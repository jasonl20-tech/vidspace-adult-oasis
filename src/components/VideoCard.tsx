
import React from 'react';
import { Play, Heart, Eye, Crown, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  uploadDate: string;
  creator: string;
  isPremium?: boolean;
  isHD?: boolean;
}

const VideoCard = ({ 
  title, 
  thumbnail, 
  duration, 
  views, 
  likes, 
  uploadDate, 
  creator,
  isPremium = false,
  isHD = false 
}: VideoCardProps) => {
  return (
    <Card className="video-card-hover glass-effect border-border/30 overflow-hidden group cursor-pointer bg-card/50 backdrop-blur-sm">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={`https://images.unsplash.com/${thumbnail}?w=600&h=400&fit=crop&crop=center`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-red-500/90 backdrop-blur-sm rounded-full p-3 sm:p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300 neon-glow">
            <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white fill-white" />
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2">
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs font-medium backdrop-blur-sm",
              duration === "LIVE" ? "bg-red-500/90 text-white animate-pulse" : "bg-black/70 text-white"
            )}
          >
            {duration}
          </Badge>
        </div>
        
        {/* Premium/HD badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {isPremium && (
            <Badge className="bg-yellow-500/90 text-black text-xs backdrop-blur-sm">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
          {isHD && (
            <Badge className="bg-blue-500/90 text-white text-xs backdrop-blur-sm">
              <Zap className="w-3 h-3 mr-1" />
              HD
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <h3 className="font-semibold text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
          <span className="hover:text-red-400 transition-colors cursor-pointer truncate mr-2">
            {creator}
          </span>
          <span className="shrink-0">{uploadDate}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{likes}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
