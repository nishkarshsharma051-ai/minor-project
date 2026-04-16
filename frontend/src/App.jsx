import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import StudentData from './pages/StudentData';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const isAuthenticated = true; // Temporary mock

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route index element={<Dashboard />} />
          <Route path="prediction" element={<Prediction />} />
          <Route path="student-data" element={<StudentData />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
