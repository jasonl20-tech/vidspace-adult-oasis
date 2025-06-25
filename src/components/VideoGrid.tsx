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
    {
      title: "Exklusiver Fetisch Content",
      thumbnail: "photo-1649972904349-6e44c42644a7",
      duration: "14:20",
      views: "890K",
      likes: "32K",
      uploadDate: "vor 1 Tag",
      creator: "FetishQueen",
      isPremium: true,
    },
    {
      title: "Interaktive VR Session",
      thumbnail: "photo-1581091226825-a6a2a5aee158",
      duration: "30:15",
      views: "1.2M",
      likes: "78K",
      uploadDate: "vor 2 Tagen",
      creator: "VirtualLove",
      isPremium: true,
      isHD: true,
    },
  ];

  const featuredVideos = videos.slice(0, 3);
  const trendingVideos = videos.slice(3, 7);
  const latestVideos = videos.slice(7);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-8 sm:space-y-12">
      {/* Featured Section */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">Featured Videos</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Die heißesten Videos, handverlesen für dich</p>
          </div>
          <div className="hidden md:block">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 justify-items-center">
          {featuredVideos.map((video, index) => (
            <div key={`featured-${index}`} className="w-full max-w-sm animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <VideoCard {...video} />
            </div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Trending heute</h2>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-muted-foreground">Hot</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 justify-items-center">
          {trendingVideos.map((video, index) => (
            <div key={`trending-${index}`} className="w-full max-w-sm slide-in-left" style={{ animationDelay: `${index * 0.15}s` }}>
              <VideoCard {...video} />
            </div>
          ))}
        </div>
      </section>

      {/* Latest Section */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Neueste Videos</h2>
          <div className="px-2 py-0.5 sm:py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
            Neu
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 justify-items-center">
          {latestVideos.map((video, index) => (
            <div key={`latest-${index}`} className="w-full max-w-sm slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
              <VideoCard {...video} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default VideoGrid;
