import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { FileText, Lock } from 'lucide-react';

export function Privacy() {
  return (
    <PageWrapper>
      <section className="bg-[#FFFFFF] py-10 md:py-12 lg:py-14 border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EEF3FF] border border-[#C9D7F5] text-xs font-mono font-bold tracking-wider text-[#0B1220] mb-3.5 shadow-2xs">
            <Lock className="h-3.5 w-3.5 text-[#1677FF]" />
            <span>SECURITY & COMPLIANCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1220] tracking-tight mb-3.5">
            Privacy & Data Protection Policy
          </h1>
          <p className="text-xs font-mono text-[#0B1220] font-medium">
            Effective Date: October 2026 • StitchX Global Technology
          </p>
        </div>
      </section>

      <section className="py-10 md:py-12 lg:py-14 bg-[#F1F4F8] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6 text-sm text-[#2B384E] leading-relaxed">
          
          <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] p-8 space-y-3 shadow-[0_4px_20px_rgba(17,24,39,0.04)] transition-all duration-200 group">
            <h2 className="text-lg font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">1. Commitment to Client Confidentiality</h2>
            <p>
              At StitchX Global Technology, we treat client confidentiality and proprietary intellectual property as fundamental pillars of our business. We do not sell, rent, or trade client information or project source code under any circumstances.
            </p>
          </div>

          <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] p-8 space-y-3 shadow-[0_4px_20px_rgba(17,24,39,0.04)] transition-all duration-200 group">
            <h2 className="text-lg font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">2. Information We Collect</h2>
            <p>
              When you submit a project inquiry, apply for a career, or engage our engineering services, we collect necessary business contact information, including name, corporate email, phone number, and architectural requirements. For contracted engineering clients, credentials provided for cloud infrastructure (AWS, GCP, GitHub) are strictly isolated using encrypted vault secret stores.
            </p>
          </div>

          <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] p-8 space-y-3 shadow-[0_4px_20px_rgba(17,24,39,0.04)] transition-all duration-200 group">
            <h2 className="text-lg font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">3. Data Security & Storage</h2>
            <p>
              All internal infrastructure, code repositories, and communication channels are protected with multi-factor authentication (MFA), least-privilege role-based access control, and AES-256 encryption at rest and in transit.
            </p>
          </div>

          <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] p-8 space-y-3 shadow-[0_4px_20px_rgba(17,24,39,0.04)] transition-all duration-200 group">
            <h2 className="text-lg font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">4. Contact Our Data Protection Officer</h2>
            <p>
              For privacy inquiries, NDA executions, or data deletion requests, contact our legal team directly at <a href="mailto:rajankitt01@gmail.com" className="text-[#0B1220] hover:text-[#1677FF] underline font-bold transition-colors duration-200">rajankitt01@gmail.com</a>.
            </p>
          </div>

        </div>
      </section>
    </PageWrapper>
  );
}

export function Terms() {
  return (
    <PageWrapper>
      <section className="bg-[#FFFFFF] py-10 md:py-12 lg:py-14 border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EEF3FF] border border-[#C9D7F5] text-xs font-mono font-bold tracking-wider text-[#0B1220] mb-3.5 shadow-2xs">
            <FileText className="h-3.5 w-3.5 text-[#1677FF]" />
            <span>CONTRACTUAL TERMS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1220] tracking-tight mb-3.5">
            Terms of Engineering Engagement
          </h1>
          <p className="text-xs font-mono text-[#0B1220] font-medium">
            Effective Date: October 2026 • StitchX Global Technology
          </p>
        </div>
      </section>

      <section className="py-10 md:py-12 lg:py-14 bg-[#F1F4F8] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6 text-sm text-[#2B384E] leading-relaxed">
          
          <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] p-8 space-y-3 shadow-[0_4px_20px_rgba(17,24,39,0.04)] transition-all duration-200 group">
            <h2 className="text-lg font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">1. Intellectual Property & Code Ownership</h2>
            <p>
              Upon fulfillment of contractual milestone payments, 100% of all custom source code, documentation, schema models, and deployed infrastructure assets are unconditionally assigned to the client. StitchX Global Technology claims zero proprietary lock-in on custom software created for your organization.
            </p>
          </div>

          <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] p-8 space-y-3 shadow-[0_4px_20px_rgba(17,24,39,0.04)] transition-all duration-200 group">
            <h2 className="text-lg font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">2. Agile Sprint Delivery & Acceptance</h2>
            <p>
              Engineering projects are executed in iterative 1-to-2 week sprints. Milestone builds are deployed to private preview environments for formal client verification before production cutover.
            </p>
          </div>

          <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] p-8 space-y-3 shadow-[0_4px_20px_rgba(17,24,39,0.04)] transition-all duration-200 group">
            <h2 className="text-lg font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">3. Warranty & Defect Remediation</h2>
            <p>
              We provide a standard 30-day post-launch warranty covering any functional regressions, unexpected bugs, or architectural defects within the defined scope of work at zero additional charge.
            </p>
          </div>

          <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] p-8 space-y-3 shadow-[0_4px_20px_rgba(17,24,39,0.04)] transition-all duration-200 group">
            <h2 className="text-lg font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">4. Governing Jurisdiction</h2>
            <p>
              These terms are governed by the laws of India, with corporate jurisdiction seated in Gurugram, Haryana.
            </p>
          </div>

        </div>
      </section>
    </PageWrapper>
  );
}

export default Privacy;
