import React, { useState } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  fallback?: React.ReactNode
  onError?: () => void
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  fallback,
  onError 
}) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const { ref, isIntersecting } = useIntersectionObserver()

  const handleLoad = () => setLoaded(true)
  const handleError = () => {
    setError(true)
    onError?.()
  }

  if (error && fallback) {
    return <>{fallback}</>
  }

  return (
    <div ref={ref} className={className}>
      {isIntersecting && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={{ display: error ? 'none' : 'block' }}
        />
      )}
    </div>
  )
}

export default LazyImage