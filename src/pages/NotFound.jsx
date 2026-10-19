import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/common/Button';
import { ArrowLeft, Home, Layers, Briefcase, Mail, Compass } from 'lucide-react';

export function NotFound() {
  const suggestedRoutes = [
    { title: "Core Engineering Services", href: "/services", icon: Layers, desc: "Explore our full-cycle web, mobile, and cloud software capabilities." },
    { title: "Production Case Studies", href: "/portfolio", icon: Briefcase, desc: "Review architectural breakdowns of systems we have designed and scaled." },
    { title: "Industries & Compliance", href: "/industries", icon: Compass, desc: "See domain-specific engineering for healthcare, finance, retail, and logistics." },
    { title: "Contact Engineering Desk", href: "/contact", icon: Mail, desc: "Initiate project scoping or discuss technical requirements with a lead architect." },
  ];

  return (
    <PageWrapper>
      {/* 404 Header */}
      <section className="bg-[#FFFFFF] py-12 md:py-16 lg:py-20 border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EEF3FF] border border-[#C9D7F5] text-xs font-mono font-bold tracking-wider text-[#0B1220] mb-4 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]"></span>
            <span>404 • ROUTE NOT RESOLVED</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.15] mb-4">
            The Requested System Route Does Not Exist
          </h1>

          <p className="text-base sm:text-lg text-[#2B384E] leading-relaxed max-w-2xl mb-8">
            The resource, page, or endpoint you are attempting to access has been relocated, archived, or is not mapped in the current client routing table.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link to="/" className="group gap-2">
                <Home className="h-4 w-4" />
                <span>Return to Homepage</span>
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link to="/contact" className="group gap-2">
                <Mail className="h-4 w-4" />
                <span>Contact Engineering Team</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Suggested System Hubs */}
      <section className="py-12 md:py-14 bg-[#F1F4F8] border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-sm font-mono uppercase text-[#0B1220] font-bold tracking-wider mb-5">
            AVAILABLE SYSTEM DIRECTORIES
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {suggestedRoutes.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-5 hover:border-[#BFDBFE] hover:bg-[#F8FAFF] hover:shadow-[0_4px_20px_rgba(11,18,32,0.04)] transition-all duration-200 flex items-start gap-4"
                >
                  <div className="h-10 w-10 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#0B1220] group-hover:text-[#1677FF] group-hover:bg-[#FFFFFF] group-hover:border-[#BFDBFE] transition-all duration-200 shrink-0 mt-0.5 shadow-2xs">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#2B384E] mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

export default NotFound;
