import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { Cpu, Activity, GitPullRequest, Gauge } from 'lucide-react';

export function WhyChooseUs() {
  const differentiators = [
    {
      icon: Gauge,
      badge: "LATENCY & PERFORMANCE",
      title: "Sub-Second Load Times",
      description: "Optimized server-side rendering, intelligent caching with Redis, and aggressive asset bundling ensure top-tier Core Web Vitals across mobile and desktop devices."
    },
    {
      icon: GitPullRequest,
      badge: "RADICAL TRANSPARENCY",
      title: "Live Weekly Staging Previews",
      description: "We deploy working milestone builds to isolated staging environments every week, giving you clear, hands-on visibility into verified sprint progress."
    },
    {
      icon: Cpu,
      badge: "CLEAN ARCHITECTURE",
      title: "Clean Modular Codebases",
      description: "Written with typed contracts, isolated component libraries, and fully documented REST/GraphQL APIs that your internal engineering team can immediately understand."
    },
    {
      icon: Activity,
      badge: "SLA OBSERVABILITY",
      title: "Continuous Observability",
      description: "Real-time error tracking, automated health checks, and proactive alerting configured from sprint zero to ensure ongoing system reliability in production."
    }
  ];

  return (
    <section className="py-10 md:py-12 lg:py-14 bg-[#EEF2F7] border-b border-[#E2E7EF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <SectionHeader
        
          title="Engineered for Production Scale & Maintainability"
          description="We build software designed to handle high transaction volumes, traffic spikes, and demanding business logic reliably."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {differentiators.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group rounded-xl border border-[#E2E7EF] bg-[#FFFFFF] p-6 flex flex-col justify-between hover:bg-[#F8FAFF] hover:border-[#BFDBFE] shadow-[0_4px_20px_rgba(11,18,32,0.04)] transition-all duration-200 text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-9 w-9 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#0B1220] group-hover:text-[#1677FF] group-hover:bg-[#FFFFFF] group-hover:border-[#BFDBFE] transition-all duration-200 shadow-2xs">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#F4F7FF] text-[#0B1220] border border-[#C9D7F5]">
                      0{index + 1}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-[#0B1220] font-bold tracking-wider uppercase block mb-1 group-hover:text-[#1677FF] transition-colors duration-200">
                    {item.badge}
                  </span>

                  <h3 className="text-base font-bold text-[#0B1220] mb-2 group-hover:text-[#1677FF] transition-colors duration-200">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#2B384E] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;
