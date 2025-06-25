
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Heart, Eye, Crown, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import VideoPreview from './VideoPreview';

interface VideoCardProps {
  id?: string;
  slug?: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  uploadDate: string;
  creator: string;
  isPremium?: boolean;
  isHD?: boolean;
  videoUrl?: string;
}

const VideoCard = ({ 
  id,
  slug,
  title, 
  thumbnail, 
  duration, 
  views, 
  likes, 
  uploadDate, 
  creator,
  isPremium = false,
  isHD = false,
  videoUrl
}: VideoCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (slug) {
      navigate(`/${slug}`);
    } else if (id) {
      navigate(`/watch/${id}`);
    }
  };

  return (
    <Card 
      className="video-card-hover glass-effect border-border/30 overflow-hidden group cursor-pointer bg-card/50 backdrop-blur-sm w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      onClick={handleClick}
    >
      <VideoPreview
        videoUrl={videoUrl}
        thumbnailUrl={thumbnail}
        title={title}
      />
      
      {/* Duration badge */}
      <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 z-10">
        <Badge 
          variant="secondary" 
          className={cn(
            "text-xs font-medium backdrop-blur-sm px-1 py-0",
            duration === "LIVE" ? "bg-red-500/90 text-white animate-pulse" : "bg-black/70 text-white"
          )}
        >
          {duration}
        </Badge>
      </div>
      
      {/* Premium/HD badges */}
      <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex gap-1 z-10">
        {isPremium && (
          <Badge className="bg-yellow-500/90 text-black text-xs backdrop-blur-sm px-1 py-0">
            <Crown className="w-2 h-2 mr-0.5" />
            <span className="hidden sm:inline">Premium</span>
          </Badge>
        )}
        {isHD && (
          <Badge className="bg-blue-500/90 text-white text-xs backdrop-blur-sm px-1 py-0">
            <Zap className="w-2 h-2 mr-0.5" />
            <span className="hidden sm:inline">HD</span>
          </Badge>
        )}
      </div>
      
      <CardContent className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
        <h3 className="font-semibold text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="hover:text-red-400 transition-colors cursor-pointer truncate mr-1 flex-1">
            {creator}
          </span>
          <span className="shrink-0 text-xs">{uploadDate}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-0.5 hover:text-red-400 transition-colors">
              <Eye className="w-3 h-3" />
              <span className="text-xs">{views}</span>
            </div>
            <div className="flex items-center gap-0.5 hover:text-red-400 transition-colors">
              <Heart className="w-3 h-3" />
              <span className="text-xs">{likes}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
