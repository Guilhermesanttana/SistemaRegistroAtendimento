export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.initialize()
  }

  const publicRoutes = ['/login', '/forgot-password', '/reset-password']

  if (publicRoutes.includes(to.path)) {
    if (authStore.isAuthenticated) {
      return navigateTo('/')
    }
    return
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
