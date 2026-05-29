<template>
  <NuxtLink :to="`/patients/${patient.id}`" class="block">
    <div class="card p-4 flex items-center gap-4 active:bg-gray-50 transition-colors">
      <div class="w-14 h-14 rounded-2xl overflow-hidden bg-green-100 flex-shrink-0 flex items-center justify-center">
        <img v-if="patient.foto" :src="patient.foto" :alt="patient.nome" class="w-full h-full object-cover" />
        <span v-else class="text-green-700 font-bold text-lg">{{ initials }}</span>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 text-lg truncate">{{ patient.nome }}</h3>
        <p class="text-gray-500 text-sm">{{ patient.idade }} anos</p>
        <div v-if="patient.nivel_suporte_tea" class="mt-1">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            Nível {{ patient.nivel_suporte_tea }} TEA
          </span>
        </div>
      </div>
      <svg class="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Patient } from '~/types'

const props = defineProps<{ patient: Patient }>()

const initials = computed(() => props.patient.nome.split(' ').slice(0, 2).map((name) => name[0]).join('').toUpperCase())
</script>
