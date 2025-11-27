import React, { ReactNode } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight'
  delay?: number
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fadeIn',
  delay = 0
}) => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 })

  const animationClasses = {
    fadeIn: 'opacity-0 translate-y-4',
    slideUp: 'opacity-0 translate-y-8',
    slideLeft: 'opacity-0 translate-x-8',
    slideRight: 'opacity-0 -translate-x-8'
  }

  const activeClasses = 'opacity-100 translate-x-0 translate-y-0'

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isIntersecting ? activeClasses : animationClasses[animation]
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default AnimatedSection