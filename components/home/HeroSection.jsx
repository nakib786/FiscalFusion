"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRightIcon, 
  BarChart3, 
  PieChart, 
  FileText, 
  CreditCard, 
  BarChart2, 
  Users, 
  Settings,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} HeroAction
 * @property {string} text
 * @property {string} href
 * @property {React.ReactNode} [icon]
 * @property {"default" | "outline" | "secondary" | "ghost" | "link" | "glow"} [variant]
 */

/**
 * @typedef {Object} HeroProps
 * @property {Object} [badge]
 * @property {string} badge.text
 * @property {Object} [badge.action]
 * @property {string} badge.action.text
 * @property {string} badge.action.href
 * @property {string} title
 * @property {string} description
 * @property {HeroAction[]} actions
 * @property {React.ReactNode} [image]
 */

const Glow = React.forwardRef(
  ({ className, variant = "top", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute w-full",
        {
          "top-0": variant === "top",
          "-top-[128px]": variant === "above",
          "bottom-0": variant === "bottom",
          "-bottom-[128px]": variant === "below",
          "top-[50%]": variant === "center",
        },
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand-foreground)/.5)_10%,_hsla(var(--brand-foreground)/0)_60%)] sm:h-[512px]",
          variant === "center" && "-translate-y-1/2",
        )}
      />
      <div
        className={cn(
          "absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 scale-[2] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand)/.3)_10%,_hsla(var(--brand-foreground)/0)_60%)] sm:h-[256px]",
          variant === "center" && "-translate-y-1/2",
        )}
      />
    </div>
  )
);
Glow.displayName = "Glow";

const MockupFrame = React.forwardRef(
  ({ className, size = "small", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-accent/5 flex relative z-10 overflow-hidden rounded-2xl",
        {
          "p-2": size === "small",
          "p-4": size === "large",
        },
        className
      )}
      {...props}
    />
  )
);
MockupFrame.displayName = "MockupFrame";

const FinancialChart = () => {
  return (
    <div className="relative bg-black/40 backdrop-blur-sm border border-white/5 rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-white">Financial Overview</h3>
        <div className="flex space-x-2">
          <Badge variant="outline" className="text-xs border-white/10">Monthly</Badge>
          <Badge variant="outline" className="text-xs border-white/10">Annual</Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-xs text-white/60">Revenue</p>
          <p className="text-lg font-semibold text-white">$24,563</p>
          <p className="text-xs text-green-400">+12.5%</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-white/60">Expenses</p>
          <p className="text-lg font-semibold text-white">$15,202</p>
          <p className="text-xs text-red-400">+3.2%</p>
        </div>
      </div>
      
      <div className="h-32 flex items-end space-x-2">
        {[40, 65, 50, 80, 60, 55, 75, 70, 85, 90, 75].map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-primary/80 rounded-t-sm" 
              style={{ height: `${height}%` }}
            />
            <span className="text-[10px] mt-1 text-white/70">{i + 1}</span>
          </div>
        ))}
      </div>
      
      <div className="absolute top-3 right-3 flex space-x-1">
        <BarChart3 className="h-4 w-4 text-white/50" />
        <PieChart className="h-4 w-4 text-white/50" />
      </div>
    </div>
  );
};

const DashboardElement = () => {
  return (
    <div className="relative bg-black/40 backdrop-blur-sm border border-white/5 rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-white">Donation Tracking</h3>
        <Badge variant="outline" className="text-xs border-white/10">Q2 2023</Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <p className="text-xs text-white/60">Total Donations</p>
          <p className="text-lg font-semibold text-white">$128,450</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-white/60">Donors</p>
          <p className="text-lg font-semibold text-white">1,245</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-white/80">
            <span>Program A</span>
            <span>65%</span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: "65%" }} />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-white/80">
            <span>Program B</span>
            <span>42%</span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }} />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-white/80">
            <span>Program C</span>
            <span>78%</span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: "78%" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Tab content components
