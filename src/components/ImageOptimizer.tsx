'use client'

import Image, { ImageProps } from 'next/image'
import { useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt' | 'onError'> {
  src: string
  alt: string
  fallback?: string
  lazy?: boolean
  cacheKey?: string
}

export function OptimizedImage({
  src,
  alt,
  fallback = '/images/placeholder.jpg',
  lazy = true,
  cacheKey,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState(lazy ? undefined : src)

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
  }, [])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
  }, [])

  // Lazy loading avec Intersection Observer
  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (!node || !lazy) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src)
            observer.unobserve(node)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(node)
  }, [lazy, src])

  const finalSrc = hasError ? fallback : imageSrc

  return (
    <div className="relative inline-block">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}
      
      <Image
        {...props}
        src={finalSrc}
        alt={alt}
        ref={lazy ? imgRef : undefined}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          ${hasError ? 'grayscale' : ''}
          ${props.className || ''}
        `.trim()}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={!lazy}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <span className="text-gray-500 text-sm">Image non disponible</span>
        </div>
      )}
    </div>
  )
}

// Hook pour le cache d'images
export function useImageCache() {
  const cache = new Map<string, { url: string; timestamp: number }>()

  const getCachedImage = useCallback((key: string): string | null => {
    const cached = cache.get(key)
    if (!cached) return null

    // Cache valide pour 1 heure
    if (Date.now() - cached.timestamp > 3600000) {
      cache.delete(key)
      return null
    }

    return cached.url
  }, [])

  const setCachedImage = useCallback((key: string, url: string): void => {
    cache.set(key, { url, timestamp: Date.now() })
  }, [])

  return { getCachedImage, setCachedImage }
}

// Composant pour les galeries d'images
export function ImageGallery({ 
  images, 
  columns = 3,
  gap = 4 
}: { 
  images: Array<{ src: string; alt: string; caption?: string }>
  columns?: number
  gap?: number 
}) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative group cursor-pointer overflow-hidden rounded-lg"
          onClick={() => setSelectedImage(index)}
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            lazy={index > 3} // Charger les 4 premières images immédiatement
          />
          
          {image.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-white text-sm truncate">{image.caption}</p>
            </div>
          )}
        </div>
      ))}
      
      {/* Modal pour l'image sélectionnée */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <OptimizedImage
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              className="max-w-full max-h-full object-contain"
              lazy={false}
            />
            
            <button
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
