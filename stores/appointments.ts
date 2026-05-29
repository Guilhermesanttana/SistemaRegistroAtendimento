import { defineStore } from 'pinia'
import type { Appointment } from '~/types'

export const useAppointmentsStore = defineStore('appointments', () => {
  const supabase = useSupabase()
  const authStore = useAuthStore()

  const appointments = ref<Appointment[]>([])
  const currentAppointment = ref<Appointment | null>(null)
  const loading = ref(false)

  async function fetchPatientAppointments(patientId: string) {
    loading.value = true

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .eq('status', 'completed')
        .order('started_at', { ascending: false })

      if (error) throw error
      appointments.value = data || []
    } finally {
      loading.value = false
    }
  }

  async function startAppointment(patientId: string, preObservations: string): Promise<string> {
    if (!authStore.professional?.id) throw new Error('Profissional não autenticado')

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        professional_id: authStore.professional.id,
        patient_id: patientId,
        started_at: new Date().toISOString(),
        pre_observations: preObservations,
        status: 'active'
      })
      .select('*, patient:patients(*)')
      .single()

    if (error) throw error
    currentAppointment.value = data
    return data.id
  }

  async function endAppointment(appointmentId: string) {
    const appt = currentAppointment.value
    if (!appt) return

    const endedAt = new Date().toISOString()
    const startedAt = new Date(appt.started_at)
    const endedAtDate = new Date(endedAt)
    const durationSeconds = Math.floor((endedAtDate.getTime() - startedAt.getTime()) / 1000)

    const { error } = await supabase
      .from('appointments')
      .update({
        ended_at: endedAt,
        duration_seconds: durationSeconds,
        status: 'completed'
      })
      .eq('id', appointmentId)

    if (error) throw error

    currentAppointment.value = {
      ...appt,
      ended_at: endedAt,
      duration_seconds: durationSeconds,
      status: 'completed'
    }
  }

  async function fetchAppointment(id: string) {
    loading.value = true

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, patient:patients(*), events:appointment_events(*, behaviors:event_behaviors(*, behavior_type:behavior_types(*)))')
        .eq('id', id)
        .single()

      if (error) throw error
      currentAppointment.value = data
    } finally {
      loading.value = false
    }
  }

  function clearCurrentAppointment() {
    currentAppointment.value = null
  }

  return {
    appointments,
    currentAppointment,
    loading,
    fetchPatientAppointments,
    startAppointment,
    endAppointment,
    fetchAppointment,
    clearCurrentAppointment,
  }
})
