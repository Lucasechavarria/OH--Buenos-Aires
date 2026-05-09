-- Add type column to instagram_posts
ALTER TABLE instagram_posts ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'post';

-- Update existing records to 'reel' if they contain 'reel' in the link_url
UPDATE instagram_posts SET type = 'reel' WHERE link_url ILIKE '%/reel/%' OR link_url ILIKE '%/reels/%';
