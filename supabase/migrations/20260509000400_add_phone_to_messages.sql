-- Migration: Add phone to contact_messages
-- Created on: 2026-05-09

ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS phone TEXT;
