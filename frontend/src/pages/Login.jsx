import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Temporary mock login logic
    navigate('/');
  };

  return (
    <div className="bg-surface text-on-surface flex items-center justify-center min-h-screen p-4 overflow-hidden relative font-body">
      {/* Intentional Void Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-surface-container-low rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-surface-container-high rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <main className="relative z-10 w-full max-w-md">
        {/* Branding Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center">
             <img src={logo} alt="EduSetu" className="h-16 w-16 mb-4 object-contain shadow-sm rounded-xl p-2 bg-white" />
             <h1 className="text-xl font-extrabold tracking-tighter text-on-surface mb-2">EduSetu</h1>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
            Student Analytics System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.04)] p-10 border-0">
          <header className="mb-10">
            <h2 className="text-2xl font-semibold tracking-tight text-on-surface leading-tight">Welcome back</h2>
            <p className="text-sm text-on-surface-variant mt-2">Access your academic command center.</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                Email Address
              </label>
              <div className="relative group">
                <input
                  className="w-full bg-surface-container-low border-none focus:ring-0 px-0 py-3 text-sm font-medium border-b-2 border-transparent focus:border-primary transition-all duration-300 placeholder:text-outline-variant text-black"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute bottom-0 left-0 h-[1px] w-full bg-outline-variant/20"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                  Password
                </label>
                <a className="text-[10px] font-bold text-primary hover:underline transition-all" href="#">
                  Forgot?
                </a>
              </div>
              <div className="relative group">
                <input
                  className="w-full bg-surface-container-low border-none focus:ring-0 px-0 py-3 text-sm font-medium border-b-2 border-transparent focus:border-primary transition-all duration-300 placeholder:text-outline-variant text-black"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute bottom-0 left-0 h-[1px] w-full bg-outline-variant/20"></div>
              </div>
            </div>

            <button
              className="w-full h-12 flex items-center justify-center rounded-xl bg-gradient-to-b from-[#3b3b3b] to-[#000000] text-on-primary font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200"
              type="submit"
            >
              Sign in to Dashboard
            </button>
          </form>

          <footer className="mt-10 pt-8 flex items-center justify-center space-x-2">
            <div className="w-8 h-[1px] bg-outline-variant/20"></div>
            <span className="text-[10px] text-on-surface-variant font-medium">SECURED BY EDUSETU PROTOCOL</span>
            <div className="w-8 h-[1px] bg-outline-variant/20"></div>
          </footer>
        </div>

        {/* System Status Decor */}
        <div className="mt-8 flex justify-between items-center px-2">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-medium text-on-surface-variant uppercase tracking-tight">
              Systems Operational
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-[10px] font-medium text-on-surface-variant hover:text-primary">HELP</button>
            <button className="text-[10px] font-medium text-on-surface-variant hover:text-primary">PRIVACY</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
