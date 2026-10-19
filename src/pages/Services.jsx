import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { services } from '../data/services';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function Services() {
  return (
    <PageWrapper>
      {/* Editorial Hero */}
      <section className="bg-[#FFFFFF] py-10 md:py-12 lg:py-14 border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EEF3FF] border border-[#C9D7F5] text-xs font-mono font-bold tracking-wider text-[#0B1220] mb-4 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF]"></span>
              <span>ENGINEERING DISCIPLINES</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.15] mb-4">
              End-to-End Software Architecture & Product Engineering
            </h1>

            <p className="text-base sm:text-lg text-[#2B384E] leading-relaxed">
              We design, develop, and maintain custom digital infrastructure. From responsive SaaS frontends and high-concurrency APIs to mobile runtimes and automated workflow engines, every deliverable is built for production reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Services Detailed Grid */}
      <section className="py-10 md:py-12 lg:py-14 bg-[#F1F4F8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="space-y-5">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={service.id}
                  className="group rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-6 md:p-7 hover:border-[#BFDBFE] hover:bg-[#F8FAFF] hover:shadow-[0_6px_24px_rgba(11,18,32,0.06)] transition-all duration-200 text-left shadow-[0_4px_20px_rgba(11,18,32,0.04)]"
                >
                  <div className="grid lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Core Info */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#0B1220] group-hover:text-[#1677FF] group-hover:bg-[#FFFFFF] group-hover:border-[#BFDBFE] transition-all duration-200 shadow-2xs">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-[#596579] font-bold uppercase tracking-wider">
                            SERVICE 0{index + 1}
                          </span>
                          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200 tracking-tight">
                            {service.title}
                          </h2>
                        </div>
                      </div>

                      <p className="text-sm text-[#2B384E] leading-relaxed">
                        {service.description}
                      </p>

                      <div className="pt-2">
                        <h3 className="text-xs font-mono font-bold uppercase text-[#0B1220] tracking-wider mb-2.5">
                          Key Capabilities & Deliverables
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {service.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-[#2B384E] font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#1677FF] shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Technical Specs & Action */}
                    <div className="lg:col-span-5 p-5 rounded-lg bg-[#F8FAFF] border border-[#E2E7EF] group-hover:border-[#BFDBFE] space-y-4 shadow-2xs transition-colors duration-200">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#0B1220] uppercase tracking-wider block mb-1.5">
                          PRIMARY TECH STACK
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {service.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#C9D7F5] text-[11px] font-mono font-medium text-[#2B384E]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#0B1220] uppercase tracking-wider block mb-1.5">
                          EXPECTED BUSINESS IMPACT
                        </span>
                        <div className="space-y-1 text-xs text-[#2B384E] font-medium">
                          {service.benefits.map((benefit, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <span className="h-1 w-1 rounded-full bg-[#1677FF]"></span>
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E8ECF2]">
                        <Link
                          to={`/services/${service.id}`}
                          className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-md bg-[#FFFFFF] border border-[#E2E7EF] group-hover:border-[#BFDBFE] text-xs font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-all duration-200 group/link"
                        >
                          <span>Review Full Architecture & Methodology</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
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

export default Services;
