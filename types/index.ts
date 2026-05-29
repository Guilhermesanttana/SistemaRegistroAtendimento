export interface Professional {
  id: string
  user_id: string
  nome: string
  email: string
  telefone?: string
  crp?: string
  foto?: string
  especialidade?: string
  observacoes?: string
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  nome: string
  data_nascimento: string
  idade?: number
  endereco?: string
  responsavel?: string
  telefone_responsavel?: string
  nivel_suporte_tea?: 1 | 2 | 3
  diagnosticos?: string
  medicacoes?: string
  observacoes?: string
  foto?: string
  created_at: string
  updated_at: string
}

export interface ProfessionalPatient {
  id: string
  professional_id: string
  patient_id: string
  created_at: string
  patient?: Patient
  professional?: Professional
}

export interface Appointment {
  id: string
  professional_id: string
  patient_id: string
  started_at: string
  ended_at?: string
  duration_seconds?: number
  pre_observations?: string
  status: 'active' | 'completed'
  created_at: string
  patient?: Patient
  events?: AppointmentEvent[]
}

export interface AppointmentEvent {
  id: string
  appointment_id: string
  professional_id: string
  event_type: 'HRE' | 'R1_START' | 'R1_END' | 'R2' | 'NOTE'
  occurred_at: string
  intensity?: number
  notes?: string
  created_at: string
  behaviors?: EventBehavior[]
}

export interface BehaviorType {
  id: string
  nome: string
  descricao?: string
  color?: string
  active: boolean
  sort_order: number
}

export interface EventBehavior {
  id: string
  event_id: string
  behavior_type_id: string
  intensity?: number
  notes?: string
  behavior_type?: BehaviorType
}

export interface AppointmentNote {
  id: string
  appointment_id: string
  professional_id: string
  content: string
  noted_at: string
  created_at: string
}

export interface AppointmentStats {
  total_r1: number
  total_r2: number
  total_hre: number
  duration_seconds: number
  r1_events: AppointmentEvent[]
  r2_events: AppointmentEvent[]
  hre_events: AppointmentEvent[]
  notes: AppointmentNote[]
}

export interface ActiveCrisis {
  eventId: string
  startedAt: string
  intensity?: number
}
