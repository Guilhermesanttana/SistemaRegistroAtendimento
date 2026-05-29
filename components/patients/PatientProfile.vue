<template>
  <div class="space-y-3">
    <div class="card p-5">
      <div class="flex items-start gap-4">
        <div class="w-20 h-20 rounded-2xl overflow-hidden bg-green-100 flex-shrink-0 flex items-center justify-center">
          <img v-if="patient.foto" :src="patient.foto" :alt="patient.nome" class="w-full h-full object-cover" />
          <span v-else class="text-green-700 font-bold text-2xl">{{ initials }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-xl font-bold text-gray-900">{{ patient.nome }}</h1>
          <p class="text-gray-500 text-sm">{{ patient.idade }} anos</p>
          <span v-if="patient.nivel_suporte_tea" class="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            TEA Nível {{ patient.nivel_suporte_tea }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-for="item in infoItems"
      :key="item.label"
      class="card p-4"
    >
      <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">{{ item.label }}</p>
      <p class="text-gray-900 mt-1 whitespace-pre-line">{{ item.value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Patient } from '~/types'

const props = defineProps<{ patient: Patient }>()

const initials = computed(() => props.patient.nome.split(' ').slice(0, 2).map((name) => name[0]).join('').toUpperCase())

const infoItems = computed(() => [
  { label: 'Responsável', value: props.patient.responsavel },
  { label: 'Telefone', value: props.patient.telefone_responsavel },
  { label: 'Endereço', value: props.patient.endereco },
  { label: 'Diagnósticos', value: props.patient.diagnosticos },
  { label: 'Medicações', value: props.patient.medicacoes },
  { label: 'Observações', value: props.patient.observacoes },
].filter((item) => Boolean(item.value)))
</script>
