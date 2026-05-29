import type { BehaviorType } from '~/types'

export function useEvents() {
  const supabase = useSupabase()
  const behaviorTypes = ref<BehaviorType[]>([])

  async function fetchBehaviorTypes() {
    const { data, error } = await supabase
      .from('behavior_types')
      .select('*')
      .eq('active', true)
      .order('sort_order')

    if (error) throw error
    behaviorTypes.value = data || []
  }

  onMounted(fetchBehaviorTypes)

  return { behaviorTypes, fetchBehaviorTypes }
}
