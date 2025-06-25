
-- Create a storage bucket for video files
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true);

-- Create RLS policies for the videos bucket
CREATE POLICY "Users can upload their own videos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Videos are publicly viewable" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'videos');

CREATE POLICY "Users can update their own videos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own videos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
