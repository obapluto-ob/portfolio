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
    const sessionKey = `session_${today}`
    
    // Check if already visited today
    const todayVisitors = JSON.parse(localStorage.getItem('daily_visitors') || '{}')
    const allVisitors = JSON.parse(localStorage.getItem('all_visitors') || '[]')
    
    if (!todayVisitors[today]) {
      todayVisitors[today] = []
    }
    
    // Add to today's visitors if not already there
    if (!todayVisitors[today].includes(visitorId)) {
      todayVisitors[today].push(visitorId)
      localStorage.setItem('daily_visitors', JSON.stringify(todayVisitors))
    }
    
    // Add to all-time visitors if not already there
    if (!allVisitors.includes(visitorId)) {
      allVisitors.push(visitorId)
      localStorage.setItem('all_visitors', JSON.stringify(allVisitors))
    }
    
    // Track session (for "online now" simulation)
    sessionStorage.setItem(sessionKey, visitorId)
  }

  // Get visitor statistics
  getVisitorStats(): { total: number; today: number; online: number } {
    const today = new Date().toDateString()
    const todayVisitors = JSON.parse(localStorage.getItem('daily_visitors') || '{}')
    const allVisitors = JSON.parse(localStorage.getItem('all_visitors') || '[]')
    
    // Simulate online users (1-3 based on today's visitors)
    const todayCount = todayVisitors[today]?.length || 0
    const online = Math.min(Math.max(1, Math.floor(todayCount / 2)), 3)
    
    return {
      total: allVisitors.length,
      today: todayCount,
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