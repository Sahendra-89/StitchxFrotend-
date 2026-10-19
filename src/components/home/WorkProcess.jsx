import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { Compass, PenTool, Terminal, Rocket } from 'lucide-react';

export function WorkProcess() {
  const phases = [
    {
      step: "01",
      icon: Compass,
      title: "Discovery & Architecture",
      duration: "Week 1 - 2",
      description: "We analyze functional requirements, model PostgreSQL/NoSQL schemas, select optimal cloud infrastructure, and establish API contracts.",
      deliverables: ["Technical Architecture Document (TAD)", "Data Schema & Entity Models", "Sprint Roadmap & Milestones"]
    },
    {
      step: "02",
      icon: PenTool,
      title: "UI/UX & Design Systems",
      duration: "Week 2 - 4",
      description: "We translate user flows into high-fidelity, accessible interfaces using a unified design token system ready for immediate frontend engineering.",
      deliverables: ["Interactive Prototypes", "Accessible Component Library", "Design System Specifications"]
    },
    {
      step: "03",
      icon: Terminal,
      title: "Sprint Engineering & CI/CD",
      duration: "Iterative Sprints",
      description: "Modular development with TypeScript, automated test suites, and continuous deployment to preview environments with weekly demos.",
      deliverables: ["Weekly Staging Preview URLs", "Automated GitHub Actions CI/CD", "Pull Request Code Reviews"]
    },
    {
      step: "04",
      icon: Rocket,
      title: "Production Cutover & SLA",
      duration: "Launch & Beyond",
      description: "Stress testing, multi-region deployment, DNS/SSL provisioning, complete IP and repository handover, followed by dedicated SLA support.",
      deliverables: ["Production Verification Testing", "100% Repository & Key Handover", "Ongoing Observability & SLA"]
    }
  ];

  return (
    <section className="py-10 md:py-12 lg:py-14 bg-[#F7F8FA] border-b border-[#E2E7EF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <SectionHeader
          
          title="Predictable, Transparent Delivery Lifecycle"
          description="Every sprint is tracked, documented, and test-driven. You always know what is being built, when it ships, and how it performs."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {phases.map((phase) => {
            const Icon = phase.icon;
            return (
              <div
                key={phase.step}
                className="group rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-6 flex flex-col justify-between hover:border-[#BFDBFE] hover:bg-[#F8FAFF] transition-all duration-200 text-left relative shadow-[0_4px_20px_rgba(11,18,32,0.04)]"
              >
                <div>

                  <div className="h-9 w-9 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#0B1220] group-hover:text-[#1677FF] group-hover:bg-[#FFFFFF] group-hover:border-[#BFDBFE] transition-all duration-200 mb-3.5">
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  <h3 className="text-base font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200 mb-1.5">
                    {phase.title}
                  </h3>

                  <p className="text-xs text-[#2B384E] leading-relaxed mb-5">
                    {phase.description}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-[#E8ECF2] space-y-1.5 mt-auto">
                  <p className="text-[10px] font-mono font-bold uppercase text-[#0B1220] tracking-wider mb-1.5">Deliverables</p>
                  {phase.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#2B384E] font-medium">
                      <span className="text-[#1677FF] font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default WorkProcess;
