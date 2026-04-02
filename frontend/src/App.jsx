import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import Login from './pages/Login';

// Mock components for other pages
const Placeholder = ({ name }) => (
  <div className="flex items-center justify-center h-[200px] bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-xl text-neutral-400">
    {name} Implementation Coming Soon
  </div>
);

function App() {
  const isAuthenticated = true; // Temporary mock

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes Wrapper */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/student-data" element={<div className="ml-64 pt-24 px-10"><Placeholder name="Student Data" /></div>} />
                <Route path="/analytics" element={<div className="ml-64 pt-24 px-10"><Placeholder name="Analytics" /></div>} />
                <Route path="/reports" element={<div className="ml-64 pt-24 px-10"><Placeholder name="Reports" /></div>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
