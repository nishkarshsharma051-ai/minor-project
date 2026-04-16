import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';

const Prediction = () => {
  const [formData, setFormData] = useState({
    student_name: '',
    marks: '',
    attendance: '',
    assignment_completion: '',
    participation: '',
    coding_score: '',
    communication_score: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [isFetchingStudents, setIsFetchingStudents] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsFetchingStudents(true);
    try {
      const response = await axios.get('/api/students?limit=100');
      setEnrolledStudents(response.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch students for lookup:", err);
      setError("Note: Could not load enrolled students list. Use manual entry or refresh.");
    } finally {
      setIsFetchingStudents(false);
    }
  };


  useEffect(() => {
    if (location.state) {
      setFormData({
        student_name:          location.state.student_name || '',
        marks:                 location.state.marks || '',
        attendance:            location.state.attendance || '',
        assignment_completion: location.state.assignment_completion || '',
        participation:         location.state.participation || '',
        coding_score:          location.state.coding_score || '',
        communication_score:   location.state.communication_score || '',
      });
    }
  }, [location.state]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      // Note: In development, we use relative URL. Vite proxy will handle port 5001.
      const response = await axios.post('/predict', formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get prediction. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Predict Performance">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-5xl font-semibold tracking-tight text-on-surface mb-4">Predict Student Performance</h2>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            Utilize our machine learning model to forecast academic outcomes based on engagement metrics.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form */}
          <div className="col-span-12 lg:col-span-5 space-y-8">
            <div className="bg-surface-container-lowest p-10 rounded-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.04)]">
              <div className="mb-8 p-4 bg-surface-container rounded-lg border border-outline-variant/30">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Quick Load</span>
                  <button 
                    onClick={fetchStudents}
                    className="text-[10px] flex items-center gap-1 font-bold text-primary hover:text-neutral-800 transition-colors uppercase tracking-widest"
                  >
                    <span className={`material-symbols-outlined text-[14px] ${isFetchingStudents ? 'animate-spin' : ''}`}>refresh</span>
                    Refresh List
                  </button>
                </div>
                <div className="relative">
                  <select 
                    onChange={(e) => {
                      const student = enrolledStudents.find(s => s.id === parseInt(e.target.value));
                      if (student) {
                        setFormData({
                          student_name: student.name,
                          marks: student.marks,
                          attendance: student.attendance,
                          assignment_completion: student.assignment_completion,
                          participation: student.participation,
                          coding_score: student.coding_score,
                          communication_score: student.communication_score
                        });
                      }
                    }}
                    className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>{isFetchingStudents ? 'Loading...' : (enrolledStudents.length === 0 ? 'No Enrolled Students Found' : 'Select Enrolled Student')}</option>
                    {enrolledStudents.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
                  </div>
                </div>
                {enrolledStudents.length === 0 && !isFetchingStudents && (
                  <p className="text-[10px] text-error mt-2">Zero students found in database. Go to Student Data to enroll someone.</p>
                )}
              </div>


              <div className="mb-8">
                <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 block">Configuration</span>
                <h3 className="text-xl font-semibold">Model Parameters</h3>
              </div>

              <form className="space-y-6">
                {[
                  { label: 'Student Name', name: 'student_name', type: 'text', placeholder: 'Enter student name' },
                  { label: 'Attendance (%)', name: 'attendance', type: 'number', placeholder: '0' },
                  { label: 'Marks (Prev. Sem)', name: 'marks', type: 'number', placeholder: '0' },
                  { label: 'Assignment Completion (%)', name: 'assignment_completion', type: 'number', placeholder: '0' },
                  { label: 'Participation (%)', name: 'participation', type: 'number', placeholder: '0' },
                  { label: 'Coding Score', name: 'coding_score', type: 'number', placeholder: '0' },
                  { label: 'Communication Score', name: 'communication_score', type: 'number', placeholder: '0' },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{field.label}</label>
                    <input
                      className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary focus:ring-0 transition-all px-0 py-2 text-lg font-medium text-black"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      type={field.type}
                    />
                  </div>
                ))}
                <div className="pt-4">
                  <button
                    onClick={handlePredict}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-neutral-800 text-on-primary font-semibold py-4 rounded-lg transition-all duration-300 shadow-lg shadow-black/10 flex items-center justify-center space-x-2 disabled:opacity-50"
                    type="button"
                  >
                    <span>{loading ? 'Analyzing...' : 'Predict Performance'}</span>
                    {!loading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                  </button>
                </div>
                {error && <p className="text-error text-xs mt-2">{error}</p>}
              </form>
            </div>
          </div>

          {/* Right Column: Results Output */}
          <div className="col-span-12 lg:col-span-7">
            {!result ? (
              <div className="bg-surface-container-lowest rounded-xl min-h-[500px] flex flex-col items-center justify-center text-center p-12 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl text-neutral-400">insights</span>
                  </div>
                  <h4 className="text-2xl font-semibold mb-3">Awaiting Prediction</h4>
                  <p className="text-on-surface-variant max-w-sm mx-auto">
                    Enter the student metrics on the left and click "Predict" to see the generated risk analysis.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.04)] border border-outline-variant/15">
                <div className="p-10">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 block">Analysis Result</span>
                      <h3 className="text-3xl font-semibold">Forecast Summary</h3>
                    </div>
                    <div className="bg-surface-container-low px-4 py-2 rounded-full flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs font-bold text-on-surface">Live Prediction</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mb-12">
                    <div className="bg-surface-container-low p-8 rounded-lg">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-4">Performance</span>
                      <div className="text-[3.5rem] font-bold leading-none tracking-tighter text-primary">
                        {result?.prediction?.toUpperCase() || 'N/A'}
                      </div>
                    </div>
                    <div className="bg-surface-container-low p-8 rounded-lg border-l-4 border-primary">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-4">Dropout Risk</span>
                      <div className="text-[3.5rem] font-bold leading-none tracking-tighter text-primary">
                        {result?.dropout_risk?.toUpperCase() || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-surface rounded-lg">
                      <h5 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-2">AI Insights</h5>
                      <p className="text-sm text-on-surface-variant">
                        {result.insight.summary}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-50 rounded-lg">
                        <h5 className="text-[10px] font-bold uppercase text-emerald-700">Strengths</h5>
                        <ul className="text-xs text-emerald-800 mt-2 list-disc list-inside">
                          {result.insight.strengths.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <h5 className="text-[10px] font-bold uppercase text-amber-700">Suggestions</h5>
                        <ul className="text-xs text-amber-800 mt-2 list-disc list-inside">
                          {result.insight.suggestions.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Prediction;
