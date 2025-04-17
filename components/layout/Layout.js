import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedGradientBackground from '../ui/DarkBackground';

const Layout = ({ children, title = 'FiscalFusion | Smart Financial Management' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="FiscalFusion - Your complete financial management solution. Track expenses, manage budgets, generate reports, and more with our intuitive platform." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AnimatedGradientBackground
        startingGap={125}
        breathing={true}
        animationSpeed={0.01}
        breathingRange={3}
        gradientColors={[
          "#050505",  // Darker starting color
          "#0F1754",  // Darker blue
          "#072571",  // Darker navy
          "#0A4B98",  // Darker royal blue
          "#015D93",  // Darker medium blue
          "#00474C",  // Darker teal
          "#003329"   // Darker green
        ]}
        gradientStops={[35, 50, 60, 70, 80, 90, 100]}
        topOffset={0}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </AnimatedGradientBackground>
    </>
  );
};

export default Layout; 