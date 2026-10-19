import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ArrowRight, Calendar, User, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { publicApi } from '../lib/api';

export function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination((p) => ({ ...p, page: 1 }));
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch posts on category, search, or page change
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    publicApi.getBlogPosts({
      search: debouncedSearch,
      category: activeCategory,
      page: pagination.page,
      limit: 6,
    })
      .then((res) => {
        if (!isCancelled && res?.success) {
          setPosts(res.posts || []);
          if (res.categories) setCategories(res.categories);
          if (res.pagination) setPagination(res.pagination);
        }
      })
      .catch((err) => console.error('Failed to load blog posts:', err))
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeCategory, debouncedSearch, pagination.page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((p) => ({ ...p, page: newPage }));
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  return (
    <PageWrapper>
      {/* Editorial Hero */}
      <section className="bg-[#FFFFFF] py-10 md:py-12 lg:py-14 border-b border-[#E2E7EF] text-left">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EEF3FF] border border-[#C9D7F5] text-xs font-mono font-bold tracking-wider text-[#0B1220] mb-4 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF]"></span>
              <span>ENGINEERING INSIGHTS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.15] mb-4">
              Architecture Patterns & Technical Analysis
            </h1>

            <p className="text-base sm:text-lg text-[#2B384E] leading-relaxed">
              Read practical perspectives on software architecture, frontend performance, data security, and cloud scalability written by practicing engineers.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Articles Grid */}
      <section className="pt-10 md:pt-12 lg:pt-14 pb-12 md:pb-14 lg:pb-16 bg-[#F1F4F8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Controls: Search Bar and Category Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-left">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 justify-start order-2 md:order-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-mono transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-[#1677FF] text-[#FFFFFF] font-bold shadow-xs'
                      : 'bg-[#FFFFFF] text-[#0B1220] font-medium border border-[#E2E7EF] hover:bg-[#F8FAFF] hover:border-[#BFDBFE] hover:text-[#1677FF]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72 order-1 md:order-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8494]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles & topics..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-[#E2E7EF] rounded-lg text-[#0B1220] focus:outline-none focus:border-[#1677FF] placeholder-[#7A8494] shadow-2xs font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-xl bg-white border border-[#E2E7EF] overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-slate-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-200 rounded"></div>
                    <div className="h-12 bg-slate-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] p-12 text-center text-[#596579]">
              <p className="text-base font-semibold text-[#0B1220]">No engineering articles found.</p>
              <p className="text-sm mt-1">
                {searchQuery || activeCategory !== 'All'
                  ? 'Try clearing your search query or choosing another category.'
                  : 'Check back soon for new technical perspectives.'}
              </p>
              {(searchQuery || activeCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="mt-4 px-4 py-2 bg-[#1677FF] text-white rounded-lg text-xs font-mono font-bold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-xl bg-[#FFFFFF] border border-[#E2E7EF] overflow-hidden flex flex-col justify-between hover:border-[#BFDBFE] hover:bg-[#F8FAFF] hover:shadow-[0_4px_20px_rgba(17,24,39,0.06)] transition-all duration-300 group text-left shadow-[0_4px_20px_rgba(17,24,39,0.04)]"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#F1F4F8]">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#FFFFFF]/95 backdrop-blur-md border border-[#E2E7EF] text-[11px] font-mono text-[#0B1220] shadow-2xs font-bold">
                        {post.category}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs font-mono text-[#2B384E] mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200" />
                          {post.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200" />
                          <span className="truncate max-w-[140px]">{post.author}</span>
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-[#0B1220] mb-3 group-hover:text-[#1677FF] transition-colors duration-200 leading-snug">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>
                      
                      <p className="text-xs sm:text-sm text-[#2B384E] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-[#E8ECF2] mt-auto">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1220] group-hover:text-[#1677FF] transition-colors duration-200 pt-4"
                    >
                      <span>Read Technical Article</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg border border-[#E2E7EF] bg-white text-[#0B1220] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-9 h-9 rounded-lg text-xs font-mono font-bold transition-colors ${
                      pagination.page === pageNumber
                        ? 'bg-[#1677FF] text-white shadow-xs'
                        : 'bg-white border border-[#E2E7EF] text-[#0B1220] hover:bg-slate-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-lg border border-[#E2E7EF] bg-white text-[#0B1220] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </section>
    </PageWrapper>
  );
}

export default Blog;
