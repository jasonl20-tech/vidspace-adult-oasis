
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const VideoCardSkeleton = () => {
  return (
    <Card className="glass-effect border-border/30 overflow-hidden w-full animate-pulse">
      <div className="relative aspect-video overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      
      <CardContent className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCardSkeleton;
