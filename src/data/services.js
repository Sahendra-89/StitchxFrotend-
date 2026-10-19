import { Palette, Globe, Smartphone, Layers, ShoppingCart, TrendingUp, Navigation, Code, Users, Clock, Settings, Brain, Search } from 'lucide-react';

export const services = [
  {
    id: 'graphics-web-designing',
    icon: Palette,
    title: 'Graphics & Web Designing',
    overview: 'Creative UI/UX design, brand identity systems, and bespoke graphic visuals engineered to engage and convert.',
    description: 'We craft intuitive user experiences and striking visual designs. From high-fidelity Figma prototypes to responsive web interfaces and marketing assets, our design team ensures your digital presence commands authority and elevates user delight.',
    features: ['UI/UX Interface Prototyping', 'Brand Identity & Visual Guidelines', 'Responsive Design Systems', 'Vector Illustrations & Marketing Collaterals'],
    benefits: ['Enhanced brand credibility', 'Higher user retention & engagement', 'Consistent visual language across all platforms'],
    techStack: ['Figma', 'Adobe Creative Cloud', 'Tailwind CSS', 'Next.js', 'Framer'],
    process: ['Brand Discovery', 'Wireframing & UX Architecture', 'Visual Design & UI Prototyping', 'User Testing & Iteration', 'Asset Delivery & Styleguide']
  },
  {
    id: 'cms-website-development',
    icon: Globe,
    title: 'CMS Website Development',
    overview: 'Dynamic, content-driven websites powered by modern CMS platforms for effortless publishing and scale.',
    description: 'Empower your team with flexible content management systems. We engineer fast, secure, and SEO-optimized CMS websites using headless solutions, WordPress, and Strapi tailored for business marketing and publishing workflows.',
    features: ['Headless & Traditional CMS Architecture', 'Custom Theme & Plugin Development', 'Advanced Role-Based Editorial Workflows', 'Blazing-Fast Page Load Optimization'],
    benefits: ['Effortless non-technical content editing', 'Exceptional SEO indexing & speed', 'Robust security and daily automated backups'],
    techStack: ['WordPress', 'Strapi', 'Next.js', 'PHP / Node.js', 'PostgreSQL / MySQL'],
    process: ['Content Modeling', 'Theme & Architecture Blueprint', 'Custom CMS Module Engineering', 'Content Migration & QA', 'Deployment & Team Training']
  },
  {
    id: 'mobile-app-development',
    icon: Smartphone,
    title: 'Mobile App Development',
    overview: 'High-performance iOS and Android applications engineered for fluid UX and offline reliability.',
    description: 'We build cross-platform and native mobile apps with smooth user experiences, secure authentication, and resilient offline data caching tailored to real user conditions.',
    features: ['Cross-Platform Engineering', 'Offline Data Synchronization', 'Native Device API Integration', 'Biometric Authentication'],
    benefits: ['Unified codebase for iOS & Android', 'Consistent native performance', 'Lower long-term maintenance costs'],
    techStack: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
    process: ['User Flow Mapping', 'Interactive Prototyping', 'Sprint Engineering', 'Device QA Testing', 'App Store Deployment']
  },
  {
    id: 'custom-application-development',
    icon: Layers,
    title: 'Custom Application Development',
    overview: 'End-to-end bespoke enterprise software, web portals, and tailored business platforms engineered for scale.',
    description: 'When off-the-shelf software falls short, we build custom web applications and business logic systems that seamlessly fit your exact organizational workflows, third-party integrations, and security requirements.',
    features: ['Bespoke Enterprise Architecture', 'Granular Role-Based Access Controls (RBAC)', 'High-Throughput REST & GraphQL APIs', 'Real-Time Data Streaming & WebSockets'],
    benefits: ['100% tailored to your business model', 'Complete code ownership without per-seat licensing', 'Built for infinite horizontal scalability'],
    techStack: ['React 19', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'],
    process: ['Discovery & Technical Architecture', 'Sprint-Based Agile Engineering', 'Integration & Security Testing', 'Cloud Deployment & Monitoring', 'Post-Launch SLA Support']
  },
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    title: 'E-commerce Solutions',
    overview: 'Custom e-commerce platforms and checkout workflows designed for speed, security, and transaction scale.',
    description: 'From custom storefronts to headless architectures, we deliver secure, high-conversion shopping experiences integrated with your inventory and fulfillment systems.',
    features: ['Headless Commerce Architecture', 'Secure Multi-Gateway Checkout', 'Real-Time Inventory Sync', 'Custom Pricing & Promotion Rules'],
    benefits: ['Reduced cart abandonment', 'Reliable handling of traffic spikes', 'Seamless ERP & fulfillment connections'],
    techStack: ['Shopify Plus', 'Next.js Commerce', 'Stripe', 'PostgreSQL', 'Redis'],
    process: ['Catalog & Data Scoping', 'Storefront Architecture', 'Payment & ERP Integration', 'Load & Stress Testing', 'Launch']
  },
  {
    id: 'digital-marketing',
    icon: TrendingUp,
    title: 'Digital Marketing Campaign',
    overview: 'Performance-focused search marketing, technical SEO, and conversion analytics to grow qualified inbound pipeline.',
    description: 'We combine technical optimization with conversion rate science to improve search engine rankings and increase lead generation from your digital assets.',
    features: ['Conversion Rate Optimization (CRO)', 'Full-Funnel Analytics Setup', 'Technical SEO Architecture', 'Campaign Performance Tracking'],
    benefits: ['Qualified inbound leads', 'Accurate revenue attribution', 'Higher organic search visibility'],
    techStack: ['Google Analytics 4', 'Google Tag Manager', 'Search Console', 'Ahrefs'],
    process: ['Analytics Audit', 'Funnel & Conversion Strategy', 'Tracking Implementation', 'A/B Testing', 'Continuous Optimization']
  },
  {
    id: 'gps-tracking-solution',
    icon: Navigation,
    title: 'GPS Tracking Solution',
    overview: 'Real-time vehicle telematics, IoT asset monitoring, and fleet management tracking platforms.',
    description: 'We architect industrial-grade GPS tracking and fleet telematics platforms. Monitor vehicles, logistics assets, and personnel in real time with geo-fencing, speed telemetry, fuel monitoring, and instant automated alert systems.',
    features: ['Real-Time Live Telemetry Tracking', 'Custom Geo-Fencing & Boundary Alerts', 'Trip History & Playback Analytics', 'OBD-II & Sensor Data Integration'],
    benefits: ['Reduced fleet operational costs', 'Enhanced asset security & theft prevention', 'Automated route optimization & driver safety'],
    techStack: ['IoT Protocols (MQTT/TCP)', 'Node.js', 'WebSocket', 'PostGIS', 'React Native', 'Leaflet'],
    process: ['Hardware & Protocol Scoping', 'Backend Telemetry Pipeline Setup', 'Map & Dashboard Engineering', 'Field Device Testing & QA', 'Live Fleet Deployment']
  },
  {
    id: 'website-development',
    icon: Code,
    title: 'Web Application Development',
    overview: 'Scalable, high-performance web applications built with modern frontend frameworks and robust cloud APIs.',
    description: 'We architect and build responsive web applications focused on performance, accessibility, and clean code. From customer-facing platforms to enterprise SaaS products, our systems are built for long-term maintainability.',
    features: ['Component-Driven Architecture', 'Server-Side Rendering (SSR)', 'Core Web Vitals Optimization', 'Headless CMS & API Integration'],
    benefits: ['Sub-second page load times', 'Higher organic search visibility', 'Easier ongoing maintenance and scaling'],
    techStack: ['React 19', 'Next.js', 'Tailwind CSS', 'Node.js', 'TypeScript'],
    process: ['Technical Discovery', 'Architecture & Wireframes', 'Sprint Development', 'QA & Performance Audit', 'Deployment']
  },
  {
    id: 'crm',
    icon: Users,
    title: 'Internal Tools & Custom CRM',
    overview: 'Tailored operations dashboards, internal tooling, and customer relationship management systems.',
    description: 'We replace fragmented spreadsheets and rigid off-the-shelf software with purpose-built internal applications that match your exact operational workflows.',
    features: ['Granular Role-Based Permissions (RBAC)', 'Operational Analytics & KPI Dashboards', 'Automated Record Lifecycles', 'Third-Party API Webhooks'],
    benefits: ['Reduced operational bottlenecks', 'Centralized business records', 'Better team productivity'],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'GraphQL', 'Tailwind CSS'],
    process: ['Workflow Analysis', 'Database Schema Modeling', 'Interface Engineering', 'Data Migration', 'Team Onboarding']
  },
  {
    id: 'business-automation',
    icon: Settings,
    title: 'Workflow & Cloud Automation',
    overview: 'Background integrations, automated document processing, and cloud services that eliminate manual busywork.',
    description: 'We connect your disparate business tools, automate repetitive multi-step tasks, and deploy background worker queues that keep data synchronized in real time.',
    features: ['Event-Driven Webhook Pipelines', 'Automated Document & Invoice Generation', 'Scheduled Data Sync Jobs', 'Error Recovery & Dead-Letter Queues'],
    benefits: ['Elimination of manual re-keying', 'Faster customer turnaround', 'Reliable audit trails'],
    techStack: ['Node.js', 'Python', 'AWS Lambda', 'Redis BullMQ', 'Docker'],
    process: ['Process Mapping', 'Integration Architecture', 'Pipeline Development', 'Security & Error Testing', 'Monitoring Setup']
  },
  {
    id: 'ai-integration',
    icon: Brain,
    title: 'Applied AI & Model Integration',
    overview: 'Practical language model workflows, document intelligence, and predictive features embedded directly into your software.',
    description: 'We build purposeful AI features that solve concrete operational challenges—including retrieval-augmented generation (RAG), intelligent search, and automated ticket classification.',
    features: ['RAG & Document Intelligence', 'Custom LLM API Integrations', 'Domain-Specific Classification', 'Automated Sentiment & Intent Routing'],
    benefits: ['Faster customer support resolution', 'Automated document extraction', 'Actionable insights from unstructured data'],
    techStack: ['Python', 'OpenAI API', 'LangChain', 'PostgreSQL pgvector', 'AWS Bedrock'],
    process: ['Feasibility & Data Assessment', 'Prompt & Model Prototyping', 'API Integration', 'Evaluation & Guardrails', 'Production Monitoring']
  }
];

