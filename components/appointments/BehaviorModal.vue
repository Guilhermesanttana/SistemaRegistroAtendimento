<template>
  <BaseModal v-model="show" :title="title">
    <div class="space-y-5">
      <div v-if="type === 'R1'" class="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
        <p class="text-red-700 font-medium text-sm leading-relaxed">
          🌿 Respire fundo. Oriente o paciente da maneira mais segura e acolhedora possível.
        </p>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-700 mb-3">Intensidade</p>
        <div class="flex gap-2">
          <button
            v-for="n in 5"
            :key="n"
            type="button"
            @click="intensity = n"
            :class="[
              'flex-1 py-3 rounded-xl text-lg font-bold transition-all',
              intensity >= n
                ? (type === 'R1' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white')
                : 'bg-gray-100 text-gray-400'
            ]"
          >
            {{ n }}
          </button>
        </div>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-700 mb-3">Comportamentos</p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="behavior in behaviorTypes"
            :key="behavior.id"
            type="button"
            @click="toggleBehavior(behavior.id)"
            :class="[
              'py-3 px-3 rounded-xl text-sm font-medium transition-all text-left',
              selectedBehaviors.has(behavior.id)
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 active:bg-gray-200'
            ]"
          >
            {{ behavior.nome }}
          </button>
        </div>
      </div>

      <BaseTextarea
        v-model="notes"
        label="Observações rápidas"
        :rows="2"
        placeholder="Descreva o contexto..."
      />
    </div>

    <template #footer>
      <BaseButton
        :variant="type === 'R1' ? 'danger' : 'warning'"
        :full-width="true"
        :loading="loading"
        @click="submit"
      >
        Registrar {{ type }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { BehaviorType } from '~/types'

const props = defineProps<{
  modelValue: boolean
  type: 'R1' | 'R2'
  behaviorTypes: BehaviorType[]
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  submit: [{ intensity: number; behaviors: string[]; notes: string }]
}>()

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const title = computed(() => props.type === 'R1' ? 'Registrar Crise (R1)' : 'Comportamento Problema (R2)')

const intensity = ref(3)
const selectedBehaviors = ref(new Set<string>())
const notes = ref('')
const loading = ref(false)

function toggleBehavior(id: string) {
  const next = new Set(selectedBehaviors.value)

  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }

  selectedBehaviors.value = next
}

async function submit() {
  loading.value = true

  try {
    emit('submit', {
      intensity: intensity.value,
      behaviors: Array.from(selectedBehaviors.value),
      notes: notes.value
    })

    intensity.value = 3
    selectedBehaviors.value = new Set()
    notes.value = ''
    show.value = false
  } finally {
    loading.value = false
  }
}
</script>
