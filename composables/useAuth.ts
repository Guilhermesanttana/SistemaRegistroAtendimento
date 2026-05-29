export function useAuth() {
  const store = useAuthStore()

  async function login(email: string, password: string) {
    await store.login(email, password)
    await navigateTo('/')
  }

  async function logout() {
    await store.logout()
  }

  return {
    user: computed(() => store.user),
    professional: computed(() => store.professional),
    loading: computed(() => store.loading),
    isAuthenticated: computed(() => store.isAuthenticated),
    login,
    logout,
    forgotPassword: store.forgotPassword,
  }
}
