import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Briefcase, MapPin, Clock, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, Upload, FileText, X } from 'lucide-react';
import { Button } from '../components/common/Button';
import { publicApi } from '../lib/api';

export function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const initialForm = {
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    resumeUrl: '',
    portfolioUrl: '',
  };

  const [formData, setFormData] = useState(initialForm);
  const [resumeFile, setResumeFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setNotFound(false);

    publicApi.getJobById(id)
      .then((res) => {
        if (isCancelled) return;
        if (res?.success && res.job) {
          setJob(res.job);
          document.title = `${res.job.title} — Careers at StitchX Global Technology`;
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        console.error('Failed to load job details:', err);
        if (!isCancelled) setNotFound(true);
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [id]);

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, resume: 'File exceeds 10MB limit.' }));
        return;
      }
      setResumeFile(file);
      setFormErrors((prev) => ({ ...prev, resume: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Please enter a valid email address.';
      }
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    }

    if (!resumeFile && !formData.resumeUrl.trim()) {
      errors.resume = 'Please upload your resume file (PDF/DOC) or provide a resume link.';
    } else if (formData.resumeUrl.trim() && !resumeFile) {
      try {
        new URL(formData.resumeUrl.trim());
      } catch {
        errors.resumeUrl = 'Please enter a valid URL (starting with http:// or https://).';
      }
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
      const fd = new FormData();
      fd.append('jobId', job.id);
      fd.append('appliedPosition', job.title);
      fd.append('fullName', formData.fullName);
      fd.append('email', formData.email);
      fd.append('phone', formData.phone);
      fd.append('experience', formData.experience);
      fd.append('portfolioUrl', formData.portfolioUrl);

      if (resumeFile) {
        fd.append('resumeFile', resumeFile);
      } else if (formData.resumeUrl) {
        fd.append('resumeUrl', formData.resumeUrl);
      }

      const res = await publicApi.applyForJob(fd);
      if (res?.success) {
        setFormStatus('success');
        setFormData(initialForm);
        setResumeFile(null);
      } else {
        setFormStatus('error');
        setErrorMessage(res?.error || 'Unable to submit application. Please try again.');
      }
    } catch (err) {
      setFormStatus('error');
      setErrorMessage('Network error occurred. Please check your connection and try again.');
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-[60vh] flex items-center justify-center py-20 bg-white">
          <div className="flex flex-col items-center gap-3">
            <span className="h-6 w-6 rounded-full border-2 border-[#1677FF]/20 border-t-[#1677FF] animate-spin" />
            <span className="text-xs font-mono text-[#596579]">Loading Career Opening...</span>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (notFound || !job) {
    return (
      <PageWrapper>
        <section className="py-20 bg-white text-center">
          <div className="container mx-auto px-4 max-w-xl">
            <h1 className="text-3xl font-extrabold text-[#0B1220] mb-3">Position Closed or Unavailable</h1>
            <p className="text-sm text-[#596579] mb-6">
              This job opening has been filled, closed, or is no longer accepting new candidate applications.
            </p>
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1677FF] text-white rounded-lg text-xs font-mono font-bold hover:bg-[#005AD8]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Active Openings</span>
            </Link>
          </div>
        </section>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Editorial Hero */}
      <section className="bg-[#FFFFFF] py-10 md:py-12 border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Link 
            to="/careers" 
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#0B1220] hover:text-[#1677FF] transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span>Back to Open Positions</span>
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded bg-[#EEF3FF] border border-[#C9D7F5] text-xs font-mono font-bold text-[#0B1220]">
                {job.department}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#F1F4F8] border border-[#E2E7EF] text-xs font-mono text-[#596579]">
                {job.jobType}
              </span>
              {job.experience && (
                <span className="px-2.5 py-0.5 rounded bg-[#F1F4F8] border border-[#E2E7EF] text-xs font-mono text-[#596579]">
                  {job.experience}
                </span>
              )}
              {job.salaryRange && (
                <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 font-bold">
                  {job.salaryRange}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.15] mb-4">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#596579]">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#1677FF]" />
                {job.location}
              </span>
              {job.applicationDeadline && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#596579]" />
                  Application Deadline: {job.applicationDeadline}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Specs + Application Form */}
      <section className="py-10 md:py-14 bg-[#F7F8FA]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 text-left">
            
            {/* Left Column: Job Description & Specs (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Short Summary */}
              <div className="bg-white border border-[#E2E7EF] rounded-xl p-6 sm:p-7 shadow-2xs">
                <h2 className="text-base font-bold text-[#0B1220] mb-3">Role Overview</h2>
                <p className="text-sm text-[#2B384E] leading-relaxed">
                  {job.shortDescription}
                </p>
              </div>

              {/* Responsibilities */}
              {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
                <div className="bg-white border border-[#E2E7EF] rounded-xl p-6 sm:p-7 shadow-2xs space-y-4">
                  <h2 className="text-base font-bold text-[#0B1220]">Core Responsibilities</h2>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-[#2B384E] leading-relaxed list-disc pl-5">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {Array.isArray(job.requirements) && job.requirements.length > 0 && (
                <div className="bg-white border border-[#E2E7EF] rounded-xl p-6 sm:p-7 shadow-2xs space-y-4">
                  <h2 className="text-base font-bold text-[#0B1220]">Technical Qualifications & Requirements</h2>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-[#2B384E] leading-relaxed list-disc pl-5">
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nice to have */}
              {Array.isArray(job.niceToHave) && job.niceToHave.length > 0 && (
                <div className="bg-white border border-[#E2E7EF] rounded-xl p-6 sm:p-7 shadow-2xs space-y-4">
                  <h2 className="text-base font-bold text-[#0B1220]">Bonus Skills & Nice to Haves</h2>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-[#2B384E] leading-relaxed list-disc pl-5">
                    {job.niceToHave.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {Array.isArray(job.benefits) && job.benefits.length > 0 && (
                <div className="bg-white border border-[#E2E7EF] rounded-xl p-6 sm:p-7 shadow-2xs space-y-4">
                  <h2 className="text-base font-bold text-[#0B1220]">Team Compensation & Benefits</h2>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-[#2B384E] leading-relaxed list-disc pl-5">
                    {job.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Application Form (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-[#E2E7EF] rounded-2xl p-6 sm:p-8 shadow-sm sticky top-24">
                <div className="mb-6">
                  <span className="text-[11px] font-mono text-[#1677FF] font-bold uppercase tracking-wider block mb-1">
                    CANDIDATE APPLICATION
                  </span>
                  <h2 className="text-xl font-bold text-[#0B1220]">Apply for this Position</h2>
                  <p className="text-xs text-[#596579] mt-1">
                    Direct submission to StitchX Global Technology engineering hiring leads. We respect your data confidentiality.
                  </p>
                </div>

                {formStatus === 'success' ? (
                  <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h3 className="text-base font-bold text-emerald-800">Application Received!</h3>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Thank you for applying for the <strong>{job.title}</strong> role. Our engineering recruitment team will review your profile and reach out within 3 business days.
                    </p>
                    <button
                      onClick={() => setFormStatus('idle')}
                      className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                    >
                      Submit Another Application
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {formStatus === 'error' && (
                      <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{errorMessage || 'Failed to submit application. Please verify details.'}</span>
                      </div>
                    )}

                    <div>
                      <label htmlFor="fullName" className="block text-[11px] font-mono font-bold text-[#0B1220] mb-1">
                        FULL NAME *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Sarah Jenkins"
                        className={`w-full px-3.5 py-2.5 bg-[#F7F8FA] border rounded-lg text-xs text-[#0B1220] focus:outline-none focus:bg-white transition-colors ${
                          formErrors.fullName ? 'border-red-500' : 'border-[#E2E7EF] focus:border-[#1677FF]'
                        }`}
                      />
                      {formErrors.fullName && <p className="text-red-500 text-[10px] mt-1">{formErrors.fullName}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-[11px] font-mono font-bold text-[#0B1220] mb-1">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="sarah@example.com"
                        className={`w-full px-3.5 py-2.5 bg-[#F7F8FA] border rounded-lg text-xs text-[#0B1220] focus:outline-none focus:bg-white transition-colors ${
                          formErrors.email ? 'border-red-500' : 'border-[#E2E7EF] focus:border-[#1677FF]'
                        }`}
                      />
                      {formErrors.email && <p className="text-red-500 text-[10px] mt-1">{formErrors.email}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label htmlFor="phone" className="block text-[11px] font-mono font-bold text-[#0B1220] mb-1">
                          PHONE NUMBER *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className={`w-full px-3.5 py-2.5 bg-[#F7F8FA] border rounded-lg text-xs text-[#0B1220] focus:outline-none focus:bg-white transition-colors ${
                            formErrors.phone ? 'border-red-500' : 'border-[#E2E7EF] focus:border-[#1677FF]'
                          }`}
                        />
                        {formErrors.phone && <p className="text-red-500 text-[10px] mt-1">{formErrors.phone}</p>}
                      </div>

                      <div>
                        <label htmlFor="experience" className="block text-[11px] font-mono font-bold text-[#0B1220] mb-1">
                          RELEVANT EXPERIENCE
                        </label>
                        <input
                          type="text"
                          id="experience"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          placeholder="e.g. 4 Years"
                          className="w-full px-3.5 py-2.5 bg-[#F7F8FA] border border-[#E2E7EF] rounded-lg text-xs text-[#0B1220] focus:outline-none focus:border-[#1677FF] focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    {/* Resume Upload / Link */}
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-[#0B1220] mb-1">
                        RESUME UPLOAD (PDF / DOC / DOCX) *
                      </label>
                      <div className="border border-dashed border-[#C9D7F5] bg-[#EEF3FF]/40 rounded-xl p-4 text-center">
                        {resumeFile ? (
                          <div className="flex items-center justify-between bg-white border border-[#E2E7EF] p-2.5 rounded-lg text-xs">
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-4 h-4 text-[#1677FF] shrink-0" />
                              <span className="font-medium text-[#0B1220] truncate">{resumeFile.name}</span>
                              <span className="text-[10px] text-slate-500 shrink-0">
                                ({(resumeFile.size / (1024 * 1024)).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setResumeFile(null)}
                              className="text-slate-400 hover:text-red-500 p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="file"
                              id="resumeFile"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <label
                              htmlFor="resumeFile"
                              className="cursor-pointer inline-flex flex-col items-center gap-1.5"
                            >
                              <Upload className="w-6 h-6 text-[#1677FF]" />
                              <span className="text-xs font-semibold text-[#1677FF] hover:underline">
                                Click to upload resume file
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                PDF, DOC, DOCX up to 10MB
                              </span>
                            </label>
                          </div>
                        )}
                      </div>
                      {formErrors.resume && <p className="text-red-500 text-[10px] mt-1">{formErrors.resume}</p>}

                      {/* Or provide URL */}
                      <div className="mt-2.5">
                        <label htmlFor="resumeUrl" className="block text-[10px] font-mono text-slate-500 mb-0.5">
                          OR PASTE CLOUD RESUME URL (DRIVE / DROPBOX / LINKEDIN)
                        </label>
                        <input
                          type="url"
                          id="resumeUrl"
                          name="resumeUrl"
                          value={formData.resumeUrl}
                          onChange={handleChange}
                          placeholder="https://drive.google.com/..."
                          className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E2E7EF] rounded-lg text-xs text-[#0B1220] focus:outline-none focus:border-[#1677FF] focus:bg-white"
                        />
                        {formErrors.resumeUrl && <p className="text-red-500 text-[10px] mt-1">{formErrors.resumeUrl}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="portfolioUrl" className="block text-[11px] font-mono font-bold text-[#0B1220] mb-1">
                        GITHUB / PORTFOLIO URL (OPTIONAL)
                      </label>
                      <input
                        type="url"
                        id="portfolioUrl"
                        name="portfolioUrl"
                        value={formData.portfolioUrl}
                        onChange={handleChange}
                        placeholder="https://github.com/..."
                        className="w-full px-3.5 py-2.5 bg-[#F7F8FA] border border-[#E2E7EF] rounded-lg text-xs text-[#0B1220] focus:outline-none focus:border-[#1677FF] focus:bg-white"
                      />
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
                            <span>Submitting Application...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Application</span>
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

export default JobDetails;
