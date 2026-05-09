-- Migration: Contact Messages Table
-- Created on: 2026-05-09

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, read, archived
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can only insert
CREATE POLICY "Public insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Admin can do everything
CREATE POLICY "Admin full access contact_messages" ON public.contact_messages FOR ALL TO authenticated USING (true);
