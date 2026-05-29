import { defineStore } from 'pinia'
import type { ActiveCrisis, AppointmentEvent, AppointmentNote } from '~/types'

export const useEventsStore = defineStore('events', () => {
  const supabase = useSupabase()
  const authStore = useAuthStore()

  const events = ref<AppointmentEvent[]>([])
  const notes = ref<AppointmentNote[]>([])
  const activeCrisis = ref<ActiveCrisis | null>(null)
  const hreActive = ref(false)
  const loading = ref(false)

  const r1Count = computed(() => events.value.filter((event) => event.event_type === 'R1_START').length)
  const r2Count = computed(() => events.value.filter((event) => event.event_type === 'R2').length)
  const hreCount = computed(() => events.value.filter((event) => event.event_type === 'HRE').length)

  async function addEvent(
    appointmentId: string,
    type: AppointmentEvent['event_type'],
    intensity?: number,
    eventNotes?: string,
    behaviors?: { behavior_type_id: string; intensity?: number; notes?: string }[]
  ): Promise<AppointmentEvent> {
    if (!authStore.professional?.id) throw new Error('Não autenticado')

    const { data: event, error } = await supabase
      .from('appointment_events')
      .insert({
        appointment_id: appointmentId,
        professional_id: authStore.professional.id,
        event_type: type,
        occurred_at: new Date().toISOString(),
        intensity,
        notes: eventNotes,
      })
      .select()
      .single()

    if (error) throw error

    if (behaviors?.length) {
      const { data: behaviorData, error: behaviorError } = await supabase
        .from('event_behaviors')
        .insert(behaviors.map((behavior) => ({ ...behavior, event_id: event.id })))
        .select('*, behavior_type:behavior_types(*)')

      if (behaviorError) throw behaviorError
      event.behaviors = behaviorData || []
    }

    events.value.push(event)
    return event
  }

  async function registerHRE(appointmentId: string) {
    hreActive.value = true
    const event = await addEvent(appointmentId, 'HRE')
    setTimeout(() => {
      hreActive.value = false
    }, 5000)
    return event
  }

  async function registerR1Start(
    appointmentId: string,
    intensity: number,
    behaviors: { behavior_type_id: string; intensity?: number; notes?: string }[],
    notes?: string
  ) {
    const event = await addEvent(appointmentId, 'R1_START', intensity, notes, behaviors)
    activeCrisis.value = {
      eventId: event.id,
      startedAt: event.occurred_at,
      intensity
    }
    return event
  }

  async function registerR1End(appointmentId: string) {
    if (!activeCrisis.value) return
    const event = await addEvent(appointmentId, 'R1_END')
    activeCrisis.value = null
    return event
  }

  async function registerR2(
    appointmentId: string,
    intensity: number,
    behaviors: { behavior_type_id: string; intensity?: number; notes?: string }[],
    noteText?: string
  ) {
    return addEvent(appointmentId, 'R2', intensity, noteText, behaviors)
  }

  async function addNote(appointmentId: string, content: string) {
    if (!authStore.professional?.id) throw new Error('Não autenticado')

    const { data, error } = await supabase
      .from('appointment_notes')
      .insert({
        appointment_id: appointmentId,
        professional_id: authStore.professional.id,
        content,
        noted_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    notes.value.push(data)
    return data
  }

  function hydrateSession(appointment: { events?: AppointmentEvent[] } | null) {
    events.value = appointment?.events || []
    notes.value = []
    activeCrisis.value = null
    hreActive.value = false
  }

  function resetSession() {
    events.value = []
    notes.value = []
    activeCrisis.value = null
    hreActive.value = false
  }

  return {
    events,
    notes,
    activeCrisis,
    hreActive,
    loading,
    r1Count,
    r2Count,
    hreCount,
    addEvent,
    registerHRE,
    registerR1Start,
    registerR1End,
    registerR2,
    addNote,
    hydrateSession,
    resetSession,
  }
})
