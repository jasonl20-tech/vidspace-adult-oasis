
import React from 'react';
import VideoCard from './VideoCard';
import VideoCardSkeleton from './VideoCardSkeleton';
import { ContentType } from '@/hooks/useContentFilter';

interface VideoGridProps {
  filter?: ContentType;
}

const VideoGrid = ({ filter = 'home' }: VideoGridProps) => {
  // Simuliere verschiedene Inhalte basierend auf dem Filter
  const getFilteredVideos = () => {
    const baseVideos = [
      {
        id: '1',
        title: 'Amazing Content 1',
        thumbnail: '/placeholder.svg',
        duration: '12:34',
        views: '1.2M',
        likes: '85K',
        uploadDate: '2 days ago',
        creator: 'Creator One',
      },
      {
        id: '2',
        title: 'Another Great Video',
        thumbnail: '/placeholder.svg',
        duration: '8:22',
        views: '950K',
        likes: '62K',
        uploadDate: '1 week ago',
        creator: 'Creator Two',
      },
      {
        id: '3',
        title: 'The Best Video Ever',
        thumbnail: '/placeholder.svg',
        duration: '15:48',
        views: '2.1M',
        likes: '120K',
        uploadDate: '3 weeks ago',
        creator: 'Creator Three',
      },
      {
        id: '4',
        title: 'Incredible Content Here',
        thumbnail: '/placeholder.svg',
        duration: '10:15',
        views: '780K',
        likes: '45K',
        uploadDate: '1 month ago',
        creator: 'Creator Four',
      },
      {
        id: '5',
        title: 'Must Watch Video',
        thumbnail: '/placeholder.svg',
        duration: '6:52',
        views: '1.5M',
        likes: '95K',
        uploadDate: '2 months ago',
        creator: 'Creator Five',
      },
    ];

    // Hier könntest du später echte Filterlogik implementieren
    return baseVideos;
  };

  const videos = getFilteredVideos();
  const isLoading = false; // Hier könntest du später echte Loading-States verwenden

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} {...video} />
      ))}
    </div>
  );
};

export default VideoGrid;
