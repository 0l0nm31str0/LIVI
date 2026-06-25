-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  LIVI — Supabase Schema                                         ║
-- ║  Run this in the Supabase SQL Editor to set up your database.  ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Patient Profiles ────────────────────────────────────────────────────────
-- Stores patient data needed for Beluga + Curexa calls.
-- livi_user_id maps to the localStorage auth user ID.
CREATE TABLE IF NOT EXISTS patient_profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  livi_user_id  TEXT UNIQUE NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  date_of_birth TEXT,               -- YYYY-MM-DD
  phone         TEXT,
  gender        TEXT,
  address_line1 TEXT,
  city          TEXT,
  state         TEXT,
  zip           TEXT,
  -- Beluga cross-reference
  beluga_patient_id TEXT UNIQUE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ─── Visits ──────────────────────────────────────────────────────────────────
-- Unified LIVI visit model: one visit spans a Beluga consultation + Curexa order.
CREATE TABLE IF NOT EXISTS visits (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id            TEXT NOT NULL,           -- LIVI user ID
  patient_email         TEXT NOT NULL,
  beluga_visit_id       TEXT UNIQUE,             -- Beluga visit ID
  beluga_patient_id     TEXT,                   -- Beluga patient ID
  status                TEXT NOT NULL DEFAULT 'draft',
  -- draft | submitted | under_review | active | prescribed | shipped | delivered | cancelled
  visit_type            TEXT NOT NULL DEFAULT 'async',
  chief_complaint       TEXT,
  questionnaire         JSONB DEFAULT '{}',
  zoom_link             TEXT,
  -- Prescription data (from Beluga RX_WRITTEN webhook)
  rx_written            BOOLEAN DEFAULT false,
  prescription_data     JSONB,                  -- Full Rx payload from Beluga
  -- Curexa order tracking
  curexa_order_id       TEXT,
  curexa_order_status   TEXT,
  tracking_number       TEXT,
  tracking_url          TEXT,
  carrier               TEXT,
  estimated_delivery    TEXT,
  -- Timestamps
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

-- ─── Visit Messages ───────────────────────────────────────────────────────────
-- Unified message thread: patient ↔ doctor (Beluga) + patient ↔ pharmacy (Curexa).
CREATE TABLE IF NOT EXISTS visit_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id     UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  sender_id    TEXT,
  sender_name  TEXT NOT NULL DEFAULT 'System',
  sender_type  TEXT NOT NULL,    -- patient | doctor | pharmacy | system
  message      TEXT NOT NULL,
  source       TEXT NOT NULL,    -- beluga | curexa | livi
  external_id  TEXT,             -- Beluga or Curexa message ID
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Webhook Event Log ────────────────────────────────────────────────────────
-- Audit trail of all incoming webhook events.
CREATE TABLE IF NOT EXISTS webhook_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source       TEXT NOT NULL,    -- beluga | curexa
  event_type   TEXT NOT NULL,
  payload      JSONB NOT NULL,
  processed    BOOLEAN DEFAULT false,
  error        TEXT,
  received_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS visits_patient_id_idx      ON visits(patient_id);
CREATE INDEX IF NOT EXISTS visits_beluga_visit_id_idx ON visits(beluga_visit_id);
CREATE INDEX IF NOT EXISTS visits_curexa_order_id_idx ON visits(curexa_order_id);
CREATE INDEX IF NOT EXISTS visit_messages_visit_idx   ON visit_messages(visit_id);
CREATE INDEX IF NOT EXISTS patient_profiles_email_idx ON patient_profiles(email);

-- ─── Auto-update updated_at ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER visits_updated_at
  BEFORE UPDATE ON visits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER patient_profiles_updated_at
  BEFORE UPDATE ON patient_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security (RLS) — disabled for service role server access ───────
-- Enable RLS but service role key bypasses it entirely.
ALTER TABLE visits          ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events  ENABLE ROW LEVEL SECURITY;
