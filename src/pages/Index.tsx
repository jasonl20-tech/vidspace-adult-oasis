
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import VideoGrid from '@/components/VideoGrid';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onToggleSidebar={toggleSidebar} />
      
      <div className="flex relative">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={cn(
          "flex-1 transition-all duration-500 ease-in-out min-h-screen",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16",
          "ml-0"
        )}>
          <VideoGrid />
          <Footer />
        </main>
      </div>

      {/* Mobile Overlay - Fixed positioning */}
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
