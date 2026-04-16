import React from 'react';
import { Link } from 'react-router-dom';
import institutionLogo from '../assets/institution_logo.png';
import AppIcon from './AppIcon';

const Topbar = ({ title = 'Dashboard', onMenuClick }) => {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-sm dark:shadow-none transition-all duration-300">
      <div className="flex justify-between items-center px-4 md:px-8 w-full h-full">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 lg:hidden text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <AppIcon icon="menu" className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 truncate">{title}</h1>
        </div>
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative flex items-center bg-surface-container-high rounded-full px-4 py-1.5 w-64">
            <AppIcon icon="search" className="h-4 w-4 text-neutral-400" />
            <input
              className="bg-transparent border-none focus:ring-0 text-xs w-full ml-2 text-neutral-700"
              placeholder="Search data..."
              type="text"
            />
          </div>
          {/* Trailing Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all text-neutral-500">
              <AppIcon icon="notifications" className="h-5 w-5" />
            </button>
            <Link to="/settings" className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all text-neutral-500">
              <AppIcon icon="settings" className="h-5 w-5" />
            </Link>
          </div>
          <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/15 hover:border-primary transition-colors">
             <img src={institutionLogo} alt="Institution" className="w-full h-full object-cover" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
