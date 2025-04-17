import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function CashFlowNav() {
  const router = useRouter();
  const currentPath = router.pathname;
  
  const isActive = (path) => {
    return currentPath === path;
  };
  
  return (
    <div className="bg-transparent border-b border-white/10 mb-6">
      <nav className="flex -mb-px space-x-8">
        <Link href="/cashflow" className={`py-4 px-1 border-b-2 font-medium text-sm ${
          isActive('/cashflow') 
            ? 'border-blue-500 text-blue-500' 
            : 'border-transparent text-gray-300 hover:text-gray-100 hover:border-gray-300'
        }`}>
          Overview
        </Link>
        
        <Link href="/transactions" className={`py-4 px-1 border-b-2 font-medium text-sm ${
          isActive('/transactions') 
            ? 'border-blue-500 text-blue-500' 
            : 'border-transparent text-gray-300 hover:text-gray-100 hover:border-gray-300'
        }`}>
          Transactions
        </Link>
        
        <Link href="/accounts" className={`py-4 px-1 border-b-2 font-medium text-sm ${
          isActive('/accounts') 
            ? 'border-blue-500 text-blue-500' 
            : 'border-transparent text-gray-300 hover:text-gray-100 hover:border-gray-300'
        }`}>
          Accounts
        </Link>
        
        <Link href="/budgeting" className={`py-4 px-1 border-b-2 font-medium text-sm ${
          isActive('/budgeting') 
            ? 'border-blue-500 text-blue-500' 
            : 'border-transparent text-gray-300 hover:text-gray-100 hover:border-gray-300'
        }`}>
          Budgeting
        </Link>
      </nav>
    </div>
  );
} 