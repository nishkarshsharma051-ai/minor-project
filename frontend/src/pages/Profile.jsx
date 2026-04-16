import React from 'react';
import Layout from '../components/Layout';

const Profile = () => {
  const user = {
    name: 'Dr. Nishkarsh Sharma',
    email: 'n.sharma@inst.edu',
    role: 'Head of Academic Analytics',
    department: 'Computer Science & Engineering',
    institution: 'EduSetu Institutional Academy',
    joined: 'Jan 2024',
    verified: true
  };

  return (
    <Layout title="User Profile">
      <div className="max-w-4xl">
        <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10">
          <div className="h-32 bg-primary/10"></div>
          <div className="px-10 pb-10">
            <div className="flex justify-between items-end -mt-12 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-primary text-white flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-white">
                  NS
                </div>
                {user.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[12px]">verified</span>
                  </div>
                )}
              </div>
              <button className="px-6 py-2 rounded-xl border border-outline-variant text-sm font-semibold hover:bg-surface-container transition-colors">
                Edit Profile
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
                <p className="text-on-surface-variant font-medium mt-1">{user.role}</p>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">Institutional Details</label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-neutral-400 text-lg">domain</span>
                        <span className="text-sm font-medium">{user.institution}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-neutral-400 text-lg">category</span>
                        <span className="text-sm font-medium">{user.department}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">Contact Information</label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-neutral-400 text-lg">mail</span>
                        <span className="text-sm font-medium">{user.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-low p-6 rounded-2xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-4">Account Statistics</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-xs text-neutral-500">Reports Generated</span>
                      <span className="text-sm font-bold">142</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-xs text-neutral-500">Last Login</span>
                      <span className="text-sm font-bold">Today, 09:12 AM</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-neutral-500">Member Since</span>
                      <span className="text-sm font-bold">{user.joined}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
