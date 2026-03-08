import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  placeholder?: string
  blurDataURL?: string
  className?: string
  sizes?: string
  quality?: number
  fill?: boolean
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
}

interface ImageDimensions {
  width: number
  height: number
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  className,
  sizes,
  quality = 75,
  fill = false,
  style,
  onLoad,
  onError
}: OptimizedImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null)

  // Generate blur placeholder if not provided
  const generateBlurPlaceholder = useCallback((w: number, h: number) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    canvas.width = w
    canvas.height = h

    // Create gradient placeholder
    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, '#f3f4f6')
    gradient.addColorStop(1, '#e5e7eb')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)

    return canvas.toDataURL('image/jpeg', 0.1)
  }, [])

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true)
    setImageError(false)
    
    if (e.currentTarget) {
      setImageDimensions({
        width: e.currentTarget.naturalWidth,
        height: e.currentTarget.naturalHeight
      })
    }
    
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setImageError(true)
    setImageLoaded(false)
    onError?.()
  }, [onError])

  // Generate WebP sources
  const generateWebPSources = useCallback((originalSrc: string) => {
    const extension = originalSrc.split('.').pop()?.toLowerCase()
    const baseSrc = originalSrc.substring(0, originalSrc.lastIndexOf('.'))
    
    if (!extension || !baseSrc) return { src: originalSrc, webpSrc: null }
    
    // Generate WebP versions for different qualities
    const webpSources = {
      high: `${baseSrc}.webp`,
      medium: `${baseSrc}_medium.webp`,
      low: `${baseSrc}_low.webp`
    }
    
    return { src: originalSrc, webpSources }
  }, [])

  const { src: finalSrc, webpSources } = generateWebPSources(src)

  // Determine image source based on device capabilities and network conditions
  const getOptimizedSrc = useCallback(() => {
    // Check if WebP is supported
    const canvas = document.createElement('canvas')
    const webpSupported = canvas.toDataURL('image/webp').startsWith('data:image/webp')
    
    if (webpSupported && webpSources) {
      // Use WebP for modern browsers
      return webpSources.high
    }
    
    return finalSrc
  }, [finalSrc, webpSources])

  const optimizedSrc = getOptimizedSrc()

  return (
    <div className={`relative ${className || ''}`} style={style}>
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        quality={quality}
        fill={fill}
        className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${imageError ? 'grayscale' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        // Add loading="lazy" for better performance
        loading="lazy"
        // Add decoding="async" for better performance
        decoding="async"
      />
      
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      
      {/* Error fallback */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">🖼️</div>
            <div className="text-sm">Image non disponible</div>
          </div>
        </div>
      )}
      
      {/* Image dimensions info */}
      {imageDimensions && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {imageDimensions.width} × {imageDimensions.height}
        </div>
      )}
    </div>
  )
}

// Lazy loaded image component for better performance
export const LazyImage = ({ 
  src, 
  alt, 
  className,
  ...props 
}: OptimizedImageProps) => {
  const [isInView, setIsInView] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current)
      }
    }
  }, [])

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <OptimizedImage
          src={src}
          alt={alt}
          className="transition-opacity duration-500"
          onLoad={() => setHasLoaded(true)}
          {...props}
        />
      )}
    </div>
  )
}

// Picture component for responsive images
export const ResponsiveImage = ({ 
  src, 
  alt, 
  className,
  ...props 
}: OptimizedImageProps) => {
  const generateSrcSet = useCallback((originalSrc: string) => {
    // Implémentation simple pour éviter l'erreur
    return undefined
  }, [])

  return (
    <picture className={className}>
      {generateSrcSet(src) && (
        <>
          <source
            type="image/webp"
            srcSet={generateSrcSet(src)}
            sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px"
          />
          <source
            type="image/jpeg"
            srcSet={generateSrcSet(src)}
            sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px"
          />
        </>
      )}
      
      <img
        src={src}
        alt={alt}
        {...props}
      />
    </picture>
  )
}

// Progressive image loading component
export const ProgressiveImage = ({ 
  src, 
  alt, 
  className,
  quality = 75,
  ...props 
}: OptimizedImageProps) => {
  const [currentQuality, setCurrentQuality] = useState(quality)
  const [networkSpeed, setNetworkSpeed] = useState<'slow' | 'medium' | 'fast'>('medium')

  useEffect(() => {
    // Detect network speed
    const connection = (navigator as any).connection
    if (connection) {
      const effectiveType = connection.effectiveType
      const downlink = connection.downlink
      
      if (effectiveType === '4g' || downlink < 0.5) {
        setNetworkSpeed('slow')
        setCurrentQuality(50)
      } else if (effectiveType === '3g' || downlink < 2) {
        setNetworkSpeed('medium')
        setCurrentQuality(65)
      } else {
        setNetworkSpeed('fast')
        setCurrentQuality(85)
      }
    }
  }, [])

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      quality={currentQuality}
      className={`${className || ''} transition-all duration-300`}
      priority={props.priority}
      {...props}
    />
  )
}

export default OptimizedImage
