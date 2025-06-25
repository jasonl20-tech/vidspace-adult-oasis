
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import VideoCard from './VideoCard';
import VideoCardSkeleton from './VideoCardSkeleton';

interface Video {
  id: string;
  title: string;
  thumbnail_url: string;
  duration: number;
  view_count: number;
  like_count: number;
  created_at: string;
  is_premium: boolean;
  slug: string;
  video_url?: string;
  categories: { name: string; color: string } | null;
  profiles: { username: string } | null;
}

const VideoGrid = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          categories(name, color),
          profiles(username)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) return `vor ${diffHours} Stunden`;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `vor ${diffDays} Tagen`;
  };

  // Loading state with skeletons
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
          <section className="space-y-3 sm:space-y-4">
            <div className="px-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text">Loading Videos...</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <VideoCardSkeleton key={index} />
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  const featuredVideos = videos.slice(0, 6);
  const trendingVideos = videos.slice(6, 14);
  const latestVideos = videos.slice(14);

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Featured Section */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text">Featured Videos</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Die heißesten Videos, handverlesen für dich</p>
            </div>
            <div className="hidden sm:block">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            {featuredVideos.map((video, index) => (
              <div key={video.id} className="w-full animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <VideoCard
                  id={video.id}
                  slug={video.slug}
                  title={video.title}
                  thumbnail={video.thumbnail_url || "photo-1649972904349-6e44c42644a7"}
                  duration={formatDuration(video.duration)}
                  views={formatViews(video.view_count)}
                  likes={formatViews(video.like_count)}
                  uploadDate={formatDate(video.created_at)}
                  creator={video.profiles?.username || 'Anonymous'}
                  isPremium={video.is_premium}
                  isHD={true}
                  videoUrl={video.video_url}
                />
              </div>
            ))}
          </div>
        </section>

        {videos.length > 6 && (
          <section className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 px-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Trending heute</h2>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Hot</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              {trendingVideos.map((video, index) => (
                <div key={video.id} className="w-full slide-in-left" style={{ animationDelay: `${index * 0.15}s` }}>
                  <VideoCard
                    id={video.id}
                    slug={video.slug}
                    title={video.title}
                    thumbnail={video.thumbnail_url || "photo-1581091226825-a6a2a5aee158"}
                    duration={formatDuration(video.duration)}
                    views={formatViews(video.view_count)}
                    likes={formatViews(video.like_count)}
                    uploadDate={formatDate(video.created_at)}
                    creator={video.profiles?.username || 'Anonymous'}
                    isPremium={video.is_premium}
                    isHD={true}
                    videoUrl={video.video_url}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {videos.length > 14 && (
          <section className="space-y-3 sm:space-y-4 pb-4">
            <div className="flex items-center gap-2 px-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Neueste Videos</h2>
              <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                Neu
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              {latestVideos.map((video, index) => (
                <div key={video.id} className="w-full slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
                  <VideoCard
                    id={video.id}
                    slug={video.slug}
                    title={video.title}
                    thumbnail={video.thumbnail_url || "photo-1721322800607-8c38375eef04"}
                    duration={formatDuration(video.duration)}
                    views={formatViews(video.view_count)}
                    likes={formatViews(video.like_count)}
                    uploadDate={formatDate(video.created_at)}
                    creator={video.profiles?.username || 'Anonymous'}
                    isPremium={video.is_premium}
                    isHD={true}
                    videoUrl={video.video_url}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {videos.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Noch keine Videos verfügbar</h3>
            <p className="text-muted-foreground">Admins können Videos über das Admin Panel hochladen.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGrid;
