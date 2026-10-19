import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight, Phone, Mail, MapPin, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../common/Logo";

const serviceItems = [
  { name: "Graphics & Web Designing", href: "/services/graphics-web-designing" },
  { name: "CMS Website Development", href: "/services/cms-website-development" },
  { name: "Mobile App Development", href: "/services/mobile-app-development" },
  { name: "Custom Application Development", href: "/services/custom-application-development" },
  { name: "E-commerce Solutions", href: "/services/ecommerce" },
  { name: "Digital Marketing Campaign", href: "/services/digital-marketing" },
  { name: "GPS Tracking Solution", href: "/services/gps-tracking-solution" },
];

const navLinks = [
  { name: "Portfolio", href: "/portfolio" },
  { name: "Industries", href: "/industries" },
  { name: "About", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Reviews", href: "/reviews" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setServicesDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isServicesActive = location.pathname.startsWith("/services");

  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#2563EB] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white text-xs font-mono font-bold"
      >
        Skip to main content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
          isScrolled
            ? "bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E2E7EF]/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
          aria-label="Main Navigation"
        >
          <div className="flex items-center justify-between h-18">
            {/* Brand Logo */}
            <div className="flex items-center">
              <Logo size="md" />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Home Link */}
              <Link
                to="/"
                aria-current={location.pathname === "/" ? "page" : undefined}
                className={`px-3.5 py-1.5 text-sm font-bold rounded-md transition-colors duration-200 relative ${
                  location.pathname === "/"
                    ? "text-[#000000] bg-black/5"
                    : "text-[#000000] hover:text-[#1677FF] hover:bg-black/5"
                }`}
              >
                Home
                {location.pathname === "/" && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#000000] rounded-full" />
                )}
              </Link>

              {/* Services with Dropdown */}
              <div 
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setServicesDropdownOpen((prev) => !prev)}
                  aria-expanded={servicesDropdownOpen}
                  className={`inline-flex items-center gap-1 px-3.5 py-1.5 text-sm font-bold rounded-md transition-colors duration-200 relative cursor-pointer ${
                    isServicesActive
                      ? "text-[#000000] bg-black/5"
                      : "text-[#000000] hover:text-[#1677FF] hover:bg-black/5"
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 text-[#1677FF] ${
                      servicesDropdownOpen ? "rotate-180" : ""
                    }`} 
                  />
                  {isServicesActive && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#000000] rounded-full" />
                  )}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {servicesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-0.5 w-64 bg-white rounded-xl shadow-2xl border border-[#E2E7EF] py-2 z-50 text-left overflow-hidden"
                    >
                      <div className="py-1">
                        {serviceItems.map((item) => {
                          const isActive = location.pathname === item.href;
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              onClick={() => setServicesDropdownOpen(false)}
                              className={`block px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                                isActive
                                  ? "text-[#1677FF] bg-[#EEF3FF] font-semibold"
                                  : "text-[#1E293B] hover:text-[#1677FF] hover:bg-[#EEF3FF]"
                              }`}
                            >
                              {item.name}
                            </Link>
                          );
                        })}
                      </div>

                      <div className="pt-2 pb-1 border-t border-[#F1F4F8] px-4">
                        <Link
                          to="/services"
                          onClick={() => setServicesDropdownOpen(false)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1677FF] hover:text-[#2563EB] transition-colors py-1 group"
                        >
                          <span>View All Services</span>
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Navigation Links */}
              {navLinks.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href + '/'));
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`px-3.5 py-1.5 text-sm font-bold rounded-md transition-colors duration-200 relative ${
                      isActive
                        ? "text-[#000000] bg-black/5"
                        : "text-[#000000] hover:text-[#1677FF] hover:bg-black/5"
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#000000] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Action Button */}
            <div className="hidden lg:flex items-center space-x-2.5">
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-[#000000] text-[#FFFFFF] hover:bg-[#1677FF] transition-all duration-200 shadow-xs active:scale-[0.98]"
              >
                <span>Discuss Your Project</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="p-2 rounded-lg border border-[#000000]/15 bg-transparent text-[#000000] hover:text-[#1677FF] hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition-colors duration-200"
                onClick={() => setMobileMenuOpen(true)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
                aria-label="Open Navigation Menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden="true"
              />
              <motion.div
                id="mobile-navigation-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile Navigation Menu"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 240 }}
                className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#FFFFFF] border-l border-[#E2E7EF] p-6 flex flex-col justify-between overflow-y-auto lg:hidden shadow-2xl text-[#000000]"
              >
                <div>
                  <div className="flex items-center justify-between pb-5 border-b border-[#E2E7EF]">
                    <Logo size="sm" onClick={() => setMobileMenuOpen(false)} />
                    <button
                      type="button"
                      className="p-1.5 rounded-lg border border-[#E2E7EF] text-[#000000] hover:text-[#1677FF] hover:bg-black/5 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                      aria-label="Close navigation menu"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="py-5 space-y-1">
                    {/* Home Link on Mobile */}
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-colors duration-200 ${
                        location.pathname === "/"
                          ? "bg-black/5 text-[#000000]"
                          : "text-[#000000] hover:text-[#1677FF] hover:bg-black/5"
                      }`}
                    >
                      <span>Home</span>
                      {location.pathname === "/" && <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF]" />}
                    </Link>

                    {/* Services Accordion for Mobile */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setMobileServicesOpen((prev) => !prev)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-colors duration-200 ${
                          isServicesActive
                            ? "bg-black/5 text-[#000000]"
                            : "text-[#000000] hover:text-[#1677FF] hover:bg-black/5"
                        }`}
                      >
                        <span>Services</span>
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform duration-200 text-[#1677FF] ${
                            mobileServicesOpen ? "rotate-180" : ""
                          }`} 
                        />
                      </button>

                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-3 pr-1 py-1 space-y-1 border-l-2 border-[#1677FF]/20 ml-3 mt-1"
                          >
                            {serviceItems.map((item) => (
                              <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 text-xs font-medium text-[#475569] hover:text-[#1677FF] hover:bg-black/5 rounded-md transition-colors"
                              >
                                {item.name}
                              </Link>
                            ))}
                            <Link
                              to="/services"
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-3 py-2 text-xs font-bold text-[#1677FF] hover:underline"
                            >
                              View All Services →
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Other Nav Links on Mobile */}
                    {navLinks.map((item) => {
                      const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href + '/'));
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-colors duration-200 ${
                            isActive
                              ? "bg-black/5 text-[#000000]"
                              : "text-[#000000] hover:text-[#1677FF] hover:bg-black/5"
                          }`}
                        >
                          <span>{item.name}</span>
                          {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF]" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Drawer Bottom Info */}
                <div className="pt-5 border-t border-[#E2E7EF] space-y-3">
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="group w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-[#000000] text-[#FFFFFF] hover:bg-[#1677FF] transition-all duration-200 shadow-xs"
                  >
                    <span>Start a Project</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>

                  <div className="space-y-2 text-xs text-[#2B384E] pt-2">
                    <a href="tel:+919341660370" className="flex items-center gap-2 hover:text-[#1677FF] transition-colors">
                      <Phone className="h-3.5 w-3.5 text-[#1677FF]" />
                      <span className="text-[#000000] font-semibold">+91 93416 60370</span>
                    </a>
                    <a href="mailto:sahendra2976@gmail.com" className="flex items-center gap-2 hover:text-[#1677FF] transition-colors">
                      <Mail className="h-3.5 w-3.5 text-[#1677FF]" />
                      <span className="text-[#000000] font-semibold">sahendra2976@gmail.com</span>
                    </a>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#1677FF] shrink-0 mt-0.5" />
                      <span className="text-[#000000] font-semibold">Sector 39, Gurugram, Haryana</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default Header;
