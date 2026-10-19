import React, { useState, useEffect } from 'react';
import {
  Star,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { adminApi } from '../../../lib/api';

export function ReviewsModule({ onStatsChange }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    role: '',
    company: '',
    review: '',
    rating: 5,
    avatar: '',
    status: 'approved',
    is_published: 1,
    display_order: 0,
  };
  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getReviews({ status: statusFilter, search });
      if (res?.success) {
        setReviews(res.reviews || []);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadReviews();
  };

  const handleOpenAdd = () => {
    setEditingReview(null);
    setFormData({ ...initialForm, display_order: reviews.length + 1 });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (review) => {
    setEditingReview(review);
    setFormData({
      name: review.name || '',
      role: review.role || '',
      company: review.company || '',
      review: review.review || '',
      rating: review.rating || 5,
      avatar: review.avatar || '',
      status: review.status || 'approved',
      is_published: review.is_published ? 1 : 0,
      display_order: review.display_order || 0,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim() || !formData.review.trim()) {
      setFormError('Client Name, Company Name, and Review Text are required.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      if (editingReview) {
        await adminApi.updateReview(editingReview.id, formData);
      } else {
        await adminApi.createReview(formData);
      }
      setModalOpen(false);
      loadReviews();
      onStatsChange?.();
    } catch (err) {
      setFormError(err.message || 'Failed to save review.');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatus = async (id, status) => {
    try {
      await adminApi.updateReviewStatus(id, status);
      loadReviews();
      onStatsChange?.();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleTogglePublish = async (id, currentVal) => {
    try {
      await adminApi.toggleReviewPublish(id, currentVal ? 0 : 1);
      loadReviews();
      onStatsChange?.();
    } catch (err) {
      alert('Error toggling publish state');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this client review?')) return;
    try {
      await adminApi.deleteReview(id);
      loadReviews();
      onStatsChange?.();
    } catch (err) {
      alert('Error deleting review');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= reviews.length) return;

    const newReviews = [...reviews];
    const temp = newReviews[index];
    newReviews[index] = newReviews[targetIndex];
    newReviews[targetIndex] = temp;

    const updates = newReviews.map((r, i) => ({ id: r.id, display_order: i + 1 }));
    setReviews(newReviews);

    try {
      await adminApi.reorderReviews(updates);
    } catch (err) {
      console.error('Reorder error:', err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#1677FF] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              WEBSITE REPUTATION & PROOF
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Reviews Moderation Engine
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Manage verified client testimonials. Only <span className="text-emerald-700 font-black">Approved</span> and <span className="text-blue-700 font-black">Published</span> reviews appear live on the public website.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black shadow-md border border-blue-400 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Verified Review</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'approved', 'pending', 'rejected'].map((st) => (
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
            placeholder="Search reviewer or company..."
            className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#1677FF]"
          />
        </form>
      </div>

      {/* Reviews Table */}
      {loading ? (
        <div className="p-16 text-center text-xs font-mono font-bold text-slate-500 bg-white rounded-2xl border border-slate-200">
          Loading client reviews from database...
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-900 mb-1">No Reviews Found</h3>
          <p className="text-xs font-bold text-slate-500 mb-4">No client reviews matched your current search and filter settings.</p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1677FF] text-white rounded-xl text-xs font-mono font-black"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create First Review</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-mono text-[11px] font-black text-slate-800 uppercase tracking-wider">
                  <th className="py-3 px-4 w-14 text-center">Order</th>
                  <th className="py-3 px-4">Reviewer Details</th>
                  <th className="py-3 px-4">Rating & Review</th>
                  <th className="py-3 px-4">Approval Status</th>
                  <th className="py-3 px-4 text-center">Live Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reviews.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono">
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          onClick={() => handleMoveOrder(idx, -1)}
                          disabled={idx === 0}
                          className="text-slate-400 hover:text-[#1677FF] disabled:opacity-20 p-0.5 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <span className="font-black text-slate-900">{r.display_order || idx + 1}</span>
                        <button
                          onClick={() => handleMoveOrder(idx, 1)}
                          disabled={idx === reviews.length - 1}
                          className="text-slate-400 hover:text-[#1677FF] disabled:opacity-20 p-0.5 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {r.avatar ? (
                          <img
                            src={r.avatar}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-[#1677FF] font-black flex items-center justify-center shrink-0">
                            {r.name?.charAt(0) || 'C'}
                          </div>
                        )}
                        <div>
                          <div className="font-black text-slate-900 text-sm">{r.name}</div>
                          <div className="text-[11px] font-bold text-slate-600">
                            {r.role || 'Client'}, <span className="font-black text-slate-900">{r.company}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="flex text-amber-500 gap-0.5 mb-1">
                        {[...Array(r.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-700 line-clamp-2 font-medium leading-relaxed">
                        "{r.review}"
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        {r.status === 'approved' && (
                          <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 font-black uppercase text-[10px] tracking-wider">
                            Approved
                          </span>
                        )}
                        {r.status === 'pending' && (
                          <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-black uppercase text-[10px] tracking-wider">
                            Pending
                          </span>
                        )}
                        {r.status === 'rejected' && (
                          <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-900 border border-rose-300 font-black uppercase text-[10px] tracking-wider">
                            Rejected
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        {r.status !== 'approved' && (
                          <button
                            onClick={() => handleQuickStatus(r.id, 'approved')}
                            className="text-[10px] font-mono font-black text-emerald-700 hover:underline cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button
                            onClick={() => handleQuickStatus(r.id, 'rejected')}
                            className="text-[10px] font-mono font-black text-rose-700 hover:underline cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(r.id, r.is_published)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono font-black transition-colors cursor-pointer ${
                          r.is_published
                            ? 'bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="Click to toggle website visibility"
                      >
                        {r.is_published ? <Eye className="w-3.5 h-3.5 stroke-[2.5]" /> : <EyeOff className="w-3.5 h-3.5 stroke-[2.5]" />}
                        <span>{r.is_published ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(r)}
                          className="p-1.5 text-slate-600 hover:text-[#1677FF] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Review"
                        >
                          <Edit className="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Review"
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

      {/* Add / Edit Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg p-6 shadow-2xl relative">
            <h3 className="text-xl font-black text-slate-900 mb-1">
              {editingReview ? 'Edit Client Review' : 'Add New Client Review'}
            </h3>
            <p className="text-xs font-bold text-slate-600 mb-5">
              Enter verified client feedback. All fields are stored in the database and visible live upon approval.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-left text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                    CLIENT NAME *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Sarah Jenkins"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-[#1677FF] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                    ROLE / DESIGNATION
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="CEO / CTO"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-[#1677FF] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                    COMPANY NAME *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                    placeholder="HealthNova"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-[#1677FF] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                    RATING (1-5)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-black focus:bg-white focus:border-[#1677FF] outline-none font-mono"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                  PHOTO / AVATAR URL (OPTIONAL)
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-[#1677FF] outline-none"
                />
              </div>

              <div>
                <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                  REVIEW TEXT *
                </label>
                <textarea
                  rows={3}
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  required
                  placeholder="Review statement describing engineering work..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-[#1677FF] outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                    STATUS
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                    PUBLISHED
                  </label>
                  <select
                    value={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: parseInt(e.target.value, 10) })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs"
                  >
                    <option value={1}>Yes (Visible)</option>
                    <option value={0}>No (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                    DISPLAY ORDER
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-slate-200 mt-2">
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
                  {saving ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewsModule;
