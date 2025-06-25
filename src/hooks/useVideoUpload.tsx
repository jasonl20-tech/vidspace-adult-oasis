
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface VideoUploadData {
  title: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  duration: number;
  category_id: string;
  is_premium: boolean;
}

export const useVideoUpload = () => {
  const [uploading, setUploading] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const uploadVideo = async (videoData: VideoUploadData, userId: string) => {
    setUploading(true);
    try {
      // Generate slug from title
      const baseSlug = generateSlug(videoData.title);
      let slug = baseSlug;
      let counter = 0;

      // Check if slug exists and add counter if needed
      while (true) {
        const { data: existingVideo } = await supabase
          .from('videos')
          .select('id')
          .eq('slug', slug)
          .single();

        if (!existingVideo) break;
        
        counter++;
        slug = `${baseSlug}-${counter}`;
      }

      const { data, error } = await supabase
        .from('videos')
        .insert({
          ...videoData,
          slug,
          uploader_id: userId,
          is_active: true,
          view_count: 0,
          like_count: 0,
          dislike_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Video erfolgreich hochgeladen!');
      return { data, error: null };
    } catch (error) {
      console.error('Video upload error:', error);
      toast.error('Fehler beim Hochladen des Videos');
      return { data: null, error };
    } finally {
      setUploading(false);
    }
  };

  return { uploadVideo, uploading };
};
