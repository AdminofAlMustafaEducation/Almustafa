-- 011_extend_notifications.sql
-- Extend notifications table for unified notification system

-- Add new columns to existing notifications table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'general';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS reference_type TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS reference_id UUID;

-- Update type constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('attendance', 'test_result', 'note', 'announcement', 'fee', 'live_class', 'admission', 'system', 'general'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Update RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Admin can manage all notifications
CREATE POLICY "Admin can manage notifications"
  ON notifications FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Users can read own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Public can read active notifications (for notification bell)
CREATE POLICY "Public can read active notifications"
  ON notifications FOR SELECT
  USING (is_active = true AND user_id IS NULL);
