import { createClient } from '@supabase/supabase-js'

let supabaseInstance: ReturnType<typeof createClient> | null = null

export function useSupabase() {
  if (!supabaseInstance) {
    const config = useRuntimeConfig()
    supabaseInstance = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )
  }

  return supabaseInstance
}
