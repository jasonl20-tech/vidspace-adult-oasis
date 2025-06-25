
import React from 'react';
import VideoCard from './VideoCard';
import VideoCardSkeleton from './VideoCardSkeleton';
import { ContentType } from '@/hooks/useContentFilter';
import { useVideos } from '@/hooks/useVideos';
import { formatDuration, formatViewCount, formatTimeAgo } from '@/utils/formatters';

interface VideoGridProps {
  filter?: ContentType;
}

const VideoGrid = ({ filter = 'home' }: VideoGridProps) => {
  const { videos, isLoading, error } = useVideos(filter);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading videos</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No videos found</p>
          <p className="text-sm text-muted-foreground">
            Videos uploaded through the admin panel will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          id={video.id}
          slug={video.slug}
          title={video.title}
          thumbnail={video.thumbnail_url || '/placeholder.svg'}
          duration={formatDuration(video.duration)}
          views={formatViewCount(video.view_count)}
          likes={formatViewCount(video.like_count)}
          uploadDate={formatTimeAgo(video.created_at)}
          creator={video.profiles?.username || 'Unknown'}
          isPremium={video.is_premium || false}
          videoUrl={video.video_url}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
