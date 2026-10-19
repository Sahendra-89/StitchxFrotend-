import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Code-split route components for optimal initial payload and Core Web Vitals
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const ServiceDetails = lazy(() => import('./pages/ServiceDetails').then(m => ({ default: m.ServiceDetails })));
const Portfolio = lazy(() => import('./pages/Portfolio').then(m => ({ default: m.Portfolio })));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails').then(m => ({ default: m.ProjectDetails })));
const Industries = lazy(() => import('./pages/Industries').then(m => ({ default: m.Industries })));
const Careers = lazy(() => import('./pages/Careers').then(m => ({ default: m.Careers })));
const JobDetails = lazy(() => import('./pages/JobDetails').then(m => ({ default: m.JobDetails })));
const Reviews = lazy(() => import('./pages/Reviews').then(m => ({ default: m.Reviews })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const BlogDetails = lazy(() => import('./pages/BlogDetails').then(m => ({ default: m.BlogDetails })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Privacy = lazy(() => import('./pages/Legal').then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages/Legal').then(m => ({ default: m.Terms })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminLogin = lazy(() => import('./pages/AdminLogin').then(m => ({ default: m.AdminLogin })));

function RouteLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-6" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <span className="inline-block h-6 w-6 rounded-full border-2 border-[#1677FF]/20 border-t-[#1677FF] animate-spin" aria-hidden="true" />
        <span className="text-xs font-mono text-[#596579] font-medium tracking-wide">Loading System Module...</span>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:id" element={<ProjectDetails />} />
          
          <Route path="/industries" element={<Industries />} />
          
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:id" element={<JobDetails />} />
          
          <Route path="/reviews" element={<Reviews />} />
          
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Admin Dashboard & Management Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Explicit 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;
