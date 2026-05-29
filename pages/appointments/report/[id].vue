<template>
  <div v-if="appointment" class="space-y-5">
    <div class="flex items-center gap-3">
      <button @click="$router.back()" class="p-2 rounded-xl active:bg-gray-100 -ml-1">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="text-xl font-bold text-gray-900">Relatório</h1>
        <p class="text-sm text-gray-500">{{ formatDate(appointment.started_at) }}</p>
      </div>
    </div>

    <div class="card p-4 flex items-center gap-3">
      <div class="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
        <span class="text-green-700 font-bold">{{ patientInitials }}</span>
      </div>
      <div>
        <p class="font-semibold text-gray-900">{{ appointment.patient?.nome }}</p>
        <p class="text-sm text-gray-500">{{ patientAge }} anos</p>
      </div>
    </div>

    <ReportSummary
      :duration-seconds="appointment.duration_seconds || 0"
      :events="appointment.events || []"
    />

    <div v-if="appointment.pre_observations" class="card p-4">
      <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Observações Pré-Atendimento</p>
      <p class="text-gray-700 text-sm whitespace-pre-line">{{ appointment.pre_observations }}</p>
    </div>

    <ReportTimeline
      :events="appointment.events || []"
      :notes="appointmentNotes"
    />

    <button type="button" class="btn-secondary opacity-60">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Exportar PDF (em breve)
    </button>
  </div>

  <div v-else-if="loading" class="flex justify-center py-20">
    <LoadingSpinner size="lg" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { AppointmentNote } from '~/types'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const appointmentsStore = useAppointmentsStore()
const { currentAppointment: appointment, loading } = storeToRefs(appointmentsStore)
const appointmentNotes = ref<AppointmentNote[]>([])

const patientInitials = computed(() => {
  const nome = appointment.value?.patient?.nome || ''
  return nome.split(' ').filter(Boolean).slice(0, 2).map((item) => item[0]).join('').toUpperCase()
})

const patientAge = computed(() => {
  const birthDate = appointment.value?.patient?.data_nascimento
  if (!birthDate) return '--'

  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  const id = route.params.id as string
  await appointmentsStore.fetchAppointment(id)

  const supabase = useSupabase()
  const { data, error } = await supabase
    .from('appointment_notes')
    .select('*')
    .eq('appointment_id', id)
    .order('noted_at')

  if (!error) {
    appointmentNotes.value = data || []
  }
})
</script>
