export function usePatients() {
  const store = usePatientsStore()

  return {
    patients: computed(() => store.patients),
    filteredPatients: computed(() => store.filteredPatients),
    currentPatient: computed(() => store.currentPatient),
    loading: computed(() => store.loading),
    searchQuery: computed({
      get: () => store.searchQuery,
      set: (value: string) => {
        store.searchQuery = value
      }
    }),
    fetchMyPatients: store.fetchMyPatients.bind(store),
    fetchPatient: store.fetchPatient.bind(store),
  }
}
