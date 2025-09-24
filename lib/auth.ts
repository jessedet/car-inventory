import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function authenticateRequest(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  if (!token) {
    throw new Error("Unauthorized")
  }
  
  return token
}

export async function requireAuth(request: NextRequest) {
  try {
    return await authenticateRequest(request)
  } catch {
    throw new Error("Authentication required")
  }
}
