import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import type { Professional } from '~/types'

let listenerRegistered = false

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabase()
  const user = ref<User | null>(null)
  const professional = ref<Professional | null>(null)
  const loading = ref(false)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  async function initialize() {
    if (initialized.value) return

    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      user.value = session.user
      await fetchProfessional(session.user.id)
    }

    if (!listenerRegistered) {
      supabase.auth.onAuthStateChange(async (_event, session) => {
        user.value = session?.user ?? null

        if (session?.user) {
          await fetchProfessional(session.user.id)
        } else {
          professional.value = null
        }
      })

      listenerRegistered = true
    }

    initialized.value = true
  }

  async function fetchProfessional(userId: string) {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error
    professional.value = data
  }

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    professional.value = null
    await navigateTo('/login')
  }

  async function forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) throw error
  }

  return {
    user,
    professional,
    loading,
    initialized,
    isAuthenticated,
    initialize,
    login,
    logout,
    forgotPassword,
    fetchProfessional,
  }
})
