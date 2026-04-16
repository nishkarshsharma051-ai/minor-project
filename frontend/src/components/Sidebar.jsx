import React from 'react';
import { NavLink } from 'react-router-dom';
import AppIcon from './AppIcon';
import logo from '../assets/logo.png';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'grid_view' },
    { name: 'Student Data', path: '/student-data', icon: 'group' },
    { name: 'Prediction', path: '/prediction', icon: 'online_prediction' },
    { name: 'Analytics', path: '/analytics', icon: 'analytics' },
    { name: 'Reports', path: '/reports', icon: 'description' },
  ];

  const user = auth.currentUser;
  const userPhoto = user?.photoURL;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <aside className={`h-screen w-64 fixed left-0 top-0 flex flex-col bg-black dark:bg-neutral-950 py-6 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="px-6 mb-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="EduSetu" className="h-8 w-8 object-contain" />
          <span className="text-white font-bold text-xl tracking-tighter">EduSetu</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden text-neutral-400 hover:text-white"
        >
          <AppIcon icon="close" />
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
            <AppIcon icon={item.icon} className="mr-3 h-5 w-5" />
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
            <AppIcon icon="account_circle" className="mr-3 h-5 w-5" />
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
            <AppIcon icon="settings" className="mr-3 h-5 w-5" />
            <span className="text-sm font-regular">Settings</span>
          </NavLink>
        </div>
      </nav>
      <div className="px-6 mt-auto space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-700 text-neutral-400">
            {userPhoto ? (
               <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
            ) : (
               <AppIcon icon="person" className="h-4 w-4" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">User</span>
            <span className="text-xs text-white truncate max-w-[100px]">{user?.displayName || user?.email?.split('@')[0] || 'Member'}</span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-200"
        >
          <AppIcon icon="logout" className="mr-3 h-5 w-5" />
          <span className="text-sm font-regular">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
