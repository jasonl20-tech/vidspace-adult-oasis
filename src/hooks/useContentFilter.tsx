
import { useState } from 'react';

export type ContentType = 
  | 'home' 
  | 'trending' 
  | 'recent' 
  | 'liked' 
  | 'saved' 
  | 'amateur' 
  | 'premium' 
  | 'hd' 
  | '4k' 
  | 'vr' 
  | 'live' 
  | 'couples' 
  | 'asmr' 
  | 'interactive' 
  | 'anime' 
  | 'fetish';

export const useContentFilter = () => {
  const [activeContent, setActiveContent] = useState<ContentType>('home');

  const setContent = (content: ContentType) => {
    setActiveContent(content);
  };

  return { activeContent, setContent };
};
