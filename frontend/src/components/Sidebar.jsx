import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'grid_view' },
    { name: 'Student Data', path: '/student-data', icon: 'group' },
    { name: 'Prediction', path: '/prediction', icon: 'online_prediction' },
    { name: 'Analytics', path: '/analytics', icon: 'analytics' },
    { name: 'Reports', path: '/reports', icon: 'description' },
  ];

  return (
    <aside className={`h-screen w-64 fixed left-0 top-0 flex flex-col bg-black dark:bg-neutral-950 py-6 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="px-6 mb-10 flex items-center justify-between">
        <span className="text-white font-bold text-xl tracking-tighter">EduSetu</span>
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden text-neutral-400 hover:text-white"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <nav className="flex-grow space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `mx-2 my-1 flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-neutral-800 text-white scale-[0.98]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`
            }
          >
            <span className="material-symbols-outlined mr-3">{item.icon}</span>
            <span className="text-sm font-regular">
              {item.name}
            </span>
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-neutral-800/50">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `mx-2 my-1 flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-neutral-800 text-white scale-[0.98]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`
            }
          >
            <span className="material-symbols-outlined mr-3">account_circle</span>
            <span className="text-sm font-regular">Profile</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `mx-2 my-1 flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-neutral-800 text-white scale-[0.98]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`
            }
          >
            <span className="material-symbols-outlined mr-3">settings</span>
            <span className="text-sm font-regular">Settings</span>
          </NavLink>
        </div>
      </nav>
      <div className="px-6 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-[10px] text-white">
              IC
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Institution</span>
            <span className="text-xs text-white">Main Campus</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
