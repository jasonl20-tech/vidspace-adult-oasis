
import React from 'react';
import { Home, TrendingUp, Clock, ThumbsUp, Bookmark, Settings, Users, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const menuItems = [
    { icon: Home, label: 'Startseite', active: true },
    { icon: TrendingUp, label: 'Trending' },
    { icon: Clock, label: 'Kürzlich angesehen' },
    { icon: ThumbsUp, label: 'Liked Videos' },
    { icon: Bookmark, label: 'Gespeichert' },
  ];

  const categories = [
    'Amateur',
    'Premium',
    'HD',
    '4K',
    'VR',
    'Live',
    'Compilation',
    'Interactive'
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-border/50 transition-all duration-300 z-40",
        isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"
      )}
    >
      <div className="flex flex-col h-full p-4 overflow-y-auto">
        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                item.active 
                  ? "bg-accent/20 text-accent border border-accent/30" 
                  : "hover:bg-accent/10 text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="border-t border-border/50 pt-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 px-2">
            KATEGORIEN
          </h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                className="w-full justify-start h-9 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-border/50">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-foreground hover:bg-accent/10"
          >
            <Crown className="h-5 w-5" />
            Premium werden
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-foreground hover:bg-accent/10"
          >
            <Settings className="h-5 w-5" />
            Einstellungen
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
