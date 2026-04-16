import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import AppIcon from '../components/AppIcon';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgPerformance: 0,
    atRiskStudents: 0,
    performanceTrend: 'up',
    trendValue: '0'
  });

  const [details, setDetails] = useState({ alerts: [], distribution: [0,0,0,0,0] });

  useEffect(() => {
    axios.get('/api/dashboard/summary')
      .then(res => setStats(prev => ({ ...prev, ...res.data })))
      .catch(err => console.error("Failed to fetch dashboard stats", err));

    axios.get('/api/dashboard/details')
      .then(res => setDetails(res.data))
      .catch(err => console.error("Failed to fetch dashboard details", err));

    axios.get('/api/analytics').then(res => {
      const trend = res.data.performanceTrend;
      if (trend && trend.length >= 2) {
        const last = trend[trend.length - 1].score;
        const prev = trend[trend.length - 2].score;
        setStats(prevStats => ({ 
          ...prevStats, 
          performanceTrend: last >= prev ? 'up' : 'down',
          trendValue: Math.abs(last - prev).toFixed(1)
        }));
      }
    });
  }, []);


  return (
    <Layout title="Dashboard">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Headline */}
        <div className="mb-8 lg:mb-12 px-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 block">
            System Overview
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-primary">
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
              <div className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-primary">
                {(stats?.totalStudents || 0).toLocaleString()}
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs">
              <AppIcon
                icon={stats?.performanceTrend === 'up' ? 'trending_up' : 'trending_down'}
                className={`mr-1 h-4 w-4 ${stats?.performanceTrend === 'up' ? 'text-green-600' : 'text-red-500'}`}
              />
              <span className={`font-bold mr-1 ${stats?.performanceTrend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                {stats?.performanceTrend === 'up' ? '+' : '-'}{stats?.trendValue || 0}%
              </span>
              <span className="text-neutral-400">vs last month</span>
            </div>
          </div>

          {/* Average Performance */}
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15 flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-4 block">
                Avg. Performance
              </span>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-primary">
                {stats?.avgPerformance || 0}<span className="text-2xl lg:text-3xl font-medium">%</span>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs text-neutral-500">
              <AppIcon icon="horizontal_rule" className="mr-1 h-4 w-4 text-neutral-400" />
              <span>Averaged institutional marks</span>
            </div>
          </div>

          {/* At-Risk Students */}
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15 flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-4 block">
                At-Risk Students
              </span>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-primary">
                {stats?.atRiskStudents || 0}
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs text-error">
              <AppIcon icon="priority_high" className="mr-1 h-4 w-4" />
              <span>Requires immediate action</span>
            </div>
          </div>
        </div>

        {/* Analytics Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Primary Performance Chart Mockup */}
          <div className="lg:col-span-2 bg-surface-container-lowest p-6 lg:p-8 rounded-xl border border-outline-variant/15">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 block">
                  Performance Distribution
                </span>
                <h3 className="text-xl font-semibold">Cohort Mastery</h3>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-primary text-on-primary rounded-full text-[10px] font-bold tracking-widest">LIVE DATA</span>
              </div>
            </div>
            <div className="h-64 w-full flex items-end gap-2 px-4">
              {['0-20', '21-40', '41-60', '61-80', '81-100'].map((label, idx) => {
                const count = details?.distribution?.[idx] || 0;
                const distArray = Array.isArray(details?.distribution) ? details.distribution : [0,0,0,0,0];
                const maxCount = Math.max(...distArray, 1);
                const heightPercent = (count / maxCount) * 100;

                return (
                  <div key={label} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="w-full bg-neutral-100 rounded-t-lg relative h-48 flex items-end overflow-hidden">
                      <div 
                        className="w-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-500 absolute bottom-0 left-0 right-0"
                        style={{ height: '100%' }}
                      ></div>
                      <div 
                        className="w-full bg-primary rounded-t-sm transition-all duration-700 relative z-10"
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter">{label}</span>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                      {count} Students
                    </div>
                  </div>
                );
              })}
            </div>


          </div>

          {/* Critical Alerts */}
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15">
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-6 block">
              Critical Alerts
            </span>
            <div className="space-y-6">
              {(details?.alerts || []).map((alert, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    alert?.type === 'error' ? 'bg-error-container text-error' : 
                    alert?.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <AppIcon
                      icon={alert?.type === 'error' ? 'warning' : alert?.type === 'warning' ? 'report' : 'info'}
                      className="h-4 w-4"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{alert?.title || 'System Alert'}</p>
                    <p className="text-xs text-neutral-500">{alert?.content || 'Status Check'}</p>
                  </div>
                </div>
              ))}

              
              <div className="pt-6">
                <a href="/analytics" className="block w-full data-monolith-gradient text-center text-white py-3 rounded-lg text-sm font-medium transition-transform active:scale-95 shadow-md">
                  View Detailed Analytics
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
