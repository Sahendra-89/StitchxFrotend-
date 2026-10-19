import React from 'react';
import { Hero } from '../components/home/Hero';
import { TechMarqueeRibbon } from '../components/home/TechMarqueeRibbon';
import { ServicesSection } from '../components/home/ServicesSection';
import { AboutPreview } from '../components/home/AboutPreview';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { PortfolioPreview } from '../components/home/PortfolioPreview';
import { IndustriesPreview } from '../components/home/IndustriesPreview';
import { WorkProcess } from '../components/home/WorkProcess';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { PageWrapper } from '../components/layout/PageWrapper';

export function Home() {
  return (
    <PageWrapper>
      <Hero />
      <TechMarqueeRibbon />
      <ServicesSection />
      <AboutPreview />
      <WhyChooseUs />
      <PortfolioPreview />
      <IndustriesPreview />
      <WorkProcess />
      <TestimonialsSection />
</PageWrapper>
  );
}
