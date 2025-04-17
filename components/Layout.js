import React from 'react';
import { useRouter } from 'next/router';
import AceternitySidebar from './layout/AceternitySidebar';
import AuroraBackground from './ui/aceternity/aurora-background';

export default function Layout({ children }) {
  const router = useRouter();
  
  return (
    <AuroraBackground 
      primaryColor="#3b82f6" 
      containerClassName="h-screen rounded-none"
      gradientClassName="bg-gradient-to-b from-slate-900/90 to-slate-950"
    >
      <div className="flex h-screen">
        {/* Sidebar */}
        <AceternitySidebar />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top navigation */}
          <header className="bg-transparent backdrop-blur-sm shadow-sm z-10 border-b border-white/5">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                {/* Page title could go here */}
              </div>
              
              <div className="flex items-center">
                <button className="text-white mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                
                <button className="text-white mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                
                <div className="relative">
                  <button className="flex items-center text-sm rounded-full focus:outline-none">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      C
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </header>
          
          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-transparent">
            {children}
          </main>
        </div>
      </div>
    </AuroraBackground>
  );
} 