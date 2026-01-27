import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value
  const { pathname } = request.nextUrl

  // Se tentar acessar admin sem estar logado como ADMIN
  if (pathname.startsWith('/admin')) {
    if (!token || role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login?tipo=admin', request.url))
    }
  }

  // Se tentar acessar professor sem estar logado como TEACHER
  if (pathname.startsWith('/professor')) {
    if (!token || role !== 'TEACHER') {
      return NextResponse.redirect(new URL('/login?tipo=professor', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/professor/:path*'],
}
