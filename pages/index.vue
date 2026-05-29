<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Meus Pacientes</h1>
      <p class="text-gray-500 text-sm mt-0.5">{{ professional?.nome }}</p>
    </div>

    <div class="relative">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar paciente..."
        class="input-field pl-10"
      />
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else-if="filteredPatients.length > 0" class="space-y-3">
      <PatientCard
        v-for="patient in filteredPatients"
        :key="patient.id"
        :patient="patient"
      />
    </div>

    <div v-else class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <p class="text-gray-500">Nenhum paciente encontrado</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { professional } = useAuth()
const { filteredPatients, loading, searchQuery, fetchMyPatients } = usePatients()

onMounted(fetchMyPatients)
</script>
