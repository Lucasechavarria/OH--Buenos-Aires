-- Evolution: Semantic Search Capabilities
-- Authored by: Data Solutions Architect

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Semantic Storage Table
CREATE TABLE brand_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    embedding VECTOR(1536), -- Standard size for OpenAI text-embedding-3-small
    content TEXT,           -- Textual representation used for the embedding
    metadata JSONB,         -- Additional info (category, name)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Indexes for Performance
-- Use HNSW for fast approximate nearest neighbor search
CREATE INDEX ON brand_embeddings USING hnsw (embedding vector_cosine_ops);

-- 4. Semantic Search Function (RPC)
-- This allows the API to perform vector similarity search directly in the DB
CREATE OR REPLACE FUNCTION match_brands (
    query_embedding VECTOR(1536),
    match_threshold FLOAT,
    match_count INT
)
RETURNS TABLE (
    id UUID,
    brand_id UUID,
    content TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        be.id,
        be.brand_id,
        be.content,
        1 - (be.embedding <=> query_embedding) AS similarity
    FROM brand_embeddings be
    WHERE 1 - (be.embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;

-- 5. RLS Policies for Semantic Data
ALTER TABLE brand_embeddings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read embeddings" ON brand_embeddings FOR SELECT USING (true);
