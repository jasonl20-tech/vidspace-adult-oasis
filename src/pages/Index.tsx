
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import VideoGrid from '@/components/VideoGrid';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LogIn, UserCog } from 'lucide-react';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header onToggleSidebar={toggleSidebar} />
      
      {/* Auth buttons in top right */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {!user ? (
          <Button 
            onClick={() => navigate('/auth')}
            className="neon-glow"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        ) : (
          <>
            {isAdmin && (
              <Button 
                onClick={() => navigate('/admin')}
                variant="outline"
                className="glass-effect"
              >
                <UserCog className="mr-2 h-4 w-4" />
                Admin
              </Button>
            )}
          </>
        )}
      </div>
      
      <div className="flex relative w-full">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={cn(
          "flex-1 transition-all duration-500 ease-in-out min-h-screen w-full",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16",
          "ml-0"
        )}>
          <VideoGrid />
          <Footer />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Index;
