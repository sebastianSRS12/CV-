import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

// Connection pool configuration for optimal performance
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Connection pool settings for scalability
    __internal: {
      engine: {
        // Connection pool size - adjust based on your server capacity
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
        // Connection timeout
        connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '5000'),
        // Pool timeout
        poolTimeout: parseInt(process.env.DB_POOL_TIMEOUT || '10000'),
        // Maximum idle time for connections
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '600000'), // 10 minutes
      },
    },
  })
}

// Singleton pattern for connection reuse
const prisma = globalThis.__prisma || createPrismaClient()

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma
}

// Graceful shutdown handling
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

export { prisma }

// Health check function for monitoring
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

// Connection metrics for monitoring
export const getConnectionMetrics = async () => {
  try {
    const metrics = await prisma.$metrics.json()
    return {
      activeConnections: metrics.counters.find(c => c.key === 'prisma_client_queries_active')?.value || 0,
      totalQueries: metrics.counters.find(c => c.key === 'prisma_client_queries_total')?.value || 0,
      queryDuration: metrics.histograms.find(h => h.key === 'prisma_client_queries_duration_histogram')?.buckets || [],
    }
  } catch (error) {
    console.error('Failed to get connection metrics:', error)
    return null
  }
}
