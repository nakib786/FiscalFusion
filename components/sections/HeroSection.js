import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import DashboardPreview from '../preview/DashboardPreview';

// Client-side only component to handle time display
const TimeDisplay = dynamic(() => Promise.resolve(() => {
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    // Set time initially
    setTime(new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }));
    
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-blue-400">{time}</span>
  );
}), { ssr: false });

const HeroSection = () => {
  // States for animated values
  const [barValues, setBarValues] = useState([60, 45, 75, 50, 65, 40]);
  const [lineValues, setLineValues] = useState([25, 40, 30, 50, 35, 60, 45, 55]);
  const [stats, setStats] = useState({
    revenue: "$142,568",
    expenses: "$58,623",
    profit: "$83,945",
    growth: "+12.4%"
  });
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Improve mobile detection
  useEffect(() => {
    setIsClient(true);
    
    // Check if mobile on mount and on resize
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Simulate data updates - only on client side
  useEffect(() => {
    if (!isClient) return;
    
    const interval = setInterval(() => {
      // Update bar chart
      setBarValues(prev => 
        prev.map(val => Math.max(30, Math.min(90, val + Math.floor(Math.random() * 20) - 10)))
      );
      
      // Update line chart
      setLineValues(prev => {
        const newValues = [...prev];
        newValues.shift();
        newValues.push(Math.max(20, Math.min(70, prev[prev.length - 1] + Math.floor(Math.random() * 20) - 10)));
        return newValues;
      });
      
      // Every few updates, simulate a revenue/expense change
      if (Math.random() > 0.7) {
        const newRevenue = 140000 + Math.floor(Math.random() * 10000);
        const newExpenses = 55000 + Math.floor(Math.random() * 8000);
        const newProfit = newRevenue - newExpenses;
        const prevRevenue = parseInt(stats.revenue.replace(/[$,]/g, ''));
        const growthPercent = ((newRevenue - prevRevenue) / prevRevenue * 100).toFixed(1);
        
        setStats({
          revenue: `$${newRevenue.toLocaleString()}`,
          expenses: `$${newExpenses.toLocaleString()}`,
          profit: `$${newProfit.toLocaleString()}`,
          growth: `${growthPercent > 0 ? '+' : ''}${growthPercent}%`
        });
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [stats, isClient]);
  
  // Handle tab click
  const handleTabClick = (index) => {
    console.log('Tab clicked:', index);
    setLoading(true);
    setActiveTab(index);
    
    // Simulate data change based on selected tab
    setTimeout(() => {
      // Update charts and data based on selected tab
      if (index === 0) { // Overview
        setBarValues([60, 45, 75, 50, 65, 40]);
        setLineValues([25, 40, 30, 50, 35, 60, 45, 55]);
      } else if (index === 1) { // Revenue
        setBarValues([75, 80, 65, 70, 85, 60]);
        setLineValues([45, 55, 60, 65, 70, 75, 80, 85]);
      } else if (index === 2) { // Expenses
        setBarValues([40, 35, 50, 45, 30, 35]);
        setLineValues([30, 35, 40, 35, 30, 40, 35, 25]);
      } else if (index === 3) { // Reports
        setBarValues([50, 60, 70, 65, 55, 65]);
        setLineValues([40, 50, 60, 55, 45, 50, 60, 65]);
      }
      
      setLoading(false);
    }, 500);
  };
  
  // Dashboard tabs with icons
  const tabs = [
    { name: 'Overview', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { name: 'Revenue', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { name: 'Expenses', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z' },
    { name: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
  ];
  
  // Format percentages 
  const getBarHeight = (value) => `${value}%`;
  
  // Static growth percentage for server-side rendering
  const staticGrowthPercent = '+8.3%';
  
  return (
    <section className="w-full py-20 md:py-32 flex flex-col items-center">
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari, Opera */
        }
        
        @media (max-width: 640px) {
          .mobile-dash {
            transform: scale(0.9);
            transform-origin: top center;
          }
        }
        
        /* Add interactive pulse effect */
        .tab-hover:hover {
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
        }
        
        /* Gradient animation for buttons */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animated-gradient {
          background: linear-gradient(-45deg, #3b82f6, #2563eb, #1d4ed8);
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }
      `}</style>
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="w-full md:w-1/2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Smart Financial <span className="text-blue-400">Management</span> Made Simple
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-xl"
          >
            Take control of your finances with FiscalFusion. Track expenses, manage budgets, and generate insightful reports all in one place.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link href="/auth/signup">
              <button className="animated-gradient text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/30">
                Get Started Free
              </button>
            </Link>
            <Link href="/demo">
              <button className="bg-transparent border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-medium py-3 px-8 rounded-lg transition-all duration-200">
                See Demo
              </button>
            </Link>
          </motion.div>
        </div>
        
        {/* Right Content - Interactive Dashboard Preview */}
        <div className="w-full md:w-1/2">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 