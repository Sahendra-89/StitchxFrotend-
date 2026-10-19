import React from 'react';
import { Link } from 'react-router-dom';
import { industries } from '../../data/industries';
import { SectionHeader } from '../common/SectionHeader';
import { ArrowRight, ShieldCheck, HeartPulse, ShoppingCart, Truck } from 'lucide-react';

export function IndustriesPreview() {
  const featuredIndustries = industries.slice(0, 4);
  const iconMap = {
    'fintech': ShieldCheck,
    'healthcare': HeartPulse,
    'ecommerce': ShoppingCart,
    'logistics': Truck,
  };

  return (
    <section className="py-10 md:py-12 lg:py-14 bg-[#F1F4F8] border-b border-[#E2E7EF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <SectionHeader
          title="Engineered for Regulated & High-Load Industries"
          description="We navigate domain-specific compliance, transaction security, and real-time processing demands across key commercial sectors."
        />

        <div className="grid md:grid-cols-2 gap-6">
          {featuredIndustries.map((industry) => {
            const SectorIcon = industry.icon || iconMap[industry.id] || ShieldCheck;
            return (
              <div
                key={industry.id}
                className="group rounded-xl border border-[#E2E7EF] bg-[#FFFFFF] p-6 sm:p-7 flex flex-col justify-between hover:bg-[#F8FAFF] hover:border-[#BFDBFE] shadow-[0_4px_20px_rgba(11,18,32,0.04)] transition-all duration-200 text-left"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-9 w-9 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#0B1220] group-hover:text-[#1677FF] group-hover:bg-[#FFFFFF] group-hover:border-[#BFDBFE] shadow-2xs transition-all duration-200">
                      <SectorIcon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">
                        {industry.title}
                      </h3>
                      <p className="text-[11px] font-mono text-[#596579] font-medium">Specialized Architecture</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-5 text-xs">
                    <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E2E7EF] group-hover:border-[#BFDBFE] transition-colors duration-200">
                      <span className="text-[10px] font-mono text-[#9B5360] font-bold block mb-0.5">CRITICAL CHALLENGE</span>
                      <p className="text-xs text-[#2B384E] leading-relaxed">{industry.challenge}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E2E7EF] group-hover:border-[#BFDBFE] transition-colors duration-200">
                      <span className="text-[10px] font-mono text-[#0B1220] font-bold block mb-0.5">ENGINEERED SOLUTION</span>
                      <p className="text-xs text-[#0B1220] leading-relaxed font-bold">{industry.solution}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-[#E8ECF2] flex items-center justify-end">
                  <Link
                    to="/industries"
                    className="text-xs font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200 inline-flex items-center gap-1 shrink-0"
                  >
                    <span>Sector Specs</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-7 md:mt-8 text-center">
          <Link
            to="/industries"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#0B1220] hover:text-[#1677FF] transition-colors duration-200"
          >
            <span>Explore All 8 Supported Sectors & Compliance Frameworks</span>
            <ArrowRight className="h-4 w-4 text-[#0B1220] group-hover:text-[#1677FF] transition-all duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default IndustriesPreview;
