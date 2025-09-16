// CDN Configuration for static asset optimization
export interface CDNConfig {
  enabled: boolean
  baseUrl: string
  regions: string[]
  cacheTTL: number
  compressionEnabled: boolean
  imageOptimization: boolean
}

export const cdnConfig: CDNConfig = {
  enabled: process.env.CDN_ENABLED === 'true',
  baseUrl: process.env.CDN_BASE_URL || '',
  regions: (process.env.CDN_REGIONS || 'us-east-1,eu-west-1,ap-southeast-1').split(','),
  cacheTTL: parseInt(process.env.CDN_CACHE_TTL || '86400'), // 24 hours
  compressionEnabled: process.env.CDN_COMPRESSION !== 'false',
  imageOptimization: process.env.CDN_IMAGE_OPTIMIZATION !== 'false',
}

// Asset URL generator with CDN support
export function getAssetUrl(path: string, options?: {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
}): string {
  if (!cdnConfig.enabled || !cdnConfig.baseUrl) {
    return path
  }

  let url = `${cdnConfig.baseUrl}${path}`

  // Add image optimization parameters
  if (options && cdnConfig.imageOptimization) {
    const params = new URLSearchParams()
    
    if (options.width) params.set('w', options.width.toString())
    if (options.height) params.set('h', options.height.toString())
    if (options.quality) params.set('q', options.quality.toString())
    if (options.format) params.set('f', options.format)

    if (params.toString()) {
      url += `?${params.toString()}`
    }
  }

  return url
}

// Cache headers for different asset types
export const cacheHeaders = {
  images: {
    'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
    'Vary': 'Accept-Encoding',
  },
  css: {
    'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
    'Content-Type': 'text/css',
    'Vary': 'Accept-Encoding',
  },
  js: {
    'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
    'Content-Type': 'application/javascript',
    'Vary': 'Accept-Encoding',
  },
  fonts: {
    'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
    'Access-Control-Allow-Origin': '*',
    'Vary': 'Accept-Encoding',
  },
  html: {
    'Cache-Control': 'public, max-age=300', // 5 minutes
    'Vary': 'Accept-Encoding',
  },
  api: {
    'Cache-Control': 'public, max-age=60', // 1 minute
    'Vary': 'Accept-Encoding, Authorization',
  },
}

// Preload critical resources
export const criticalResources = [
  { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
  { href: '/css/critical.css', as: 'style' },
  { href: '/js/critical.js', as: 'script' },
]

// Generate preload links for critical resources
export function generatePreloadLinks(): string {
  return criticalResources
    .map(resource => {
      const href = getAssetUrl(resource.href)
      const attrs = Object.entries(resource)
        .filter(([key]) => key !== 'href')
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')
      return `<link rel="preload" href="${href}" ${attrs}>`
    })
    .join('\n')
}

// Service Worker configuration for CDN caching
export const serviceWorkerConfig = {
  cacheFirst: [
    /\.(js|css|woff2?|png|jpg|jpeg|gif|svg|ico)$/,
    new RegExp(`^${cdnConfig.baseUrl}/`),
  ],
  networkFirst: [
    /\/api\//,
    /\/auth\//,
  ],
  staleWhileRevalidate: [
    /\.(html|json)$/,
  ],
}

// Image optimization settings
export const imageOptimization = {
  formats: ['webp', 'jpeg', 'png'] as const,
  qualities: {
    low: 60,
    medium: 80,
    high: 90,
  },
  sizes: {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
    xlarge: { width: 1920, height: 1920 },
  },
}

// Generate responsive image srcset
export function generateSrcSet(imagePath: string, sizes: (keyof typeof imageOptimization.sizes)[]): string {
  return sizes
    .map(size => {
      const { width } = imageOptimization.sizes[size]
      const url = getAssetUrl(imagePath, { width, format: 'webp', quality: imageOptimization.qualities.high })
      return `${url} ${width}w`
    })
    .join(', ')
}

// CDN purge utility
export async function purgeCDNCache(paths: string[]): Promise<boolean> {
  if (!cdnConfig.enabled) return true

  try {
    // This would integrate with your CDN provider's API
    // Example for Cloudflare:
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/purge_cache`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: paths.map(path => getAssetUrl(path)),
      }),
    })

    return response.ok
  } catch (error) {
    console.error('Failed to purge CDN cache:', error)
    return false
  }
}

// CDN health check
export async function checkCDNHealth(): Promise<boolean> {
  if (!cdnConfig.enabled) return true

  try {
    const testUrl = getAssetUrl('/health-check.txt')
    const response = await fetch(testUrl, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    console.error('CDN health check failed:', error)
    return false
  }
}
