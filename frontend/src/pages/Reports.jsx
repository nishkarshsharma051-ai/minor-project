import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({ totalStudents: 0, avgPerformance: 0, atRiskStudents: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    fetch('/api/dashboard/summary')
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(console.error);
  }, []);
  
  useEffect(() => {
    fetch(`/api/students?page=${page}&limit=5`)
      .then(res => res.json())
      .then(data => {
        setStudents(data.data || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(console.error);
  }, [page]);

  return (
    <Layout title="Reports">
      {/* Action Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Academic Insights</p>
          <h2 className="text-4xl font-semibold tracking-tight text-neutral-900">Student Risk Assessment</h2>
        </div>
        <button 
          onClick={() => window.open('/download-report?format=csv&marks=60&attendance=80&assignment_completion=50&participation=75&coding_score=85&communication_score=70')}
          className="bg-primary text-on-primary px-6 py-2.5 rounded shadow-lg hover:opacity-90 transition-all flex items-center space-x-2">
          <span className="material-symbols-outlined text-sm">download</span>
          <span className="text-sm font-medium">Download Sample Report</span>
        </button>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-xl border-none">
          <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-4">Total Students</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-semibold tracking-tighter">{summary.totalStudents.toLocaleString()}</span>
            <span className="text-xs text-neutral-400 font-medium">+ Live Sync</span>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest p-6 rounded-xl border-none">
          <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-4">At Risk</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-semibold tracking-tighter text-error">{summary.atRiskStudents}</span>
            <span className="text-xs text-neutral-400 font-medium">Flagged</span>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest p-6 rounded-xl border-none">
          <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-4">Avg Prediction</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-semibold tracking-tighter">{summary.avgPerformance}%</span>
            <span className="text-xs text-neutral-400 font-medium">Stable</span>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest p-6 rounded-xl border-none">
          <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block mb-4">Network Status</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-semibold tracking-tighter text-emerald-600">Up</span>
            <span className="text-xs text-neutral-400 font-medium">Supabase</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        <div className="px-8 py-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Predicted Performance Results</h3>
          <div className="flex space-x-4">
            <button className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black transition-colors">Filter</button>
            <button className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black transition-colors">Sort</button>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-neutral-500">Student Name</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-neutral-500">Predicted Score</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-neutral-500">Success Probability</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-neutral-500">Risk Level</th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-0">
              {students.map((st) => (
                <tr key={st.id} className={`${st.dropoutRisk === 'high' ? 'bg-neutral-200 border-l-4 border-black' : 'hover:bg-surface-container-high'} group transition-colors`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${st.dropoutRisk === 'high' ? 'bg-neutral-300' : 'bg-neutral-100'}`}>
                        {st.initials}
                      </div>
                      <span className={`text-sm ${st.dropoutRisk === 'high' ? 'font-bold' : 'font-medium'} text-on-surface`}>{st.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium">{st.marks} / 100</td>
                  <td className="px-8 py-5 text-sm font-medium">{st.attendance}%</td>
                  <td className="px-8 py-5">
                    {st.dropoutRisk === "high" ? (
                      <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-black text-white rounded">Critical</span>
                    ) : st.attendanceRisk ? (
                      <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-neutral-600 text-white rounded">Medium</span>
                    ) : (
                      <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-neutral-100 rounded">Low</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => window.open(`/download-report?format=pdf&student_name=${encodeURIComponent(st.name)}&marks=${st.marks}&attendance=${st.attendance}&assignment_completion=${st.assignment_completion}&participation=${st.participation}&coding_score=${st.coding_score}&communication_score=${st.communication_score}`)}
                      className={`material-symbols-outlined text-sm px-3 py-1.5 rounded-md hover:bg-neutral-200 transition-colors ${st.dropoutRisk === 'high' ? 'text-black' : 'text-neutral-500'}`}
                      title="Download PDF ML Report"
                    >
                      picture_as_pdf
                    </button>
                    <button 
                      onClick={() => window.open(`/download-report?format=csv&student_name=${encodeURIComponent(st.name)}&marks=${st.marks}&attendance=${st.attendance}&assignment_completion=${st.assignment_completion}&participation=${st.participation}&coding_score=${st.coding_score}&communication_score=${st.communication_score}`)}
                      className={`material-symbols-outlined text-sm px-3 py-1.5 rounded-md hover:bg-neutral-200 transition-colors ml-1 ${st.dropoutRisk === 'high' ? 'text-black' : 'text-neutral-500'}`}
                      title="Download CSV Evaluation"
                    >
                      csv
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6 bg-surface-container-low flex justify-between items-center">
          <p className="text-xs font-medium text-neutral-500">Showing {students.length} of {summary.totalStudents} students</p>
          <div className="flex space-x-2">
            <button 
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded border border-outline-variant/20 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded bg-black text-white flex items-center justify-center text-xs font-bold">{page}</button>
            <button 
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="w-8 h-8 rounded border border-outline-variant/20 flex items-center justify-center hover:bg-white transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytical Footer Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest p-8 rounded-xl">
          <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-6">Historical Comparison</h4>
          <div className="flex items-end space-x-4 h-40">
            <div className="flex-1 bg-neutral-100 h-[40%] rounded-t-sm"></div>
            <div className="flex-1 bg-neutral-200 h-[60%] rounded-t-sm"></div>
            <div className="flex-1 bg-neutral-300 h-[55%] rounded-t-sm"></div>
            <div className="flex-1 bg-neutral-400 h-[80%] rounded-t-sm"></div>
            <div className="flex-1 bg-black h-[95%] rounded-t-sm"></div>
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
            <span>Jan</span>
            <span>Feb</span>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-2">Trend Analysis</h4>
            <p className="text-sm text-neutral-500 leading-relaxed">Risk factors have decreased by 2.4% since the last reporting cycle. Predictive modeling suggests a continued stabilization through Q3.</p>
          </div>
          <div className="pt-6">
            <button className="text-black text-xs font-bold uppercase tracking-widest underline decoration-2 underline-offset-4">View detailed trends</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
