<template>
  <div v-if="currentPatient" class="space-y-5">
    <NuxtLink to="/" class="flex items-center gap-1 text-green-600 font-medium text-sm">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Pacientes
    </NuxtLink>

    <PatientProfile :patient="currentPatient" />

    <BaseButton
      :full-width="true"
      size="lg"
      @click="navigateTo(`/appointments/pre/${currentPatient.id}`)"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Iniciar Atendimento
    </BaseButton>

    <div class="space-y-3">
      <h2 class="section-title">Histórico de Atendimentos</h2>

      <div v-if="loading" class="flex justify-center py-6">
        <LoadingSpinner />
      </div>

      <div v-else-if="appointments.length > 0" class="space-y-3">
        <div v-for="appointment in appointments" :key="appointment.id" class="card p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-semibold text-gray-900">{{ formatDate(appointment.started_at) }}</p>
              <p class="text-sm text-gray-500">{{ formatDuration(appointment.duration_seconds || 0) }}</p>
            </div>
            <NuxtLink :to="`/appointments/report/${appointment.id}`" class="text-sm text-green-600 font-medium">
              Ver relatório
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="card p-6 text-center text-gray-500 text-sm">
        Nenhum atendimento registrado ainda.
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="flex justify-center py-20">
    <LoadingSpinner size="lg" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { currentPatient, loading: patientLoading, fetchPatient } = usePatients()
const appointmentsStore = useAppointmentsStore()
const { appointments, loading: appointmentsLoading } = storeToRefs(appointmentsStore)

const loading = computed(() => patientLoading.value || appointmentsLoading.value)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}min`
  return `${m} minutos`
}

onMounted(async () => {
  const patientId = route.params.id as string
  await fetchPatient(patientId)
  await appointmentsStore.fetchPatientAppointments(patientId)
})
</script>
