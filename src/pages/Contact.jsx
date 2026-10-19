import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/common/Button';
import { Mail, Phone, MapPin, CheckCircle2, Clock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { publicApi } from '../lib/api';

export function Contact() {
  const [contactInfo, setContactInfo] = useState({
    email: 'sahendra2976@gmail.com',
    phone: '+91 93416 60370',
    address: 'Tower A, 3rd Floor, Unitech Cyber Park, Sector 39, Gurugram, Haryana, India',
    businessHours: 'Mon - Fri, 9:00 AM - 6:00 PM IST',
    socialLinks: {},
  });

  const initialForm = {
    firstName: '',
    lastName: '',
    businessEmail: '',
    phoneNumber: '',
    companyName: '',
    service: 'Website & Web App Development',
    budget: '',
    projectDetails: '',
    _gotcha: '',
  };

  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch dynamic contact info from database
  useEffect(() => {
    publicApi.getContactInfo()
      .then((res) => {
        if (res?.success && res.contact) {
          setContactInfo(res.contact);
        }
      })
      .catch((err) => console.error('Failed to load contact info:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) {
      errors.firstName = 'First Name is required.';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last Name is required.';
    }
    if (!formData.businessEmail.trim()) {
      errors.businessEmail = 'Business Email is required.';
    } else {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailRegex.test(formData.businessEmail.trim())) {
        errors.businessEmail = 'Please enter a valid business email address.';
      }
    }
    if (!formData.service.trim()) {
      errors.service = 'Primary Service is required.';
    }
    if (formData.budget.trim() && formData.budget.trim().length > 100) {
      errors.budget = 'Project budget must be 100 characters or less.';
    }
    if (!formData.projectDetails.trim()) {
      errors.projectDetails = 'Project Details & Technical Goals are required.';
    } else if (formData.projectDetails.trim().length < 10) {
      errors.projectDetails = 'Please provide at least 10 characters describing your project.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setFormStatus('submitting');
    setErrorMessage('');

    try {
      const res = await publicApi.submitContact(formData);
      if (res?.success) {
        setFormStatus('success');
        setFormData(initialForm);
      } else {
        setFormStatus('error');
        setErrorMessage(res?.error || `Unable to send message right now. Please email us directly at ${contactInfo.email}.`);
      }
    } catch (err) {
      setFormStatus('error');
      setErrorMessage(`Network error occurred. Please email us directly at ${contactInfo.email}.`);
    }
  };

  const handleReset = () => {
    setFormStatus('idle');
    setErrorMessage('');
    setFormErrors({});
    setFormData(initialForm);
  };

  return (
    <PageWrapper>
      {/* Editorial Hero */}
      <section className="bg-[#FFFFFF] py-10 md:py-12 lg:py-14 border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EEF3FF] border border-[#C9D7F5] text-xs font-mono font-bold tracking-wider text-[#0B1220] mb-4 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF]"></span>
              <span>DIRECT TECHNICAL SCOPING</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.15] mb-4">
              Let's Discuss Your Product Architecture & Milestones
            </h1>

            <p className="text-base sm:text-lg text-[#2B384E] leading-relaxed">
              Connect directly with our engineering team. Whether you need a technical audit, a new software MVP, or enterprise cloud scaling, we're ready to review your requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Grid: Details + Form */}
      <section className="py-10 md:py-12 lg:py-14 bg-[#F1F4F8] border-b border-[#E2E7EF]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 text-left">
            
            {/* Left Column: Dynamic Contact Channels & Location (5 cols) */}
            <div className="lg:col-span-5 space-y-5 md:space-y-6">
              <div>
                <span className="text-xs font-mono text-[#0B1220] font-bold uppercase tracking-wider block mb-2">
                  CONTACT CHANNELS
                </span>
                <h2 className="text-2xl font-bold text-[#0B1220] mb-4">
                  Headquarters & Inquiries
                </h2>
                <p className="text-sm text-[#2B384E] leading-relaxed">
                  We maintain strict NDA privacy standards. All inquiries are saved to our secure internal database and reviewed directly by engineering leads.
                </p>
              </div>

              <div className="space-y-4">
                {/* Phone */}
                {contactInfo.phone && (
                  <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] flex items-start gap-4 shadow-[0_4px_20px_rgba(17,24,39,0.04)] transition-all duration-200 group">
                    <div className="h-10 w-10 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#0B1220] group-hover:text-[#1677FF] shrink-0 transition-colors duration-200">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono text-[#0B1220] font-bold uppercase tracking-wider">Direct Phone</h3>
                      <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} className="text-base font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200 mt-0.5 block">
                        {contactInfo.phone}
                      </a>
                      <span className="text-[11px] text-[#2B384E]">{contactInfo.businessHours}</span>
                    </div>
                  </div>
                )}

                {/* Email */}
                {contactInfo.email && (
                  <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] flex items-start gap-4 shadow-[0_4px_20px_rgba(17,24,39,0.04)] transition-all duration-200 group">
                    <div className="h-10 w-10 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#0B1220] group-hover:text-[#1677FF] shrink-0 transition-colors duration-200">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono text-[#0B1220] font-bold uppercase tracking-wider">Engineering Email</h3>
                      <a href={`mailto:${contactInfo.email}`} className="text-base font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200 mt-0.5 block">
                        {contactInfo.email}
                      </a>
                      <span className="text-[11px] text-[#2B384E]">Response within 24 business hours</span>
                    </div>
                  </div>
                )}

                {/* Address */}
                {contactInfo.address && (
                  <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] flex items-start gap-4 shadow-[0_4px_20px_rgba(17,24,39,0.04)] transition-all duration-200 group">
                    <div className="h-10 w-10 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#0B1220] group-hover:text-[#1677FF] shrink-0 transition-colors duration-200">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono text-[#0B1220] font-bold uppercase tracking-wider">Corporate Office</h3>
                      <p className="text-sm font-semibold text-[#0B1220] mt-0.5 leading-snug">
                        {contactInfo.address}
                      </p>
                    </div>
                  </div>
                )}

                {/* Operating Standards */}
                <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] hover:border-[#BFDBFE] hover:bg-[#F8FAFF] flex items-start gap-4 shadow-[0_4px_20px_rgba(17,24,39,0.04)] transition-all duration-200 group">
                  <div className="h-10 w-10 rounded-lg bg-[#EEF3FF] border border-[#C9D7F5] flex items-center justify-center text-[#0B1220] group-hover:text-[#1677FF] shrink-0 transition-colors duration-200">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono text-[#0B1220] font-bold uppercase tracking-wider">Operating Standards</h3>
                    <p className="text-xs text-[#2B384E] mt-0.5 leading-relaxed">
                      Agile sprint cycles with 24/7 critical incident response on production enterprise SLAs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Project Inquiry Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#E2E7EF] shadow-sm">
                
                {formStatus === 'success' ? (
                  <div className="py-12 px-4 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0B1220]">Inquiry Received Successfully</h3>
                    <p className="text-sm text-[#2B384E] max-w-md mx-auto leading-relaxed">
                      Thank you for submitting your project specifications. Our engineering leadership has logged your requirements in our secure pipeline and will schedule a scoping call within 24 hours.
                    </p>
                    <div className="pt-4">
                      <Button onClick={handleReset} variant="outline" size="sm">
                        Submit Another Inquiry
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-left font-mono text-xs">
                    
                    {/* Honeypot field for anti-spam bots */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="_gotcha">Do not fill this field</label>
                      <input
                        type="text"
                        id="_gotcha"
                        name="_gotcha"
                        value={formData._gotcha}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div className="border-b border-[#E8ECF2] pb-4 mb-2">
                      <h3 className="text-lg font-bold text-[#0B1220] font-sans">Project Scoping Inquiry</h3>
                      <p className="text-xs text-[#596579] font-sans mt-0.5">
                        Fill in your technical goals below. We respond with a preliminary architecture breakdown and milestone estimates.
                      </p>
                    </div>

                    {formStatus === 'error' && (
                      <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-red-700">
                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
                        <div className="text-left font-sans">
                          <p className="text-xs font-bold">Submission Error</p>
                          <p className="text-xs mt-0.5">{errorMessage || `Unable to send message right now. Please email us directly at ${contactInfo.email}.`}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-[#0B1220] mb-1.5 font-bold">FIRST NAME *</label>
                        <input 
                          type="text" 
                          id="firstName" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          aria-required="true"
                          aria-invalid={Boolean(formErrors.firstName)}
                          aria-describedby={formErrors.firstName ? "firstName-error" : undefined}
                          className={`w-full px-3.5 py-2.5 bg-[#F7F8FA] border rounded-lg text-[#0B1220] placeholder-[#7A8494] focus:outline-none focus:bg-[#FFFFFF] text-xs font-sans transition-colors duration-200 ${
                            formErrors.firstName ? 'border-red-500 focus:border-red-500' : 'border-[#E2E7EF] focus:border-[#1677FF]'
                          }`}
                          placeholder="John" 
                        />
                        {formErrors.firstName && (
                          <p id="firstName-error" className="text-red-500 text-[11px] font-sans mt-1">{formErrors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-[#0B1220] mb-1.5 font-bold">LAST NAME *</label>
                        <input 
                          type="text" 
                          id="lastName" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          aria-required="true"
                          aria-invalid={Boolean(formErrors.lastName)}
                          aria-describedby={formErrors.lastName ? "lastName-error" : undefined}
                          className={`w-full px-3.5 py-2.5 bg-[#F7F8FA] border rounded-lg text-[#0B1220] placeholder-[#7A8494] focus:outline-none focus:bg-[#FFFFFF] text-xs font-sans transition-colors duration-200 ${
                            formErrors.lastName ? 'border-red-500 focus:border-red-500' : 'border-[#E2E7EF] focus:border-[#1677FF]'
                          }`}
                          placeholder="Doe" 
                        />
                        {formErrors.lastName && (
                          <p id="lastName-error" className="text-red-500 text-[11px] font-sans mt-1">{formErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="businessEmail" className="block text-[#0B1220] mb-1.5 font-bold">BUSINESS EMAIL *</label>
                        <input 
                          type="email" 
                          id="businessEmail" 
                          name="businessEmail"
                          value={formData.businessEmail}
                          onChange={handleChange}
                          aria-required="true"
                          aria-invalid={Boolean(formErrors.businessEmail)}
                          aria-describedby={formErrors.businessEmail ? "businessEmail-error" : undefined}
                          className={`w-full px-3.5 py-2.5 bg-[#F7F8FA] border rounded-lg text-[#0B1220] placeholder-[#7A8494] focus:outline-none focus:bg-[#FFFFFF] text-xs font-sans transition-colors duration-200 ${
                            formErrors.businessEmail ? 'border-red-500 focus:border-red-500' : 'border-[#E2E7EF] focus:border-[#1677FF]'
                          }`}
                          placeholder="john@company.com" 
                        />
                        {formErrors.businessEmail && (
                          <p id="businessEmail-error" className="text-red-500 text-[11px] font-sans mt-1">{formErrors.businessEmail}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="phoneNumber" className="block text-[#0B1220] mb-1.5 font-bold">PHONE NUMBER</label>
                        <input 
                          type="tel" 
                          id="phoneNumber" 
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-[#F7F8FA] border border-[#E2E7EF] rounded-lg text-[#0B1220] placeholder-[#7A8494] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#1677FF] text-xs font-sans transition-colors duration-200" 
                          placeholder="+1 (555) 000-0000" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="companyName" className="block text-[#0B1220] mb-1.5 font-bold">COMPANY NAME</label>
                        <input 
                          type="text" 
                          id="companyName" 
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-[#F7F8FA] border border-[#E2E7EF] rounded-lg text-[#0B1220] placeholder-[#7A8494] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#1677FF] text-xs font-sans transition-colors duration-200" 
                          placeholder="Acme Technologies" 
                        />
                      </div>

                      <div>
                        <label htmlFor="budget" className="block text-[#0B1220] mb-1.5 font-bold">PROJECT BUDGET</label>
                        <input 
                          type="text" 
                          id="budget" 
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          placeholder="e.g. $10,000 - $25,000 USD"
                          aria-invalid={Boolean(formErrors.budget)}
                          aria-describedby={formErrors.budget ? "budget-error" : undefined}
                          className={`w-full px-3.5 py-2.5 bg-[#F7F8FA] border rounded-lg text-[#0B1220] focus:outline-none focus:bg-[#FFFFFF] text-xs font-sans transition-colors duration-200 ${
                            formErrors.budget ? 'border-red-500 focus:border-red-500' : 'border-[#E2E7EF] focus:border-[#1677FF]'
                          }`}
                        />
                        {formErrors.budget && (
                          <p id="budget-error" className="text-red-500 text-[11px] font-sans mt-1">{formErrors.budget}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="service" className="block text-[#0B1220] mb-1.5 font-bold">PRIMARY SERVICE REQUIRED *</label>
                      <select 
                        id="service" 
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        aria-required="true"
                        aria-invalid={Boolean(formErrors.service)}
                        aria-describedby={formErrors.service ? "service-error" : undefined}
                        className={`w-full px-3.5 py-2.5 bg-[#F7F8FA] border rounded-lg text-[#0B1220] font-medium focus:outline-none focus:bg-[#FFFFFF] text-xs font-sans transition-colors duration-200 ${
                          formErrors.service ? 'border-red-500 focus:border-red-500' : 'border-[#E2E7EF] focus:border-[#1677FF]'
                        }`}
                      >
                        <option>Website & Web App Development</option>
                        <option>Mobile App Development (iOS & Android)</option>
                        <option>E-commerce Platform & Checkout</option>
                        <option>Admin Panels & Enterprise CRM</option>
                        <option>Cloud Workflow & Business Automation</option>
                        <option>AI API & Intelligent Systems</option>
                        <option>Comprehensive Architecture Audit</option>
                        <option>Other</option>
                      </select>
                      {formErrors.service && (
                        <p id="service-error" className="text-red-500 text-[11px] font-sans mt-1">{formErrors.service}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="projectDetails" className="block text-[#0B1220] mb-1.5 font-bold">PROJECT DETAILS & TECHNICAL GOALS *</label>
                      <textarea 
                        id="projectDetails" 
                        name="projectDetails"
                        rows={4} 
                        value={formData.projectDetails}
                        onChange={handleChange}
                        aria-required="true"
                        aria-invalid={Boolean(formErrors.projectDetails)}
                        aria-describedby={formErrors.projectDetails ? "projectDetails-error" : undefined}
                        className={`w-full px-3.5 py-2.5 bg-[#F7F8FA] border rounded-lg text-[#0B1220] placeholder-[#7A8494] focus:outline-none focus:bg-[#FFFFFF] text-xs font-sans leading-relaxed transition-colors duration-200 ${
                          formErrors.projectDetails ? 'border-red-500 focus:border-red-500' : 'border-[#E2E7EF] focus:border-[#1677FF]'
                        }`}
                        placeholder="Please describe your key milestones, user scale, tech stack preferences, and target deployment timeline..."
                      />
                      {formErrors.projectDetails && (
                        <p id="projectDetails-error" className="text-red-500 text-[11px] font-sans mt-1">{formErrors.projectDetails}</p>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full gap-2" 
                        size="default"
                        disabled={formStatus === 'submitting'}
                      >
                        {formStatus === 'submitting' ? (
                          <>
                            <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                            <span>Sending Inquiry...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Project Inquiry</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>

                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

export default Contact;