const DashboardContent = () => (
  <>
    {/* Welcome Banner */}
    <div className="bg-gradient-to-r from-primary/30 to-blue-500/30 backdrop-blur-md rounded-lg border border-white/5 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">Welcome back, Sarah!</h2>
          <p className="text-sm text-white/70">Here's an overview of your finances</p>
        </div>
        <div className="hidden md:block h-14 w-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
          <span className="text-xl font-bold text-white">S</span>
        </div>
      </div>
    </div>
  
    {/* Stats Row */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Total Revenue', value: '$142,568', change: '+8.2%', color: 'text-green-400', icon: <DollarSign className="h-4 w-4" /> },
        { label: 'Expenses', value: '$58,623', change: '-3.1%', color: 'text-green-400', icon: <TrendingDown className="h-4 w-4" /> },
        { label: 'Invoices', value: '36', change: '+12', color: 'text-blue-400', icon: <FileText className="h-4 w-4" /> },
        { label: 'Clients', value: '24', change: '+3', color: 'text-blue-400', icon: <Users className="h-4 w-4" /> }
      ].map((stat, index) => (
        <div key={index} className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/5 p-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-white/60">{stat.label}</p>
              <p className="text-lg font-bold text-white mt-1">{stat.value}</p>
            </div>
            <div className={`h-7 w-7 rounded-full ${index % 2 === 0 ? 'bg-green-500/20' : 'bg-blue-500/20'} flex items-center justify-center`}>
              <span className={`${index % 2 === 0 ? 'text-green-400' : 'text-blue-400'}`}>
                {stat.icon}
              </span>
            </div>
          </div>
          <p className={`text-xs mt-2 flex items-center ${stat.color}`}>
            {stat.change.startsWith('+') ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  </>
);

const TransactionsContent = () => (
  <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/5 p-4">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-medium text-white">Recent Transactions</h3>
      <Badge variant="outline" className="text-xs border-white/10 cursor-pointer hover:bg-white/5">Add New</Badge>
    </div>
    
    <div className="space-y-3">
      {[
        { name: 'Client A Project', amount: '+$3,200', date: 'Today, 10:25 AM', type: 'income' },
        { name: 'Office Rent', amount: '-$1,800', date: 'Yesterday, 3:45 PM', type: 'expense' },
        { name: 'Client B Retainer', amount: '+$2,400', date: '2 days ago, 11:30 AM', type: 'income' },
        { name: 'Software Subscription', amount: '-$99', date: '3 days ago, 9:15 AM', type: 'expense' },
        { name: 'Client C Project', amount: '+$5,600', date: '5 days ago, 2:30 PM', type: 'income' },
      ].map((transaction, index) => (
        <div key={index} className="flex justify-between items-center p-2 hover:bg-white/5 rounded-md cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className={`h-8 w-8 rounded-full ${transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center`}>
              <span className={`${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                {transaction.type === 'income' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{transaction.name}</p>
              <p className="text-xs text-white/60 flex items-center">
                <Clock className="h-3 w-3 mr-1" /> {transaction.date}
              </p>
            </div>
          </div>
          <span className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
            {transaction.amount}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const InvoicesContent = () => (
  <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/5 p-4">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-medium text-white">Recent Invoices</h3>
      <Badge variant="outline" className="text-xs border-white/10 cursor-pointer hover:bg-white/5">Create Invoice</Badge>
    </div>
    
    <div className="space-y-3">
      {[
        { id: 'INV-2024-001', client: 'Acme Corp', amount: '$3,200', status: 'Paid', dueDate: '10/05/2024' },
        { id: 'INV-2024-002', client: 'TechStart Inc', amount: '$1,800', status: 'Pending', dueDate: '15/05/2024' },
        { id: 'INV-2024-003', client: 'Global Services', amount: '$4,500', status: 'Overdue', dueDate: '01/05/2024' },
        { id: 'INV-2024-004', client: 'Design Partners', amount: '$2,750', status: 'Draft', dueDate: '20/05/2024' },
      ].map((invoice, index) => (
        <div key={index} className="flex justify-between items-center p-2 hover:bg-white/5 rounded-md cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-400">
                <FileText className="h-4 w-4" />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{invoice.client}</p>
              <p className="text-xs text-white/60">{invoice.id}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-white">{invoice.amount}</p>
            <div className="flex items-center space-x-2">
              <Badge variant={
                invoice.status === 'Paid' ? 'success' : 
                invoice.status === 'Pending' ? 'warning' : 
                invoice.status === 'Overdue' ? 'destructive' : 'outline'
              } 
              className="text-[10px]">{invoice.status}</Badge>
              <span className="text-[10px] text-white/60">{invoice.dueDate}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ExpensesContent = () => (
  <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/5 p-4">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-medium text-white">Recent Expenses</h3>
      <Badge variant="outline" className="text-xs border-white/10 cursor-pointer hover:bg-white/5">Add Expense</Badge>
    </div>
    
    <div className="space-y-3">
      {[
        { name: 'Office Rent', category: 'Facilities', amount: '$1,800', date: '01/05/2024' },
        { name: 'Software Subscriptions', category: 'Software', amount: '$350', date: '03/05/2024' },
        { name: 'Team Lunch', category: 'Meals', amount: '$120', date: '06/05/2024' },
        { name: 'Marketing Campaign', category: 'Marketing', amount: '$750', date: '07/05/2024' },
      ].map((expense, index) => (
        <div key={index} className="flex justify-between items-center p-2 hover:bg-white/5 rounded-md cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-red-400">
                <TrendingDown className="h-4 w-4" />
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{expense.name}</p>
              <p className="text-xs text-white/60">{expense.category}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-red-400">-{expense.amount}</p>
            <p className="text-[10px] text-white/60">{expense.date}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ReportsContent = () => (
  <div className="space-y-4">
    <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/5 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-white">Financial Reports</h3>
        <div className="flex space-x-2">
          <Badge variant="outline" className="text-xs border-white/10 cursor-pointer hover:bg-white/5">Monthly</Badge>
          <Badge variant="outline" className="text-xs border-white/10 cursor-pointer hover:bg-white/5">Quarterly</Badge>
          <Badge variant="outline" className="text-xs border-white/10 cursor-pointer hover:bg-white/5">Yearly</Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-black/10 rounded-lg border border-white/5 hover:bg-white/5 cursor-pointer">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-white">Income Statement</span>
          </div>
          <p className="text-xs text-white/60 mt-1">View profit and loss summary</p>
        </div>
        
        <div className="p-3 bg-black/10 rounded-lg border border-white/5 hover:bg-white/5 cursor-pointer">
          <div className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-white">Balance Sheet</span>
          </div>
          <p className="text-xs text-white/60 mt-1">View assets and liabilities</p>
        </div>
        
        <div className="p-3 bg-black/10 rounded-lg border border-white/5 hover:bg-white/5 cursor-pointer">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium text-white">Cash Flow</span>
          </div>
          <p className="text-xs text-white/60 mt-1">Track money movement</p>
        </div>
        
        <div className="p-3 bg-black/10 rounded-lg border border-white/5 hover:bg-white/5 cursor-pointer">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-medium text-white">Tax Summary</span>
          </div>
          <p className="text-xs text-white/60 mt-1">Tax liability overview</p>
        </div>
      </div>
    </div>
  </div>
);

const SettingsContent = () => (
  <div className="space-y-4">
    <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/5 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-white">Account Settings</h3>
      </div>
      
      <div className="space-y-3">
        <div className="p-3 bg-black/10 rounded-lg border border-white/5 hover:bg-white/5 cursor-pointer">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-white">Profile Information</span>
          </div>
          <p className="text-xs text-white/60 mt-1">Manage your personal details</p>
        </div>
        
        <div className="p-3 bg-black/10 rounded-lg border border-white/5 hover:bg-white/5 cursor-pointer">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-white">Preferences</span>
          </div>
          <p className="text-xs text-white/60 mt-1">Customize your experience</p>
        </div>
        
        <div className="p-3 bg-black/10 rounded-lg border border-white/5 hover:bg-white/5 cursor-pointer">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium text-white">Billing</span>
          </div>
          <p className="text-xs text-white/60 mt-1">Manage payment methods</p>
        </div>
      </div>
    </div>
  </div>
);

// Replace these components with a more comprehensive dashboard preview
const DashboardPreview = () => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  
  React.useEffect(() => {
    console.log('DashboardPreview mounted, tabs should be interactive');
    // Log the initial active tab
    console.log('Initial active tab:', activeTab);
  }, []);
  
  const handleTabClick = (tabName) => {
    console.log('Tab clicked:', tabName);
    setActiveTab(tabName);
  };
  
  // Generate random data for charts
  const generateRandomData = (min, max, count) => {
    return Array.from({ length: count }, () => 
      Math.floor(Math.random() * (max - min + 1) + min)
    );
  };

  const barChartData = generateRandomData(40, 95, 6);
  const lineChartData1 = [60, 55, 70, 40, 50, 70, 65, 75, 50, 80, 75, 65];
  const lineChartData2 = [40, 45, 55, 70, 65, 60, 70, 65, 60, 50, 55, 60];
  
  const donutChartData = [65, 25, 10]; // Percentages
  const donutColors = ['#4ADE80', '#3B82F6', '#F43F5E'];
  const donutLabels = ['Income', 'Expenses', 'Savings'];

  // Calculate total length of the donut chart circumference
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  
  // Create start positions for each segment
  let cumulativePercent = 0;
  const donutSegments = donutChartData.map((percent, i) => {
    const segmentLength = (percent / 100) * circumference;
    const startPosition = cumulativePercent;
    cumulativePercent += segmentLength;
    
    return {
      percent,
      color: donutColors[i],
      label: donutLabels[i],
      dasharray: `${segmentLength} ${circumference}`,
      dashoffset: -startPosition
    };
  });
  
  // Define tabs data for easier mapping
  const tabsData = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'invoices', label: 'Invoices', icon: <FileText className="h-4 w-4" /> },
    { id: 'expenses', label: 'Expenses', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart2 className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> }
  ];

  // Render content based on active tab
  const renderTabContent = () => {
    console.log('Rendering content for tab:', activeTab);
    
    // Add animation wrapper
    const AnimatedContent = ({ children }) => (
      <div className="animate-fadeIn transition-all duration-300 ease-in-out">
        {children}
      </div>
    );
    
    switch(activeTab) {
      case 'dashboard':
        return <AnimatedContent><DashboardContent /></AnimatedContent>;
      case 'transactions':
        return <AnimatedContent><TransactionsContent /></AnimatedContent>;
      case 'invoices':
        return <AnimatedContent><InvoicesContent /></AnimatedContent>;
      case 'expenses':
        return <AnimatedContent><ExpensesContent /></AnimatedContent>;
      case 'reports':
        return <AnimatedContent><ReportsContent /></AnimatedContent>;
      case 'settings':
        return <AnimatedContent><SettingsContent /></AnimatedContent>;
      default:
        return <AnimatedContent><DashboardContent /></AnimatedContent>;
    }
  };

  return (
    <div className="w-full rounded-xl overflow-hidden bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl">
      {/* Dashboard Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-black/50 to-black/30 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
        </div>
        <div className="text-sm font-medium text-white/80">FiscalFusion Dashboard</div>
        <div className="text-xs text-white/60">v1.0.2</div>
      </div>
      
      {/* Dashboard Content */}
      <div className="grid md:grid-cols-12 gap-4 p-4">
        {/* Sidebar Navigation */}
        <div className="md:col-span-3 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 p-3 shadow-lg">
          <div className="flex flex-col space-y-3">
            <div className="mb-4 px-2">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary/30 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                  FiscalFusion
                </span>
              </div>
            </div>
            
            {tabsData.map((tab) => (
              <div 
                key={tab.id}
                className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-primary/20 border-l-2 border-primary' 
                    : 'hover:bg-white/10 hover:border-l-2 hover:border-white/30 border-l-2 border-transparent'
                }`}
                onClick={() => handleTabClick(tab.id)}
              >
                <div className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors duration-200 ${
                  activeTab === tab.id ? 'bg-primary/30' : 'bg-white/10'
                }`}>
                  <span className={`transition-colors duration-200 ${
                    activeTab === tab.id ? 'text-primary animate-pulse' : 'text-white/70'
                  }`}>
                    {tab.icon}
                  </span>
                </div>
                <span className={`text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id ? 'text-white' : 'text-white/70'
                } cursor-pointer`}>{tab.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="md:col-span-9 space-y-4">
          <div className="min-h-[400px] w-full bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 shadow-md p-4">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export function HeroSection({
  badge,
  title,
  description,
  actions,
  image,
}) {
  return (
    <section
      className={cn(
        "relative bg-black/30 backdrop-blur-md text-foreground",
        "py-12 sm:py-24 md:py-32 px-4",
        "fade-bottom overflow-hidden border-b border-white/5"
      )}
    >
      <div className="mx-auto flex max-w-container flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {/* Badge */}
          {badge && (
            <Badge variant="outline" className="animate-appear gap-2 bg-black/30 backdrop-blur-sm border-white/10">
              <span className="text-white">{badge.text}</span>
              {badge.action && (
                <a href={badge.action.href} className="flex items-center gap-1">
                  {badge.action.text}
                  <ArrowRightIcon className="h-3 w-3" />
                </a>
              )}
            </Badge>
          )}

          {/* Title */}
          <h1 className="relative z-10 inline-block animate-appear text-4xl font-semibold leading-tight text-white drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-7xl md:leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-md relative z-10 max-w-[550px] animate-appear font-medium text-white/80 opacity-0 delay-100 sm:text-xl">
            {description}
          </p>

          {/* Actions */}
          <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300">
            {actions.map((action, index) => (
              <Button 
                key={index} 
                variant={action.variant || "default"} 
                size="lg" 
                className={cn(
                  index === 0 ? "bg-primary text-white hover:bg-primary/90" : "bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 text-white"
                )}
                asChild
              >
                <a href={action.href} className="flex items-center gap-2">
                  {action.text}
                  {action.icon}
                </a>
              </Button>
            ))}
          </div>

          {/* Floating Graphics */}
          <div className="relative pt-12 w-full max-w-5xl mx-auto">
            <MockupFrame className="animate-appear opacity-0 delay-700 bg-black/30 backdrop-blur-md border-white/10">
              <DashboardPreview />
            </MockupFrame>
            <Glow variant="top" className="animate-appear-zoom opacity-0 delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HeroSectionDemo() {
  return (
    <HeroSection
      badge={{
        text: "Next-gen financial platform",
      }}
      title="Financial Management Made Simple"
      description="FiscalFusion offers powerful tools with an intuitive interface and affordable pricing designed for growing businesses."
      actions={[
        {
          text: "Start Free Trial",
          href: "/register",
          variant: "default",
        },
        {
          text: "Explore Features",
          href: "/features",
          variant: "outline",
        },
      ]}
    />
  );
} 