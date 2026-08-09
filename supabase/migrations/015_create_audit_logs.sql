-- 015_create_audit_logs.sql
-- Audit logging table

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin can read all audit logs
CREATE POLICY "Admin can read audit_logs"
  ON audit_logs FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- System can insert audit logs
CREATE POLICY "System can insert audit_logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- Function to log important actions
CREATE OR REPLACE FUNCTION log_audit_event(
  p_actor_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, old_data, new_data)
  VALUES (p_actor_id, p_action, p_entity_type, p_entity_id, p_old_data, p_new_data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
