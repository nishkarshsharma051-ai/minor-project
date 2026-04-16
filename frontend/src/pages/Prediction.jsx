import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import AppIcon from '../components/AppIcon';
import { API_BASE_URL } from '../config';

const Prediction = () => {
  const [formData, setFormData] = useState({
    student_name: '',
    marks: '',
    attendance: '',
    assignment_completion: '',
    participation: '',
    coding_score: '',
    communication_score: '',
    cgpa: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [isFetchingStudents, setIsFetchingStudents] = useState(false);
  const [activeMetric, setActiveMetric] = useState(localStorage.getItem('edu_setu_primary_metric') || 'percentage');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsFetchingStudents(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/students?limit=100`);
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
        cgpa:                  location.state.marks ? (location.state.marks / 10).toFixed(2) : ''
      });
    }
  }, [location.state]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'marks') {
      setFormData({ 
        ...formData, 
        marks: value, 
        cgpa: value ? (parseFloat(value) / 10).toFixed(2) : '' 
      });
    } else if (name === 'cgpa') {
      setFormData({ 
        ...formData, 
        cgpa: value, 
        marks: value ? (parseFloat(value) * 10).toFixed(1) : '' 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create a copy without the UI-only cgpa field for the backend
      const { cgpa, ...payload } = formData;
      const response = await axios.post(`${API_BASE_URL}/predict`, payload);
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
        <div className="mb-8 lg:mb-12 px-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-on-surface mb-2">Predict Performance</h2>
            <p className="text-on-surface-variant text-sm max-w-xl leading-relaxed">
              Utilize our machine learning model to forecast academic outcomes.
            </p>
          </div>
          <div className="flex bg-surface-container-high p-1 rounded-xl border border-outline-variant/10 self-end">
            <button 
              onClick={() => { setActiveMetric('percentage'); localStorage.setItem('edu_setu_primary_metric', 'percentage'); }}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeMetric === 'percentage' ? 'bg-black text-white' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              %
            </button>
            <button 
              onClick={() => { setActiveMetric('cgpa'); localStorage.setItem('edu_setu_primary_metric', 'cgpa'); }}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeMetric === 'cgpa' ? 'bg-black text-white' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              CGPA
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form */}
          <div className="col-span-12 lg:col-span-5 space-y-8">
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.04)]">
              <div className="mb-8 p-4 bg-surface-container rounded-lg border border-outline-variant/30">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Quick Load Student</span>
                  <button 
                    onClick={fetchStudents}
                    className="text-[10px] flex items-center gap-1 font-bold text-primary hover:text-neutral-800 transition-colors uppercase tracking-widest"
                  >
                    <AppIcon icon="refresh" className={`h-[14px] w-[14px] ${isFetchingStudents ? 'animate-spin' : ''}`} />
                    Refresh
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
                          cgpa: (student.marks / 10).toFixed(2),
                          attendance: student.attendance,
                          assignment_completion: student.assignment_completion,
                          participation: student.participation,
                          coding_score: student.coding_score,
                          communication_score: student.communication_score
                        });
                      }
                    }}
                    className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 text-sm focus:outline-none appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>{isFetchingStudents ? 'Loading...' : (enrolledStudents.length === 0 ? 'No Enrolled Students' : 'Select Student')}</option>
                    {enrolledStudents.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <AppIcon icon="expand_more" className="h-4 w-4 text-on-surface-variant" />
                  </div>
                </div>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Student Name</label>
                  <input
                    className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary focus:ring-0 transition-all px-0 py-2 text-lg font-medium text-black"
                    name="student_name"
                    value={formData.student_name}
                    onChange={handleChange}
                    placeholder="Enter name..."
                    type="text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      {activeMetric === 'percentage' ? 'Marks / Percentage (%)' : 'CGPA (Scale of 10.0)'}
                    </label>
                    <input
                      className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary focus:ring-0 transition-all px-0 py-2 text-lg font-bold text-primary"
                      name={activeMetric === 'percentage' ? 'marks' : 'cgpa'}
                      value={activeMetric === 'percentage' ? formData.marks : formData.cgpa}
                      onChange={handleChange}
                      placeholder="0"
                      type="number"
                      step={activeMetric === 'percentage' ? "0.1" : "0.01"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Attendance (%)</label>
                    <input
                      className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary focus:ring-0 transition-all px-0 py-2 text-lg font-medium text-black"
                      name="attendance"
                      value={formData.attendance}
                      onChange={handleChange}
                      placeholder="0"
                      type="number"
                    />
                  </div>
                </div>

                {[
                  { label: 'Assignment Completion (%)', name: 'assignment_completion', placeholder: '0' },
                  { label: 'Participation (%)', name: 'participation', placeholder: '0' },
                  { label: 'Coding Score', name: 'coding_score', placeholder: '0' },
                  { label: 'Communication Score', name: 'communication_score', placeholder: '0' },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{field.label}</label>
                    <input
                      className="w-full bg-surface-container-low border-b-2 border-transparent focus:border-primary focus:ring-0 transition-all px-0 py-2 text-lg font-medium text-black"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      type="number"
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
                    {!loading && <AppIcon icon="arrow_forward" className="h-4 w-4" />}
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
                    <AppIcon icon="insights" className="h-10 w-10 text-neutral-400" />
                  </div>
                  <h4 className="text-2xl font-semibold mb-3">Awaiting Prediction</h4>
                  <p className="text-on-surface-variant max-w-sm mx-auto">
                    Enter the student metrics on the left and click "Predict" to see the generated risk analysis.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.04)] border border-outline-variant/15">
                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-2 block">Analysis Result</span>
                      <h3 className="text-2xl lg:text-3xl font-semibold">Forecast Summary</h3>
                    </div>
                    <div className="bg-surface-container-low px-4 py-2 rounded-full flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs font-bold text-on-surface">Live Prediction</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8 mb-12">
                    <div className="bg-surface-container-low p-6 lg:p-8 rounded-lg">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-4">Performance</span>
                      <div className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-none tracking-tighter text-primary">
                        {result?.prediction?.toUpperCase() || 'N/A'}
                      </div>
                    </div>
                    <div className="bg-surface-container-low p-6 lg:p-8 rounded-lg border-l-4 border-primary">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 block mb-4">Dropout Risk</span>
                      <div className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-none tracking-tighter text-primary">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
