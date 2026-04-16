import React from 'react';
import logo from '../assets/logo.png';

const SplashScreen = ({ isFading }) => {
  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative flex flex-col items-center">
        {/* Animated outer ring */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse scale-150"></div>
        
        {/* Floating Logo Container */}
        <div className="relative animate-bounce-slow">
          <img 
            src={logo} 
            alt="EduSetu Logo" 
            className="w-24 h-24 object-contain shadow-2xl rounded-2xl p-3 bg-white/5 backdrop-blur-sm border border-white/10"
          />
        </div>

        {/* Text and Indicator */}
        <div className="mt-12 text-center">
          <h1 className="text-white text-2xl font-bold tracking-tight mb-2 opacity-0 animate-fade-in fill-mode-forwards" style={{ animationDelay: '0.5s' }}>
            EduSetu
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest opacity-0 animate-fade-in fill-mode-forwards" style={{ animationDelay: '0.8s' }}>
              Establishing Secure Connection
            </p>
          </div>
          
          {/* Subtle Progress Bar */}
          <div className="w-32 h-0.5 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-full origin-left animate-progress-full"></div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-0 right-0 text-center opacity-0 animate-fade-in fill-mode-forwards" style={{ animationDelay: '1.2s' }}>
        <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
          The Future of Student Analytics
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
