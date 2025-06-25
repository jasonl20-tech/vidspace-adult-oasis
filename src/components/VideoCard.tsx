
import React from 'react';
import { Play, Clock, Eye, ThumbsUp, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VideoCardProps {
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  uploadDate: string;
  creator: string;
  isHD?: boolean;
  isPremium?: boolean;
}

const VideoCard = ({
  title,
  thumbnail,
  duration,
  views,
  likes,
  uploadDate,
  creator,
  isHD = false,
  isPremium = false,
}: VideoCardProps) => {
  return (
    <div className="group video-card-hover cursor-pointer">
      <div className="relative overflow-hidden rounded-xl bg-muted/20">
        <img
          src={`https://images.unsplash.com/${thumbnail}?w=400&h=225&fit=crop`}
          alt={title}
          className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Play className="h-8 w-8 text-white" fill="white" />
            </div>
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {duration}
        </div>

        {/* Quality Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {isHD && (
            <Badge variant="secondary" className="bg-accent/80 text-white text-xs">
              HD
            </Badge>
          )}
          {isPremium && (
            <Badge variant="secondary" className="bg-yellow-500/80 text-white text-xs">
              Premium
            </Badge>
          )}
        </div>

        {/* More Options */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-2">{creator}</p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              <span>{likes}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{uploadDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
