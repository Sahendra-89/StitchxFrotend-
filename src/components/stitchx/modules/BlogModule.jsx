import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { adminApi } from '../../../lib/api';

export function BlogModule({ onStatsChange }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Form State
  const initialForm = {
    title: '',
    slug: '',
    category: 'Engineering',
    author: 'StitchX Engineering Team',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80',
    excerpt: '',
    content: '',
    tags: '',
    seo_title: '',
    seo_description: '',
    status: 'published',
    is_published: 1,
  };
  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getBlogPosts({ status: statusFilter, category: categoryFilter, search });
      if (res?.success) {
        setPosts(res.posts || []);
      }
    } catch (err) {
      console.error('Failed to load blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadPosts();
  };

  const handleOpenAdd = () => {
    setEditingPost(null);
    setFormData(initialForm);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      category: post.category || 'Engineering',
      author: post.author || '',
      date: post.date || '',
      image: post.image || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      tags: post.tags || '',
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      status: post.status || 'published',
      is_published: post.is_published ? 1 : 0,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleTitleChange = (newTitle) => {
    const slugified = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: !editingPost ? slugified : prev.slug,
      seo_title: !editingPost ? newTitle : prev.seo_title,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await adminApi.uploadImage(file);
      if (res?.success && res.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
      } else {
        alert(res?.error || 'Failed to upload image.');
      }
    } catch (err) {
      alert('Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setFormError('Title and article content are required.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      if (editingPost) {
        await adminApi.updateBlogPost(editingPost.id, formData);
      } else {
        await adminApi.createBlogPost(formData);
      }
      setModalOpen(false);
      loadPosts();
      onStatsChange?.();
    } catch (err) {
      setFormError(err.message || 'Failed to save blog post.');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (id, currentVal) => {
    try {
      await adminApi.toggleBlogPostPublish(id, currentVal ? 0 : 1);
      loadPosts();
      onStatsChange?.();
    } catch (err) {
      alert('Error updating publication status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this technical article permanently?')) return;
    try {
      await adminApi.deleteBlogPost(id);
      loadPosts();
      onStatsChange?.();
    } catch (err) {
      alert('Error deleting post.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#1677FF] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              THOUGHT LEADERSHIP & SEO
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Engineering Blog & Insights
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Draft, edit, publish, and schedule technical articles with SEO metadata and tag categorization.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black shadow-md border border-blue-400 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Write Technical Post</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'published', 'draft'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search article titles..."
            className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#1677FF]"
          />
        </form>
      </div>

      {/* Posts Table */}
      {loading ? (
        <div className="p-16 text-center text-xs font-mono font-bold text-slate-500 bg-white rounded-2xl border border-slate-200">
          Loading technical articles...
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-900 mb-1">No Articles Found</h3>
          <p className="text-xs font-bold text-slate-500 mb-4">No published articles matched your filter parameters.</p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1677FF] text-white rounded-xl text-xs font-mono font-black"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Write First Post</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-mono text-[11px] font-black text-slate-800 uppercase tracking-wider">
                  <th className="py-3 px-4">Article Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author & Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt=""
                          className="w-14 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div className="truncate">
                          <h4 className="font-black text-slate-900 text-sm hover:text-[#1677FF] truncate">
                            <Link to={`/blog/${p.slug}`} target="_blank" rel="noreferrer">
                              {p.title}
                            </Link>
                          </h4>
                          <span className="text-[10px] font-mono font-bold text-slate-500 block truncate">
                            /blog/{p.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-[10px] text-[#1677FF] font-black uppercase tracking-wider">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="font-bold text-slate-800 truncate max-w-[160px]">{p.author}</div>
                      <div className="text-[10px] font-bold text-slate-500">{p.date}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <button
                        onClick={() => handleTogglePublish(p.id, p.is_published)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-black transition-colors cursor-pointer ${
                          p.is_published && p.status === 'published'
                            ? 'bg-emerald-100 border border-emerald-300 text-emerald-900 hover:bg-emerald-200'
                            : 'bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {p.is_published ? <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" /> : <Clock className="w-3.5 h-3.5 stroke-[2.5]" />}
                        <span>{p.is_published ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/blog/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View Live Page"
                        >
                          <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-slate-600 hover:text-[#1677FF] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Post"
                        >
                          <Edit className="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Blog Post Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-3xl p-6 sm:p-7 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-900 mb-1">
              {editingPost ? 'Edit Blog Article' : 'Write New Engineering Article'}
            </h3>
            <p className="text-xs font-bold text-slate-600 mb-5">
              Compose technical perspective with HTML markup support, featured imagery, and SEO metadata.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-left text-xs">
              <div>
                <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                  ARTICLE TITLE *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  placeholder="e.g. Pragmatic AI Integration in Enterprise Systems"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-[#1677FF] outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                    URL SLUG *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    placeholder="pragmatic-ai-integration"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                    CATEGORY
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="AI, Web Development, Mobile Apps..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                    PUBLICATION DATE
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="Oct 15, 2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                    AUTHOR NAME & DESIGNATION
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Aarav Mehta, Lead Systems Architect"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                    TAGS (COMMA SEPARATED)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="React, Next.js, Cloud, Architecture"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                  FEATURED COVER IMAGE URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  />
                  <label className="px-3.5 py-2 bg-slate-100 border border-slate-300 rounded-xl cursor-pointer hover:bg-slate-200 flex items-center gap-1.5 font-mono text-xs font-black text-slate-800">
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                  SHORT EXCERPT / ABSTRACT *
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="2-3 sentence overview of this technical article..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                  ARTICLE BODY CONTENT (HTML / RICH MARKUP) *
                </label>
                <textarea
                  rows={9}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  placeholder="<p>Main technical discussion...</p><h3>Subheading</h3><p>Details...</p>"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-medium leading-relaxed"
                />
                <span className="text-[10px] text-slate-600 font-mono font-bold mt-1 block">
                  Supported HTML tags: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;code&gt;, &lt;pre&gt;, &lt;a&gt;
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-mono font-black text-[11px] text-slate-900 block uppercase tracking-wider">
                  SEO METADATA SETTINGS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] font-bold text-slate-700 mb-0.5">SEO Title Tag</label>
                    <input
                      type="text"
                      value={formData.seo_title}
                      onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                      placeholder="Title displayed in Google SERP"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-bold text-slate-700 mb-0.5">SEO Meta Description</label>
                    <input
                      type="text"
                      value={formData.seo_description}
                      onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                      placeholder="Meta snippet description"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                    PUBLICATION STATUS
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({
                      ...formData,
                      status: e.target.value,
                      is_published: e.target.value === 'published' ? 1 : 0
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black"
                  >
                    <option value="published">Published (Public)</option>
                    <option value="draft">Draft (Private)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                    PUBLIC VISIBILITY
                  </label>
                  <select
                    value={formData.is_published}
                    onChange={(e) => setFormData({
                      ...formData,
                      is_published: parseInt(e.target.value, 10),
                      status: parseInt(e.target.value, 10) === 1 ? 'published' : 'draft'
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black"
                  >
                    <option value={1}>Yes (Active)</option>
                    <option value={0}>No (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black transition-all shadow-md border border-blue-400 cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogModule;
