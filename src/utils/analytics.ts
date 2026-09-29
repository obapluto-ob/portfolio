// Declare gtag for TypeScript
declare function gtag(command: string, action: string, params?: Record<string, unknown>): void

interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

// Sanitize strings before logging to prevent log injection
function sanitize(value: string): string {
  return value.replace(/[\r\n\t]/g, ' ').substring(0, 200)
}

class Analytics {
  private static instance: Analytics
  private isProduction = import.meta.env.PROD

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  track(event: AnalyticsEvent) {
    const safe = {
      action: sanitize(event.action),
      category: sanitize(event.category),
      label: event.label ? sanitize(event.label) : undefined,
      value: event.value
    }

    if (!this.isProduction) {
      // Dev-only — sanitized before logging
      console.log('Analytics:', safe.action, safe.category, safe.label ?? '')
      return
    }

    if (typeof gtag !== 'undefined') {
      gtag('event', safe.action, {
        event_category: safe.category,
        event_label: safe.label,
        value: safe.value
      })
    }
  }

  trackPageView(page: string) {
    this.track({ action: 'page_view', category: 'navigation', label: page })
  }

  trackClick(element: string, location?: string) {
    this.track({
      action: 'click',
      category: 'engagement',
      label: `${element}${location ? ` - ${location}` : ''}`
    })
  }

  trackError(error: string, component?: string) {
    this.track({
      action: 'error',
      category: 'technical',
      label: `${error}${component ? ` in ${component}` : ''}`
    })
  }
}

export default Analytics.getInstance()
