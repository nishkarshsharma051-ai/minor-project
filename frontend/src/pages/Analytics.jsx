import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AppIcon from '../components/AppIcon';
import { API_BASE_URL } from '../config';

const Analytics = () => {
  const [data, setData] = useState({
    institutionalPerformance: 0,
    avgAttendance: 0,
    retentionRate: 0,
    passVsFail: { passingPercentage: 0 },
    scatterPoints: [],
    correlationData: [0, 0, 0, 0],
    performanceTrend: [],
    insights: { summary: '', focus_areas: [] }
  });
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/analytics`)
      .then(res => res.ok ? res.json() : { error: true })
      .then(payload => {
        if (!payload.error) setData(prev => ({ ...prev, ...payload }));
      })
      .catch(err => console.error("Analytics fetch error:", err));
  }, []);
  return (
    <Layout title="Analytics">
      {/* Hero Metric Section - Asymmetric Density */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-end px-2">
          <p className="label-sm text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2">Institutional Performance</p>
          <h2 className="text-5xl lg:text-8xl font-extrabold tracking-tight text-primary leading-none">
            {localStorage.getItem('edu_setu_primary_metric') === 'cgpa' ? (
              <>
                {((data?.institutionalPerformance || 0) / 10).toFixed(1)}
                <span className="text-3xl font-medium text-neutral-400 ml-2">CGPA</span>
              </>
            ) : (
              <>
                {data?.institutionalPerformance || 0}<span className="text-3xl font-medium text-neutral-400">%</span>
              </>
            )}
            <span className="text-sm font-bold text-neutral-400 ml-4 tracking-[0.2em] relative -top-6">
              | {localStorage.getItem('edu_setu_primary_metric') === 'cgpa' ? `${data?.institutionalPerformance || 0}%` : `${((data?.institutionalPerformance || 0) / 10).toFixed(1)} CGPA`}
            </span>
          </h2>
          <p className="body-md text-on-surface-variant mt-4 max-w-md leading-relaxed">Overall academic efficiency index calculated across all departments for the current semester cycle.</p>
        </div>
        
        <div className="col-span-1 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between">
            <AppIcon icon="trending_up" className="h-5 w-5 text-neutral-400" />
            <div>
              <p className="text-sm font-medium text-neutral-500">Avg. Attendance</p>
              <p className="text-2xl font-bold">{data.avgAttendance}%</p>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between">
            <AppIcon icon="bolt" className="h-5 w-5 text-neutral-400" />
            <div>
              <p className="text-sm font-medium text-neutral-500">Retention Rate</p>
              <p className="text-2xl font-bold">{data?.retentionRate || 0}%</p>
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
              <AppIcon icon="more_vert" className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1 flex items-end gap-4 px-4 pb-4">
            {['60-70%', '70-80%', '80-90%', '90-100%'].map((label, idx) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full bg-neutral-100 rounded-t-lg relative group h-48">
                  <div 
                    className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-500"
                    style={{ height: `${data?.correlationData?.[idx] || 0}%` }}
                  ></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Avg Marks: {data.correlationData[idx]}%
                  </div>
                </div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">{label}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Chart 2: Pie Chart (Pass vs Fail) */}
        <div className="bg-surface-container-lowest rounded-xl p-8 flex flex-col h-[400px]">
          <div className="mb-8">
            <h3 className="text-lg font-semibold tracking-tight">Pass vs Fail Ratio</h3>
            <p className="text-xs text-neutral-500 font-medium mt-1">Based on global pass threshold (40%)</p>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center relative scale-90 sm:scale-100">
            <svg className="w-40 h-40 lg:w-48 lg:h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="#f3f3f4" strokeWidth="12"></circle>
              {/* Dynamic SVG mapping based on passing percentage */}
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="#000000" strokeDasharray={`${(data.passVsFail.passingPercentage / 100) * 251.2} 251.2`} strokeLinecap="round" strokeWidth="12"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold">{data?.passVsFail?.passingPercentage || 0}%</span>
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

        {/* Chart 3: Performance Trend (Line Chart) */}
        <div className="lg:col-span-3 bg-surface-container-lowest rounded-xl p-8 flex flex-col h-[400px]">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Institutional Performance Trend</h3>
              <p className="text-xs text-neutral-500 font-medium mt-1">Average marks (%) trend over current academic semester</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">
              <AppIcon icon="trending_up" className="h-3 w-3" />
              +2.4% vs Prev
            </div>
          </div>
          
          <div className="flex-1 relative flex items-end justify-between px-10 pb-8 mt-4">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between px-10 pb-8 pointer-events-none opacity-20">
              {[1, 2, 3, 4].map(i => <div key={i} className="border-t border-neutral-300 w-full h-0"></div>)}
            </div>

            <svg className="absolute inset-0 px-6 sm:px-10 pb-8 w-full h-full overflow-visible" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#000000"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={(data?.performanceTrend || []).map((point, i, arr) => {
                  const x = (i / (arr.length - 1)) * 100;
                  const y = 100 - (point.score); // Assuming score is %
                  return `${x}% ${y}%`;
                }).join(', ')}
                className="drop-shadow-lg"
              />
              {/* Data points */}
              {(data?.performanceTrend || []).map((point, i, arr) => {
                const x = (i / (arr.length - 1)) * 100;
                const y = 100 - (point.score);
                return (
                  <circle key={i} cx={`${x}%`} cy={`${y}%`} r="5" fill="#000000" className="hover:r-7 transition-all cursor-pointer" />
                );
              })}
            </svg>

            {(data?.performanceTrend || []).map((point) => (
              <div key={point.period} className="flex flex-col items-center gap-2 relative z-10">
                <span className="text-[10px] font-bold text-neutral-400 mt-4 uppercase tracking-tighter">{point.period}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Individual Student Effort Mapping (Scatter) */}
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
            {(data?.scatterPoints || []).map((point, index) => (
              <div 
                key={index}
                className="absolute w-2 h-2 bg-neutral-800 rounded-full opacity-60 hover:w-3 hover:h-3 hover:bg-primary transition-all"
                style={{ 
                  left: `${(point?.x / 14) * 100}%`, 
                  bottom: `${point?.y}%` 
                }}
                title={`Study Hours: ${point?.x}, Marks: ${point?.y}`}
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
        <p className="text-xs font-medium">© 2024 EduSetu Analytics Engine. Data refreshed in real-time.</p>
        <div className="flex gap-4">
          <a className="text-xs hover:text-primary underline-offset-4 hover:underline" href="#">Compliance</a>
          <a className="text-xs hover:text-primary underline-offset-4 hover:underline" href="#">API Docs</a>
        </div>
      </footer>

      {/* Contextual Insight Overlay */}
      {showInsight && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 lg:p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <AppIcon icon="auto_awesome" className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Institutional AI Summary</h3>
                </div>
                <button onClick={() => setShowInsight(false)} className="text-neutral-400 hover:text-black">
                  <AppIcon icon="close" className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                    {data?.insights?.summary || "No insights available yet. Enroll more students to generate analytics."}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">Key Focus Areas</h4>
                  <div className="space-y-2">
                    {(data?.insights?.focus_areas || []).map((area, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-surface-container-low rounded-lg items-start border-l-4 border-primary">
                        <AppIcon icon="priority_high" className="mt-0.5 h-4 w-4 text-primary" />
                        <p className="text-xs font-medium text-on-surface">{area}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-surface-container-low flex justify-between items-center">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Refreshed {data.insights.timestamp}</span>
                  <button onClick={() => setShowInsight(false)} className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-transform active:scale-95">Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contextual Insight Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setShowInsight(true)}
          className="flex items-center gap-2 bg-black text-white px-6 py-4 rounded-full shadow-2xl hover:scale-[1.05] transition-all active:scale-95 group">
          <AppIcon icon="auto_awesome" className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-semibold">Generate AI Insight</span>
        </button>
      </div>

    </Layout>
  );
};

export default Analytics;
