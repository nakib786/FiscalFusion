import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="w-full py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-30"></div>
      
      {/* Animated shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-700/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-indigo-700/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-8 md:p-12 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Ready to Take Control of Your <span className="text-blue-400">Finances</span>?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Join thousands of users who have transformed their financial management with FiscalFusion. Start your 14-day free trial today.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link href="/auth/signup">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg transition-all duration-200 hover:shadow-blue-500/30 text-lg">
                  Get Started Free
                </button>
              </Link>
              <Link href="/pricing">
                <button className="bg-transparent border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 text-lg">
                  View Pricing
                </button>
              </Link>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 text-gray-400 text-sm"
            >
              No credit card required. Cancel anytime.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 