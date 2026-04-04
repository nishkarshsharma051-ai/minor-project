import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgPerformance: 0,
    atRiskStudents: 0
  });

  useEffect(() => {
    fetch('/api/dashboard/summary')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to fetch dashboard stats", err));
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Headline */}
        <div className="mb-12">
          <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 block">
            System Overview
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-primary">
            Academic Performance
          </h2>
        </div>

        {/* KPI Cards: Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Total Students */}
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15 flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-4 block">
                Total Students
              </span>
              <div className="text-6xl font-semibold tracking-tighter text-primary">
                {stats.totalStudents.toLocaleString()}
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs text-neutral-500">
              <span className="material-symbols-outlined text-sm mr-1 text-green-600">trending_up</span>
              <span>Live Database Synchronization</span>
            </div>
          </div>

          {/* Average Performance */}
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15 flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-4 block">
                Avg. Performance
              </span>
              <div className="text-6xl font-semibold tracking-tighter text-primary">
                {stats.avgPerformance}<span className="text-3xl font-medium">%</span>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs text-neutral-500">
              <span className="material-symbols-outlined text-sm mr-1 text-neutral-400">horizontal_rule</span>
              <span>Averaged institutional marks</span>
            </div>
          </div>

          {/* At-Risk Students */}
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15 flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-4 block">
                At-Risk Students
              </span>
              <div className="text-6xl font-semibold tracking-tighter text-primary">
                {stats.atRiskStudents}
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs text-error">
              <span className="material-symbols-outlined text-sm mr-1">priority_high</span>
              <span>Requires immediate action</span>
            </div>
          </div>
        </div>

        {/* Analytics Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Primary Performance Chart Mockup */}
          <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 block">
                  Performance Trend
                </span>
                <h3 className="text-xl font-semibold">Institutional Growth</h3>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold">WEEKLY</span>
                <span className="px-3 py-1 bg-primary text-on-primary rounded-full text-[10px] font-bold">MONTHLY</span>
              </div>
            </div>
            <div className="h-64 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 800 200">
                <path d="M0,180 Q100,160 200,120 T400,100 T600,60 T800,40" fill="none" stroke="black" strokeWidth="3"></path>
                <path d="M0,190 Q100,180 200,160 T400,150 T600,130 T800,120" fill="none" stroke="#c6c6c6" strokeDasharray="8 4" strokeWidth="2"></path>
                <circle cx="200" cy="120" fill="black" r="4"></circle>
                <circle cx="400" cy="100" fill="black" r="4"></circle>
                <circle cx="600" cy="60" fill="black" r="4"></circle>
              </svg>
              <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-bold text-neutral-400 mt-4 px-2">
                <span>SEP</span>
                <span>OCT</span>
                <span>NOV</span>
                <span>DEC</span>
                <span>JAN</span>
                <span>FEB</span>
              </div>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15">
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-6 block">
              Critical Alerts
            </span>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-sm">warning</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Attendance Drop</p>
                  <p className="text-xs text-neutral-500">Year 3 Engineering decreased by 15%</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-sm">task_alt</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Reports Generated</p>
                  <p className="text-xs text-neutral-500">Quarterly performance audit ready</p>
                </div>
              </div>
              <div className="pt-6">
                <button className="w-full data-monolith-gradient text-on-primary py-3 rounded-lg text-sm font-medium transition-transform active:scale-95 shadow-md">
                  View Detailed Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
