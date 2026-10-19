import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { services } from '../data/services';
import { PageWrapper } from '../components/layout/PageWrapper';
import { CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Cpu } from 'lucide-react';
import { Button } from '../components/common/Button';

export function ServiceDetails() {
  const { id } = useParams();
  const service = services.find(s => s.id === id);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const Icon = service.icon;

  return (
    <PageWrapper>
      {/* Editorial Header */}
      <section className="bg-[#FFFFFF] py-8 md:py-10 lg:py-12 border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl">
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#0B1220] hover:text-[#1677FF] transition-colors duration-200 mb-4 group"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
              <span>Back to Services Catalog</span>
            </Link>

            <div className="flex items-center gap-3 mb-2.5">
              <div className="h-9 w-9 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#1677FF] shadow-2xs">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-mono text-[#0B1220] font-bold uppercase tracking-wider">
                TECHNICAL SPECIFICATION
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.15] mb-3.5">
              {service.title}
            </h1>

            <p className="text-base text-[#2B384E] leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Technical Content */}
      <section className="py-10 md:py-12 lg:py-14 bg-[#F1F4F8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 text-left">
            
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              
              {/* Architecture Overview */}
              <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-7 space-y-3 shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
                <h2 className="text-base font-bold text-[#0B1220] font-mono">
                  ARCHITECTURAL SCOPE & APPROACH
                </h2>
                <p className="text-sm text-[#2B384E] leading-relaxed">
                  {service.overview} We design and implement this system following strict enterprise guidelines: clean separation of concerns, defensive validation, deterministic state management, and comprehensive observability.
                </p>
              </div>

              {/* Features & Benefits Side-by-Side */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-6 space-y-3 shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
                  <h3 className="text-sm font-bold text-[#0B1220] font-mono border-b border-[#E8ECF2] pb-2">
                    KEY CAPABILITIES
                  </h3>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#2B384E] p-1 rounded hover:bg-[#F8FAFF] transition-colors duration-200 group">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#0B1220] group-hover:text-[#1677FF] shrink-0 mt-0.5 transition-colors duration-200" />
                        <span className="group-hover:text-[#1677FF] transition-colors duration-200">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-6 space-y-3 shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
                  <h3 className="text-sm font-bold text-[#0B1220] font-mono border-b border-[#E8ECF2] pb-2">
                    BUSINESS OUTCOMES
                  </h3>
                  <div className="space-y-2">
                    {service.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#2B384E] p-1 rounded hover:bg-[#F8FAFF] transition-colors duration-200 group">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#0B1220] group-hover:text-[#1677FF] shrink-0 mt-0.5 transition-colors duration-200" />
                        <span className="group-hover:text-[#1677FF] transition-colors duration-200">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delivery Process Milestones */}
              <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-7 space-y-5 shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
                <h3 className="text-base font-bold text-[#0B1220] font-mono">
                  SPRINT EXECUTION ROADMAP
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3">
                  {service.process.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-[#F7F8FA] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] transition-all duration-200 group space-y-1.5">
                      <span className="text-[11px] font-mono text-[#0B1220] group-hover:text-[#1677FF] font-bold transition-colors duration-200">
                        0{idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">{step}</h4>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Sticky Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Stack Card */}
              <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-6 space-y-3 shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
                <h3 className="text-xs font-bold text-[#0B1220] font-mono uppercase tracking-wider">
                  Technology Frameworks
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {service.techStack.map((tech, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 bg-[#FFFFFF] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:text-[#1677FF] hover:bg-[#F8FAFF] rounded-md text-xs font-mono text-[#0B1220] font-medium transition-all duration-200 cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Conversion Inquiry Card */}
              <div className="rounded-xl bg-[#EEF3FF] border border-[#C9D7F5] p-6 space-y-3 text-left shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#1677FF]">
                  <Cpu className="h-4 w-4" />
                  <span className="font-semibold">START ARCHITECTURE INQUIRY</span>
                </div>
                <h3 className="text-base font-bold text-[#0B1220]">
                  Ready to Scope This Service?
                </h3>
                <p className="text-xs text-[#2B384E] leading-relaxed">
                  Book an engineering discovery call to discuss architectural requirements, sprint timelines, and commercial estimates.
                </p>
                <Button size="default" className="w-full gap-2" asChild>
                  <Link to="/contact">
                    <span>Schedule Technical Scope</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Security & Code Ownership */}
              <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-5 text-xs font-mono space-y-1.5 shadow-[0_4px_20px_rgba(17,24,39,0.04)]">
                <div className="flex items-center gap-2 text-[#0B1220] font-bold">
                  <ShieldCheck className="h-4 w-4 text-[#1677FF]" />
                  <span>100% Client Code Ownership</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#2B384E]">
                  All repositories, architectural blueprints, and deployed cloud infrastructure belong unconditionally to your organization.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

export default ServiceDetails;
