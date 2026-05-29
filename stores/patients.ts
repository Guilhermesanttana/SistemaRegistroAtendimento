import { defineStore } from 'pinia'
import type { Patient, ProfessionalPatient } from '~/types'

export const usePatientsStore = defineStore('patients', () => {
  const supabase = useSupabase()
  const authStore = useAuthStore()

  const patients = ref<Patient[]>([])
  const currentPatient = ref<Patient | null>(null)
  const loading = ref(false)
  const searchQuery = ref('')

  const filteredPatients = computed(() => {
    if (!searchQuery.value) return patients.value

    const q = searchQuery.value.toLowerCase()
    return patients.value.filter((patient) => patient.nome.toLowerCase().includes(q))
  })

  function calcularIdade(dataNascimento: string): number {
    const hoje = new Date()
    const nasc = new Date(dataNascimento)
    let idade = hoje.getFullYear() - nasc.getFullYear()
    const m = hoje.getMonth() - nasc.getMonth()

    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
      idade--
    }

    return idade
  }

  async function fetchMyPatients() {
    if (!authStore.professional?.id) return

    loading.value = true

    try {
      const { data, error } = await supabase
        .from('professional_patients')
        .select('*, patient:patients(*)')
        .eq('professional_id', authStore.professional.id)

      if (error) throw error

      patients.value = (data || [])
        .map((item: ProfessionalPatient) => item.patient)
        .filter((patient): patient is Patient => Boolean(patient))
        .map((patient) => ({
          ...patient,
          idade: calcularIdade(patient.data_nascimento)
        }))
    } finally {
      loading.value = false
    }
  }

  async function fetchPatient(id: string) {
    loading.value = true

    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      currentPatient.value = data
        ? { ...data, idade: calcularIdade(data.data_nascimento) }
        : null
    } finally {
      loading.value = false
    }
  }

  return {
    patients,
    currentPatient,
    loading,
    searchQuery,
    filteredPatients,
    fetchMyPatients,
    fetchPatient,
    calcularIdade,
  }
})
