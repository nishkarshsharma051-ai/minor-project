import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import StudentData from './pages/StudentData';
import Reports from './pages/Reports';

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
                <Route path="/student-data" element={<StudentData />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/reports" element={<Reports />} />
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
