import { NextRequest } from "next/server"

interface RateLimitOptions {
  windowMs: number
  max: number
}

const requests = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(options: RateLimitOptions) {
  return async (request: NextRequest): Promise<boolean> => {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const now = Date.now()
    const windowStart = now - options.windowMs
    
    // Clean up old entries
    for (const [key, value] of requests.entries()) {
      if (value.resetTime < windowStart) {
        requests.delete(key)
      }
    }
    
    const current = requests.get(ip)
    
    if (!current) {
      requests.set(ip, { count: 1, resetTime: now })
      return true
    }
    
    if (current.resetTime < windowStart) {
      requests.set(ip, { count: 1, resetTime: now })
      return true
    }
    
    if (current.count >= options.max) {
      return false
    }
    
    current.count++
    return true
  }
}

export const createRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
