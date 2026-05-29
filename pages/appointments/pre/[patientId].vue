<template>
  <div class="space-y-5">
    <div class="flex items-center gap-3">
      <button @click="$router.back()" class="p-2 rounded-xl active:bg-gray-100 -ml-1">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="text-xl font-bold text-gray-900">Pré-Atendimento</h1>
        <p v-if="patient" class="text-gray-500 text-sm">{{ patient.nome }}</p>
      </div>
    </div>

    <div class="card p-5 space-y-4">
      <div>
        <h2 class="font-semibold text-gray-900">Estado atual do paciente</h2>
        <p class="text-sm text-gray-500 mt-0.5">Registre observações antes de iniciar</p>
      </div>

      <BaseTextarea
        v-model="preObservations"
        placeholder="Como o paciente chegou hoje? Humor, comportamentos observados, situações relevantes..."
        :rows="5"
      />
    </div>

    <BaseButton
      :full-width="true"
      size="lg"
      :loading="loading"
      @click="handleStart"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Iniciar Atendimento
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { currentPatient: patient, fetchPatient } = usePatients()
const { startAppointment, resetSession } = useAppointment()

const preObservations = ref('')
const loading = ref(false)

onMounted(async () => {
  resetSession()
  await fetchPatient(route.params.patientId as string)
})

async function handleStart() {
  loading.value = true

  try {
    const id = await startAppointment(route.params.patientId as string, preObservations.value)
    await navigateTo(`/appointments/${id}`)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
