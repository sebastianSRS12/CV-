import { NextRequest, NextResponse } from 'next/server'
import { performanceMonitor } from '@/lib/monitoring/performance-monitor'
import { checkDatabaseHealth } from '@/lib/database/connection-pool'
import { redisCache } from '@/lib/cache/redis-client'
import { checkCDNHealth } from '@/lib/cdn/cdn-config'

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Check all system components
    const [dbHealth, redisHealth, cdnHealth, systemHealth] = await Promise.all([
      checkDatabaseHealth(),
      redisCache.healthCheck(),
      checkCDNHealth(),
      performanceMonitor.getSystemHealth(),
    ])

    const responseTime = Date.now() - startTime
    const status = dbHealth && redisHealth ? 'healthy' : 'unhealthy'
    
    const healthData = {
      status,
      timestamp: new Date().toISOString(),
      responseTime,
      services: {
        database: dbHealth,
        redis: redisHealth,
        cdn: cdnHealth,
      },
      system: systemHealth,
      performance: performanceMonitor.getStats(5), // Last 5 minutes
      alerts: performanceMonitor.checkAlerts(),
    }

    return NextResponse.json(healthData, {
      status: status === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 500 }
    )
  }
}
