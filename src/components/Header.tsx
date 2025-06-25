
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
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="glass-effect border-b border-border/50 sticky top-0 z-50">
      <div className="flex items-center justify-between px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
        {/* Left side - Menu + Logo */}
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hover:bg-accent/20 transition-all duration-300 hover:scale-110 h-8 w-8 sm:h-10 sm:w-10"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg overflow-hidden">
              <img 
                src="/lovable-uploads/9fccfeee-d97b-4b0c-a483-d908ad8789e7.png" 
                alt="Hub4Porn Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-white whitespace-nowrap">Hub4Porn</h1>
          </div>
        </div>

        {/* Center - Search (hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative group w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Suche nach Videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Mobile search button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent/20 transition-all duration-300 md:hidden h-8 w-8"
          >
            <Search className="h-4 w-4" />
          </Button>
          
          <ThemeToggle />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent/20 transition-all duration-300 hidden sm:flex h-8 w-8 sm:h-10 sm:w-10"
          >
            <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent/20 transition-all duration-300 relative h-8 w-8 sm:h-10 sm:w-10"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full animate-pulse"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:scale-110 transition-all duration-300">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary/30">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-700 text-white">
                    <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass-effect border-border/50 bg-background z-50" align="end" forceMount>
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

      {/* Mobile search bar */}
      <div className="md:hidden px-2 pb-2">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="Suche nach Videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 text-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
