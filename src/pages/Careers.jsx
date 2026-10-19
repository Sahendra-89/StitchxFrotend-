import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Laptop, Award, Users, Briefcase } from 'lucide-react';
import { publicApi } from '../lib/api';

export function Careers() {
  const [department, setDepartment] = useState('All');
  const [type, setType] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState(['All']);
  const [jobTypes, setJobTypes] = useState(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    publicApi.getJobs({ department, type })
      .then((res) => {
        if (!isCancelled && res?.success) {
          setJobs(res.jobs || []);
          if (res.departments) setDepartments(res.departments);
          if (res.jobTypes) setJobTypes(res.jobTypes);
        }
      })
      .catch((err) => console.error('Failed to load jobs:', err))
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [department, type]);

  const perks = [
    {
      icon: Laptop,
      title: "Deep Work Culture",
      description: "Minimal meetings, zero micromanagement, and generous uninterrupted blocks for actual software engineering."
    },
    {
      icon: Award,
      title: "Transparent Growth & Pay",
      description: "Market-leading compensation, bi-annual performance evaluations, and clear engineering progression bands."
    },
    {
      icon: Users,
      title: "Flexible Hybrid Setup",
      description: "Work from our modern Gurugram office or remotely across India. We measure code output, not desk hours."
    }
  ];

  return (
    <PageWrapper>
      {/* Editorial Hero */}
      <section className="bg-[#FFFFFF] py-10 md:py-12 lg:py-14 border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EEF3FF] border border-[#C9D7F5] text-xs font-mono font-bold tracking-wider text-[#0B1220] mb-4 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF]"></span>
              <span>ENGINEERING CAREERS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.15] mb-4">
              Build Production Systems with High Engineering Standards
            </h1>

            <p className="text-base sm:text-lg text-[#2B384E] leading-relaxed">
              We are an engineering-driven team building mission-critical products for global businesses. If you value clean architecture, automated testing, and direct ownership, you'll thrive at StitchX Global Technology.
            </p>
          </div>
        </div>
      </section>

      {/* Engineering Culture Pillars */}
      <section className="py-10 md:py-12 lg:py-14 bg-[#F1F4F8] border-b border-[#E2E7EF]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {perks.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] p-6 space-y-2.5 transition-all duration-200 group shadow-[0_4px_20px_rgba(17,24,39,0.04)]"
                >
                  <div className="h-10 w-10 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">
                    {perk.title}
                  </h3>
                  <p className="text-xs text-[#2B384E] leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Roles Section */}
      <section className="pt-10 md:pt-12 lg:pt-14 pb-12 md:pb-14 lg:pb-16 bg-[#F7F8FA]" id="open-positions">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 text-left">
            <div>
              <span className="text-xs font-mono text-[#0B1220] font-bold tracking-wider uppercase block mb-2">
                ACTIVE OPENINGS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1220]">
                Open Engineering & Design Positions
              </h2>
            </div>

            {/* Filter Dropdowns */}
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="px-3 py-2 text-xs font-mono bg-white border border-[#E2E7EF] rounded-lg text-[#0B1220] focus:outline-none focus:border-[#1677FF]"
              >
                <option value="All">All Departments</option>
                {departments.filter(d => d !== 'All').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="px-3 py-2 text-xs font-mono bg-white border border-[#E2E7EF] rounded-lg text-[#0B1220] focus:outline-none focus:border-[#1677FF]"
              >
                <option value="All">All Job Types</option>
                {jobTypes.filter(t => t !== 'All').map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Listings List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="p-6 bg-white border border-[#E2E7EF] rounded-xl animate-pulse space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-xl bg-white border border-[#E2E7EF] p-12 text-center text-[#596579]">
              <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-base font-semibold text-[#0B1220]">No active positions match your filter criteria.</p>
              <p className="text-sm mt-1">Check back soon or submit a general application for future opportunities.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] p-6 transition-all duration-200 text-left shadow-[0_2px_12px_rgba(17,24,39,0.03)] group flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#EEF3FF] border border-[#C9D7F5] text-[11px] font-mono text-[#0B1220] font-bold">
                        {job.department}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-[#F1F4F8] border border-[#E2E7EF] text-[11px] font-mono text-[#596579]">
                        {job.jobType}
                      </span>
                      {job.experience && (
                        <span className="px-2.5 py-0.5 rounded bg-[#F1F4F8] border border-[#E2E7EF] text-[11px] font-mono text-[#596579]">
                          {job.experience}
                        </span>
                      )}
                      {job.salaryRange && (
                        <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-800 font-semibold">
                          {job.salaryRange}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">
                      <Link to={`/careers/${job.id}`}>
                        {job.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#2B384E] leading-relaxed line-clamp-2">
                      {job.shortDescription}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-mono text-[#596579] pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#1677FF]" />
                        {job.location}
                      </span>
                      {job.applicationDeadline && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#596579]" />
                          Apply before: {job.applicationDeadline}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 pt-2 md:pt-0">
                    <Link
                      to={`/careers/${job.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B1220] text-white hover:bg-[#1677FF] text-xs font-mono font-bold transition-all duration-200 shadow-sm"
                    >
                      <span>View Role & Apply</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </PageWrapper>
  );
}

export default Careers;
