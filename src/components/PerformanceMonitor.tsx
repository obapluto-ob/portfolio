import { useEffect } from 'react'

const PerformanceMonitor = () => {
  useEffect(() => {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const nav = entry as PerformanceNavigationTiming
            const loadTime = nav.loadEventEnd - nav.loadEventStart
            // Sanitized numeric output only — no user input logged
            if (loadTime > 0) {
              console.log('Page load time:', loadTime.toFixed(0), 'ms')
            }
          }
          if (entry.entryType === 'paint') {
            console.log(entry.name + ':', entry.startTime.toFixed(0), 'ms')
          }
        }
      })
      observer.observe({ entryTypes: ['navigation', 'paint'] })
      return () => observer.disconnect()
    } catch {
      // PerformanceObserver not supported — ignore silently
    }
  }, [])

  return null
}

export default PerformanceMonitor
