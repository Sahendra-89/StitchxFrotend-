import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { projects, categories } from '../data/projects';
import { PageWrapper } from '../components/layout/PageWrapper';
import { TechBadge } from '../components/common/TechBadge';
import { ArrowRight } from 'lucide-react';

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((item) => item.category === activeCategory);

  return (
    <PageWrapper>
      {/* Editorial Hero */}
      <section className="bg-[#FFFFFF] py-10 md:py-12 lg:py-14 border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EEF3FF] border border-[#C9D7F5] text-[11px] font-mono font-bold tracking-wide text-[#0B1220] mb-4 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF]"></span>
              <span>PRODUCTION DEPLOYMENTS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.15] mb-4">
              Engineering Case Studies & Deployed Platforms
            </h1>

            <p className="text-base sm:text-lg text-[#2B384E] leading-relaxed">
              Explore our architectural track record across web applications, high-concurrency mobile products, custom dashboards, and business automation platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Filterable Portfolio Grid */}
      <section className="py-10 md:py-12 lg:py-14 bg-[#F1F4F8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-8 md:mb-10 justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                  activeCategory === cat 
                    ? 'bg-[#1677FF] text-[#FFFFFF] font-bold shadow-2xs' 
                    : 'bg-[#FFFFFF] text-[#0B1220] font-medium border border-[#E2E7EF] hover:bg-[#F8FAFF] hover:border-[#BFDBFE] hover:text-[#1677FF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length === 0 ? (
              <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-12 text-center text-[#596579] col-span-full">
                <p>No case studies found in this category.</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] overflow-hidden flex flex-col justify-between hover:border-[#BFDBFE] hover:bg-[#F8FAFF] hover:shadow-[0_4px_20px_rgba(17,24,39,0.06)] transition-all duration-200 group text-left shadow-[0_4px_20px_rgba(17,24,39,0.04)]"
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
                        {project.techStack.map(tech => (
                          <TechBadge key={tech} name={tech} size="sm" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-[#E8ECF2] mt-auto">
                    <Link 
                      to={`/portfolio/${project.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200 pt-4"
                    >
                      <span>Read Full Architectural Breakdown</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>
    </PageWrapper>
  );
}

export default Portfolio;
