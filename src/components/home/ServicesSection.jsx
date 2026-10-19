import React from 'react';
import { Link } from 'react-router-dom';
import { services } from '../../data/services';
import { ArrowRight, Check, Code2, Smartphone, ShoppingBag, LayoutDashboard, Cloud, Cpu } from 'lucide-react';

export function ServicesSection() {
  const iconMap = {
    'website-development': Code2,
    'mobile-app-development': Smartphone,
    'ecommerce': ShoppingBag,
    'crm': LayoutDashboard,
    'business-automation': Cloud,
    'ai-integration': Cpu,
  };

  return (
    <section className="py-10 md:py-12 lg:py-14 bg-[#F1F4F8] border-b border-[#E2E7EF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Context & Editorial Narrative (4 cols) */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-5 text-left lg:sticky lg:top-24">
            
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B1220] leading-snug">
              Full-Lifecycle Software Engineering Services
            </h2>

            <p className="text-sm text-[#2B384E] leading-relaxed">
              We design, build, and support production-grade digital infrastructure. From customer-facing web and mobile applications to internal ERP engines and cloud automation, every system is engineered for scale and maintainability.
            </p>

            <div className="pt-1.5 space-y-2 text-xs text-[#2B384E]">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#1677FF] shrink-0" />
                <span className="font-medium">100% Repository & IP Handover from Day 1</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#1677FF] shrink-0" />
                <span className="font-medium">Weekly Preview Deployments to Private Staging</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#1677FF] shrink-0" />
                <span className="font-medium">Enterprise Security & OWASP Compliant Workflows</span>
              </div>
            </div>

            <div className="pt-2 sm:pt-3">
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[#0B1220] hover:text-[#1677FF] transition-colors duration-200"
              >
                <span>Review Complete Service Catalog</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Horizontal Capability Rows (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            {services.map((service, index) => {
              const ServiceIcon = service.icon || iconMap[service.id] || Code2;
              return (
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  className="group block p-5 sm:p-6 rounded-xl border border-[#E2E7EF] bg-[#FFFFFF] hover:bg-[#F8FAFF] hover:border-[#BFDBFE] shadow-[0_4px_20px_rgba(11,18,32,0.04)] transition-all duration-200 text-left"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#0B1220] group-hover:text-[#1677FF] group-hover:bg-[#FFFFFF] group-hover:border-[#BFDBFE] transition-all duration-200 shrink-0 shadow-2xs">
                        <ServiceIcon className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#596579] font-semibold uppercase tracking-wider">
                            0{index + 1}
                          </span>
                          <h3 className="text-base font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">
                            {service.title}
                          </h3>
                        </div>
                        <p className="text-xs text-[#2B384E] mt-1 line-clamp-2 max-w-xl leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8ECF2]">
                      <div className="hidden md:flex flex-wrap gap-1.5">
                        {service.techStack.slice(0, 2).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-[#F4F7FF] border border-[#C9D7F5] group-hover:border-[#BFDBFE] text-[10px] font-mono text-[#2B384E] font-medium transition-colors duration-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="text-xs font-bold text-[#0B1220] group-hover:text-[#1677FF] flex items-center gap-1 shrink-0 transition-colors duration-200">
                        <span>Details</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

export default ServicesSection;
