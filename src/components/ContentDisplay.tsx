
import React from 'react';
import VideoGrid from './VideoGrid';
import { ContentType } from '@/hooks/useContentFilter';

interface ContentDisplayProps {
  activeContent: ContentType;
}

const ContentDisplay = ({ activeContent }: ContentDisplayProps) => {
  const getContentTitle = () => {
    switch (activeContent) {
      case 'home': return 'Startseite';
      case 'trending': return 'Trending Videos';
      case 'recent': return 'Kürzlich angesehen';
      case 'liked': return 'Liked Videos';
      case 'saved': return 'Gespeicherte Videos';
      case 'amateur': return 'Amateur Videos';
      case 'premium': return 'Premium Content';
      case 'hd': return 'HD Videos';
      case '4k': return '4K Videos';
      case 'vr': return 'VR Videos';
      case 'live': return 'Live Streams';
      case 'couples': return 'Paare Videos';
      case 'asmr': return 'ASMR Content';
      case 'interactive': return 'Interaktive Videos';
      case 'anime': return 'Anime Content';
      case 'fetish': return 'Fetisch Videos';
      default: return 'Startseite';
    }
  };

  const getContentDescription = () => {
    switch (activeContent) {
      case 'home': return 'Entdecke die besten Videos';
      case 'trending': return 'Die beliebtesten Videos gerade jetzt';
      case 'recent': return 'Deine zuletzt angesehenen Videos';
      case 'liked': return 'Videos die dir gefallen haben';
      case 'saved': return 'Deine gespeicherten Favoriten';
      case 'amateur': return 'Authentische Amateur-Inhalte';
      case 'premium': return 'Exklusive Premium-Inhalte';
      case 'hd': return 'Videos in hoher Auflösung';
      case '4k': return 'Ultra-HD 4K Videos';
      case 'vr': return 'Immersive Virtual Reality Erfahrungen';
      case 'live': return 'Live Streaming Content';
      case 'couples': return 'Content für Paare';
      case 'asmr': return 'Entspannende ASMR Videos';
      case 'interactive': return 'Interaktive Multimedia-Erfahrungen';
      case 'anime': return 'Anime und Animation';
      case 'fetish': return 'Spezialisierte Fetisch-Inhalte';
      default: return 'Entdecke die besten Videos';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {getContentTitle()}
        </h1>
        <p className="text-muted-foreground">
          {getContentDescription()}
        </p>
      </div>
      <VideoGrid filter={activeContent} />
    </div>
  );
};

export default ContentDisplay;
