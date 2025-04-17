import React from 'react';
import Head from 'next/head';
import BusinessOverviewLayout from '../components/layout/BusinessOverviewLayout';
import CashFlow from '../components/dashboard/CashFlow';

export default function CashFlowPage() {
  return (
    <>
      <Head>
        <title>Cash Flow - FiscalFusion</title>
        <meta name="description" content="Track and manage your business cash flow" />
      </Head>
      
      <BusinessOverviewLayout>
        <CashFlow />
      </BusinessOverviewLayout>
    </>
  );
} 