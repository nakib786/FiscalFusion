import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="w-full py-20 md:py-32 flex flex-col items-center">
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
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/30">
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
        
        {/* Right Content - Dashboard Preview Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full md:w-1/2 relative"
        >
          <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
            <Image 
              src="/images/dashboard-preview.png" 
              alt="FiscalFusion Dashboard Preview"
              width={800}
              height={600}
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 