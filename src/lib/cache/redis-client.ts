import { createClient, RedisClientType } from 'redis'

class RedisCache {
  private client: RedisClientType | null = null
  private isConnected = false

  async connect() {
    if (this.isConnected && this.client) {
      return this.client
    }

    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          connectTimeout: 5000,
        },
      })

      this.client.on('error', (err: any) => {
        console.error('Redis Client Error:', err)
        this.isConnected = false
      })

      this.client.on('connect', () => {
        console.log('Redis Client Connected')
        this.isConnected = true
      })

      this.client.on('disconnect', () => {
        console.log('Redis Client Disconnected')
        this.isConnected = false
      })

      await this.client.connect()
      return this.client
    } catch (error) {
      console.error('Failed to connect to Redis:', error)
      this.isConnected = false
      return null
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.disconnect()
      this.isConnected = false
    }
  }

  // Cache CV data with TTL
  async cacheCV(cvId: string, data: any, ttlSeconds = 3600) {
    try {
      const client = await this.connect()
      if (!client) return false

      const key = `cv:${cvId}`
      await client.setEx(key, ttlSeconds, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Failed to cache CV:', error)
      return false
    }
  }

  // Get cached CV
  async getCachedCV(cvId: string) {
    try {
      const client = await this.connect()
      if (!client) return null

      const key = `cv:${cvId}`
      const cached = await client.get(key)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error('Failed to get cached CV:', error)
      return null
    }
  }

  // Cache user data
  async cacheUser(userId: string, data: any, ttlSeconds = 1800) {
    try {
      const client = await this.connect()
      if (!client) return false

      const key = `user:${userId}`
      await client.setEx(key, ttlSeconds, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Failed to cache user:', error)
      return false
    }
  }

  // Get cached user
  async getCachedUser(userId: string) {
    try {
      const client = await this.connect()
      if (!client) return null

      const key = `user:${userId}`
      const cached = await client.get(key)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error('Failed to get cached user:', error)
      return null
    }
  }

  // Cache search results
  async cacheSearchResults(query: string, results: any, ttlSeconds = 600) {
    try {
      const client = await this.connect()
      if (!client) return false

      const key = `search:${Buffer.from(query).toString('base64')}`
      await client.setEx(key, ttlSeconds, JSON.stringify(results))
      return true
    } catch (error) {
      console.error('Failed to cache search results:', error)
      return false
    }
  }

  // Get cached search results
  async getCachedSearchResults(query: string) {
    try {
      const client = await this.connect()
      if (!client) return null

      const key = `search:${Buffer.from(query).toString('base64')}`
      const cached = await client.get(key)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error('Failed to get cached search results:', error)
      return null
    }
  }

  // Session caching for faster authentication
  async cacheSession(sessionToken: string, sessionData: any, ttlSeconds = 86400) {
    try {
      const client = await this.connect()
      if (!client) return false

      const key = `session:${sessionToken}`
      await client.setEx(key, ttlSeconds, JSON.stringify(sessionData))
      return true
    } catch (error) {
      console.error('Failed to cache session:', error)
      return false
    }
  }

  // Get cached session
  async getCachedSession(sessionToken: string) {
    try {
      const client = await this.connect()
      if (!client) return null

      const key = `session:${sessionToken}`
      const cached = await client.get(key)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error('Failed to get cached session:', error)
      return null
    }
  }

  // Rate limiting
  async checkRateLimit(identifier: string, limit: number, windowSeconds: number) {
    try {
      const client = await this.connect()
      if (!client) return { allowed: true, remaining: limit }

      const key = `rate_limit:${identifier}`
      const current = await client.incr(key)
      
      if (current === 1) {
        await client.expire(key, windowSeconds)
      }

      const remaining = Math.max(0, limit - current)
      return {
        allowed: current <= limit,
        remaining,
        resetTime: Date.now() + (windowSeconds * 1000)
      }
    } catch (error) {
      console.error('Failed to check rate limit:', error)
      return { allowed: true, remaining: limit }
    }
  }

  // Clear cache by pattern
  async clearCachePattern(pattern: string) {
    try {
      const client = await this.connect()
      if (!client) return false

      const keys = await client.keys(pattern)
      if (keys.length > 0) {
        await client.del(keys)
      }
      return true
    } catch (error) {
      console.error('Failed to clear cache pattern:', error)
      return false
    }
  }

  // Cache invalidation for specific user
  async invalidateUserCache(userId: string) {
    try {
      await this.clearCachePattern(`user:${userId}`)
      await this.clearCachePattern(`cv:${userId}:*`)
      return true
    } catch (error) {
      console.error('Failed to invalidate user cache:', error)
      return false
    }
  }

  // Health check
  async healthCheck() {
    try {
      const client = await this.connect()
      if (!client) return false

      const result = await client.ping()
      return result === 'PONG'
    } catch (error) {
      console.error('Redis health check failed:', error)
      return false
    }
  }

  // Get cache statistics
  async getCacheStats() {
    try {
      const client = await this.connect()
      if (!client) return null

      const info = await client.info('memory')
      const keyspace = await client.info('keyspace')
      
      return {
        memory: info,
        keyspace,
        connected: this.isConnected
      }
    } catch (error) {
      console.error('Failed to get cache stats:', error)
      return null
    }
  }
}

// Singleton instance
export const redisCache = new RedisCache()

// Graceful shutdown
process.on('SIGINT', async () => {
  await redisCache.disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await redisCache.disconnect()
  process.exit(0)
})

// Cache decorator for automatic caching
export function cacheResult(ttlSeconds: number = 300, keyPrefix: string = '') {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${keyPrefix}${propertyName}_${JSON.stringify(args)}`
      
      // Try to get from cache first
      const cached = await redisCache.getCachedSearchResults(cacheKey)
      if (cached) {
        return cached
      }

      // Execute method and cache result
      const result = await method.apply(this, args)
      await redisCache.cacheSearchResults(cacheKey, result, ttlSeconds)
      
      return result
    }

    return descriptor
  }
}
