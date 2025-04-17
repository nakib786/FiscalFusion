import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#050505]/60 backdrop-blur-md text-white py-8 mt-auto border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">FiscalFusion</h3>
            <p className="text-sm text-white/60">Your all-in-one financial management solution.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="text-sm text-white/60 hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link href="/clients" className="text-sm text-white/60 hover:text-primary transition-colors">Clients</Link></li>
              <li><Link href="/invoices" className="text-sm text-white/60 hover:text-primary transition-colors">Invoices</Link></li>
              <li><Link href="/expenses" className="text-sm text-white/60 hover:text-primary transition-colors">Expenses</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-sm text-white/60 hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-sm text-white/60 hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-sm text-white/60 hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/login" className="text-sm text-white/60 hover:text-primary transition-colors">Login</Link></li>
              <li><Link href="/register" className="text-sm text-white/60 hover:text-primary transition-colors">Sign Up</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-white/40">&copy; {new Date().getFullYear()} FiscalFusion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 