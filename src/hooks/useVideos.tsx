
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from './useContentFilter';

interface Video {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  video_url: string;
  duration: number | null;
  view_count: number | null;
  like_count: number | null;
  created_at: string | null;
  is_premium: boolean | null;
  profiles: {
    username: string | null;
  } | null;
}

export const useVideos = (filter: ContentType) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('videos')
          .select(`
            id,
            title,
            slug,
            thumbnail_url,
            video_url,
            duration,
            view_count,
            like_count,
            created_at,
            is_premium,
            profiles:uploader_id (
              username
            )
          `)
          .eq('is_active', true);

        // Apply filters based on content type
        switch (filter) {
          case 'trending':
            query = query.order('view_count', { ascending: false });
            break;
          case 'recent':
            query = query.order('created_at', { ascending: false });
            break;
          case 'premium':
            query = query.eq('is_premium', true);
            break;
          case 'hd':
          case '4k':
          case 'vr':
            // These would need additional metadata in the database
            query = query.order('created_at', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }

        query = query.limit(20);

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching videos:', error);
          setError('Failed to load videos');
          return;
        }

        setVideos(data || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [filter]);

  return { videos, isLoading, error };
};
