import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../utils/firebase';
import logo from '../assets/logo.png';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface flex items-center justify-center min-h-screen p-4 overflow-hidden relative font-body">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-surface-container-low rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-surface-container-high rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <main className="relative z-10 w-full max-w-md">
        <div className="text-center mb-12">
          <div className="flex flex-col items-center">
             <img src={logo} alt="EduSetu" className="h-16 w-16 mb-4 object-contain shadow-sm rounded-xl p-2 bg-white" />
             <h1 className="text-xl font-extrabold tracking-tighter text-on-surface mb-2">EduSetu</h1>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
            Create your account
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-3xl rounded-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.04)] p-10 border-0">
          <header className="mb-10">
            <h2 className="text-2xl font-semibold tracking-tight text-on-surface leading-tight">Get Started</h2>
            <p className="text-sm text-on-surface-variant mt-2">Join the academic analytics revolution.</p>
          </header>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 uppercase tracking-tighter font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                Email Address
              </label>
              <input
                className="w-full bg-surface-container-low border-none focus:ring-0 px-0 py-3 text-sm font-medium border-b-2 border-transparent focus:border-primary transition-all duration-300 placeholder:text-outline-variant text-black"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                Password
              </label>
              <input
                className="w-full bg-surface-container-low border-none focus:ring-0 px-0 py-3 text-sm font-medium border-b-2 border-transparent focus:border-primary transition-all duration-300 placeholder:text-outline-variant text-black"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                Confirm Password
              </label>
              <input
                className="w-full bg-surface-container-low border-none focus:ring-0 px-0 py-3 text-sm font-medium border-b-2 border-transparent focus:border-primary transition-all duration-300 placeholder:text-outline-variant text-black"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="w-full h-12 flex items-center justify-center rounded-xl bg-gradient-to-b from-[#3b3b3b] to-[#000000] text-white font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative mb-8">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/20"></div>
               </div>
               <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
                  <span className="bg-white/80 px-4">Or continue with</span>
               </div>
            </div>

            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full h-12 flex items-center justify-center rounded-xl bg-white border border-outline-variant/30 text-on-surface font-semibold text-sm tracking-wide shadow-sm hover:bg-neutral-50 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.39-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>

          <footer className="mt-8 text-center">
            <p className="text-xs text-on-surface-variant">
              Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Signup;
