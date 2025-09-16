import { prisma } from './connection-pool'
import { Prisma } from '@prisma/client'

// Query optimization utilities for better performance
export class QueryOptimizer {
  
  // Optimized user queries with selective field loading
  static async getUserWithCVs(userId: string, includeContent = false) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        cvs: {
          select: {
            id: true,
            title: true,
            slug: true,
            isPublic: true,
            createdAt: true,
            updatedAt: true,
            // Only include content if explicitly requested
            ...(includeContent && { content: true }),
          },
          orderBy: { updatedAt: 'desc' },
        },
      },
    })
  }

  // Paginated CV queries for better performance
  static async getPaginatedCVs(
    userId: string,
    page = 1,
    limit = 10,
    includeContent = false
  ) {
    const skip = (page - 1) * limit
    
    const [cvs, total] = await Promise.all([
      prisma.cV.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          slug: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true,
          ...(includeContent && { content: true }),
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.cV.count({ where: { userId } }),
    ])

    return {
      cvs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    }
  }

  // Optimized public CV search with full-text search simulation
  static async searchPublicCVs(
    searchTerm: string,
    page = 1,
    limit = 10
  ) {
    const skip = (page - 1) * limit
    
    // Using contains for basic search - can be enhanced with full-text search
    const whereClause: Prisma.CVWhereInput = {
      isPublic: true,
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        // Note: JSON search is database-specific, this is PostgreSQL syntax
        { content: { path: ['personalInfo', 'name'], string_contains: searchTerm } },
      ],
    }

    const [cvs, total] = await Promise.all([
      prisma.cV.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.cV.count({ where: whereClause }),
    ])

    return { cvs, total, page, limit }
  }

  // Batch operations for better performance
  static async batchUpdateCVs(updates: Array<{ id: string; data: Prisma.CVUpdateInput }>) {
    const transactions = updates.map(({ id, data }) =>
      prisma.cV.update({
        where: { id },
        data,
      })
    )

    return await prisma.$transaction(transactions)
  }

  // Optimized session cleanup
  static async cleanupExpiredSessions() {
    const result = await prisma.session.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    })
    
    console.log(`Cleaned up ${result.count} expired sessions`)
    return result.count
  }

  // Analytics queries with aggregation
  static async getUserAnalytics(userId: string) {
    const [totalCVs, publicCVs, recentActivity] = await Promise.all([
      prisma.cV.count({ where: { userId } }),
      prisma.cV.count({ where: { userId, isPublic: true } }),
      prisma.cV.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
    ])

    return {
      totalCVs,
      publicCVs,
      privateCVs: totalCVs - publicCVs,
      recentActivity,
    }
  }

  // Database performance monitoring
  static async getQueryPerformanceStats() {
    try {
      // Get slow queries (PostgreSQL specific)
      const slowQueries = await prisma.$queryRaw`
        SELECT query, mean_exec_time, calls, total_exec_time
        FROM pg_stat_statements
        WHERE mean_exec_time > 100
        ORDER BY mean_exec_time DESC
        LIMIT 10
      `

      return { slowQueries }
    } catch (error) {
      console.error('Failed to get performance stats:', error)
      return { slowQueries: [] }
    }
  }

  // Index usage analysis
  static async analyzeIndexUsage() {
    try {
      const indexStats = await prisma.$queryRaw`
        SELECT 
          schemaname,
          tablename,
          indexname,
          idx_tup_read,
          idx_tup_fetch
        FROM pg_stat_user_indexes
        ORDER BY idx_tup_read DESC
      `

      return { indexStats }
    } catch (error) {
      console.error('Failed to analyze index usage:', error)
      return { indexStats: [] }
    }
  }
}

// Query caching decorator
export function cached(ttlSeconds: number = 300) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value
    const cache = new Map<string, { data: any; timestamp: number }>()

    descriptor.value = async function (...args: any[]) {
      const key = `${propertyName}_${JSON.stringify(args)}`
      const cached = cache.get(key)
      
      if (cached && Date.now() - cached.timestamp < ttlSeconds * 1000) {
        return cached.data
      }

      const result = await method.apply(this, args)
      cache.set(key, { data: result, timestamp: Date.now() })
      
      return result
    }

    return descriptor
  }
}

// Example usage with caching
export class CachedQueries {
  @cached(300) // Cache for 5 minutes
  static async getPopularCVs(limit = 10) {
    return await prisma.cV.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        user: {
          select: { name: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  @cached(600) // Cache for 10 minutes
  static async getSystemStats() {
    const [totalUsers, totalCVs, publicCVs] = await Promise.all([
      prisma.user.count(),
      prisma.cV.count(),
      prisma.cV.count({ where: { isPublic: true } }),
    ])

    return { totalUsers, totalCVs, publicCVs }
  }
}
