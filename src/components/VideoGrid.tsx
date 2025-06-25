
import React from 'react';
import VideoCard from './VideoCard';

const VideoGrid = () => {
  const videos = [
    {
      title: "Heißes Amateur-Video mit geiler Blondine",
      thumbnail: "photo-1649972904349-6e44c42644a7",
      duration: "12:34",
      views: "2.1M",
      likes: "45K",
      uploadDate: "vor 2 Stunden",
      creator: "SexyBlonde23",
      isHD: true,
    },
    {
      title: "Premium Content - Exklusive Szene",
      thumbnail: "photo-1581091226825-a6a2a5aee158",
      duration: "18:45",
      views: "856K",
      likes: "23K",
      uploadDate: "vor 1 Tag",
      creator: "PremiumProducer",
      isPremium: true,
      isHD: true,
    },
    {
      title: "Wilde Nacht zu zweit - Amateur",
      thumbnail: "photo-1721322800607-8c38375eef04",
      duration: "08:22",
      views: "1.5M",
      likes: "67K",
      uploadDate: "vor 3 Stunden",
      creator: "CoupleXXX",
    },
    {
      title: "Sinnliche Massage mit Happy End",
      thumbnail: "photo-1649972904349-6e44c42644a7",
      duration: "15:11",
      views: "3.2M",
      likes: "89K",
      uploadDate: "vor 5 Stunden",
      creator: "MassagePro",
      isHD: true,
    },
    {
      title: "Geile Studentin zeigt alles",
      thumbnail: "photo-1581091226825-a6a2a5aee158",
      duration: "09:33",
      views: "4.1M",
      likes: "156K",
      uploadDate: "vor 6 Stunden",
      creator: "StudentGirl19",
    },
    {
      title: "Premium VR Experience",
      thumbnail: "photo-1721322800607-8c38375eef04",
      duration: "22:18",
      views: "678K",
      likes: "34K",
      uploadDate: "vor 8 Stunden",
      creator: "VRStudio",
      isPremium: true,
      isHD: true,
    },
    {
      title: "Compilation der besten Szenen",
      thumbnail: "photo-1649972904349-6e44c42644a7",
      duration: "25:47",
      views: "5.8M",
      likes: "245K",
      uploadDate: "vor 12 Stunden",
      creator: "BestOfXXX",
      isHD: true,
    },
    {
      title: "Live-Session mit Chat",
      thumbnail: "photo-1581091226825-a6a2a5aee158",
      duration: "LIVE",
      views: "12K",
      likes: "1.2K",
      uploadDate: "LIVE",
      creator: "LiveCamGirl",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Empfohlen für dich</h2>
        <p className="text-muted-foreground">Die heißesten Videos, speziell für dich ausgewählt</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video, index) => (
          <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <VideoCard {...video} />
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Trending heute</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.slice(0, 4).map((video, index) => (
            <div key={`trending-${index}`} className="animate-slide-in-left" style={{ animationDelay: `${index * 0.15}s` }}>
              <VideoCard {...video} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoGrid;
