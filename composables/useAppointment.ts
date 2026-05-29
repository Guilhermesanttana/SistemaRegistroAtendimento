export function useAppointment() {
  const appointmentsStore = useAppointmentsStore()
  const eventsStore = useEventsStore()

  return {
    currentAppointment: computed(() => appointmentsStore.currentAppointment),
    events: computed(() => eventsStore.events),
    notes: computed(() => eventsStore.notes),
    hreActive: computed(() => eventsStore.hreActive),
    activeCrisis: computed(() => eventsStore.activeCrisis),
    r1Count: computed(() => eventsStore.r1Count),
    r2Count: computed(() => eventsStore.r2Count),
    hreCount: computed(() => eventsStore.hreCount),
    startAppointment: appointmentsStore.startAppointment.bind(appointmentsStore),
    endAppointment: appointmentsStore.endAppointment.bind(appointmentsStore),
    registerHRE: eventsStore.registerHRE.bind(eventsStore),
    registerR1Start: eventsStore.registerR1Start.bind(eventsStore),
    registerR1End: eventsStore.registerR1End.bind(eventsStore),
    registerR2: eventsStore.registerR2.bind(eventsStore),
    addNote: eventsStore.addNote.bind(eventsStore),
    hydrateSession: eventsStore.hydrateSession.bind(eventsStore),
    resetSession: eventsStore.resetSession.bind(eventsStore),
  }
}
