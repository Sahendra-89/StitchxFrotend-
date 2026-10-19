import React from 'react';
import { TechLogo } from '../common/TechLogo';

export function TechMarqueeRibbon() {
  const techBadges = [
    { name: "React 19 & Next.js", logos: ["React", "Next.js"] },
    { name: "Node.js & Express", logos: ["Node.js", "Express.js"] },
    { name: "Python & FastAPI", logos: ["Python", "FastAPI"] },
    { name: "Java & Spring Boot", logos: ["Java", "Spring Boot"] },
    { name: "Flutter & React Native", logos: ["Flutter", "React Native"] },
    { name: "Swift & Kotlin Native", logos: ["Swift", "Kotlin"] },
    { name: "PostgreSQL & MySQL", logos: ["PostgreSQL", "MySQL"] },
    { name: "MongoDB & Redis Cache", logos: ["MongoDB", "Redis"] },
    { name: "AWS & Microsoft Azure", logos: ["AWS", "Microsoft Azure"] },
    { name: "Docker & Kubernetes", logos: ["Docker", "Kubernetes"] },
    { name: "Tailwind CSS", logos: ["Tailwind CSS"] },
    { name: "AI / LLM & OpenAI", logos: ["OpenAI API"] },
    { name: "PHP & Laravel", logos: ["PHP", "Laravel"] },
    { name: "Golang Microservices", logos: ["Golang"] },
    { name: "CI/CD & GitHub Actions", logos: ["GitHub Actions"] },
    { name: "TypeScript & GraphQL", logos: ["TypeScript", "GraphQL"] },
    { name: "Git & Version Control", logos: ["Git"] },
    { name: "Kafka & Event Streams", logos: ["Kafka"] }
  ];

  return (
    <section className="bg-white border-y border-[#E2E8F0] py-6 sm:py-7 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Label Strip */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0"></span>
            <p className="text-sm sm:text-base md:text-[17px] font-black text-black uppercase tracking-wide">
              Core Production Technologies • Global & Indian Enterprise Stack
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 font-semibold hidden sm:inline-block">
            Hover to pause
          </span>
        </div>

        {/* Infinite Marquee Ribbon Container */}
        <div 
          className="relative overflow-hidden w-full py-1.5"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
          }}
        >
          <div className="animate-marquee-ltr flex items-center gap-3.5 sm:gap-4">
            {[...techBadges, ...techBadges].map((tech, idx) => (
              <div
                key={`${tech.name}-${idx}`}
                className="shrink-0 flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#2563EB] text-[#1E293B] shadow-2xs hover:shadow-xs transition-all duration-200 cursor-default select-none"
              >
                <div className="flex items-center gap-1.5 shrink-0">
                  {tech.logos.map((logoName, lIdx) => (
                    <TechLogo key={lIdx} name={logoName} className="w-5 h-5 sm:w-[22px] sm:h-[22px] shrink-0" />
                  ))}
                </div>
                <span className="text-sm sm:text-[15px] font-bold whitespace-nowrap text-[#1E293B]">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TechMarqueeRibbon;
