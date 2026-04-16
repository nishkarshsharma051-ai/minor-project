import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AppIcon from '../components/AppIcon';
import avatar from '../assets/avatar.png';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'Dr. Nishkarsh Sharma',
    email: 'n.sharma@inst.edu',
    role: 'Head of Academic Analytics',
    department: 'Computer Science & Engineering',
    institution: 'EduSetu Institutional Academy',
    joined: 'Jan 2024',
    verified: true
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleSave = () => {
    setUser({ ...formData });
    setIsEditing(false);
  };

  return (
    <Layout title="User Profile">
      <div className="max-w-4xl pt-4">
        <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10">
          <div className="h-32 bg-primary/10 relative overflow-hidden">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_2px_2px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[size:24px_24px]"></div>
          </div>
          <div className="px-6 sm:px-10 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end -mt-12 mb-8 gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center text-3xl font-bold shadow-xl border-4 border-white overflow-hidden">
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                {user.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-md">
                    <AppIcon icon="verified" className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-6 py-2 rounded-xl border border-outline-variant text-sm font-semibold hover:bg-neutral-50 transition-all active:scale-95"
              >
                Edit Profile
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-on-surface">{user.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-on-surface-variant font-medium">{user.role}</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                  <span className="text-xs text-primary font-bold uppercase tracking-wider">Administrator</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-3">Institutional Details</label>
                    <div className="space-y-5">
                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-neutral-500 group-hover:text-primary transition-colors">
                          <AppIcon icon="domain" className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">Organization</span>
                           <span className="text-sm font-semibold">{user.institution}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-neutral-500 group-hover:text-primary transition-colors">
                          <AppIcon icon="category" className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">Department</span>
                           <span className="text-sm font-semibold">{user.department}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-3">Contact Information</label>
                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-neutral-500 group-hover:text-primary transition-colors">
                        <AppIcon icon="mail" className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">Official Email</span>
                         <span className="text-sm font-semibold">{user.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-low/50 border border-outline-variant/10 p-8 rounded-3xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-6 text-on-surface">Analytics Footprint</h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
                      <div>
                        <p className="text-xs text-neutral-500 mb-0.5">Performance Reports</p>
                        <p className="text-lg font-bold">142</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                         <AppIcon icon="analytics" className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
                      <div>
                        <p className="text-xs text-neutral-500 mb-0.5">Last System Access</p>
                        <p className="text-sm font-bold">Today, 09:12 AM</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-0.5">Credential Start</p>
                      <p className="text-sm font-bold">{user.joined}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-bold">Edit Profile</h3>
                   <button onClick={() => setIsEditing(false)} className="text-neutral-400 hover:text-black">
                     <AppIcon icon="close" />
                   </button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Full Name</label>
                    <input 
                      className="w-full bg-surface-container-low border-none focus:ring-0 px-4 py-3 rounded-xl text-sm font-medium" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Position / Role</label>
                    <input 
                      className="w-full bg-surface-container-low border-none focus:ring-0 px-4 py-3 rounded-xl text-sm font-medium" 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Department</label>
                    <input 
                      className="w-full bg-surface-container-low border-none focus:ring-0 px-4 py-3 rounded-xl text-sm font-medium" 
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-10 flex gap-3">
                   <button 
                    onClick={handleSave}
                    className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
                   >
                     Save Changes
                   </button>
                   <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-neutral-100 text-neutral-600 py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-neutral-200 transition-all"
                   >
                     Cancel
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Profile;
