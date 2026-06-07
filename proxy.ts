import { auth } from './auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn   = !!req.auth
  const isLoginPage  = req.nextUrl.pathname === '/admin/login'
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isDocsRoute  = req.nextUrl.pathname.startsWith('/api/docs') ||
                       req.nextUrl.pathname.startsWith('/api/openapi.json')

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }

  if (isDocsRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
  }
})

export const config = {
  matcher: ['/admin/:path*', '/api/docs', '/api/openapi.json'],
}
