import { NextRequest, NextResponse } from 'next/server'
import { securityMiddleware } from './src/middleware/security-middleware'

export async function middleware(request: NextRequest) {
  const response = new NextResponse()
  return await securityMiddleware(request, response)
}

export const config = {
  matcher: ['/', '/admin/:path*', '/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
}
