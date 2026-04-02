import React from 'react';
import Layout from '../components/Layout';

const StudentData = () => {
  return (
    <Layout title="Student Directory">
      {/* Page Header Section */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-2 block">Institutional Management</span>
          <h2 className="text-5xl font-semibold tracking-tight text-primary">Student Data</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-outline-variant border-opacity-15 rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-lg mr-2">filter_list</span>
            Filter
          </button>
          <button className="flex items-center px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-container transition-all">
            <span className="material-symbols-outlined text-lg mr-2">add</span>
            Enroll Student
          </button>
        </div>
      </div>

      {/* Asymmetric Data Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Summary Metrics */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between h-48">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Students</span>
            <div className="mt-4">
              <span className="text-6xl font-semibold tracking-tighter">1,284</span>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between h-48">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Avg Attendance</span>
            <div className="mt-4">
              <span className="text-6xl font-semibold tracking-tighter">92%</span>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-surface-container-lowest p-8 rounded-xl flex items-center h-48 overflow-hidden relative">
            <div className="z-10">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Performance Trend</span>
              <span className="text-3xl font-semibold">+4.2%</span>
              <p className="text-xs text-on-surface-variant mt-1">Growth in median internal scores</p>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 flex items-end">
              <div className="w-full h-full bg-gradient-to-t from-primary to-transparent" style={{ clipPath: "polygon(0 100%, 10% 80%, 20% 90%, 30% 60%, 40% 70%, 50% 40%, 60% 50%, 70% 20%, 80% 30%, 90% 10%, 100% 40%, 100% 100%)" }}></div>
            </div>
          </div>
        </div>

        {/* Main Table Section */}
        <div className="col-span-12">
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Name</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">Attendance (%)</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">Internal Marks</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">Study Hours</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  <tr className="hover:bg-surface-container-highest/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center mr-4 text-primary font-bold">AS</div>
                        <span className="text-sm font-medium text-primary">Arjun Sharma</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center"><span className="text-sm font-semibold">85%</span></td>
                    <td className="px-8 py-6 text-center"><span className="text-sm">42</span></td>
                    <td className="px-8 py-6 text-center"><span className="text-sm">6.5</span></td>
                    <td className="px-8 py-6 text-right"><button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_horiz</button></td>
                  </tr>
                  
                  {/* Low Attendance Highlight */}
                  <tr className="bg-surface-container-low/40 hover:bg-surface-container-low transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center mr-4 text-primary font-bold">RP</div>
                        <span className="text-sm font-medium text-primary">Riya Patel</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center"><span className="text-sm font-bold text-error">72%</span></td>
                    <td className="px-8 py-6 text-center"><span className="text-sm">35</span></td>
                    <td className="px-8 py-6 text-center"><span className="text-sm">4.0</span></td>
                    <td className="px-8 py-6 text-right"><button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_horiz</button></td>
                  </tr>

                  <tr className="hover:bg-surface-container-highest/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center mr-4 text-primary font-bold">AK</div>
                        <span className="text-sm font-medium text-primary">Aarav Kumar</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center"><span className="text-sm font-semibold">94%</span></td>
                    <td className="px-8 py-6 text-center"><span className="text-sm">48</span></td>
                    <td className="px-8 py-6 text-center"><span className="text-sm">8.2</span></td>
                    <td className="px-8 py-6 text-right"><button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_horiz</button></td>
                  </tr>

                  <tr className="hover:bg-surface-container-highest/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center mr-4 text-primary font-bold">IS</div>
                        <span className="text-sm font-medium text-primary">Isha Singh</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center"><span className="text-sm font-semibold">88%</span></td>
                    <td className="px-8 py-6 text-center"><span className="text-sm">39</span></td>
                    <td className="px-8 py-6 text-center"><span className="text-sm">5.5</span></td>
                    <td className="px-8 py-6 text-right"><button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_horiz</button></td>
                  </tr>

                  <tr className="hover:bg-surface-container-highest/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center mr-4 text-primary font-bold">VD</div>
                        <span className="text-sm font-medium text-primary">Vikram Das</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center"><span className="text-sm font-semibold">91%</span></td>
                    <td className="px-8 py-6 text-center"><span className="text-sm">45</span></td>
                    <td className="px-8 py-6 text-center"><span className="text-sm">7.0</span></td>
                    <td className="px-8 py-6 text-right"><button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_horiz</button></td>
                  </tr>

                </tbody>
              </table>
            </div>
            
            {/* Minimalist Pagination */}
            <div className="px-8 py-6 bg-white border-t border-surface-container-low flex justify-between items-center">
              <span className="text-xs text-on-surface-variant font-medium">Showing 5 of 1,284 students</span>
              <div className="flex space-x-2">
                <button className="p-2 border border-outline-variant border-opacity-15 rounded-lg hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="p-2 border border-outline-variant border-opacity-15 rounded-lg bg-primary text-on-primary">
                  <span className="text-xs px-2">1</span>
                </button>
                <button className="p-2 border border-outline-variant border-opacity-15 rounded-lg hover:bg-surface-container-low transition-colors">
                  <span className="text-xs px-2">2</span>
                </button>
                <button className="p-2 border border-outline-variant border-opacity-15 rounded-lg hover:bg-surface-container-low transition-colors">
                  <span className="text-xs px-2">3</span>
                </button>
                <button className="p-2 border border-outline-variant border-opacity-15 rounded-lg hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentData;
