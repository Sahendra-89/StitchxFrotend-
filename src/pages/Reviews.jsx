import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Star, MessageSquarePlus, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { publicApi } from '../lib/api';

export function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const initialForm = {
    name: '',
    role: '',
    company: '',
    rating: 5,
    review: '',
    avatar: '',
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const res = await publicApi.getReviews();
      if (res?.success && Array.isArray(res.reviews)) {
        setReviews(res.reviews);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateReviewForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Your name is required.';
    if (!formData.company.trim()) errors.company = 'Company name is required.';
    if (!formData.review.trim()) {
      errors.review = 'Review text is required.';
    } else if (formData.review.trim().length < 10) {
      errors.review = 'Please write at least 10 characters.';
    }
    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateReviewForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await publicApi.submitReview(formData);
      if (res?.success) {
        setSubmitSuccess(true);
        setFormData(initialForm);
      } else {
        setSubmitError(res?.error || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      setSubmitError('Unable to submit review right now. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      {/* Editorial Hero */}
      <section className="bg-[#FFFFFF] py-10 md:py-12 lg:py-14 border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EEF3FF] border border-[#C9D7F5] text-xs font-mono font-bold tracking-wider text-[#0B1220] mb-4 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF]"></span>
                <span>VERIFIED FEEDBACK</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.15] mb-4">
                Client Endorsements & Engineering Feedback
              </h1>

              <p className="text-base sm:text-lg text-[#2B384E] leading-relaxed">
                Read candid testimonials from founders, CTOs, and product directors who rely on StitchX Global Technology for mission-critical software engineering and deployment.
              </p>
            </div>

            <div>
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setSubmitError('');
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1677FF] hover:bg-[#005AD8] text-white text-xs font-mono font-bold shadow-sm transition-all duration-200"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Submit Client Review</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="pt-10 md:pt-12 lg:pt-14 pb-12 md:pb-14 lg:pb-16 bg-[#F1F4F8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-xl bg-white border border-[#E2E7EF] p-8 animate-pulse space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-16 bg-slate-100 rounded"></div>
                  <div className="h-10 bg-slate-200 rounded-full w-10"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-12 text-center text-[#596579]">
              <p className="text-base font-semibold text-[#0B1220]">No client reviews displayed at this moment.</p>
              <p className="text-sm mt-1">Check back soon or submit feedback from your recent project collaboration.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-8 flex flex-col justify-between hover:border-[#BFDBFE] hover:bg-[#F8FAFF] transition-all duration-200 text-left shadow-[0_4px_20px_rgba(17,24,39,0.04)] group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex text-amber-500 gap-0.5">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-[11px] font-mono text-[#0B1220] bg-[#EEF3FF] px-2.5 py-0.5 rounded border border-[#C9D7F5] shadow-2xs font-bold">
                        VERIFIED ENGAGEMENT
                      </span>
                    </div>

                    <p className="text-sm text-[#2B384E] leading-relaxed mb-6 group-hover:text-[#0B1220] transition-colors duration-200">
                      "{testimonial.review}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3.5 pt-5 border-t border-[#E8ECF2] mt-auto">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-11 h-11 rounded-full object-cover border border-[#E2E7EF] shrink-0"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#EEF3FF] border border-[#C9D7F5] text-[#1677FF] font-bold flex items-center justify-center text-sm shrink-0">
                        {testimonial.name?.charAt(0) || 'C'}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-[#2B384E]">
                        {testimonial.role || 'Client'},{' '}
                        <span className="text-[#0B1220] font-semibold group-hover:text-[#1677FF] transition-colors duration-200">
                          {testimonial.company}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Submit Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#E2E7EF] rounded-2xl w-full max-w-lg p-6 sm:p-7 shadow-2xl relative text-left">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#1677FF]" />
              <span className="text-xs font-mono font-bold text-[#1677FF]">CLIENT ENDORSEMENT</span>
            </div>
            <h2 className="text-xl font-bold text-[#0B1220] mb-2">Share Your Project Experience</h2>
            <p className="text-xs text-[#596579] mb-5">
              We appreciate your partnership. Verified client reviews are reviewed and approved by our leadership before publication.
            </p>

            {submitSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-800">Review Submitted Successfully!</h3>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Thank you for your valuable feedback. Your review has been saved in our system and will appear publicly once verified by our team.
                </p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-[#0B1220] mb-1">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3 py-2 text-xs bg-[#F7F8FA] border border-[#E2E7EF] rounded-lg text-[#0B1220] focus:outline-none focus:border-[#1677FF] focus:bg-white"
                    />
                    {formErrors.name && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-[#0B1220] mb-1">
                      DESIGNATION / ROLE
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="e.g. CTO / Founder"
                      className="w-full px-3 py-2 text-xs bg-[#F7F8FA] border border-[#E2E7EF] rounded-lg text-[#0B1220] focus:outline-none focus:border-[#1677FF] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-[#0B1220] mb-1">
                      COMPANY NAME *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. HealthNova"
                      className="w-full px-3 py-2 text-xs bg-[#F7F8FA] border border-[#E2E7EF] rounded-lg text-[#0B1220] focus:outline-none focus:border-[#1677FF] focus:bg-white"
                    />
                    {formErrors.company && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.company}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-[#0B1220] mb-1">
                      RATING
                    </label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs bg-[#F7F8FA] border border-[#E2E7EF] rounded-lg text-[#0B1220] focus:outline-none focus:border-[#1677FF] focus:bg-white font-mono"
                    >
                      <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                      <option value="4">★★★★☆ (4 Stars - Very Good)</option>
                      <option value="3">★★★☆☆ (3 Stars - Average)</option>
                      <option value="2">★★☆☆☆ (2 Stars - Below Average)</option>
                      <option value="1">★☆☆☆☆ (1 Star - Poor)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#0B1220] mb-1">
                    PHOTO / AVATAR URL (OPTIONAL)
                  </label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs bg-[#F7F8FA] border border-[#E2E7EF] rounded-lg text-[#0B1220] focus:outline-none focus:border-[#1677FF] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#0B1220] mb-1">
                    YOUR REVIEW & FEEDBACK *
                  </label>
                  <textarea
                    rows={4}
                    name="review"
                    value={formData.review}
                    onChange={handleInputChange}
                    placeholder="Describe the engineering collaboration, project deliverables, and team communication..."
                    className="w-full px-3 py-2 text-xs bg-[#F7F8FA] border border-[#E2E7EF] rounded-lg text-[#0B1220] focus:outline-none focus:border-[#1677FF] focus:bg-white leading-relaxed"
                  />
                  {formErrors.review && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.review}</p>}
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-[#E2E7EF] rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-[#1677FF] hover:bg-[#005AD8] text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review for Approval'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

export default Reviews;
