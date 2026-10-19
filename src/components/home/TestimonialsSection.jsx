import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../common/SectionHeader';
import { Star, ArrowRight } from 'lucide-react';
import { publicApi } from '../../lib/api';

export function TestimonialsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getReviews(3)
      .then((res) => {
        if (res?.success && Array.isArray(res.reviews)) {
          setReviews(res.reviews);
        }
      })
      .catch((err) => console.error('Error fetching home reviews:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="pt-10 md:pt-12 lg:pt-14 pb-11 md:pb-13 lg:pb-15 bg-[#EEF2F7]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 text-left">
          <SectionHeader
            title="What Engineering & Business Leaders Say"
            description="Read direct feedback from executives who engaged StitchX Global Technology to build and scale their primary software products."
          />
          <Link
            to="/reviews"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#1677FF] hover:underline mb-2 shrink-0"
          >
            <span>View All Client Endorsements</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-xl border border-[#E2E7EF] bg-white p-7 animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-14 bg-slate-100 rounded"></div>
                <div className="h-9 bg-slate-200 rounded-full w-9"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((testimonial) => (
              <div
                key={testimonial.id}
                className="group rounded-xl border border-[#E2E7EF] bg-[#FFFFFF] p-6 sm:p-7 flex flex-col justify-between hover:border-[#BFDBFE] hover:bg-[#F8FAFF] shadow-[0_4px_20px_rgba(11,18,32,0.04)] transition-all duration-200 text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-500 gap-0.5">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-[#0B1220] group-hover:text-[#1677FF] group-hover:border-[#BFDBFE] bg-[#EEF3FF] px-2.5 py-0.5 rounded border border-[#C9D7F5] font-bold shadow-2xs transition-colors duration-200">
                      VERIFIED CLIENT
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#2B384E] leading-relaxed mb-6">
                    "{testimonial.review}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8ECF2] flex items-center gap-3 mt-auto">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#E2E7EF] shrink-0"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#EEF3FF] border border-[#C9D7F5] text-[#1677FF] font-bold flex items-center justify-center text-xs shrink-0">
                      {testimonial.name?.charAt(0) || 'C'}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1220]">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-[#596579]">
                      {testimonial.role || 'Client'}, <span className="text-[#0B1220] font-bold group-hover:text-[#1677FF] transition-colors duration-200">{testimonial.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default TestimonialsSection;
