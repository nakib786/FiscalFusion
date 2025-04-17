import React from 'react';
import Head from 'next/head';
import BusinessOverviewLayout from '../components/layout/BusinessOverviewLayout';
import SimpleTransactions from '../components/dashboard/SimpleTransactions';
import CashFlowNav from '../components/dashboard/CashFlowNav';

export default function TransactionsPage() {
  return (
    <>
      <Head>
        <title>Transactions - FiscalFusion</title>
        <meta name="description" content="View and manage your business transactions" />
      </Head>
      
      <BusinessOverviewLayout>
        <div className="bg-transparent backdrop-blur-sm rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h1 className="text-2xl font-semibold mb-4 md:mb-0 text-white">Cash Flow</h1>
          </div>
          
          <CashFlowNav />
          
          <SimpleTransactions />
        </div>
      </BusinessOverviewLayout>
    </>
  );
} 