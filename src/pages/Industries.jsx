import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { industries } from '../data/industries';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Industries() {
  return (
    <PageWrapper>
      {/* Editorial Hero */}
      <section className="bg-[#FFFFFF] py-10 md:py-12 lg:py-14 border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EEF3FF] border border-[#C9D7F5] text-[11px] font-mono font-bold tracking-wide text-[#0B1220] mb-4 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF]"></span>
              <span>DOMAIN SPECIALIZATION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.15] mb-4">
              Industry-Specific Software Architecture & Compliance
            </h1>

            <p className="text-base sm:text-lg text-[#2B384E] leading-relaxed">
              We build specialized platforms tailored to the regulatory, transactional, and operational realities of specific commercial sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Showcase */}
      <section className="py-10 md:py-12 lg:py-14 bg-[#F1F4F8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="space-y-5">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <div 
                  key={industry.id}
                  className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-6 md:p-7 hover:border-[#BFDBFE] hover:bg-[#F8FAFF] hover:shadow-[0_4px_20px_rgba(17,24,39,0.06)] transition-all duration-200 text-left shadow-[0_4px_20px_rgba(17,24,39,0.04)] group"
                >
                  <div className="grid lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Industry Overview & Problem/Solution (5 cols) */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#1677FF] shadow-2xs">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-[#0B1220] font-bold uppercase tracking-wider">
                            SECTOR 0{index + 1}
                          </span>
                          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">
                            {industry.title}
                          </h2>
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-1 text-xs">
                        <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#E2E7EF]">
                          <span className="font-mono text-[#0B1220] font-bold block mb-0.5">
                            CRITICAL CHALLENGE:
                          </span>
                          <p className="text-xs text-[#2B384E] leading-relaxed">{industry.challenge}</p>
                        </div>

                        <div className="p-3.5 rounded-lg bg-[#FFFFFF] border border-[#E2E7EF]">
                          <span className="font-mono text-[#0B1220] font-bold block mb-0.5">
                            ENGINEERED SOLUTION:
                          </span>
                          <p className="text-xs text-[#2B384E] leading-relaxed">{industry.solution}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Technical Features, Outcomes & Deployments (7 cols) */}
                    <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5 bg-[#F7F8FA] p-6 rounded-lg border border-[#E2E7EF] shadow-2xs">
                      <div>
                        <h3 className="text-xs font-mono uppercase text-[#0B1220] font-bold tracking-wider mb-2.5">
                          Technical Capabilities
                        </h3>
                        <div className="space-y-1.5">
                          {industry.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-[#2B384E]">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#0B1220] group-hover:text-[#1677FF] shrink-0 transition-colors duration-200" />
                              <span className="group-hover:text-[#1677FF] transition-colors duration-200">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-mono uppercase text-[#0B1220] font-bold tracking-wider mb-2.5">
                          Measurable Benefits
                        </h3>
                        <div className="space-y-1.5">
                          {industry.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-[#2B384E]">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#0B1220] group-hover:text-[#1677FF] shrink-0 transition-colors duration-200" />
                              <span className="group-hover:text-[#1677FF] transition-colors duration-200">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="sm:col-span-2 pt-3.5 border-t border-[#E8ECF2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-[#2B384E]">
                          <span className="font-mono text-[10px] text-[#0B1220] font-bold">REPRESENTATIVE:</span>
                          <span className="text-[#0B1220] font-semibold">{industry.examples.join(', ')}</span>
                        </div>

                        <Link
                          to="/contact"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200"
                        >
                          <span>Request Sector Scope</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

export default Industries;
