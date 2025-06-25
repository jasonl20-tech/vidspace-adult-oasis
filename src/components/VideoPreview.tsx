
import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl?: string;
  thumbnailUrl: string;
  title: string;
  className?: string;
}

const VideoPreview = ({ videoUrl, thumbnailUrl, title, className = "" }: VideoPreviewProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoUrl) {
      setTimeout(() => setIsPlaying(true), 500);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPlaying(false);
  };

  return (
    <div 
      className={`relative aspect-video overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isPlaying && videoUrl ? (
        <video
          src={videoUrl}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img
          src={`https://images.unsplash.com/${thumbnailUrl}?w=600&h=400&fit=crop&crop=center`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Play/Pause indicator */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-red-500/90 backdrop-blur-sm rounded-full p-2 sm:p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300 neon-glow">
          {isPlaying ? (
            <Pause className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-white" />
          ) : (
            <Play className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-white" />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
