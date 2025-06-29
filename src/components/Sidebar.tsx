import React from 'react';
import { Home, TrendingUp, Clock, ThumbsUp, Bookmark, Settings, Users, Crown, Heart, Star, Zap, Camera, Video, Music, Gamepad2, Palette, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ContentType } from '@/hooks/useContentFilter';

interface SidebarProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  activeContent: ContentType;
  onContentChange: (content: ContentType) => void;
}

const Sidebar = ({ isOpen, onMouseEnter, onMouseLeave, activeContent, onContentChange }: SidebarProps) => {
  const menuItems = [
    { icon: Home, label: 'Startseite', key: 'home' as ContentType },
    { icon: TrendingUp, label: 'Trending', key: 'trending' as ContentType },
    { icon: Clock, label: 'Kürzlich angesehen', key: 'recent' as ContentType },
    { icon: ThumbsUp, label: 'Liked Videos', key: 'liked' as ContentType },
    { icon: Bookmark, label: 'Gespeichert', key: 'saved' as ContentType },
  ];

  const categories = [
    { icon: Heart, label: 'Amateur', color: 'text-pink-400', key: 'amateur' as ContentType },
    { icon: Crown, label: 'Premium', color: 'text-yellow-400', key: 'premium' as ContentType },
    { icon: Zap, label: 'HD', color: 'text-blue-400', key: 'hd' as ContentType },
    { icon: Star, label: '4K', color: 'text-purple-400', key: '4k' as ContentType },
    { icon: Video, label: 'VR', color: 'text-green-400', key: 'vr' as ContentType },
    { icon: Camera, label: 'Live', color: 'text-red-400', key: 'live' as ContentType },
    { icon: Users, label: 'Paare', color: 'text-orange-400', key: 'couples' as ContentType },
    { icon: Music, label: 'ASMR', color: 'text-indigo-400', key: 'asmr' as ContentType },
    { icon: Gamepad2, label: 'Interaktiv', color: 'text-cyan-400', key: 'interactive' as ContentType },
    { icon: Palette, label: 'Anime', color: 'text-rose-400', key: 'anime' as ContentType },
    { icon: Coffee, label: 'Fetisch', color: 'text-amber-400', key: 'fetish' as ContentType },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-border/50 transition-all duration-500 z-30 glass-effect",
        isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-16 lg:translate-x-0"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={cn(
        "flex flex-col h-full p-4 overflow-y-auto custom-scrollbar transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 lg:opacity-100"
      )}>
        <nav className="space-y-2 mb-8">
          {menuItems.map((item, index) => (
            <Button
              key={item.label}
              variant={activeContent === item.key ? "secondary" : "ghost"}
              onClick={() => onContentChange(item.key)}
              className={cn(
                "w-full justify-start gap-3 h-11 transition-all duration-300 hover:scale-105 cursor-pointer",
                activeContent === item.key
                  ? "bg-accent/20 text-accent border border-accent/30 neon-glow" 
                  : "hover:bg-accent/10 text-muted-foreground hover:text-foreground",
                !isOpen && "lg:justify-center lg:px-2"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && (
                <span className="animate-fade-in text-foreground font-bold">{item.label}</span>
              )}
              {!isOpen && (
                <span className="hidden lg:group-hover:block lg:absolute lg:left-14 lg:bg-background lg:px-2 lg:py-1 lg:rounded lg:shadow-lg lg:z-50 lg:whitespace-nowrap text-foreground font-bold">
                  {item.label}
                </span>
              )}
            </Button>
          ))}
        </nav>

        <div className="border-t border-border/50 pt-6">
          <h3 className={cn(
            "text-sm font-semibold text-foreground mb-4 px-2 transition-all duration-300",
            !isOpen && "lg:hidden"
          )}>
            KATEGORIEN
          </h3>
          <div className="space-y-1">
            {categories.map((category, index) => (
              <Button
                key={category.label}
                variant="ghost"
                onClick={() => onContentChange(category.key)}
                className={cn(
                  "w-full justify-start h-10 text-sm hover:bg-accent/10 transition-all duration-300 hover:scale-105 group text-foreground cursor-pointer",
                  activeContent === category.key && "bg-accent/10",
                  !isOpen && "lg:justify-center lg:px-2"
                )}
                style={{ animationDelay: `${(index + 5) * 0.1}s` }}
              >
                <category.icon className={cn("h-4 w-4 flex-shrink-0", category.color, "group-hover:animate-pulse")} />
                {isOpen && (
                  <span className="animate-fade-in ml-3 text-foreground font-bold">{category.label}</span>
                )}
                {!isOpen && (
                  <span className="hidden lg:group-hover:block lg:absolute lg:left-14 lg:bg-background lg:px-2 lg:py-1 lg:rounded lg:shadow-lg lg:z-50 lg:whitespace-nowrap text-foreground font-bold">
                    {category.label}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-border/50">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-11 text-foreground hover:text-foreground hover:bg-accent/10 transition-all duration-300 hover:scale-105 group",
              !isOpen && "lg:justify-center lg:px-2"
            )}
          >
            <Crown className="h-5 w-5 flex-shrink-0 text-yellow-500 group-hover:animate-pulse" />
            {isOpen && (
              <span className="animate-fade-in font-bold">Premium werden</span>
            )}
            {!isOpen && (
              <span className="hidden lg:group-hover:block lg:absolute lg:left-14 lg:bg-background lg:px-2 lg:py-1 lg:rounded lg:shadow-lg lg:z-50 lg:whitespace-nowrap font-bold">
                Premium werden
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-11 text-foreground hover:text-foreground hover:bg-accent/10 transition-all duration-300 hover:scale-105 group",
              !isOpen && "lg:justify-center lg:px-2"
            )}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {isOpen && (
              <span className="animate-fade-in font-bold">Einstellungen</span>
            )}
            {!isOpen && (
              <span className="hidden lg:group-hover:block lg:absolute lg:left-14 lg:bg-background lg:px-2 lg:py-1 lg:rounded lg:shadow-lg lg:z-50 lg:whitespace-nowrap font-bold">
                Einstellungen
              </span>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
