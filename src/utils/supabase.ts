// Supabase configuration
// You'll need to:
// 1. Go to https://supabase.com
// 2. Create free account
// 3. Create new project
// 4. Get your URL and anon key
// 5. Replace the values below

const SUPABASE_URL = 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'

class SupabaseClient {
  private baseUrl: string
  private headers: HeadersInit

  constructor() {
    this.baseUrl = SUPABASE_URL
    this.headers = {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  }

  async query(table: string, method: 'GET' | 'POST' | 'PATCH' = 'GET', data?: any) {
    try {
      const url = `${this.baseUrl}/rest/v1/${table}`
      const options: RequestInit = {
        method,
        headers: this.headers
      }

      if (data && method !== 'GET') {
        options.body = JSON.stringify(data)
      }

      const response = await fetch(url, options)
      return await response.json()
    } catch (error) {
      console.error('Supabase error:', error)
      return null
    }
  }

  // Visitor tracking
  async trackVisitor(fingerprint: string) {
    const today = new Date().toISOString().split('T')[0]
    
    // Check if visitor exists today
    const existing = await this.query(`visitors?fingerprint=eq.${fingerprint}&date=eq.${today}`)
    
    if (!existing || existing.length === 0) {
      // New visitor today
      await this.query('visitors', 'POST', {
        fingerprint,
        date: today,
        visits: 1
      })
    } else {
      // Existing visitor, increment visits
      await this.query(`visitors?fingerprint=eq.${fingerprint}&date=eq.${today}`, 'PATCH', {
        visits: existing[0].visits + 1
      })
    }
  }

  // Get visitor stats
  async getVisitorStats() {
    const total = await this.query('visitors')
    const today = new Date().toISOString().split('T')[0]
    const todayVisitors = await this.query(`visitors?date=eq.${today}`)
    
    return {
      total: total?.length || 0,
      today: todayVisitors?.length || 0,
      online: Math.min(todayVisitors?.length || 1, 5) // Simulate online users
    }
  }

  // Rating system
  async submitRating(fingerprint: string, rating: number) {
    // Check if user already rated
    const existing = await this.query(`ratings?fingerprint=eq.${fingerprint}`)
    
    if (!existing || existing.length === 0) {
      await this.query('ratings', 'POST', {
        fingerprint,
        rating,
        created_at: new Date().toISOString()
      })
      return true
    }
    return false // Already rated
  }

  async getRatingStats() {
    const ratings = await this.query('ratings')
    if (!ratings || ratings.length === 0) {
      return { average: 0, total: 0 }
    }
    
    const total = ratings.length
    const sum = ratings.reduce((acc: number, r: any) => acc + r.rating, 0)
    const average = sum / total
    
    return { average, total }
  }

  // Share tracking
  async trackShare(platform: string) {
    const today = new Date().toISOString().split('T')[0]
    const existing = await this.query(`shares?platform=eq.${platform}&date=eq.${today}`)
    
    if (!existing || existing.length === 0) {
      await this.query('shares', 'POST', {
        platform,
        date: today,
        count: 1
      })
    } else {
      await this.query(`shares?platform=eq.${platform}&date=eq.${today}`, 'PATCH', {
        count: existing[0].count + 1
      })
    }
  }

  async getShareStats() {
    const shares = await this.query('shares')
    if (!shares) return 0
    
    return shares.reduce((acc: number, s: any) => acc + s.count, 0)
  }
}

// Generate browser fingerprint for unique visitor tracking
function generateFingerprint(): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx?.fillText('fingerprint', 10, 10)
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|')
  
  // Simple hash function
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString()
}

export const supabase = new SupabaseClient()
export { generateFingerprint }