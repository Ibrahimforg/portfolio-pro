import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  fallback?: string
  priority?: boolean
  className?: string
}

export function OptimizedImage({ 
  src, 
  alt, 
  fallback = '/images/placeholder.jpg',
  priority = false,
  className = '',
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
      
      <Image
        src={hasError ? fallback : src}
        alt={alt}
        priority={priority}
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPxEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwARAAEFAQEBAQEBAAAAAAAAAAAAABEBECAwQDBAcFAAAAAAAAAAAAAARECAwQFBgcICQoLAAAAAAAAAAAAAAAAAABAhEDBQYHCAkKCwAAAAAAAAAAAAAAAAAABAhEDBQYHCAkKCwEAAwEAAAAAAAAAAAAAAAAAAAAB/8AAEQgACAgEAAAAAAAAAAAAAAAAAAAEQEQACAgEAAAAAAAAAAAAAAAAAAAAARAAAABEBAAAAAAEAAP/xAAhEQEBAQACAgMBAQEAAAAAAAAAAQIRAxASITFBUWFxgZGhscHR8BECUmJygpKjwf/EAABAwEBAQADAQMAAAAAAAAAAAAAAQIRMUFRYXGhsfBx0hIjQlKicoKSosHh/8QAGxEAAwEBAAMBAAAAAAAAAAAAAAAARARITFBUWGRobHR8gIjQlKicoKSosH/2gAMAwEAAAAAAAAAAAAAAAAAAAAAAAARARITFBUWGRobHR8gIjQlKicoKSosH/2gA"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={`
          duration-300 ease-in-out
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          ${hasError ? 'grayscale' : ''}
        `}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        {...props}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface/80 text-text-secondary text-sm">
          Image non disponible
        </div>
      )}
    </div>
  )
}

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export function LazyImage({ 
  src, 
  alt, 
  className = '',
  width = 400,
  height = 300 
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false)
  const [imgRef, setImgRef] = useState<HTMLDivElement | null>(null)

  useState(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef) {
      observer.observe(imgRef)
    }

    return () => observer.disconnect()
  })

  return (
    <div 
      ref={setImgRef}
      className={`relative bg-surface ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {!isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-surface-elevated rounded animate-pulse" />
        </div>
      )}
      
      {isInView && (
        <OptimizedImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      )}
    </div>
  )
}

export function Picture({ 
  src, 
  alt, 
  className = '',
  width = 400,
  height = 300 
}: LazyImageProps) {
  return (
    <picture className={className}>
      <source 
        srcSet={`${src}?format=webp&w=${width}&h=${height}&q=80`} 
        type="image/webp" 
      />
      <source 
        srcSet={`${src}?w=${width}&h=${height}&q=80`} 
        type="image/jpeg" 
      />
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
      />
    </picture>
  )
}
