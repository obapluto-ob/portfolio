import { useEffect } from 'react'

const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          console.log('Page Load Time:', navEntry.loadEventEnd - navEntry.loadEventStart, 'ms')
        }
        
        if (entry.entryType === 'paint') {
          console.log(`${entry.name}:`, entry.startTime, 'ms')
        }
      }
    })

    observer.observe({ entryTypes: ['navigation', 'paint'] })

    // Monitor LCP (Largest Contentful Paint)
    if ('web-vitals' in window) {
      // This would work with web-vitals library if installed
      // import { getLCP, getFID, getCLS } from 'web-vitals'
      // getLCP(console.log)
      // getFID(console.log)
      // getCLS(console.log)
    }

    return () => observer.disconnect()
  }, [])

  return null // This component doesn't render anything
}

export default PerformanceMonitor