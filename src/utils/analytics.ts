interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
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
    if (!this.isProduction) {
      console.log('Analytics Event:', event)
      return
    }

    // Add your analytics provider here (Google Analytics, Plausible, etc.)
    if (typeof gtag !== 'undefined') {
      gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      })
    }
  }

  trackPageView(page: string) {
    this.track({
      action: 'page_view',
      category: 'navigation',
      label: page
    })
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