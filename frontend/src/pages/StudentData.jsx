import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';


const StudentData = () => {
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({ totalStudents: 0, avgAttendance: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    firstName: '',
    lastName: '',
    marks: '',
    attendance: '',
    assignmentCompletion: '',
    participation: '',
    coding_score: '',
    communication_score: ''
  });

  const limit = 5;

  const fetchSummary = () => {
    fetch('/api/students/summary')
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error("Failed to fetch summary:", err));
  };

  const fetchStudents = () => {
    setLoading(true);
    fetch(`/api/students?page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        setStudents(data.data || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch students:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollForm)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEnrollForm({ 
          firstName: '', lastName: '', marks: '', attendance: '', 
          assignmentCompletion: '', participation: '', 
          coding_score: '', communication_score: '' 
        });
        fetchSummary();
        fetchStudents();
      }

    } catch (err) {
      console.error("Enrollment failed:", err);
    }
  };

  const handlePredictClick = (student) => {
    navigate('/prediction', { 
      state: { 
        student_name: student.name,
        marks: student.marks,
        attendance: student.attendance,
        assignment_completion: student.assignment_completion,
        participation: student.participation,
        coding_score: student.coding_score,
        communication_score: student.communication_score
      } 
    });
  };

  const handleDeleteStudent = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchSummary();
          fetchStudents();
        } else {
          const data = await res.json();
          alert(`Failed to delete student: ${data.error || "Server error"}`);
        }
      } catch (err) {
        console.error("Deletion failed:", err);
        alert(`Failed to delete student: ${err.message}`);
      }
    }
  };




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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-container hover:text-black transition-all">
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
              <span className="text-6xl font-semibold tracking-tighter">{(summary?.totalStudents || 0).toLocaleString()}</span>
            </div>

          </div>
        </div>
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between h-48">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Avg Attendance</span>
            <div className="mt-4">
              <span className="text-6xl font-semibold tracking-tighter">{summary?.avgAttendance || 0}%</span>
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
                  {loading ? (
                    <tr><td colSpan="5" className="px-8 py-6 text-center text-sm text-on-surface-variant">Loading students...</td></tr>
                  ) : students.length === 0 ? (
                    <tr><td colSpan="5" className="px-8 py-6 text-center text-sm text-on-surface-variant">No students found.</td></tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id} className={`${student.attendanceRisk ? 'bg-surface-container-low/40 hover:bg-surface-container-low' : 'hover:bg-surface-container-highest/30'} transition-colors`}>
                        <td className="px-8 py-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center mr-4 text-primary font-bold">{student.initials}</div>
                            <span className="text-sm font-medium text-primary">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center"><span className={`text-sm ${student.attendanceRisk ? 'font-bold text-error' : 'font-semibold'}`}>{student.attendance}%</span></td>
                        <td className="px-8 py-6 text-center"><span className="text-sm">{student.marks}</span></td>
                        <td className="px-8 py-6 text-center"><span className="text-sm">{student.studyHours}</span></td>
                        <td className="px-8 py-6 text-right flex justify-end gap-2">
                          <button 
                            onClick={() => handlePredictClick(student)}
                            className="material-symbols-outlined text-neutral-400 hover:text-primary transition-colors"
                            title="Predict metrics for this student"
                          >
                            insights
                          </button>
                          <button 
                            onClick={() => handleDeleteStudent(student.id, student.name)}
                            className="material-symbols-outlined text-neutral-400 hover:text-error transition-colors"
                            title="Delete this student"
                          >
                            delete
                          </button>
                        </td>


                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Minimalist Pagination */}
            <div className="px-8 py-6 bg-white border-t border-surface-container-low flex justify-between items-center">
              <span className="text-xs text-on-surface-variant font-medium">
                Showing {students?.length || 0} of {(summary?.totalStudents || 0).toLocaleString()} students
              </span>

              <div className="flex space-x-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-outline-variant border-opacity-15 rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-50">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="p-2 border border-outline-variant border-opacity-15 rounded-lg bg-primary text-on-primary">
                  <span className="text-xs px-2">{page}</span>
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="p-2 border border-outline-variant border-opacity-15 rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-50">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
            <h3 className="text-2xl font-semibold mb-6 tracking-tight text-primary">Enroll New Student</h3>
            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">First Name</label>
                  <input type="text" required
                    className="w-full px-4 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none transition-colors"
                    value={enrollForm.firstName} onChange={e => setEnrollForm({...enrollForm, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">Last Name</label>
                  <input type="text" required
                    className="w-full px-4 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none transition-colors"
                    value={enrollForm.lastName} onChange={e => setEnrollForm({...enrollForm, lastName: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">Marks (%)</label>
                  <input type="number" step="0.1" required
                    className="w-full px-4 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none transition-colors"
                    value={enrollForm.marks} onChange={e => setEnrollForm({...enrollForm, marks: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">Attendance (%)</label>
                  <input type="number" step="0.1" required
                    className="w-full px-4 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none transition-colors"
                    value={enrollForm.attendance} onChange={e => setEnrollForm({...enrollForm, attendance: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">Assignment (%)</label>
                  <input type="number" step="0.1" required
                    className="w-full px-4 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none transition-colors"
                    value={enrollForm.assignmentCompletion} onChange={e => setEnrollForm({...enrollForm, assignmentCompletion: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">Participation (%)</label>
                  <input type="number" step="0.1" required
                    className="w-full px-4 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none transition-colors"
                    value={enrollForm.participation} onChange={e => setEnrollForm({...enrollForm, participation: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">Coding Score</label>
                  <input type="number" step="0.1" required
                    className="w-full px-4 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none transition-colors"
                    value={enrollForm.coding_score} onChange={e => setEnrollForm({...enrollForm, coding_score: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">Comm. Score</label>
                  <input type="number" step="0.1" required
                    className="w-full px-4 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none transition-colors"
                    value={enrollForm.communication_score} onChange={e => setEnrollForm({...enrollForm, communication_score: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="w-full mt-6 data-monolith-gradient py-3 rounded-xl text-white font-semibold hover:shadow-lg transition-transform active:scale-95">
                Complete Enrollment
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default StudentData;
