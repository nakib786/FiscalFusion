import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  DocumentReportIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/outline';

const features = [
  {
    title: 'Expense Tracking',
    description: 'Easily log and categorize all your expenses in one centralized dashboard.',
    icon: CurrencyDollarIcon,
  },
  {
    title: 'Budgeting Tools',
    description: 'Create and manage detailed budgets with smart recommendations based on your spending habits.',
    icon: ChartBarIcon,
  },
  {
    title: 'Financial Reports',
    description: 'Generate comprehensive reports with visualizations to gain insights into your financial patterns.',
    icon: DocumentReportIcon,
  },
  {
    title: 'Bill Reminders',
    description: 'Never miss a payment with automated bill reminders and scheduled payment tracking.',
    icon: CalendarIcon,
  },
  {
    title: 'Multi-User Access',
    description: 'Share financial management with family members or team members with customizable permissions.',
    icon: UserGroupIcon,
  },
  {
    title: 'Secure Encryption',
    description: 'Rest easy knowing your financial data is protected with enterprise-grade security.',
    icon: ShieldCheckIcon,
  },
];

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl hover:shadow-blue-900/10 hover:border-gray-600 transition-all duration-300"
    >
      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
        <feature.icon className="w-6 h-6 text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
      <p className="text-gray-400">{feature.description}</p>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-transparent to-gray-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Powerful Features for Complete <span className="text-blue-400">Financial Control</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Everything you need to manage your finances efficiently in one integrated platform.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 