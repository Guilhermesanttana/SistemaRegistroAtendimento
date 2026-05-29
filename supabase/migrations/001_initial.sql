-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  crp TEXT,
  foto TEXT,
  especialidade TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  endereco TEXT,
  responsavel TEXT,
  telefone_responsavel TEXT,
  nivel_suporte_tea SMALLINT CHECK (nivel_suporte_tea IN (1, 2, 3)),
  diagnosticos TEXT,
  medicacoes TEXT,
  observacoes TEXT,
  foto TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE professional_patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(professional_id, patient_id)
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  pre_observations TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE behavior_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  color TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO behavior_types (nome, descricao, color, sort_order) VALUES
  ('Auto-lesivo', 'Comportamentos que causam dano ao próprio paciente', '#ef4444', 1),
  ('Agressão', 'Comportamentos agressivos direcionados a outros', '#f97316', 2),
  ('Choro', 'Choro intenso ou prolongado', '#3b82f6', 3),
  ('Fuga', 'Tentativas de fuga ou evasão', '#8b5cf6', 4),
  ('Automutilação', 'Atos de automutilação', '#dc2626', 5),
  ('Gritos', 'Vocalizações intensas de alto volume', '#f59e0b', 6),
  ('Recusa', 'Recusa em cooperar com atividades', '#6b7280', 7),
  ('Estereotipia', 'Movimentos repetitivos ou autoestimulatórios', '#10b981', 8);

CREATE TABLE appointment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('HRE', 'R1_START', 'R1_END', 'R2', 'NOTE')),
  occurred_at TIMESTAMPTZ NOT NULL,
  intensity SMALLINT CHECK (intensity BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE event_behaviors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES appointment_events(id) ON DELETE CASCADE,
  behavior_type_id UUID NOT NULL REFERENCES behavior_types(id),
  intensity SMALLINT CHECK (intensity BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE appointment_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  noted_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_professionals_user_id ON professionals(user_id);
CREATE INDEX idx_professional_patients_professional ON professional_patients(professional_id);
CREATE INDEX idx_professional_patients_patient ON professional_patients(patient_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_professional ON appointments(professional_id);
CREATE INDEX idx_appointment_events_appointment ON appointment_events(appointment_id);
CREATE INDEX idx_event_behaviors_event ON event_behaviors(event_id);
CREATE INDEX idx_appointment_notes_appointment ON appointment_notes(appointment_id);

ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "professionals_own" ON professionals
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "patients_by_professional" ON patients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM professional_patients pp
      JOIN professionals p ON p.id = pp.professional_id
      WHERE pp.patient_id = patients.id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "professional_patients_own" ON professional_patients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM professionals p
      WHERE p.id = professional_patients.professional_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "appointments_own" ON appointments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM professionals p
      WHERE p.id = appointments.professional_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "appointment_events_own" ON appointment_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM appointments a
      JOIN professionals p ON p.id = a.professional_id
      WHERE a.id = appointment_events.appointment_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "event_behaviors_own" ON event_behaviors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM appointment_events ae
      JOIN appointments a ON a.id = ae.appointment_id
      JOIN professionals p ON p.id = a.professional_id
      WHERE ae.id = event_behaviors.event_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "appointment_notes_own" ON appointment_notes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM professionals p
      WHERE p.id = appointment_notes.professional_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "behavior_types_read" ON behavior_types
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER professionals_updated_at
  BEFORE UPDATE ON professionals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
