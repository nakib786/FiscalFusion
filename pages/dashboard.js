import React from 'react';
import Head from 'next/head';
import BusinessOverviewLayout from '../components/layout/BusinessOverviewLayout';
import BusinessOverview from '../components/dashboard/BusinessOverview';

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Business Overview - FiscalFusion</title>
        <meta name="description" content="View your business financial overview and key metrics" />
      </Head>
      
      <BusinessOverviewLayout>
        <BusinessOverview />
      </BusinessOverviewLayout>
    </>
  );
} 