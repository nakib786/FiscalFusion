import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const isActive = (path) => {
    return router.pathname === path ? 'border-b-2 border-primary font-bold' : '';
  };

  // Check if current page is dashboard or related pages
  const isDashboardArea = router.pathname.includes('/dashboard') || 
                          router.pathname.includes('/clients') || 
                          router.pathname.includes('/invoices') || 
                          router.pathname.includes('/expenses') || 
                          router.pathname.includes('/reports');

  return (
    <nav className="bg-[#050505]/60 backdrop-blur-md text-white shadow-md border-b border-white/5 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary">
              FiscalFusion
            </Link>
          </div>

          {/* Navigation menu */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className={`px-3 py-2 text-sm hover:text-primary transition-colors ${isActive('/dashboard')}`}>
              Dashboard
            </Link>
            
            {/* Only show these links when in dashboard area */}
            {isDashboardArea && (
              <>
                <Link href="/clients" className={`px-3 py-2 text-sm hover:text-primary transition-colors ${isActive('/clients')}`}>
                  Clients
                </Link>
                <Link href="/invoices" className={`px-3 py-2 text-sm hover:text-primary transition-colors ${isActive('/invoices')}`}>
                  Invoices
                </Link>
                <Link href="/expenses" className={`px-3 py-2 text-sm hover:text-primary transition-colors ${isActive('/expenses')}`}>
                  Expenses
                </Link>
                <Link href="/reports" className={`px-3 py-2 text-sm hover:text-primary transition-colors ${isActive('/reports')}`}>
                  Reports
                </Link>
              </>
            )}
            
            {/* Authentication Links */}
            <div className="ml-4 flex items-center border-l border-white/10 pl-4">
              <Link href="/login" className={`px-3 py-2 text-sm hover:text-primary transition-colors ${isActive('/login')}`}>
                Login
              </Link>
              <Link 
                href="/register" 
                className="ml-2 px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 