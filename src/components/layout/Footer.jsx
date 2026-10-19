import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Globe } from "lucide-react";
import { Logo } from "../common/Logo";

import { publicApi } from "../../lib/api";

export function Footer() {
  const [contact, setContact] = React.useState({
    email: "rajankitt01@gmail.com",
    phone: "+91 93416 60370",
    address: "Tower A, 3rd Floor, Unitech Cyber Park, Sector 39, Gurugram, Haryana, India",
    socialLinks: {}
  });

  React.useEffect(() => {
    publicApi.getContactInfo()
      .then(d => {
        if (d?.success && d.contact) setContact(d.contact);
      })
      .catch(() => {});
  }, []);

  return (
    <footer 
      className="relative bg-[#060C1B] border-t border-[#131F37] text-[#94A3B8] text-sm overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-12 md:pt-14 pb-8 md:pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-10 md:pb-12 border-b border-[#131F37]">
          
          {/* Brand & Value Proposition */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <Logo size="md" theme="dark" />
            
            <p className="text-[#94A3B8] leading-relaxed max-w-sm text-sm">
              StitchX Global Technology is an enterprise software engineering studio. We architect and build resilient web platforms, mobile systems, and intelligent automated workflows for fast-growing companies worldwide.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-[#94A3B8]">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {contact.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#38BDF8] shrink-0" />
                <a 
                  href={`tel:${contact.phone?.replace(/\s+/g, '')}`} 
                  className="hover:text-[#38BDF8] transition-colors"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Our Services */}
          <div className="text-left">
            <h3 className="text-base font-semibold text-white tracking-tight mb-4">
              Our Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link 
                  to="/services/graphics-web-designing" 
                  className="inline-block text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                >
                  Graphics & Web Designing
                </Link>
              </li>
              <li>
                <Link 
                  to="/services/cms-website-development" 
                  className="inline-block text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                >
                  CMS Website Development
                </Link>
              </li>
              <li>
                <Link 
                  to="/services/mobile-app-development" 
                  className="inline-block text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                >
                  Mobile App Development
                </Link>
              </li>
              <li>
                <Link 
                  to="/services/custom-application-development" 
                  className="inline-block text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                >
                  Custom Application Development
                </Link>
              </li>
              <li>
                <Link 
                  to="/services/ecommerce" 
                  className="inline-block text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                >
                  E-commerce Solutions
                </Link>
              </li>
              <li>
                <Link 
                  to="/services/digital-marketing" 
                  className="inline-block text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                >
                  Digital Marketing Campaign
                </Link>
              </li>
              <li>
                <Link 
                  to="/services/gps-tracking-solution" 
                  className="inline-block text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                >
                  GPS Tracking Solution
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h3 className="text-base font-semibold text-white tracking-tight mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link 
                  to="/" 
                  className="inline-block text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="inline-block text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/portfolio" 
                  className="inline-block text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                >
                  Our Portfolio
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="inline-block text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="inline-block text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/careers" 
                  className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                >
                  <span>Careers</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 font-medium">
                    Hiring
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Let's Connect */}
          <div className="text-left space-y-4">
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight mb-4">
                Let's Connect
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <div className="text-xs text-[#64748B] mb-0.5">Business Email:</div>
                  <a 
                    href="mailto:hello@stitchxglobal.in" 
                    className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                  >
                    hello@stitchxglobal.in
                  </a>
                </li>
                <li>
                  <div className="text-xs text-[#64748B] mb-0.5">Website:</div>
                  <a 
                    href="https://stitchxglobal.in" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors duration-200"
                  >
                    stitchxglobal.in
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Icons */}
            <div className="pt-1">
              <div className="flex items-center gap-3">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="p-2 rounded-lg bg-[#111C33]/60 text-[#38BDF8] hover:text-white hover:bg-[#38BDF8]/20 transition-all duration-200 border border-[#1E293B]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.92 0-1.66.74-1.66 1.66 0 .92.74 1.66 1.66 1.66.92 0 1.66-.74 1.66-1.66Z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="p-2 rounded-lg bg-[#111C33]/60 text-[#38BDF8] hover:text-white hover:bg-[#38BDF8]/20 transition-all duration-200 border border-[#1E293B]"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="p-2 rounded-lg bg-[#111C33]/60 text-[#38BDF8] hover:text-white hover:bg-[#38BDF8]/20 transition-all duration-200 border border-[#1E293B]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 hover:gap-2.5 text-xs font-semibold text-[#38BDF8] hover:text-white transition-all duration-200 group"
              >
                <span>Request Project Estimate</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Security Bar */}
        <div className="pt-6 sm:pt-7 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#38BDF8]" />
            <span>© {new Date().getFullYear()} StitchX Global Technology. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link 
              to="/privacy" 
              className="text-[#64748B] hover:text-[#38BDF8] transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-[#64748B] hover:text-[#38BDF8] transition-colors duration-200"
            >
              Terms of Engagement
            </Link>
            <Link 
              to="/privacy" 
              className="text-[#64748B] hover:text-[#38BDF8] transition-colors duration-200"
            >
              Security Standards
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
