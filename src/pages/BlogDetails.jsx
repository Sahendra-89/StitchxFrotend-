import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Calendar, User, ArrowLeft, ArrowRight, Tag } from 'lucide-react';
import { publicApi } from '../lib/api';
import { sanitizeClientHtml } from '../lib/sanitizeHtml';

export function BlogDetails() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setNotFound(false);

    publicApi.getBlogPostBySlug(slug)
      .then((res) => {
        if (isCancelled) return;
        if (res?.success && res.post) {
          setPost(res.post);
          setRelatedPosts(res.relatedPosts || []);
          // Set dynamic page title
          document.title = `${res.post.seo_title || res.post.title} — StitchX Global Technology`;
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        console.error('Error fetching blog post:', err);
        if (!isCancelled) setNotFound(true);
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-[60vh] flex items-center justify-center py-20 bg-white">
          <div className="flex flex-col items-center gap-3">
            <span className="h-6 w-6 rounded-full border-2 border-[#1677FF]/20 border-t-[#1677FF] animate-spin" />
            <span className="text-xs font-mono text-[#596579]">Loading Technical Article...</span>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (notFound || !post) {
    return (
      <PageWrapper>
        <section className="py-20 bg-white text-center">
          <div className="container mx-auto px-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-50 border border-red-200 text-xs font-mono font-bold text-red-700 mb-4">
              <span>ARTICLE NOT FOUND</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0B1220] mb-3">Article Unavailable or Unpublished</h1>
            <p className="text-sm text-[#596579] mb-6">
              The article you are searching for is not available or has been unpublished by editorial management.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1677FF] text-white rounded-lg text-xs font-mono font-bold hover:bg-[#005AD8] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Engineering Insights</span>
            </Link>
          </div>
        </section>
      </PageWrapper>
    );
  }

  const tagsList = post.tags
    ? post.tags.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return (
    <PageWrapper>
      {/* Header */}
      <section className="bg-[#FFFFFF] py-8 md:py-10 lg:py-12 border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#0B1220] hover:text-[#1677FF] transition-colors duration-200 mb-4 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span>Back to Engineering Insights</span>
          </Link>

          <div className="flex items-center gap-3 mb-2.5">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#EEF3FF] border border-[#C9D7F5] text-[#0B1220] font-bold shadow-2xs">
              {post.category}
            </span>
            <span className="text-xs font-mono text-[#0B1220] font-bold">TECHNICAL PERSPECTIVE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.2] mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#2B384E] pt-2 border-t border-[#E2E7EF]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0B1220]" /> {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#0B1220]" /> {post.author}
            </span>
            <span>•</span>
            <span className="text-[#2B384E]">StitchX Global Technology Engineering Team</span>
          </div>
        </div>
      </section>

      {/* Featured Cover Image */}
      <section className="py-6 md:py-8 bg-[#F1F4F8] border-b border-[#E2E7EF]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="rounded-2xl overflow-hidden border border-[#E2E7EF] aspect-[16/9] max-h-[460px] w-full bg-[#FFFFFF] shadow-sm">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80';
              }}
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-10 md:py-14 bg-[#FFFFFF]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-left">
          <div
            className="prose prose-slate max-w-none text-[#2B384E] text-base leading-relaxed space-y-5 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[#0B1220] [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[#0B1220] [&>p]:leading-relaxed [&>ul]:space-y-2 [&>ul]:list-disc [&>ul]:pl-5 [&>a]:text-[#0B1220] [&>a]:hover:text-[#1677FF] [&>a]:underline transition-colors duration-200"
            dangerouslySetInnerHTML={{ __html: sanitizeClientHtml(post.content) }}
          />

          {/* Tags */}
          {tagsList.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#E8ECF2] flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#596579]">
                <Tag className="w-3.5 h-3.5" /> Tags:
              </span>
              {tagsList.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md bg-[#F1F4F8] border border-[#E2E7EF] text-[11px] font-mono text-[#0B1220]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Callout Footer */}
          <div className="mt-8 md:mt-10 pt-6 border-t border-[#E8ECF2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-[#2B384E]">
              <span>Published by </span>
              <strong className="text-[#0B1220]">{post.author}</strong>
              <span> at StitchX Global Technology Engineering Studio.</span>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1220] hover:text-[#1677FF] transition-colors duration-200 group"
            >
              <span>Discuss Engineering Topics</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-[#F1F4F8] border-t border-[#E2E7EF]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-mono text-[#1677FF] font-bold uppercase tracking-wider block">
                  EXPLORE MORE
                </span>
                <h2 className="text-2xl font-bold text-[#0B1220]">Related Engineering Insights</h2>
              </div>
              <Link
                to="/blog"
                className="text-xs font-mono font-bold text-[#1677FF] hover:underline"
              >
                All Articles →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.id}
                  className="rounded-xl bg-white border border-[#E2E7EF] overflow-hidden flex flex-col justify-between hover:border-[#BFDBFE] hover:shadow-sm transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#1677FF] uppercase">
                        {rel.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#0B1220] mt-1 mb-2 line-clamp-2">
                        <Link to={`/blog/${rel.slug}`} className="hover:text-[#1677FF]">
                          {rel.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-[#596579] line-clamp-2">
                        {rel.excerpt}
                      </p>
                    </div>
                    <div className="pt-4 mt-3 border-t border-slate-100">
                      <Link
                        to={`/blog/${rel.slug}`}
                        className="text-xs font-semibold text-[#1677FF] inline-flex items-center gap-1"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageWrapper>
  );
}

export default BlogDetails;
