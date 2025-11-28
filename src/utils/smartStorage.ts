// Smart localStorage with better visitor tracking and persistence
// No external dependencies, works forever

class SmartStorage {
  private static instance: SmartStorage

  static getInstance(): SmartStorage {
    if (!SmartStorage.instance) {
      SmartStorage.instance = new SmartStorage()
    }
    return SmartStorage.instance
  }

  // Generate unique visitor ID (persists across sessions)
  private getVisitorId(): string {
    let visitorId = localStorage.getItem('portfolio_visitor_id')
    
    if (!visitorId) {
      // Create unique ID based on browser fingerprint
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        navigator.platform
      ].join('|')
      
      // Simple hash
      let hash = 0
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
      }
      
      visitorId = Math.abs(hash).toString() + Date.now()
      localStorage.setItem('portfolio_visitor_id', visitorId)
    }
    
    return visitorId
  }

  // Track unique visitors (no duplicates on refresh)
  trackVisitor(): void {
    const visitorId = this.getVisitorId()
    const today = new Date().toDateString()
    
    // Get or initialize counters
    let totalVisits = parseInt(localStorage.getItem('portfolio_total_visits') || '0')
    let todayVisits = parseInt(localStorage.getItem(`portfolio_visits_${today}`) || '0')
    
    // Check if this visitor already counted today
    const visitedToday = localStorage.getItem(`visited_${today}_${visitorId}`)
    
    if (!visitedToday) {
      // New visitor for today
      todayVisits++
      totalVisits++
      
      localStorage.setItem('portfolio_total_visits', totalVisits.toString())
      localStorage.setItem(`portfolio_visits_${today}`, todayVisits.toString())
      localStorage.setItem(`visited_${today}_${visitorId}`, 'true')
    }
    
    // Track active session for online count
    const sessionId = `session_${Date.now()}_${Math.random()}`
    sessionStorage.setItem('active_session', sessionId)
    localStorage.setItem(`online_${sessionId}`, Date.now().toString())
    
    // Clean old online sessions (older than 5 minutes)
    this.cleanOnlineSessions()
  }

  // Clean old online sessions
  private cleanOnlineSessions(): void {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('online_')) {
        const timestamp = parseInt(localStorage.getItem(key) || '0')
        if (timestamp < fiveMinutesAgo) {
          localStorage.removeItem(key)
        }
      }
    })
  }

  // Get visitor statistics
  getVisitorStats(): { total: number; today: number; online: number } {
    const today = new Date().toDateString()
    
    // Get persistent counters
    const total = parseInt(localStorage.getItem('portfolio_total_visits') || '0')
    const todayCount = parseInt(localStorage.getItem(`portfolio_visits_${today}`) || '0')
    
    // Count active online sessions
    this.cleanOnlineSessions()
    const onlineSessions = Object.keys(localStorage).filter(key => key.startsWith('online_'))
    const online = Math.max(1, onlineSessions.length)
    
    return {
      total: Math.max(total, 1), // Ensure at least 1
      today: Math.max(todayCount, 1),
      online: online
    }
  }

  // Rating system (one per visitor)
  submitRating(rating: number): boolean {
    const visitorId = this.getVisitorId()
    const ratings = JSON.parse(localStorage.getItem('portfolio_ratings') || '{}')
    
    if (ratings[visitorId]) {
      return false // Already rated
    }
    
    ratings[visitorId] = {
      rating,
      timestamp: Date.now()
    }
    
    localStorage.setItem('portfolio_ratings', JSON.stringify(ratings))
    return true
  }

  // Check if user has rated
  hasUserRated(): { rated: boolean; rating?: number } {
    const visitorId = this.getVisitorId()
    const ratings = JSON.parse(localStorage.getItem('portfolio_ratings') || '{}')
    
    if (ratings[visitorId]) {
      return { rated: true, rating: ratings[visitorId].rating }
    }
    
    return { rated: false }
  }

  // Get rating statistics
  getRatingStats(): { average: number; total: number } {
    const ratings = JSON.parse(localStorage.getItem('portfolio_ratings') || '{}')
    const ratingValues = Object.values(ratings) as Array<{ rating: number }>
    
    if (ratingValues.length === 0) {
      return { average: 0, total: 0 }
    }
    
    const sum = ratingValues.reduce((acc, r) => acc + r.rating, 0)
    const average = sum / ratingValues.length
    
    return { average, total: ratingValues.length }
  }

  // Share tracking
  trackShare(platform: string): void {
    const shares = JSON.parse(localStorage.getItem('portfolio_shares') || '{}')
    const today = new Date().toDateString()
    
    if (!shares[today]) {
      shares[today] = {}
    }
    
    if (!shares[today][platform]) {
      shares[today][platform] = 0
    }
    
    shares[today][platform]++
    localStorage.setItem('portfolio_shares', JSON.stringify(shares))
  }

  // Get total shares
  getTotalShares(): number {
    const shares = JSON.parse(localStorage.getItem('portfolio_shares') || '{}')
    let total = 0
    
    Object.values(shares).forEach((dayShares: any) => {
      Object.values(dayShares).forEach((count: any) => {
        total += count
      })
    })
    
    return total
  }

  // Clean old data (keep last 30 days)
  cleanOldData(): void {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    // Clean daily visitors
    const dailyVisitors = JSON.parse(localStorage.getItem('daily_visitors') || '{}')
    Object.keys(dailyVisitors).forEach(date => {
      if (new Date(date) < thirtyDaysAgo) {
        delete dailyVisitors[date]
      }
    })
    localStorage.setItem('daily_visitors', JSON.stringify(dailyVisitors))
    
    // Clean shares
    const shares = JSON.parse(localStorage.getItem('portfolio_shares') || '{}')
    Object.keys(shares).forEach(date => {
      if (new Date(date) < thirtyDaysAgo) {
        delete shares[date]
      }
    })
    localStorage.setItem('portfolio_shares', JSON.stringify(shares))
  }
}

export default SmartStorage.getInstance()