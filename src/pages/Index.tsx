
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ContentDisplay from '@/components/ContentDisplay';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useContentFilter } from '@/hooks/useContentFilter';
import { cn } from '@/lib/utils';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const { user, isAdmin } = useAuth();
  const { activeContent, setContent } = useContentFilter();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarMouseEnter = () => {
    setSidebarHovered(true);
  };

  const handleSidebarMouseLeave = () => {
    setSidebarHovered(false);
  };

  const isSidebarExpanded = sidebarOpen || sidebarHovered;

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header onToggleSidebar={toggleSidebar} />
      
      <div className="flex relative w-full">
        <Sidebar 
          isOpen={isSidebarExpanded} 
          onMouseEnter={handleSidebarMouseEnter}
          onMouseLeave={handleSidebarMouseLeave}
          activeContent={activeContent}
          onContentChange={setContent}
        />
        
        <main className={cn(
          "flex-1 transition-all duration-500 ease-in-out min-h-screen w-full",
          isSidebarExpanded ? "lg:ml-64" : "lg:ml-16",
          "ml-0"
        )}>
          <div className="p-4 sm:p-6">
            <ContentDisplay activeContent={activeContent} />
          </div>
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
