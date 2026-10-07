import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value
  const { pathname } = request.nextUrl

  // Se tentar acessar admin sem estar logado como ADMIN
  if (pathname.startsWith('/admin')) {
    if (!token || role !== 'ADMIN') {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.search = '?tipo=admin'
      return NextResponse.redirect(loginUrl)
    }
  }

  // Se tentar acessar professor sem estar logado como TEACHER
  if (pathname.startsWith('/professor')) {
    if (!token || role !== 'TEACHER') {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.search = '?tipo=professor'
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/admin/:path*', '/professor/:path*'],
}
