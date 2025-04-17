import React from "react";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, TrendingUp, DollarSign, ReceiptText, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} FeatureItemProps
 * @property {React.ReactNode} icon
 * @property {string} title
 * @property {string} description
 */

/**
 * @param {FeatureItemProps} props
 */
function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-lg border border-white/5 bg-black/10 backdrop-blur-sm hover:bg-black/20 transition-all hover:shadow-md">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-medium text-white">{title}</h3>
        <p className="text-white/70">{description}</p>
      </div>
    </div>
  );
}

/**
 * @typedef {Object} FinancialFeaturesProps
 * @property {string} [title]
 * @property {string} [description]
 */

/**
 * @param {FinancialFeaturesProps} props
 */
function FinancialFeatures({
  title = "Comprehensive Financial Tools",
  description = "FiscalFusion provides all the essential financial management features with modern improvements for a seamless experience."
}) {
  const features = [
    {
      icon: <ReceiptText className="w-6 h-6" />,
      title: "Invoicing & Billing",
      description: "Create professional invoices, track payment status, and send automated reminders with our intuitive workflow management system."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Expense Tracking",
      description: "Automatically categorize and track expenses with AI-powered recognition, making tax season easier with flexible reporting options."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Financial Reporting",
      description: "Generate comprehensive profit & loss statements, balance sheets, and cash flow reports with beautiful visualizations and insights."
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Tax Preparation",
      description: "Export tax-ready reports and identify potential deductions with our smart tax optimization tools to maximize your savings."
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Payroll Management",
      description: "Process payroll, calculate taxes, and handle direct deposits with reliability at an affordable price point for businesses of all sizes."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Financial Forecasting",
      description: "Leverage AI-powered forecasting tools that analyze your financial data to predict cash flow and identify growth opportunities."
    }
  ];

  return (
    <div className="w-full py-20 lg:py-32">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-12">
          <div className="text-center max-w-2xl mx-auto">
            <Badge className="mb-4">Advanced Financial Suite</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {features.map((feature, index) => (
              <FeatureItem
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FinancialFeaturesDemo() {
  return <FinancialFeatures />;
} 