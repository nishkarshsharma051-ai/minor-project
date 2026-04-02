import React from 'react';
import { Search, Notifications, Settings } from 'lucide-react';

const Topbar = ({ title = 'Dashboard' }) => {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-sm dark:shadow-none">
      <div className="flex justify-between items-center px-8 w-full h-full">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">{title}</h1>
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative flex items-center bg-surface-container-high rounded-full px-4 py-1.5 w-64">
            <span className="material-symbols-outlined text-neutral-400 text-sm">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-xs w-full ml-2 text-neutral-700"
              placeholder="Search data..."
              type="text"
            />
          </div>
          {/* Trailing Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all text-neutral-500">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all text-neutral-500">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/15">
             <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-[10px]">US</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
