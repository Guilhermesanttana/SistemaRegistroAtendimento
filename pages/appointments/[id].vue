<template>
  <div class="min-h-screen flex flex-col">
    <div class="bg-white/80 backdrop-blur border-b border-gray-100 px-4 py-3">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs text-gray-400 font-medium">Atendendo</p>
          <p class="font-semibold text-gray-900 text-sm">{{ appointment?.patient?.nome || '...' }}</p>
        </div>
        <AppointmentTimer v-if="appointment?.started_at" :started-at="appointment.started_at" />
        <div class="flex gap-2 text-sm">
          <span class="flex items-center gap-1 text-red-600 font-bold">
            <span class="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs">{{ r1Count }}</span>
            R1
          </span>
          <span class="flex items-center gap-1 text-amber-600 font-bold">
            <span class="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center text-xs">{{ r2Count }}</span>
            R2
          </span>
        </div>
      </div>
    </div>

    <Transition name="slide-down">
      <div v-if="activeCrisis" class="bg-red-600 text-white px-4 py-3 text-center">
        <p class="text-sm font-semibold">🔴 Crise R1 em andamento</p>
        <button
          type="button"
          @click="handleR1End"
          class="mt-1 bg-white text-red-600 text-xs font-bold px-4 py-1.5 rounded-full active:bg-red-50"
        >
          Encerrar Crise
        </button>
      </div>
    </Transition>

    <div class="flex-1 p-4 flex flex-col gap-4">
      <HreCard @register="handleHRE" />
      <R2Card @register="showR2Modal = true" />
      <R1Card @register="showR1Modal = true" />
    </div>

    <NotesFooter @save="handleNote" />

    <div class="bg-white border-t border-gray-100 p-4">
      <button
        type="button"
        @click="showEndModal = true"
        class="w-full py-4 px-6 bg-gray-800 text-white font-semibold rounded-2xl active:bg-gray-900 text-base"
      >
        Finalizar Atendimento
      </button>
    </div>

    <BehaviorModal
      v-model="showR1Modal"
      type="R1"
      :behavior-types="behaviorTypes"
      @submit="handleR1Submit"
    />

    <BehaviorModal
      v-model="showR2Modal"
      type="R2"
      :behavior-types="behaviorTypes"
      @submit="handleR2Submit"
    />

    <BaseModal v-model="showEndModal" title="Finalizar Atendimento">
      <div class="space-y-4">
        <p class="text-gray-600 text-center">
          Deseja encerrar o atendimento de<br><strong>{{ appointment?.patient?.nome }}</strong>?
        </p>
        <div class="grid grid-cols-2 gap-3">
          <BaseButton variant="secondary" @click="showEndModal = false" :full-width="true">Cancelar</BaseButton>
          <BaseButton variant="danger" :loading="ending" @click="handleEnd" :full-width="true">Encerrar</BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

definePageMeta({ middleware: 'auth', layout: 'appointment' })

const route = useRoute()
const appointmentsStore = useAppointmentsStore()
const { currentAppointment: appointment } = storeToRefs(appointmentsStore)
const {
  r1Count,
  r2Count,
  activeCrisis,
  registerHRE,
  registerR1Start,
  registerR1End,
  registerR2,
  addNote,
  hydrateSession,
  resetSession,
} = useAppointment()
const { behaviorTypes, fetchBehaviorTypes } = useEvents()

const showR1Modal = ref(false)
const showR2Modal = ref(false)
const showEndModal = ref(false)
const ending = ref(false)

const appointmentId = computed(() => route.params.id as string)

watch(appointment, (value) => {
  if (value) {
    hydrateSession(value)
  }
}, { immediate: true })

onMounted(async () => {
  await fetchBehaviorTypes()
  if (!appointment.value || appointment.value.id !== appointmentId.value) {
    await appointmentsStore.fetchAppointment(appointmentId.value)
  }
})

onBeforeUnmount(() => {
  resetSession()
})

async function handleHRE() {
  await registerHRE(appointmentId.value)
}

async function handleR1Submit(data: { intensity: number; behaviors: string[]; notes: string }) {
  await registerR1Start(
    appointmentId.value,
    data.intensity,
    data.behaviors.map((id) => ({ behavior_type_id: id })),
    data.notes
  )
}

async function handleR1End() {
  await registerR1End(appointmentId.value)
}

async function handleR2Submit(data: { intensity: number; behaviors: string[]; notes: string }) {
  await registerR2(
    appointmentId.value,
    data.intensity,
    data.behaviors.map((id) => ({ behavior_type_id: id })),
    data.notes
  )
}

async function handleNote(content: string) {
  await addNote(appointmentId.value, content)
}

async function handleEnd() {
  if (!appointment.value) return

  ending.value = true
  const patientId = appointment.value.patient_id

  try {
    await appointmentsStore.endAppointment(appointmentId.value)
    appointmentsStore.clearCurrentAppointment()
    resetSession()
    await navigateTo(`/patients/${patientId}`)
  } finally {
    ending.value = false
    showEndModal.value = false
  }
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
