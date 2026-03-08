// Cache intelligent et optimisation des performances
import { unstable_cache } from 'next/cache'
import { supabase } from '@/lib/supabase'

export interface CacheConfig {
  ttl: number // Time to live en secondes
  maxSize: number // Taille maximale en MB
  strategy: 'LRU' | 'LFU' | 'FIFO'
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  hits: number
  size: number
}

export class AdvancedCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>()
  private config: CacheConfig
  private currentSize = 0

  constructor(config: CacheConfig) {
    this.config = config
  }

  // Ajouter une entrée dans le cache
  set(key: string, data: T, customTtl?: number): void {
    const size = this.calculateSize(data)
    
    // Vérifier si on dépasse la taille maximale
    if (this.currentSize + size > this.config.maxSize * 1024 * 1024) {
      this.evict()
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: customTtl || this.config.ttl,
      hits: 0,
      size
    }

    this.cache.set(key, entry)
    this.currentSize += size
  }

  // Récupérer une entrée du cache
  get(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null

    // Vérifier si l'entrée a expiré
    if (Date.now() - entry.timestamp > entry.ttl * 1000) {
      this.delete(key)
      return null
    }

    entry.hits++
    return entry.data
  }

  // Supprimer une entrée
  delete(key: string): boolean {
    const entry = this.cache.get(key)
    if (entry) {
      this.currentSize -= entry.size
      return this.cache.delete(key)
    }
    return false
  }

  // Vider le cache
  clear(): void {
    this.cache.clear()
    this.currentSize = 0
  }

  // Évincer les entrées selon la stratégie
  private evict(): void {
    let entriesToEvict = 1
    const entries = Array.from(this.cache.entries())

    switch (this.config.strategy) {
      case 'LRU': // Least Recently Used
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
        break
      case 'LFU': // Least Frequently Used
        entries.sort((a, b) => a[1].hits - b[1].hits)
        break
      case 'FIFO': // First In First Out
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
        break
    }

    // Évincer jusqu'à avoir assez d'espace
    for (let i = 0; i < entriesToEvict && i < entries.length; i++) {
      const [key, entry] = entries[i]
      this.currentSize -= entry.size
      this.cache.delete(key)
    }
  }

  // Calculer la taille approximative des données
  private calculateSize(data: T): number {
    return JSON.stringify(data).length * 2 // Approximation en bytes
  }

  // Statistiques du cache
  getStats() {
    const entries = Array.from(this.cache.values())
    return {
      size: this.currentSize,
      entries: this.cache.size,
      hitRate: entries.reduce((sum, entry) => sum + entry.hits, 0),
      avgTtl: entries.reduce((sum, entry) => sum + entry.ttl, 0) / entries.length || 0
    }
  }
}

// Cache distribué pour les applications scalables
export class DistributedCache<T> {
  private localCache: AdvancedCache<T>
  private redis?: any // Client Redis optionnel

  constructor(config: CacheConfig, redisUrl?: string) {
    this.localCache = new AdvancedCache<T>(config)
    // Initialiser Redis si disponible
    // this.redis = new Redis(redisUrl)
  }

  async get(key: string): Promise<T | null> {
    // Essayer le cache local d'abord
    let data = this.localCache.get(key)
    if (data) return data

    // Essayer Redis si disponible
    if (this.redis) {
      try {
        const redisData = await this.redis.get(key)
        if (redisData) {
          data = JSON.parse(redisData)
          this.localCache.set(key, data)
          return data
        }
      } catch (error) {
        console.error('Redis error:', error)
      }
    }

    return null
  }

  async set(key: string, data: T, ttl?: number): Promise<void> {
    // Mettre en cache local
    this.localCache.set(key, data, ttl)

    // Mettre en cache Redis si disponible
    if (this.redis) {
      try {
        await this.redis.setex(key, ttl || 3600, JSON.stringify(data))
      } catch (error) {
        console.error('Redis error:', error)
      }
    }
  }

  async invalidate(key: string): Promise<void> {
    this.localCache.delete(key)
    if (this.redis) {
      try {
        await this.redis.del(key)
      } catch (error) {
        console.error('Redis error:', error)
      }
    }
  }
}

// Cache HTTP intelligent
export class HttpCache {
  private cache = new Map<string, { data: any; etag?: string; lastModified?: string }>()

  async get(url: string, options?: RequestInit): Promise<Response> {
    const cacheKey = this.getCacheKey(url, options)
    const cached = this.cache.get(cacheKey)

    if (cached) {
      const headers = new Headers()
      
      if (cached.etag) headers.set('If-None-Match', cached.etag)
      if (cached.lastModified) headers.set('If-Modified-Since', cached.lastModified)

      const response = await fetch(url, { ...options, headers })
      
      if (response.status === 304) {
        // Not Modified - retourner le cache
        return new Response(JSON.stringify(cached.data), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'HIT'
          }
        })
      } else if (response.ok) {
        // Mise à jour du cache
        const data = await response.json()
        this.cache.set(cacheKey, {
          data,
          etag: response.headers.get('ETag') || undefined,
          lastModified: response.headers.get('Last-Modified') || undefined
        })
        return response
      }
    }

    // Pas de cache ou cache invalide
    const response = await fetch(url, options)
    
    if (response.ok) {
      const data = await response.json()
      this.cache.set(cacheKey, {
        data,
        etag: response.headers.get('ETag') || undefined,
        lastModified: response.headers.get('Last-Modified') || undefined
      })
    }

    return response
  }

  private getCacheKey(url: string, options?: RequestInit): string {
    return url + (options ? JSON.stringify(options) : '')
  }

  invalidate(url: string, options?: RequestInit): void {
    this.cache.delete(this.getCacheKey(url, options))
  }

  clear(): void {
    this.cache.clear()
  }
}

// Next.js unstable_cache functions
export const getCachedProjects = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id, title, description, status, featured, created_at,
        category_id (name, color),
        project_images (url, alt_text, is_primary)
      `)
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },
  ['projects'],
  {
    revalidate: 1800, // 30 minutes
    tags: ['projects'],
  }
)

export const getCachedProfile = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },
  ['profile'],
  {
    revalidate: 3600, // 1 heure
    tags: ['profile'],
  }
)

export const getCachedSkills = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from('skills')
      .select(`
        *,
        category:skill_categories (name, color)
      `)
      .eq('visible', true)
      .order('order', { ascending: true })
    
    if (error) throw error
    return data
  },
  ['skills'],
  {
    revalidate: 7200, // 2 heures
    tags: ['skills'],
  }
)

// Revalidation manuelle
export async function revalidateCache(tags: string[]) {
  const { revalidateTag } = await import('next/cache')
  tags.forEach(tag => revalidateTag(tag, 'page'))
}

// Instance globale pour le cache
export const cacheManager = {
  userCache: new AdvancedCache({ ttl: 300, maxSize: 10, strategy: 'LRU' }), // 5min, 10MB
  apiCache: new AdvancedCache({ ttl: 60, maxSize: 5, strategy: 'LFU' }), // 1min, 5MB
  staticCache: new AdvancedCache({ ttl: 3600, maxSize: 20, strategy: 'FIFO' }), // 1h, 20MB
  httpCache: new HttpCache()
}
