
import React, { useState } from 'react';
import { Search, Upload, User, Bell, Menu, Crown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="glass-effect border-b border-border/50 sticky top-0 z-50 animate-slide-in-bottom">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hover:bg-accent/20 transition-all duration-300 hover:scale-110"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center floating-animation">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold gradient-text">VidSpace</h1>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Suche nach Videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 focus:bg-muted/70"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent/20 transition-all duration-300 hover:scale-110 pulse-glow hidden sm:flex"
          >
            <Upload className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent/20 transition-all duration-300 hover:scale-110 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-110 transition-all duration-300">
                <Avatar className="h-10 w-10 border-2 border-primary/30">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-700 text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass-effect border-border/50" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">MaxMustermann</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    max@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                <span>Premium werden</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Einstellungen</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                <span>Abmelden</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
