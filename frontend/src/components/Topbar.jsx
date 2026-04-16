import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppIcon from './AppIcon';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import { API_BASE_URL } from '../config';

const Topbar = ({ title = 'Dashboard', onMenuClick }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  
  const user = auth.currentUser;
  const userPhoto = user?.photoURL;
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    // Fetch real alerts from dashboard details API
    fetch(`${API_BASE_URL}/api/dashboard/details`)
      .then(res => res.json())
      .then(data => setAlerts(data.alerts || []))
      .catch(err => console.error("Failed to fetch topbar alerts:", err));

    // Click outside listener
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // For now, redirect to student data with a search param or just clear it
      console.log("Searching for:", searchQuery);
      navigate(`/student-data?search=${encodeURIComponent(searchQuery)}`);
    }
  };

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
        
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Search Bar */}
          <div className="hidden sm:flex relative items-center bg-surface-container-high rounded-full px-4 py-1.5 w-48 lg:w-64 border border-transparent focus-within:border-primary/20 transition-all">
            <AppIcon icon="search" className="h-4 w-4 text-neutral-400" />
            <input
              className="bg-transparent border-none focus:ring-0 text-xs w-full ml-2 text-neutral-700"
              placeholder="Search..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className={`p-2 hover:bg-neutral-100 rounded-full transition-all text-neutral-500 relative ${isNotificationsOpen ? 'bg-neutral-100 text-primary' : ''}`}
              >
                <AppIcon icon="notifications" className="h-5 w-5" />
                {alerts.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-outline-variant/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-4 py-3 bg-neutral-50 border-b border-outline-variant/10 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Notifications</span>
                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">{alerts.length} New</span>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {alerts.length === 0 ? (
                      <div className="p-8 text-center">
                        <AppIcon icon="notifications_none" className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                        <p className="text-xs text-neutral-400">All caught up! No new alerts.</p>
                      </div>
                    ) : (
                      alerts.map((alert, idx) => (
                        <div key={idx} className="p-4 hover:bg-neutral-50 border-b border-outline-variant/5 last:border-0 transition-colors cursor-pointer group">
                          <div className="flex gap-3">
                            <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${alert.type === 'error' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                            <div>
                              <p className="text-sm font-semibold group-hover:text-primary transition-colors">{alert.title}</p>
                              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{alert.content}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 bg-white border-t border-outline-variant/10 text-center">
                    <Link to="/analytics" onClick={() => setIsNotificationsOpen(false)} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">View All Insights</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Link */}
            <Link to="/settings" className="p-2 hover:bg-neutral-100 rounded-full transition-all text-neutral-500">
              <AppIcon icon="settings" className="h-5 w-5" />
            </Link>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className={`w-8 h-8 rounded-full overflow-hidden border transition-all flex items-center justify-center bg-surface-container-high text-neutral-400 outline-none ${isProfileOpen ? 'border-primary ring-2 ring-primary/10' : 'border-outline-variant/15 hover:border-primary'}`}
            >
              {userPhoto ? (
                <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold">{userName.charAt(0).toUpperCase()}</span>
              )}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-outline-variant/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="p-4 border-b border-outline-variant/10 bg-neutral-50">
                  <p className="text-sm font-bold text-on-surface truncate">{userName}</p>
                  <p className="text-[10px] text-neutral-400 font-medium truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="p-1">
                  <Link 
                    to="/profile" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors group"
                  >
                    <AppIcon icon="person" className="mr-3 h-4 w-4 group-hover:text-primary" />
                    Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors group"
                  >
                    <AppIcon icon="settings" className="mr-3 h-4 w-4 group-hover:text-primary" />
                    Settings
                  </Link>
                </div>
                <div className="p-1 border-t border-outline-variant/10">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <AppIcon icon="logout" className="mr-3 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
