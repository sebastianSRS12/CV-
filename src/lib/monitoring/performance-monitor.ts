import { prisma } from '../database/connection-pool'
import { redisCache } from '../cache/redis-client'

export interface PerformanceMetrics {
  timestamp: number
  endpoint: string
  method: string
  duration: number
  statusCode: number
  userId?: string
  userAgent?: string
  ip?: string
  memoryUsage: NodeJS.MemoryUsage
  dbQueries: number
  cacheHits: number
  cacheMisses: number
}

export interface SystemHealth {
  database: boolean
  redis: boolean
  memory: {
    used: number
    free: number
    percentage: number
  }
  uptime: number
  activeConnections: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private maxMetricsHistory = 1000
  private dbQueryCount = 0
  private cacheHitCount = 0
  private cacheMissCount = 0

  // Start monitoring a request
  startRequest(endpoint: string, method: string, userId?: string, userAgent?: string, ip?: string) {
    const startTime = Date.now()
    this.dbQueryCount = 0
    this.cacheHitCount = 0
    this.cacheMissCount = 0

    return {
      endpoint,
      method,
      startTime,
      userId,
      userAgent,
      ip,
    }
  }

  // End monitoring and record metrics
  endRequest(requestData: any, statusCode: number) {
    const duration = Date.now() - requestData.startTime
    const memoryUsage = process.memoryUsage()

    const metric: PerformanceMetrics = {
      timestamp: Date.now(),
      endpoint: requestData.endpoint,
      method: requestData.method,
      duration,
      statusCode,
      userId: requestData.userId,
      userAgent: requestData.userAgent,
      ip: requestData.ip,
      memoryUsage,
      dbQueries: this.dbQueryCount,
      cacheHits: this.cacheHitCount,
      cacheMisses: this.cacheMissCount,
    }

    this.addMetric(metric)

    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request detected: ${requestData.method} ${requestData.endpoint} - ${duration}ms`)
    }

    return metric
  }

  // Add metric to history
  private addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric)
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory)
    }
  }

  // Increment database query counter
  incrementDbQuery() {
    this.dbQueryCount++
  }

  // Increment cache counters
  incrementCacheHit() {
    this.cacheHitCount++
  }

  incrementCacheMiss() {
    this.cacheMissCount++
  }

  // Get performance statistics
  getStats(timeRangeMinutes = 60) {
    const cutoff = Date.now() - (timeRangeMinutes * 60 * 1000)
    const recentMetrics = this.metrics.filter(m => m.timestamp > cutoff)

    if (recentMetrics.length === 0) {
      return null
    }

    const durations = recentMetrics.map(m => m.duration)
    const totalRequests = recentMetrics.length
    const avgDuration = durations.reduce((a, b) => a + b, 0) / totalRequests
    const maxDuration = Math.max(...durations)
    const minDuration = Math.min(...durations)

    // Calculate percentiles
    const sortedDurations = durations.sort((a, b) => a - b)
    const p50 = sortedDurations[Math.floor(sortedDurations.length * 0.5)]
    const p95 = sortedDurations[Math.floor(sortedDurations.length * 0.95)]
    const p99 = sortedDurations[Math.floor(sortedDurations.length * 0.99)]

    // Error rate
    const errors = recentMetrics.filter(m => m.statusCode >= 400).length
    const errorRate = (errors / totalRequests) * 100

    // Cache statistics
    const totalCacheRequests = recentMetrics.reduce((sum, m) => sum + m.cacheHits + m.cacheMisses, 0)
    const totalCacheHits = recentMetrics.reduce((sum, m) => sum + m.cacheHits, 0)
    const cacheHitRate = totalCacheRequests > 0 ? (totalCacheHits / totalCacheRequests) * 100 : 0

    // Database statistics
    const totalDbQueries = recentMetrics.reduce((sum, m) => sum + m.dbQueries, 0)
    const avgDbQueriesPerRequest = totalDbQueries / totalRequests

    return {
      timeRange: timeRangeMinutes,
      totalRequests,
      avgDuration: Math.round(avgDuration),
      maxDuration,
      minDuration,
      percentiles: { p50, p95, p99 },
      errorRate: Math.round(errorRate * 100) / 100,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      avgDbQueriesPerRequest: Math.round(avgDbQueriesPerRequest * 100) / 100,
      requestsPerMinute: Math.round(totalRequests / timeRangeMinutes),
    }
  }

  // Get system health status
  async getSystemHealth(): Promise<SystemHealth> {
    const [dbHealth, redisHealth] = await Promise.all([
      this.checkDatabaseHealth(),
      this.checkRedisHealth(),
    ])

    const memoryUsage = process.memoryUsage()
    const totalMemory = memoryUsage.heapTotal + memoryUsage.external
    const usedMemory = memoryUsage.heapUsed
    const memoryPercentage = (usedMemory / totalMemory) * 100

    return {
      database: dbHealth,
      redis: redisHealth,
      memory: {
        used: Math.round(usedMemory / 1024 / 1024), // MB
        free: Math.round((totalMemory - usedMemory) / 1024 / 1024), // MB
        percentage: Math.round(memoryPercentage * 100) / 100,
      },
      uptime: Math.round(process.uptime()),
      activeConnections: this.getActiveConnectionCount(),
    }
  }

  // Check database health
  private async checkDatabaseHealth(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      console.error('Database health check failed:', error)
      return false
    }
  }

  // Check Redis health
  private async checkRedisHealth(): Promise<boolean> {
    try {
      return await redisCache.healthCheck()
    } catch (error) {
      console.error('Redis health check failed:', error)
      return false
    }
  }

  // Get active connection count (simplified)
  private getActiveConnectionCount(): number {
    // This would need to be implemented based on your server setup
    // For now, return the current metrics count as a proxy
    return this.metrics.filter(m => Date.now() - m.timestamp < 60000).length
  }

  // Get endpoint-specific statistics
  getEndpointStats(endpoint: string, timeRangeMinutes = 60) {
    const cutoff = Date.now() - (timeRangeMinutes * 60 * 1000)
    const endpointMetrics = this.metrics.filter(
      m => m.timestamp > cutoff && m.endpoint === endpoint
    )

    if (endpointMetrics.length === 0) {
      return null
    }

    const durations = endpointMetrics.map(m => m.duration)
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
    const errors = endpointMetrics.filter(m => m.statusCode >= 400).length
    const errorRate = (errors / endpointMetrics.length) * 100

    return {
      endpoint,
      totalRequests: endpointMetrics.length,
      avgDuration: Math.round(avgDuration),
      errorRate: Math.round(errorRate * 100) / 100,
      requestsPerMinute: Math.round(endpointMetrics.length / timeRangeMinutes),
    }
  }

  // Alert on performance issues
  checkAlerts() {
    const recentStats = this.getStats(5) // Last 5 minutes
    const alerts = []

    if (recentStats) {
      // High response time alert
      if (recentStats.avgDuration > 2000) {
        alerts.push({
          type: 'HIGH_RESPONSE_TIME',
          message: `Average response time is ${recentStats.avgDuration}ms`,
          severity: 'warning',
        })
      }

      // High error rate alert
      if (recentStats.errorRate > 5) {
        alerts.push({
          type: 'HIGH_ERROR_RATE',
          message: `Error rate is ${recentStats.errorRate}%`,
          severity: 'error',
        })
      }

      // Low cache hit rate alert
      if (recentStats.cacheHitRate < 70) {
        alerts.push({
          type: 'LOW_CACHE_HIT_RATE',
          message: `Cache hit rate is ${recentStats.cacheHitRate}%`,
          severity: 'warning',
        })
      }
    }

    return alerts
  }

  // Export metrics for external monitoring
  exportMetrics(format: 'json' | 'prometheus' = 'json') {
    if (format === 'prometheus') {
      return this.exportPrometheusMetrics()
    }
    
    return {
      metrics: this.metrics,
      stats: this.getStats(),
      systemHealth: this.getSystemHealth(),
    }
  }

  // Export in Prometheus format
  private exportPrometheusMetrics() {
    const stats = this.getStats()
    if (!stats) return ''

    return `
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total ${stats.totalRequests}

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.1"} ${this.metrics.filter(m => m.duration <= 100).length}
http_request_duration_seconds_bucket{le="0.5"} ${this.metrics.filter(m => m.duration <= 500).length}
http_request_duration_seconds_bucket{le="1.0"} ${this.metrics.filter(m => m.duration <= 1000).length}
http_request_duration_seconds_bucket{le="+Inf"} ${this.metrics.length}

# HELP cache_hit_rate Cache hit rate percentage
# TYPE cache_hit_rate gauge
cache_hit_rate ${stats.cacheHitRate}

# HELP error_rate Error rate percentage
# TYPE error_rate gauge
error_rate ${stats.errorRate}
    `.trim()
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Middleware for automatic monitoring
export function monitoringMiddleware() {
  return (req: any, res: any, next: any) => {
    const requestData = performanceMonitor.startRequest(
      req.url,
      req.method,
      req.user?.id,
      req.headers['user-agent'],
      req.ip
    )

    // Override res.end to capture response
    const originalEnd = res.end
    res.end = function(...args: any[]) {
      performanceMonitor.endRequest(requestData, res.statusCode)
      originalEnd.apply(res, args)
    }

    next()
  }
}
