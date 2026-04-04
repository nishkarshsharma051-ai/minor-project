import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const Analytics = () => {
  const [data, setData] = useState({
    institutionalPerformance: 0,
    avgAttendance: 0,
    retentionRate: 0,
    passVsFail: { passingPercentage: 0 },
    scatterPoints: []
  });

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(payload => setData(payload))
      .catch(err => console.error(err));
  }, []);
  return (
    <Layout title="Analytics">
      {/* Hero Metric Section - Asymmetric Density */}
      <section className="grid grid-cols-12 gap-8 mb-12">
        <div className="col-span-12 md:col-span-7 flex flex-col justify-end">
          <p className="label-sm text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2">Institutional Performance</p>
          <h2 className="text-6xl font-extrabold tracking-tight text-primary leading-none">{data.institutionalPerformance}<span className="text-3xl font-medium text-neutral-400">%</span></h2>
          <p className="body-md text-on-surface-variant mt-4 max-w-md leading-relaxed">Overall academic efficiency index calculated across all departments for the current semester cycle.</p>
        </div>
        
        <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between">
            <span className="material-symbols-outlined text-neutral-400">trending_up</span>
            <div>
              <p className="text-sm font-medium text-neutral-500">Avg. Attendance</p>
              <p className="text-2xl font-bold">{data.avgAttendance}%</p>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between">
            <span className="material-symbols-outlined text-neutral-400">bolt</span>
            <div>
              <p className="text-sm font-medium text-neutral-500">Retention Rate</p>
              <p className="text-2xl font-bold">{data.retentionRate}%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Charts Grid - Bento Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Chart 1: Bar Chart (Attendance vs Marks) */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 flex flex-col h-[400px]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Attendance vs Marks Correlation</h3>
              <p className="text-xs text-neutral-500 font-medium mt-1">Comparing percentage tiers for Semester 1</p>
            </div>
            <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
              <span className="material-symbols-outlined text-sm">more_vert</span>
            </button>
          </div>
          
          <div className="flex-1 flex items-end gap-4 px-4 pb-4">
            <div className="flex-1 flex flex-col items-center gap-3">
              <div className="w-full bg-neutral-100 rounded-t-lg relative group h-48">
                <div className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-500 h-[60%]"></div>
              </div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">60-70%</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-3">
              <div className="w-full bg-neutral-100 rounded-t-lg relative group h-48">
                <div className="absolute bottom-0 w-full bg-neutral-800 rounded-t-lg transition-all duration-500 h-[75%]"></div>
              </div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">70-80%</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-3">
              <div className="w-full bg-neutral-100 rounded-t-lg relative group h-48">
                <div className="absolute bottom-0 w-full bg-neutral-600 rounded-t-lg transition-all duration-500 h-[88%]"></div>
              </div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">80-90%</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-3">
              <div className="w-full bg-neutral-100 rounded-t-lg relative group h-48">
                <div className="absolute bottom-0 w-full bg-neutral-400 rounded-t-lg transition-all duration-500 h-[95%]"></div>
              </div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">90-100%</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Pie Chart (Pass vs Fail) */}
        <div className="bg-surface-container-lowest rounded-xl p-8 flex flex-col h-[400px]">
          <div className="mb-8">
            <h3 className="text-lg font-semibold tracking-tight">Pass vs Fail Ratio</h3>
            <p className="text-xs text-neutral-500 font-medium mt-1">Mid-term evaluation results</p>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="#f3f3f4" strokeWidth="12"></circle>
              {/* Dynamic SVG mapping based on passing percentage */}
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="#000000" strokeDasharray={`${(data.passVsFail.passingPercentage / 100) * 251.2} 251.2`} strokeLinecap="round" strokeWidth="12"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold">{data.passVsFail.passingPercentage}%</span>
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Passing</span>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-black"></div>
              <span className="text-xs font-medium">Qualified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
              <span className="text-xs font-medium">Re-eval</span>
            </div>
          </div>
        </div>

        {/* Chart 3: Scatter Plot (Study Hours vs Marks) */}
        <div className="lg:col-span-3 bg-surface-container-lowest rounded-xl p-8 flex flex-col min-h-[450px]">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Individual Student Effort Mapping</h3>
              <p className="text-xs text-neutral-500 font-medium mt-1">Scatter plot: Weekly Study Hours (X) vs Exam Score (Y)</p>
            </div>
            <div className="flex gap-2">
               <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-low text-[10px] font-bold uppercase tracking-wider text-neutral-600">Global Cohort</span>
               <span className="inline-flex items-center px-3 py-1 rounded-full border border-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-400">Department Only</span>
            </div>
          </div>
          
          <div className="flex-1 relative border-l-2 border-b-2 border-surface-container-low mb-8 ml-8">
            {/* Dynamic Plotting */}
            {data.scatterPoints.map((point, index) => (
              <div 
                key={index}
                className="absolute w-2 h-2 bg-neutral-800 rounded-full opacity-60 hover:w-3 hover:h-3 hover:bg-primary transition-all"
                style={{ 
                  left: `${(point.x / 14) * 100}%`, 
                  bottom: `${point.y}%` 
                }}
                title={`Study Hours: ${point.x}, Marks: ${point.y}`}
              ></div>
            ))}
            
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Study Hours (per week)</div>
            <div className="absolute -left-12 top-1/2 -rotate-90 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Final Score</div>
          </div>
          
          <div className="flex justify-between items-center pt-6 border-t border-surface-container-low">
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-400">Strong Correlation</p>
                <p className="text-sm font-semibold">0.89 r-value</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-400">Outliers</p>
                <p className="text-sm font-semibold">4 Students</p>
              </div>
            </div>
            <button className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Export Dataset
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-16 flex justify-between items-center text-neutral-400">
        <p className="text-xs font-medium">© 2024 EduSetu Analytics Engine. All data refreshed 4 minutes ago.</p>
        <div className="flex gap-4">
          <a className="text-xs hover:text-primary underline-offset-4 hover:underline" href="#">Compliance</a>
          <a className="text-xs hover:text-primary underline-offset-4 hover:underline" href="#">API Docs</a>
        </div>
      </footer>

      {/* Contextual Insight (FAB-like alternative for Analytics) */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="flex items-center gap-2 bg-black text-white px-6 py-4 rounded-full shadow-2xl hover:scale-[1.02] transition-transform active:scale-95">
          <span className="material-symbols-outlined">auto_awesome</span>
          <span className="text-sm font-semibold">Generate AI Insight</span>
        </button>
      </div>
    </Layout>
  );
};

export default Analytics;
