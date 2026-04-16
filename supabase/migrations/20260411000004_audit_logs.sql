-- Migration: 20260411000004_audit_logs.sql
-- Goal: Inmutable Audit Trail for Admin Actions

-- 1. Create Audit Logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL, -- 'brand', 'promotion', 'settings'
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    request_id UUID,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Performance Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_request_id ON audit_logs(request_id);

-- 3. Security: Write-Only Policy (Inmutable)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow initial ingestion (INSERT) for authenticated managers/admins
CREATE POLICY "Allow ingestion for authenticated users" 
ON audit_logs FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Deny all other operations (SELECT, UPDATE, DELETE)
-- This ensures that logs cannot be tampered with or read without special privileges
CREATE POLICY "Deny modifications" 
ON audit_logs FOR UPDATE 
TO public 
USING (false);

CREATE POLICY "Deny deletions" 
ON audit_logs FOR DELETE 
TO public 
USING (false);

-- Optional: Superadmins can read logs for investigation
CREATE POLICY "Admins can read logs" 
ON audit_logs FOR SELECT 
TO authenticated 
USING (true); -- En producción, restringir a un rol específico
