import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionHeader } from '../components/common/SectionHeader';
import { Target, Eye, Lightbulb, Shield, Award, BookOpen, MapPin, Terminal } from 'lucide-react';

const principles = [
  {
    icon: Lightbulb,
    title: 'Architectural Pragmatism',
    description: 'We prioritize battle-tested, maintainable technology over fleeting industry hype to deliver dependable systems.'
  },
  {
    icon: Shield,
    title: 'Security & Integrity',
    description: 'Zero compromises on data security, environment isolation, clean secrets management, and transparent pricing.'
  },
  {
    icon: Award,
    title: 'Engineering Craftsmanship',
    description: 'Clean typed codebases, comprehensive unit tests, and thorough documentation on every single pull request.'
  },
  {
    icon: Target,
    title: 'Commercial Accountability',
    description: 'We tie our engineering success directly to your operational velocity, user retention, and business growth.'
  },
  {
    icon: BookOpen,
    title: 'Continuous Optimization',
    description: 'Relentless profiling of bundle sizes, database query performance, and infrastructure cost efficiency.'
  },
  {
    icon: Terminal,
    title: 'Direct Senior Communication',
    description: 'No sales account buffers. You collaborate directly with experienced engineers who design and build your product.'
  },
];

export function About() {
  return (
    <PageWrapper>
      {/* Editorial Hero */}
      <section className="bg-[#FFFFFF] py-10 md:py-12 lg:py-14 border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EEF3FF] border border-[#C9D7F5] text-xs font-mono font-bold tracking-wider text-[#0B1220] mb-4 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF]"></span>
              <span>ABOUT STITCHX GLOBAL TECHNOLOGY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.15] mb-4">
              A Software Engineering Studio Built on Precision & Accountability
            </h1>

            <p className="text-base sm:text-lg text-[#2B384E] leading-relaxed">
              We design, build, and support production-grade digital systems. From high-throughput web applications to native mobile software and automated workflow platforms, we help ambitious businesses turn complex ideas into resilient technology.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Studio Heritage */}
      <section className="py-10 md:py-12 lg:py-14 bg-[#F1F4F8] border-b border-[#E2E7EF]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="text-xs font-mono text-[#0B1220] font-bold tracking-wider uppercase block">
                OUR PHILOSOPHY & STORY
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight">
                Why We Built StitchX Global Technology Differently
              </h2>

              <p className="text-sm sm:text-base text-[#2B384E] leading-relaxed">
                Too often, digital projects suffer when software development is treated as an assembly line of generic templates, passed between non-technical intermediaries and disconnected junior teams.
              </p>

              <p className="text-sm sm:text-base text-[#2B384E] leading-relaxed">
                StitchX Global Technology was founded on a simple principle: build small, senior, focused engineering squads who take direct responsibility for system architecture, data integrity, and user experience.
              </p>

              <p className="text-sm sm:text-base text-[#2B384E] leading-relaxed">
                Headquartered at Unitech Cyber Park in Gurugram, India, our team partners with ambitious startups and established mid-market enterprises across healthcare, finance, logistics, and retail to build software that scales reliably under real-world usage.
              </p>

              <div className="pt-1 flex items-center gap-2 text-xs font-mono font-medium text-[#2B384E]">
                <MapPin className="h-3.5 w-3.5 text-[#1677FF]" />
                <span>Sector 39, Gurugram, Haryana, India • Global Client Delivery</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-6 sm:p-7 text-left space-y-5 shadow-[0_4px_20px_rgba(11,18,32,0.04)]">
                <h3 className="text-sm font-bold text-[#0B1220] font-mono border-b border-[#E2E7EF] pb-3 uppercase tracking-wider">
                  STUDIO SPECIFICATIONS
                </h3>

                <div className="space-y-1 text-xs font-mono">
                  <div className="group flex justify-between py-2 px-2.5 rounded-md hover:bg-[#F8FAFF] hover:border-[#BFDBFE] border border-transparent transition-all duration-200">
                    <span className="text-[#0B1220] font-bold group-hover:text-[#1677FF] transition-colors duration-200">CORE STACK</span>
                    <span className="text-[#0B1220] font-bold">React, Node, Python, Flutter, Postgres</span>
                  </div>
                  <div className="group flex justify-between py-2 px-2.5 rounded-md hover:bg-[#F8FAFF] hover:border-[#BFDBFE] border border-transparent transition-all duration-200">
                    <span className="text-[#0B1220] font-bold group-hover:text-[#1677FF] transition-colors duration-200">DELIVERY MODEL</span>
                    <span className="text-[#0B1220] font-bold group-hover:text-[#1677FF] transition-colors duration-200">Agile Sprints with Weekly Previews</span>
                  </div>
                  <div className="group flex justify-between py-2 px-2.5 rounded-md hover:bg-[#F8FAFF] hover:border-[#BFDBFE] border border-transparent transition-all duration-200">
                    <span className="text-[#0B1220] font-bold group-hover:text-[#1677FF] transition-colors duration-200">INTELLECTUAL PROPERTY</span>
                    <span className="text-[#0B1220] font-bold group-hover:text-[#1677FF] transition-colors duration-200">100% Client Code & Repo Ownership</span>
                  </div>
                  <div className="group flex justify-between py-2 px-2.5 rounded-md hover:bg-[#F8FAFF] hover:border-[#BFDBFE] border border-transparent transition-all duration-200">
                    <span className="text-[#0B1220] font-bold group-hover:text-[#1677FF] transition-colors duration-200">QUALITY BENCHMARK</span>
                    <span className="text-[#0B1220] font-bold">Automated CI/CD Test Coverage</span>
                  </div>
                  <div className="group flex justify-between py-2 px-2.5 rounded-md hover:bg-[#F8FAFF] hover:border-[#BFDBFE] border border-transparent transition-all duration-200">
                    <span className="text-[#0B1220] font-bold group-hover:text-[#1677FF] transition-colors duration-200">HEADQUARTERS</span>
                    <span className="text-[#0B1220] font-bold">Gurugram, Haryana (NCR)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-10 md:py-12 lg:py-14 bg-[#F7F8FA] border-b border-[#E2E7EF]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-6 text-left">
            
            <div className="group rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-6 md:p-7 space-y-3 shadow-[0_4px_20px_rgba(11,18,32,0.04)] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] transition-all duration-200">
              <div className="h-10 w-10 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#0B1220] group-hover:text-[#1677FF] group-hover:bg-[#FFFFFF] group-hover:border-[#BFDBFE] transition-all duration-200">
                <Target className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">Our Mission</h2>
              <p className="text-sm text-[#2B384E] leading-relaxed">
                To engineer secure, scalable, and maintainable software that eliminates operational bottlenecks, simplifies complex workflows, and supports our clients' long-term business goals.
              </p>
            </div>

            <div className="group rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-6 md:p-7 space-y-3 shadow-[0_4px_20px_rgba(11,18,32,0.04)] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] transition-all duration-200">
              <div className="h-10 w-10 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#0B1220] group-hover:text-[#1677FF] group-hover:bg-[#FFFFFF] group-hover:border-[#BFDBFE] transition-all duration-200">
                <Eye className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">Our Vision</h2>
              <p className="text-sm text-[#2B384E] leading-relaxed">
                To be the trusted technology engineering partner for organizations that demand rigorous code quality, transparent collaboration, and verifiable technical delivery.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="pt-10 md:pt-12 lg:pt-14 pb-12 md:pb-14 lg:pb-16 bg-[#EEF2F7]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <SectionHeader
            tag="OPERATING PRINCIPLES"
            title="How We Work & What We Value"
            description="Our engineering culture is governed by clear technical principles that ensure predictable, high-standard execution."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {principles.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-6 space-y-2.5 hover:border-[#BFDBFE] hover:bg-[#F8FAFF] shadow-[0_4px_20px_rgba(11,18,32,0.04)] transition-all duration-200"
                >
                  <div className="h-9 w-9 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#0B1220] group-hover:text-[#1677FF] group-hover:bg-[#FFFFFF] group-hover:border-[#BFDBFE] transition-all duration-200 shadow-2xs">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#2B384E] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

export default About;
