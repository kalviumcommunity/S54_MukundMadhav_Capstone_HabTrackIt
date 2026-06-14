// RBAC (Role-Based Access Control) utilities

export const ROLES = {
  USER: 'user',
  PREMIUM: 'premium',
  ADMIN: 'admin',
}

export function isAdmin(profile) {
  return profile?.role === ROLES.ADMIN
}

export function isPremium(profile) {
  return profile?.is_premium === true || profile?.role === ROLES.ADMIN
}

export function hasAccess(profile, requiredRole) {
  if (!profile) return false
  if (profile.role === ROLES.ADMIN) return true // admins can do everything
  if (requiredRole === ROLES.ADMIN) return false
  if (requiredRole === ROLES.PREMIUM) return profile.is_premium === true || profile.role === ROLES.PREMIUM
  return true // 'user' role has basic access
}

export async function requireAdmin() {
  const { createClient } = await import('@/utils/supabase/server')
  const { getProfile } = await import('@/utils/supabase/queries')

  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized')
  }

  const profile = await getProfile(supabase, user.id)

  if (!profile || profile.role !== ROLES.ADMIN) {
    throw new Error('Forbidden: Admin access required')
  }

  return { user, profile, supabase }
}
