
import React, { useState } from 'react';
import { Play, Clock, Eye, ThumbsUp, MoreVertical, Heart, Share2 } from 'lucide-react';
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
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group video-card-hover cursor-pointer scale-in">
      <div className="relative overflow-hidden rounded-xl bg-muted/20 shadow-lg">
        <img
          src={`https://images.unsplash.com/${thumbnail}?w=400&h=225&fit=crop`}
          alt={title}
          className="w-full aspect-video object-cover transition-all duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-0 group-hover:scale-100 transition-all duration-300 pulse-glow">
              <Play className="h-8 w-8 text-white" fill="white" />
            </div>
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
          {duration}
        </div>

        {/* Quality Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {isHD && (
            <Badge variant="secondary" className="bg-blue-500/80 text-white text-xs hover:bg-blue-600/80 transition-colors">
              HD
            </Badge>
          )}
          {isPremium && (
            <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs hover:from-yellow-500 hover:to-yellow-700 transition-all">
              Premium
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white h-8 w-8 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white h-8 w-8 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white h-8 w-8 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors leading-tight">
          {title}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{creator.charAt(0)}</span>
          </div>
          <p className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            {creator}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Eye className="h-3 w-3" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer">
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
