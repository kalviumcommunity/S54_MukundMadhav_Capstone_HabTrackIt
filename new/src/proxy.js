import { updateSession } from './utils/supabase/middleware'

export async function proxy(request) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|old|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
