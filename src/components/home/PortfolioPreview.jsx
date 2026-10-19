import React from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';
import { SectionHeader } from '../common/SectionHeader';
import { TechBadge } from '../common/TechBadge';
import { ArrowRight } from 'lucide-react';

export function PortfolioPreview() {
  const featured = projects.slice(0, 3);

  return (
    <section className="py-10 md:py-12 lg:py-14 bg-[#F7F8FA] border-b border-[#E2E7EF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8">
          <SectionHeader
            
            title="Featured Engineering Deployments"
            description="Explore representative systems we have architected, from cloud ERP dashboards to real-time e-commerce infrastructure."
            align="left"
            className="mb-0"
          />

          <div className="mt-4 md:mt-0">
            <Link
              to="/portfolio"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#0B1220] hover:text-[#1677FF] transition-colors duration-200"
            >
              <span>View Full Case Study Archive</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((project) => (
            <div
              key={project.id}
              className="group rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] overflow-hidden flex flex-col justify-between hover:border-[#BFDBFE] hover:bg-[#F8FAFF] hover:shadow-[0_6px_24px_rgba(11,18,32,0.06)] transition-all duration-200 text-left shadow-[0_4px_20px_rgba(11,18,32,0.04)]"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F1F4F8]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#FFFFFF]/95 backdrop-blur-md border border-[#E2E7EF] text-[11px] font-mono text-[#0B1220] shadow-2xs font-bold">
                    {project.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#0B1220] mb-2 group-hover:text-[#1677FF] transition-colors duration-200">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#2B384E] leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech) => (
                      <TechBadge key={tech} name={tech} size="sm" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#E8ECF2] mt-auto">
                <Link
                  to={`/portfolio/${project.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200 pt-4"
                >
                  <span>Review Case Study & Architecture</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default PortfolioPreview;
