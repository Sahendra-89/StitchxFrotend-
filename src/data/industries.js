import { HeartPulse, GraduationCap, ShoppingBag, Landmark, Truck, Building2, Rocket, Briefcase } from 'lucide-react';

export const industries = [
  {
    id: 'healthcare',
    icon: HeartPulse,
    title: 'Healthcare & Life Sciences',
    challenge: 'Protecting protected health information (PHI), maintaining HIPAA compliance, and ensuring low-latency telehealth connectivity.',
    solution: 'HIPAA-ready telehealth platforms, encrypted EHR/EMR data bridges, and secure provider-patient portals with end-to-end audit logging.',
    features: ['HIPAA-compliant WebRTC video', 'HL7 & FHIR API integration', 'Automated audit logs & access controls', 'Encrypted patient records storage'],
    benefits: ['Verified HIPAA/HITECH compliance readiness', 'Sub-second consultation latency', 'Automated regulatory audit trails'],
    examples: ['HealthTrack Telehealth Suite', 'MediPortal Provider Dashboard']
  },
  {
    id: 'education',
    icon: GraduationCap,
    title: 'Education & EdTech',
    challenge: 'Supporting high-concurrency video delivery, adaptive assessments, and granular student progress tracking across distributed cohorts.',
    solution: 'Scalable Learning Management Systems (LMS) with low-latency media delivery, automated proctoring integrations, and student analytics.',
    features: ['Adaptive quiz & assessment engines', 'High-concurrency video delivery', 'SCORM & xAPI compliance standards', 'Cohort performance analytics'],
    benefits: ['Zero-lag video playback across high concurrency', 'Automated grading and analytics pipelines', 'Cross-platform mobile and tablet support'],
    examples: ['LearnNova LMS Platform', 'EduTrack Student Portal']
  },
  {
    id: 'retail',
    icon: ShoppingBag,
    title: 'Retail & Modern Commerce',
    challenge: 'Preventing checkout drop-off during peak traffic surges and synchronizing inventory across decentralized distribution channels.',
    solution: 'Headless commerce architectures with edge-cached product catalogs, sub-second checkout pipelines, and bi-directional ERP inventory sync.',
    features: ['Headless Shopify / custom checkout', 'Real-time multi-warehouse inventory sync', 'Sub-second global product search', 'Automated fraud risk scoring'],
    benefits: ['Sub-second cart-to-confirmation checkout', 'Zero inventory reconciliation discrepancies', 'Seamless surge traffic scaling'],
    examples: ['StyleStore Headless Suite', 'RetailSync ERP Connector']
  },
  {
    id: 'finance',
    icon: Landmark,
    title: 'Financial Services & FinTech',
    challenge: 'Complying with strict PCI-DSS regulations, eliminating ledger reconciliation errors, and delivering sub-second market data analytics.',
    solution: 'Audited financial platforms featuring double-entry ledger databases, role-based cryptographic signing, and real-time portfolio dashboards.',
    features: ['PCI-DSS compliant payment gateways', 'Double-entry cryptographic ledger', 'Real-time market data streaming', 'Granular multi-factor authorization (MFA)'],
    benefits: ['100% auditable transactional ledgers', 'End-to-end data encryption at rest and in transit', 'Enterprise security verification'],
    examples: ['FinMetrics Asset Console', 'TradeSecure Portfolio Engine']
  },
  {
    id: 'logistics',
    icon: Truck,
    title: 'Logistics & Supply Chain',
    challenge: 'Managing fragmented dispatch pipelines, lack of shipment visibility, and inefficient route dispatching across multi-modal fleets.',
    solution: 'Centralized fleet telematics systems featuring GPS tracking, automated dispatch scheduling, and transparent carrier-client portals.',
    features: ['Real-time GPS vehicle tracking', 'Dynamic route optimization engines', 'Automated carrier dispatch & geofencing', 'Consolidated BOL & invoice generation'],
    benefits: ['Up to 22% reduction in fleet transit delays', 'Complete multi-party shipment transparency', 'Elimination of manual dispatch paperwork'],
    examples: ['LogiFlow Dispatch Suite', 'FleetTrack Telematics Engine']
  },
  {
    id: 'real-estate',
    icon: Building2,
    title: 'Real Estate & PropTech',
    challenge: 'Managing fragmented MLS feeds, synchronizing high-resolution property media, and routing high-value buyer leads to agents instantly.',
    solution: 'Custom PropTech platforms with RESO Web API integrations, interactive map searches, automated CRM lead routing, and virtual tour support.',
    features: ['RESO Web API & MLS data sync', 'Mapbox interactive geospatial search', 'Automated agent lead distribution', 'Document digital signature pipelines'],
    benefits: ['Sub-minute MLS listing synchronization', 'Zero lead decay with automated assignment', 'High-fidelity mobile property browsing'],
    examples: ['PropView Marketplace', 'AgentCRM Brokerage Engine']
  },
  {
    id: 'startups',
    icon: Rocket,
    title: 'B2B SaaS & Tech Startups',
    challenge: 'Validating product-market fit rapidly without accumulating debilitating technical debt or brittle infrastructure.',
    solution: 'Production-ready MVP sprints engineered with modular TypeScript architecture, clean API boundaries, and automated CI/CD pipelines.',
    features: ['Rapid 6-8 week MVP delivery sprints', 'Multi-tenant database architecture', 'Stripe recurring billing integrations', 'Production-ready CI/CD pipelines'],
    benefits: ['Accelerated investor & beta launch timelines', 'Maintainable codebase ready for series scaling', 'Full repository and IP ownership'],
    examples: ['B2B Workflow MVP', 'SaaS Billing & Account Core']
  },
  {
    id: 'professional-services',
    icon: Briefcase,
    title: 'Professional & Legal Services',
    challenge: 'Coordinating billable hours, confidential client documents, and complex milestone invoicing across distributed client teams.',
    solution: 'Secure practice management suites featuring client document vaults, automated milestone invoicing, and encrypted communication channels.',
    features: ['Confidential client document vaults', 'Automated time tracking & invoicing', 'Calendar & video meeting synchronization', 'Configurable role permissions'],
    benefits: ['Accelerated invoice settlement cycles', 'Strict confidentiality and document security', 'Professional client-facing collaboration'],
    examples: ['ConsultPro Client Portal', 'LegalDoc Secure Repository']
  }
];
