import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { PageWrapper } from '../components/layout/PageWrapper';
import { CheckCircle2, ArrowLeft, ArrowRight, Cpu } from 'lucide-react';
import { Button } from '../components/common/Button';
import { TechBadge } from '../components/common/TechBadge';

export function ProjectDetails() {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return <Navigate to="/portfolio" replace />;
  }

  return (
    <PageWrapper>
      {/* Header */}
      <section className="bg-[#FFFFFF] py-8 md:py-10 lg:py-12 border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl">
            <Link 
              to="/portfolio" 
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#0B1220] hover:text-[#1677FF] transition-colors duration-200 mb-4 group"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
              <span>Back to Case Studies</span>
            </Link>

            <div className="flex items-center gap-3 mb-2.5">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#EEF3FF] border border-[#C9D7F5] text-[#0B1220] font-bold shadow-2xs">
                {project.category}
              </span>
              <span className="text-xs font-mono text-[#0B1220] font-bold">PRODUCTION DEPLOYMENT</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.15] mb-3.5">
              {project.title}
            </h1>

            <p className="text-base text-[#2B384E] leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Architecture Showcase */}
      <section className="py-6 md:py-8 bg-[#F1F4F8] border-b border-[#E2E7EF]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="rounded-xl overflow-hidden border border-[#E2E7EF] aspect-[16/9] max-h-[480px] w-full bg-[#FFFFFF] shadow-sm">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80';
              }}
            />
          </div>
        </div>
      </section>

      {/* Case Study Details */}
      <section className="py-10 md:py-12 lg:py-14 bg-[#F1F4F8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 text-left">
            
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              
              {/* Challenge vs Solution */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-6 space-y-2.5 shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
                  <span className="text-xs font-mono text-[#0B1220] uppercase tracking-wider block font-bold">
                    THE ARCHITECTURAL CHALLENGE
                  </span>
                  <p className="text-sm text-[#2B384E] leading-relaxed">
                    {project.clientChallenge}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-6 space-y-2.5 shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
                  <span className="text-xs font-mono text-[#0B1220] uppercase tracking-wider block font-bold">
                    OUR IMPLEMENTED SOLUTION
                  </span>
                  <p className="text-sm text-[#2B384E] leading-relaxed">
                    {project.ourSolution}
                  </p>
                </div>
              </div>

              {/* Key Features */}
              <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-7 space-y-4 shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
                <h3 className="text-base font-bold text-[#0B1220] font-mono">
                  CORE SYSTEM CAPABILITIES
                </h3>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] transition-all duration-200 group text-xs text-[#2B384E]">
                      <CheckCircle2 className="h-4 w-4 text-[#0B1220] group-hover:text-[#1677FF] shrink-0 transition-colors duration-200" />
                      <span className="group-hover:text-[#1677FF] transition-colors duration-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Roadmap */}
              <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-7 space-y-4 shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
                <h3 className="text-base font-bold text-[#0B1220] font-mono">
                  DEPLOYMENT LIFECYCLE
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-2.5">
                  {project.process.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] transition-all duration-200 group space-y-1">
                      <span className="text-[10px] font-mono text-[#0B1220] group-hover:text-[#1677FF] font-bold transition-colors duration-200">
                        0{idx + 1}
                      </span>
                      <p className="text-xs font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Results Metric Card */}
              <div className="rounded-xl bg-[#EEF3FF] border border-[#C9D7F5] p-6 space-y-2.5 shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#1677FF]">
                  <Cpu className="h-4 w-4" />
                  <span className="font-semibold">PRODUCTION RESULT</span>
                </div>
                <h4 className="text-base font-bold text-[#0B1220]">
                  Measurable Operational Impact
                </h4>
                <p className="text-sm font-semibold text-[#0B1220] bg-[#FFFFFF] p-3 rounded-lg border border-[#C9D7F5] leading-relaxed shadow-2xs">
                  {project.results}
                </p>
              </div>

              {/* Tech Stack Box */}
              <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-6 space-y-3 shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
                <h4 className="text-xs font-mono font-bold text-[#0B1220] uppercase tracking-wider">
                  Technology Frameworks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <TechBadge key={tech} name={tech} size="md" />
                  ))}
                </div>
              </div>

              {/* Start Similar Project CTA */}
              <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-6 space-y-3 shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
                <h4 className="text-base font-bold text-[#0B1220]">
                  Planning a Similar Architecture?
                </h4>
                <p className="text-xs text-[#2B384E] leading-relaxed">
                  Speak directly with an engineering lead to evaluate your technical roadmap and receive a realistic milestone scope.
                </p>
                <Button size="default" className="w-full gap-2" asChild>
                  <Link to="/contact">
                    <span>Discuss Your Project</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

            </div>

          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

export default ProjectDetails;
