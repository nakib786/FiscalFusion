"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Zap,
  Calendar,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AnimatedAnalytics = () => {
  const [hoveredChart, setHoveredChart] = useState(null);
  const [chartData, setChartData] = useState(generateData());
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  // Loop the chart data animation
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(generateData());
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Update time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  function generateData() {
    // Generate random data for the charts
    return {
      revenue: Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 20),
      expenses: Array.from({ length: 12 }, () => Math.floor(Math.random() * 60) + 10),
      profit: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 30),
      stocks: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
      distribution: [
        { name: "Product A", value: Math.floor(Math.random() * 40) + 10 },
        { name: "Product B", value: Math.floor(Math.random() * 30) + 15 },
        { name: "Product C", value: Math.floor(Math.random() * 20) + 20 },
      ]
    };
  }
  
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-2">Real-time Analytics</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Financial Insights</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Monitor your company's financial performance with real-time data visualization 
            and actionable insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Performance Chart */}
          <motion.div 
            className="relative bg-black/40 backdrop-blur-md border border-white/5 p-5 rounded-xl shadow-lg overflow-hidden"
            whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.15)" }}
            onHoverStart={() => setHoveredChart("revenue")}
            onHoverEnd={() => setHoveredChart(null)}
          >
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-white">Revenue Performance</h3>
              </div>
              <Badge variant="outline" className="border-white/10 text-white/80 text-xs">
                <Clock className="h-3 w-3 mr-1" /> Live
              </Badge>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-white/60 text-sm">Today's Revenue</p>
                <motion.p 
                  className="text-2xl font-bold text-white"
                  key={chartData.revenue.reduce((a, b) => a + b, 0)}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  ${(chartData.revenue.reduce((a, b) => a + b, 0) * 100).toLocaleString()}
                </motion.p>
              </div>
              <motion.div 
                className="flex items-center text-green-400 text-sm"
                animate={{ 
                  y: [0, -5, 0],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+{Math.floor(Math.random() * 5) + 3}.2%</span>
              </motion.div>
            </div>
            
            <div className="h-56 flex items-end space-x-1">
              {chartData.revenue.map((value, index) => (
                <motion.div 
                  key={`revenue-${index}-${value}`} 
                  className="relative flex-1 group"
                  initial={{ height: 0 }}
                  animate={{ height: `${value}%` }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.05,
                  }}
                >
                  <div 
                    className={`w-full rounded-t-sm ${hoveredChart === "revenue" ? "bg-primary" : "bg-primary/70"} transition-all duration-300`}
                    style={{ height: '100%' }}
                  />
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${value * 100}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between text-white/50 text-xs">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </motion.div>
  
          {/* Profit & Loss Chart */}
          <motion.div 
            className="relative bg-black/40 backdrop-blur-md border border-white/5 p-5 rounded-xl shadow-lg overflow-hidden"
            whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.15)" }}
            onHoverStart={() => setHoveredChart("profit")}
            onHoverEnd={() => setHoveredChart(null)}
          >
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-green-500/10">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="font-semibold text-white">Profit & Loss</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-900/40 text-green-400 text-xs">Profit</Badge>
                <Badge className="bg-red-900/40 text-red-400 text-xs">Loss</Badge>
              </div>
            </div>
            
            <div className="flex space-x-6 mb-3">
              <div>
                <p className="text-white/60 text-sm">Net Profit</p>
                <motion.p 
                  className="text-2xl font-bold text-white"
                  key={`profit-${chartData.profit.reduce((a, b) => a + b, 0)}`}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  ${(chartData.profit.reduce((a, b) => a + b, 0) * 120).toLocaleString()}
                </motion.p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Total Expenses</p>
                <motion.p 
                  className="text-2xl font-bold text-white"
                  key={`expense-${chartData.expenses.reduce((a, b) => a + b, 0)}`}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  ${(chartData.expenses.reduce((a, b) => a + b, 0) * 80).toLocaleString()}
                </motion.p>
              </div>
            </div>
            
            <div className="h-56 relative mb-2">
              {/* Background grid */}
              <div className="absolute inset-0 grid grid-rows-5 h-full w-full">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border-t border-white/5 relative">
                    <span className="absolute -top-2.5 -left-5 text-white/40 text-[10px]">
                      ${(5-i) * 20}k
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Chart lines */}
              <motion.svg
                className="absolute inset-0 h-full w-full overflow-visible"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Profit Line */}
                <motion.path
                  d={`M 0 ${100 - chartData.profit[0]} ${chartData.profit.map((value, i) => (
                    `L ${(i+1) * (100 / (chartData.profit.length - 1))} ${100 - value}`
                  )).join(' ')}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: 1,
                    stroke: hoveredChart === "profit" ? "#34d399" : "#10b981" 
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                />
                
                {/* Expense Line */}
                <motion.path
                  d={`M 0 ${100 - chartData.expenses[0]} ${chartData.expenses.map((value, i) => (
                    `L ${(i+1) * (100 / (chartData.expenses.length - 1))} ${100 - value}`
                  )).join(' ')}`}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: 1,
                    stroke: hoveredChart === "profit" ? "#f87171" : "#ef4444"
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                />
                
                {/* Data points for profit */}
                {chartData.profit.map((value, i) => (
                  <motion.circle
                    key={`point-profit-${i}-${value}`}
                    cx={`${i * (100 / (chartData.profit.length - 1))}`}
                    cy={`${100 - value}`}
                    r="1.5"
                    fill="#10b981"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: hoveredChart === "profit" ? 1.5 : 1,
                      fill: hoveredChart === "profit" ? "#34d399" : "#10b981"
                    }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                ))}
                
                {/* Data points for expenses */}
                {chartData.expenses.map((value, i) => (
                  <motion.circle
                    key={`point-expense-${i}-${value}`}
                    cx={`${i * (100 / (chartData.expenses.length - 1))}`}
                    cy={`${100 - value}`}
                    r="1.5"
                    fill="#ef4444"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: hoveredChart === "profit" ? 1.5 : 1,
                      fill: hoveredChart === "profit" ? "#f87171" : "#ef4444"
                    }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                ))}
              </motion.svg>
            </div>
            
            <div className="flex justify-between">
              <div className="flex items-center text-white/60 text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Last 12 months</span>
              </div>
              <div className="text-white/60 text-xs">{currentTime}</div>
            </div>
          </motion.div>
  
          {/* Market Performance */}
          <motion.div 
            className="relative bg-black/40 backdrop-blur-md border border-white/5 p-5 rounded-xl shadow-lg overflow-hidden"
            whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.15)" }}
            onHoverStart={() => setHoveredChart("market")}
            onHoverEnd={() => setHoveredChart(null)}
          >
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <Zap className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-semibold text-white">Market Performance</h3>
              </div>
              <Badge variant="outline" className="border-white/10 text-white/80 text-xs">
                <Clock className="h-3 w-3 mr-1" /> Real-time
              </Badge>
            </div>
            
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-white/60 text-sm">NASDAQ</p>
                <div className="flex items-center">
                  <motion.p 
                    className="text-xl font-bold text-white mr-2"
                    key={`nasdaq-${Date.now()}`}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    14,{Math.floor(Math.random() * 900) + 100}
                  </motion.p>
                  <motion.div 
                    className="flex items-center text-green-400 text-xs"
                    animate={{ 
                      y: [0, -3, 0],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+{(Math.random() * 2 + 0.1).toFixed(2)}%</span>
                  </motion.div>
                </div>
              </div>
              
              <div>
                <p className="text-white/60 text-sm">S&P 500</p>
                <div className="flex items-center">
                  <motion.p 
                    className="text-xl font-bold text-white mr-2"
                    key={`sp500-${Date.now()}`}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    4,{Math.floor(Math.random() * 900) + 100}
                  </motion.p>
                  <motion.div 
                    className="flex items-center text-red-400 text-xs"
                    animate={{ 
                      y: [0, 3, 0],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 1.8,
                      ease: "easeInOut"
                    }}
                  >
                    <TrendingDown className="h-3 w-3 mr-1" />
                    <span>-{(Math.random() * 1 + 0.1).toFixed(2)}%</span>
                  </motion.div>
                </div>
              </div>
              
              <div>
                <p className="text-white/60 text-sm">FFUS</p>
                <div className="flex items-center">
                  <motion.p 
                    className="text-xl font-bold text-white mr-2"
                    key={`ffus-${Date.now()}`}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    ${(Math.random() * 100 + 300).toFixed(2)}
                  </motion.p>
                  <motion.div 
                    className="flex items-center text-green-400 text-xs"
                    animate={{ 
                      y: [0, -3, 0],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut"
                    }}
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+{(Math.random() * 5 + 1).toFixed(2)}%</span>
                  </motion.div>
                </div>
              </div>
            </div>
            
            <div className="h-32 relative mb-4 overflow-hidden">
              <motion.svg
                className="absolute inset-0 h-full w-full overflow-visible"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Stock price line */}
                <motion.path
                  d={`M 0 ${100 - chartData.stocks[0]} ${chartData.stocks.map((value, i) => (
                    `L ${(i+1) * (100 / (chartData.stocks.length - 1))} ${100 - value}`
                  )).join(' ')}`}
                  fill="none"
                  stroke="url(#stockGradient)"
                  strokeWidth="3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: 1,
                    strokeWidth: hoveredChart === "market" ? 4 : 3
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
                
                <defs>
                  <linearGradient id="stockGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                
                {/* Area under the line */}
                <motion.path
                  d={`M 0 ${100 - chartData.stocks[0]} ${chartData.stocks.map((value, i) => (
                    `L ${(i+1) * (100 / (chartData.stocks.length - 1))} ${100 - value}`
                  )).join(' ')} L 100 100 L 0 100 Z`}
                  fill="url(#areaGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredChart === "market" ? 0.3 : 0.15 }}
                  transition={{ duration: 0.5 }}
                />
                
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </motion.svg>
              
              {/* Animated dots moving along the line */}
              {hoveredChart === "market" && (
                <motion.div
                  className="absolute h-2.5 w-2.5 rounded-full bg-blue-400 shadow-glow"
                  initial={{ left: "0%", top: `${100 - chartData.stocks[0]}%` }}
                  animate={{
                    left: "100%",
                    top: `${100 - chartData.stocks[chartData.stocks.length - 1]}%`,
                    pathOffset: [0, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}
            </div>
  
            <div className="grid grid-cols-3 gap-3">
              {chartData.distribution.map((item, index) => (
                <motion.div
                  key={`dist-${index}`}
                  className="bg-black/20 rounded-lg p-3 border border-white/5"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.3)" }}
                >
                  <p className="text-white/70 text-xs mb-1">{item.name}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-white">
                      ${(item.value * 100).toLocaleString()}
                    </p>
                    <Badge className={`text-xs ${index === 0 ? 'bg-blue-900/30 text-blue-400' : index === 1 ? 'bg-purple-900/30 text-purple-400' : 'bg-cyan-900/30 text-cyan-400'}`}>
                      {item.value}%
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 10px 2px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </section>
  );
};

export default AnimatedAnalytics; 