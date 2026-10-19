import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Terminal, Shield, GitCommit, FileText } from 'lucide-react';

export function AboutPreview() {
  const specs = [
    { label: "PRIMARY STACK", value: "React 19, Node.js, Python, Flutter, PostgreSQL", icon: Terminal },
    { label: "DELIVERY MODEL", value: "Agile Sprints with Weekly Working Previews", icon: GitCommit },
    { label: "IP ASSIGNMENT", value: "100% Code & Infrastructure Client Ownership", icon: Shield },
    { label: "DOCUMENTATION", value: "Comprehensive API Specs & Architecture Blueprints", icon: FileText },
  ];

  return (
    <section className="py-10 md:py-12 lg:py-14 bg-[#F7F8FA] border-b border-[#E2E7EF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Narrative */}
          <div className="lg:col-span-6 space-y-4 text-left">
           

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B1220] leading-snug">
              Software Engineered for Long-Term Resilience, Not Short-Term Hype
            </h2>

            <p className="text-sm sm:text-base text-[#2B384E] leading-relaxed">
              At StitchX Global Technology, we treat software development as an exact engineering discipline rather than a creative gamble. Based at Unitech Cyber Park in Gurugram, our senior engineering studio partners with ambitious enterprises and startups to solve high-stakes technical problems.
            </p>

            <p className="text-sm text-[#2B384E] leading-relaxed">
              We focus on modular architectures, thorough test coverage, and intuitive interfaces that serve your users reliably every day.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs font-mono font-medium text-[#2B384E]">
              <MapPin className="h-3.5 w-3.5 text-[#1677FF]" />
              <span>Tower A, Unitech Cyber Park, Sector 39, Gurugram, India</span>
            </div>

            <div className="pt-2 sm:pt-2.5">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFFFFF] border border-[#E2E7EF] text-sm font-bold text-[#0B1220] hover:bg-[#F8FAFF] hover:border-[#BFDBFE] hover:text-[#1677FF] transition-all duration-200 shadow-2xs"
              >
                <span>Read Studio Story & Principles</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Specifications Ledger */}
          <div className="lg:col-span-6">
            <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-6 sm:p-7 shadow-[0_4px_20px_rgba(11,18,32,0.04)] text-left">
              <div className="pb-4 border-b border-[#E2E7EF]">
                <span className="text-xs font-mono font-bold text-[#0B1220] uppercase tracking-wider">
                  STUDIO OPERATING SPECIFICATIONS
                </span>
              </div>

              <div className="divide-y divide-[#E8ECF2] text-xs">
                {specs.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx} 
                      className="group py-3.5 px-3 rounded-lg border border-transparent hover:border-[#BFDBFE] hover:bg-[#F8FAFF] transition-all duration-200 flex items-start justify-between gap-3.5 cursor-default"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="h-8 w-8 rounded-md bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#0B1220] group-hover:text-[#1677FF] group-hover:bg-[#FFFFFF] group-hover:border-[#BFDBFE] transition-all duration-200 shrink-0 mt-0.5">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-[11px] font-mono font-bold text-[#0B1220] group-hover:text-[#1677FF] uppercase tracking-wider block transition-colors duration-200">
                            {item.label}
                          </span>
                          <p className="text-sm font-bold text-[#0B1220] mt-0.5 transition-colors duration-200">
                            {item.value}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-[#0B1220]/30 group-hover:text-[#1677FF] group-hover:translate-x-1 transition-all duration-200 shrink-0 mt-2" />
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default AboutPreview;
