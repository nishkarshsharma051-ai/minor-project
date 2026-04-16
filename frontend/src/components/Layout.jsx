import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen">
      {/* Sidebar with mobile toggle state */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Backdrop for mobile drawer */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="lg:ml-64 transition-all duration-300">
        <Topbar 
          title={title} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        <main className="pt-20 px-4 md:px-10 pb-12">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
