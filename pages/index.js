import React from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import TestimonialCarousel from '../components/sections/TestimonialCarousel';
import CTASection from '../components/sections/CTASection';
import { Logos3 } from '../components/logos3';

export default function Home() {
  return (
    <Layout title="FiscalFusion | Smart Financial Management">
      <HeroSection />
      <FeaturesSection />
      <Logos3 />
      <TestimonialCarousel />
      <CTASection />
    </Layout>
  );
} 