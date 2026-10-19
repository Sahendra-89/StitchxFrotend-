export const projects = [
  {
    id: 'health-app',
    title: 'HealthTrack Mobile',
    category: 'Mobile Apps',
    description: 'A secure patient monitoring mobile application with real-time biometric synchronization and clinic scheduling.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80',
    techStack: ['React Native', 'Node.js', 'PostgreSQL', 'AWS'],
    clientChallenge: 'The startup needed to capture and transmit patient vitals securely with offline resilience and strict medical data privacy standards.',
    ourSolution: 'Architected a cross-platform mobile app using React Native with end-to-end payload encryption and background sync to AWS.',
    features: ['Real-time Vitals Tracking', 'Encrypted Patient Messaging', 'Integrated Appointment Scheduling', 'Offline Data Synchronization'],
    results: 'Increased patient engagement by 40% in the first 3 months.',
    process: ['Discovery & Clinical Scoping', 'HIPAA Security Architecture', 'Mobile Development', 'Penetration Testing', 'App Store Deployment']
  },
  {
    id: 'edu-platform',
    title: 'LearnNova Platform',
    category: 'Websites',
    description: 'A high-concurrency virtual learning platform supporting low-latency video delivery and interactive assessments.',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80',
    techStack: ['React 19', 'Next.js', 'PostgreSQL', 'Vercel CDN'],
    clientChallenge: 'The educational institution required a reliable remote learning infrastructure capable of sustaining concurrent exam sessions without latency degradation.',
    ourSolution: 'Delivered an autoscaling Next.js and PostgreSQL architecture with adaptive bitrate streaming via CDN edge caching.',
    features: ['Adaptive Video Streaming', 'Interactive Evaluation Engine', 'Real-Time Progress Tracking', 'Role-Based Educator Dashboards'],
    results: 'Successfully onboarded 10,000+ students with 99.9% uptime.',
    process: ['Requirements Discovery', 'Architecture & Schema Design', 'Frontend & Video Pipeline', 'Concurrency Stress Testing', 'Staged Rollout']
  },
  {
    id: 'retail-ecommerce',
    title: 'StyleStore E-commerce',
    category: 'E-commerce',
    description: 'A headless commerce storefront with sub-second page transitions, predictive catalog search, and checkout optimization.',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80',
    techStack: ['Shopify Plus', 'Next.js', 'Tailwind CSS', 'Stripe'],
    clientChallenge: 'A legacy monolithic storefront suffered from slow mobile load times and high cart abandonment during seasonal promotional peaks.',
    ourSolution: 'Engineered a decoupled headless frontend with Shopify Plus APIs, edge-rendered product catalogs, and accelerated checkout.',
    features: ['Headless Storefront Architecture', 'Instant Dynamic Faceted Filtering', 'One-Click Checkout Optimization', 'Automated Inventory Webhooks'],
    results: 'Conversion rate increased by 25% and page load speed improved by 60%.',
    process: ['Performance & UX Audit', 'Interface Engineering', 'API & Gateway Integration', 'Data Migration', 'Peak Load Verification']
  },
  {
    id: 'finance-dashboard',
    title: 'FinMetrics Dashboard',
    category: 'Dashboards',
    description: 'A real-time institutional investment analytics platform with multi-asset financial charting and automated compliance exports.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
    techStack: ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
    clientChallenge: 'Investment analysts required sub-second visual updates across volatile financial datasets without browser performance throttling.',
    ourSolution: 'Built a streaming dashboard leveraging D3.js and WebSocket connections to a Python analytics pipeline for real-time reporting.',
    features: ['Sub-Second WebSocket Feeds', 'Configurable Multi-Asset Visualizations', 'Custom Formula Calculation Engine', 'Automated Audit-Ready Report Generation'],
    results: 'Reduced data analysis turnaround from hours to minutes.',
    process: ['Financial Data Modeling', 'High-Frequency Schema Design', 'UI/UX & Chart Prototyping', 'Engine Integration', 'Security & Audit Sign-Off']
  },
  {
    id: 'logistics-crm',
    title: 'LogiFlow CRM',
    category: 'CRM',
    description: 'A centralized supply chain and carrier management platform with automated milestone tracking and invoice reconciliation.',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    clientChallenge: 'Disparate carrier systems and manual spreadsheet tracking caused frequent communication bottlenecks and shipping dispatch delays.',
    ourSolution: 'Constructed a unified logistics dashboard with automated webhook tracking, customer dispatch alerts, and ERP invoicing sync.',
    features: ['Real-Time Shipment Milestone Tracking', 'Carrier API Dispatch Integration', 'Dedicated Self-Service Customer Portal', 'Automated Billing & Invoice Generation'],
    results: 'Improved operational efficiency by 35% and reduced manual errors.',
    process: ['Workflow & Bottleneck Analysis', 'Database Schema Modeling', 'Core Application Development', 'Carrier System Integration', 'User Training & Rollout']
  },
  {
    id: 'ai-customer-service',
    title: 'SmartSupport AI',
    category: 'AI',
    description: 'A context-aware customer support platform integrating domain-specific AI models with human agent workflows.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80',
    techStack: ['Node.js', 'Python', 'OpenAI API', 'React', 'PostgreSQL pgvector'],
    clientChallenge: 'Tier-1 support volume was overwhelming human representatives with repetitive inquiries, slowing critical resolution times.',
    ourSolution: 'Deployed an intelligent intent-routing assistant with retrieval-augmented generation and automatic agent escalation.',
    features: ['Retrieval-Augmented Domain Q&A', 'Automated Confidence-Score Escalation', 'Real-Time Sentiment & Topic Analytics', 'Seamless CRM Ticket Synchronization'],
    results: 'Reduced average response time by 80% and saved 40 hours/week in support time.',
    process: ['Knowledge Corpus Structuring', 'RAG Pipeline Prototyping', 'Safety Guardrail Implementation', 'Agent Console Integration', 'Live Production Testing']
  }
];

export const categories = ['All', 'Websites', 'Mobile Apps', 'E-commerce', 'CRM', 'Dashboards', 'AI'];
