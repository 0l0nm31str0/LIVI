-- Migration 002: Marketplace orders table
-- Run after 001 (initial schema)

CREATE TABLE IF NOT EXISTS marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id TEXT,
  patient_email TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('prescription', 'otc')),
  plan_interval TEXT NOT NULL DEFAULT 'month',
  auto_renew BOOLEAN DEFAULT true,
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'cart',
  shipping_address JSONB DEFAULT '{}',
  beluga_master_id TEXT,
  intake_completed_at TIMESTAMPTZ,
  stripe_checkout_session_id TEXT,
  stripe_subscription_id TEXT,
  visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS marketplace_orders_patient_idx ON marketplace_orders(patient_id);
CREATE INDEX IF NOT EXISTS marketplace_orders_email_idx ON marketplace_orders(patient_email);
CREATE INDEX IF NOT EXISTS marketplace_orders_status_idx ON marketplace_orders(status);
CREATE INDEX IF NOT EXISTS marketplace_orders_beluga_idx ON marketplace_orders(beluga_master_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_marketplace_order_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS marketplace_orders_updated_at ON marketplace_orders;
CREATE TRIGGER marketplace_orders_updated_at
  BEFORE UPDATE ON marketplace_orders
  FOR EACH ROW EXECUTE FUNCTION update_marketplace_order_timestamp();

-- RLS
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
-- Service role bypasses RLS; add patient-scoped policies when using Supabase Auth
