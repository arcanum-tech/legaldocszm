-- LegalDocs ZM Schema
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_type TEXT NOT NULL,        -- affidavit | sale_agreement | nda | employment | tenancy | demand_letter | loan | power_of_attorney
  title TEXT NOT NULL,
  fields JSONB NOT NULL,         -- the form inputs used to generate
  content TEXT NOT NULL,         -- the generated document text
  requester_name TEXT,
  requester_phone TEXT,
  requester_email TEXT,
  amount_paid_zmw NUMERIC(10,2) DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS docs_type_idx ON legal_documents(doc_type);
CREATE INDEX IF NOT EXISTS docs_phone_idx ON legal_documents(requester_phone);
CREATE INDEX IF NOT EXISTS docs_paid_idx ON legal_documents(is_paid);
