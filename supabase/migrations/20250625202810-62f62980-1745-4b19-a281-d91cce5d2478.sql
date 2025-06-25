
-- Add slug column to videos table for SEO-friendly URLs
ALTER TABLE public.videos ADD COLUMN slug text;

-- Create unique index on slug column
CREATE UNIQUE INDEX videos_slug_idx ON public.videos(slug);

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_slug(title text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    slug text;
    counter integer := 0;
    base_slug text;
BEGIN
    -- Convert title to lowercase, replace spaces with hyphens, remove special characters
    base_slug := lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
    slug := base_slug;
    
    -- Check if slug exists and add counter if needed
    WHILE EXISTS (SELECT 1 FROM public.videos WHERE slug = slug) LOOP
        counter := counter + 1;
        slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN slug;
END;
$$;

-- Create RPC function to increment view count (fixing the TypeScript error)
CREATE OR REPLACE FUNCTION public.increment_view_count(video_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.videos 
    SET view_count = view_count + 1 
    WHERE id = video_id;
END;
$$;

-- Update existing videos to have slugs
UPDATE public.videos 
SET slug = public.generate_slug(title) 
WHERE slug IS NULL;

-- Make slug required for future videos
ALTER TABLE public.videos ALTER COLUMN slug SET NOT NULL;
