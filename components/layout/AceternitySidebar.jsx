"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function AceternitySidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const router = useRouter();
  
  // Navigation items with icons
  const sidebarItems = [
    {
      id: "overview", 
      label: "Business overview",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      path: "/dashboard"
    },
    { 
      id: "clients", 
      label: "Clients",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      path: "/clients"
    },
    { 
      id: "invoices", 
      label: "Invoices",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
      path: "/invoices"
    },
    { 
      id: "expenses", 
      label: "Expenses",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      ),
      path: "/expenses"
    },
    { 
      id: "cashflow", 
      label: "Cash flow",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      ),
      path: "/cashflow"
    },
    { 
      id: "performance", 
      label: "Performance center",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      path: "/performance"
    },
    { 
      id: "reports", 
      label: "Reports",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
        </svg>
      ),
      path: "/reports"
    },
    { 
      id: "planner", 
      label: "Planner",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      path: "/planner"
    },
    { 
      id: "projects", 
      label: "Projects",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
          <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
        </svg>
      ),
      path: "/projects"
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    // Close sidebar when route changes (on mobile)
    if (isMobile) {
      setIsOpen(false);
    }
  }, [router.pathname, isMobile]);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handlers for hover behavior with debounce
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsCollapsed(true);
    }
  };

  return (
    <>
      {/* Mobile hamburger menu */}
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 text-white p-2 rounded-md bg-slate-800/40 backdrop-blur-sm"
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      )}
      
      {/* Sidebar */}
      <motion.div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={false}
        animate={{
          width: isMobile 
            ? isOpen ? '16rem' : '0rem' 
            : isCollapsed ? '4rem' : '16rem'
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25, 
          duration: 0.25
        }}
        className={`bg-slate-900/50 backdrop-blur-md border-r border-white/5 h-screen overflow-y-auto fixed md:relative top-0 left-0 z-40 ${
          isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <motion.h1 
              animate={{ opacity: !isCollapsed || isMobile ? 1 : 0 }}
              transition={{ duration: 0.2, delay: isCollapsed ? 0 : 0.1 }}
              className={`text-xl font-bold text-white absolute ${isCollapsed && !isMobile ? 'invisible' : 'visible'}`}
            >
              FiscalFusion
            </motion.h1>
            <motion.h1 
              animate={{ opacity: isCollapsed && !isMobile ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className={`text-xl font-bold text-white ${!isCollapsed || isMobile ? 'invisible' : 'visible'}`}
            >
              FF
            </motion.h1>
            {isMobile && (
              <button onClick={toggleSidebar} className="text-white ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="mt-8">
            <motion.p 
              animate={{ opacity: !isCollapsed || isMobile ? 1 : 0 }}
              transition={{ duration: 0.2, delay: isCollapsed ? 0 : 0.1 }}
              className={`text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 ${isCollapsed && !isMobile ? 'invisible' : 'visible'}`}
            >
              Dashboard
            </motion.p>
            <nav className="space-y-1">
              {sidebarItems.map(item => (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`flex items-center ${!isCollapsed || isMobile ? 'px-3' : 'px-2 justify-center'} py-2 rounded-md text-sm font-medium w-full transition-all duration-300 ease-in-out ${
                    router.pathname === item.path
                      ? 'bg-primary-500/20 text-primary-500 border-l-2 border-primary-500'
                      : 'text-gray-300 hover:bg-gray-700/20 hover:text-white'
                  }`}
                  title={isCollapsed && !isMobile ? item.label : ""}
                >
                  <span className={!isCollapsed || isMobile ? "mr-3 transition-all duration-300" : "transition-all duration-300"}>
                    {item.icon}
                  </span>
                  <motion.span 
                    animate={{ 
                      opacity: !isCollapsed || isMobile ? 1 : 0,
                      width: !isCollapsed || isMobile ? 'auto' : 0
                    }}
                    transition={{ duration: 0.2, delay: isCollapsed ? 0 : 0.1 }}
                    className={`whitespace-nowrap overflow-hidden ${isCollapsed && !isMobile ? 'w-0' : ''}`}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="border-t border-white/10 mt-6 pt-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-semibold">C</span>
                </div>
              </div>
              <motion.div 
                animate={{ 
                  opacity: !isCollapsed || isMobile ? 1 : 0,
                  width: !isCollapsed || isMobile ? 'auto' : 0,
                  marginLeft: !isCollapsed || isMobile ? '0.75rem' : '0rem'
                }}
                transition={{ duration: 0.2, delay: isCollapsed ? 0 : 0.1 }}
                className={`overflow-hidden ${isCollapsed && !isMobile ? 'w-0 ml-0' : 'ml-3'}`}
              >
                <p className="text-sm font-medium text-white whitespace-nowrap">Company Account</p>
                <p className="text-xs text-gray-400 whitespace-nowrap">Administrator</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
} 