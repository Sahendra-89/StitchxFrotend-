import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Copy,
  Edit,
  Trash2,
  AlertTriangle,
  X,
  Download,
  Check,
  Printer,
  FileText,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { docApi } from '../../../lib/docApi';
import { formatINR, exportToCSV } from '../utils';

export const OFFICIAL_RATE_CARD_CATEGORIES = [
  'Website & commerce',
  'Applications & software',
  'Digital services & support',
];

export const OFFICIAL_COMMERCIAL_TERMS = [
  {
    title: 'Payment Schedule',
    desc: 'Suggested payment schedule for fixed-price projects: 50% kickoff, 30% milestone approval, 20% before final handover; amend per project.',
  },
  {
    title: 'Third-Party Charges',
    desc: 'Rates exclude domain, hosting, paid themes/plugins, stock assets, SMS/email, payment gateway, app-store, advertising, and other third-party charges unless expressly included.',
  },
  {
    title: 'Client Content & Approvals',
    desc: 'Client supplies accurate content, credentials, approvals, and lawful rights to all materials. Delays in client feedback may shift delivery dates.',
  },
  {
    title: 'Revision Rounds',
    desc: 'Includes 2 revision rounds for the agreed design deliverables. New scope or additional revisions are quoted separately.',
  },
  {
    title: 'Support & Warranty',
    desc: 'Support/warranty: 30 days for reproducible defects in agreed deliverables; excludes third-party outages, misuse, and new feature requests.',
  },
  {
    title: 'Tax Treatment (Non-GST)',
    desc: 'GST is not added in this rate card. If/when registration or another tax obligation applies, invoices and pricing will be updated lawfully. Do not describe this as a GST tax invoice.',
  },
];

export function RateCardsModule({ onQuickActionWithRateCard }) {
  const [rateCards, setRateCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    service_name: '',
    category: 'Website & commerce',
    description: '',
    pricing_model: 'fixed',
    base_price: 15000,
    price_range: '₹15,000–₹50,000',
    currency: 'INR',
    included_features: '',
    exclusions: '',
    validity_period: 'Fiscal Year 2026-27',
    status: 'draft_suggestion',
    is_draft_suggestion: true,
  });

  useEffect(() => {
    loadRateCards();
  }, [categoryFilter]);

  const loadRateCards = async () => {
    setLoading(true);
    try {
      const res = await docApi.getRateCards({ category: categoryFilter });
      if (res.success) {
        setRateCards(res.rateCards);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (item = null) => {
    setEditingItem(item);
    setFormError('');
    if (item) {
      setFormData({
        service_name: item.service_name || '',
        category: item.category || 'Website & commerce',
        description: item.description || '',
        pricing_model: item.pricing_model || 'fixed',
        base_price: item.base_price || 0,
        price_range: item.price_range || '',
        currency: item.currency || 'INR',
        included_features: (item.included_features || []).join('\n'),
        exclusions: (item.exclusions || []).join('\n'),
        validity_period: item.validity_period || 'Fiscal Year 2026-27',
        status: item.status || 'draft_suggestion',
        is_draft_suggestion: item.is_draft_suggestion !== undefined ? item.is_draft_suggestion : true,
      });
    } else {
      setFormData({
        service_name: '',
        category: 'Website & commerce',
        description: '',
        pricing_model: 'fixed',
        base_price: 15000,
        price_range: '₹15,000–₹50,000',
        currency: 'INR',
        included_features: 'Responsive UI Design\nSEO Best Practices\nContact Form',
        exclusions: 'Third-party API license costs\nPaid stock assets',
        validity_period: 'Fiscal Year 2026-27',
        status: 'draft_suggestion',
        is_draft_suggestion: true,
      });
    }
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    const payload = {
      ...formData,
      base_price: Number(formData.base_price) || 0,
      price_range: (formData.price_range || '').trim(),
      included_features: formData.included_features
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      exclusions: formData.exclusions
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingItem) {
        const res = await docApi.updateRateCard(editingItem._id, payload);
        if (res.success) {
          setIsFormOpen(false);
          loadRateCards();
        } else {
          setFormError(res.error || 'Failed to update rate card.');
        }
      } else {
        const res = await docApi.createRateCard(payload);
        if (res.success) {
          setIsFormOpen(false);
          loadRateCards();
        } else {
          setFormError(res.error || 'Failed to create rate card.');
        }
      }
    } catch (err) {
      setFormError(err.message || 'Error saving rate card.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await docApi.duplicateRateCard(id);
      if (res.success) {
        loadRateCards();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete rate card entry for "${name}"?`)) return;
    try {
      const res = await docApi.deleteRateCard(id);
      if (res.success) {
        loadRateCards();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExportCSV = () => {
    const exportData = filteredRateCards.map((r) => ({
      ServiceName: r.service_name,
      Category: r.category,
      PriceRangeINR: r.price_range || formatINR(r.base_price),
      StartingPriceINR: r.base_price,
      ScopeAndNotes: r.description,
      PricingModel: r.pricing_model,
      ValidityPeriod: r.validity_period,
      Status: r.status,
      Features: (r.included_features || []).join('; '),
      Exclusions: (r.exclusions || []).join('; '),
    }));
    exportToCSV(`StitchX_Service_RateCard_${new Date().toISOString().slice(0, 10)}`, exportData);
  };

  const filteredRateCards = rateCards.filter((r) => {
    if (!search) return true;
    return (
      r.service_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.category?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.price_range?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 text-left font-sans antialiased">
      {/* Official Top Corporate Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-5 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#1677FF] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                Official Document
              </span>
              <span className="text-slate-400 font-bold">•</span>
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                Indicative Pricing for India
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              STITCHX GLOBAL TECHNOLOGY
            </h1>
            <p className="text-sm font-black text-[#1677FF] tracking-wide mt-0.5 uppercase">
              SERVICE RATE CARD
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsSheetModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B1528] hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-black transition-all shadow-md border border-slate-700 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-sky-400 stroke-[2.5]" />
              <span>View / Print Official Rate Card</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleOpenForm()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black transition-all shadow-md border border-blue-400 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Service</span>
            </button>
          </div>
        </div>

        {/* Company Quick Credentials Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600 shrink-0 stroke-[2.5]" />
            <span className="text-slate-500">Email:</span>
            <span className="text-slate-900 font-mono">info@stitchxglobal.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600 shrink-0 stroke-[2.5]" />
            <span className="text-slate-500">Phone:</span>
            <span className="text-slate-900 font-mono">9341660370</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600 shrink-0 stroke-[2.5]" />
            <span className="text-slate-500">Structure:</span>
            <span className="text-slate-900">Sole proprietorship</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 stroke-[2.5]" />
            <span className="text-slate-500">Address:</span>
            <span className="text-slate-900">Sector 9A, Gurugram</span>
          </div>
        </div>
      </div>

      {/* Official Pricing Note Callout Banner */}
      <div className="p-4 bg-blue-50/90 border border-blue-200 rounded-2xl text-xs text-slate-800 flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-4 h-4 text-[#1677FF] shrink-0 mt-0.5 stroke-[2.5]" />
        <div className="leading-relaxed">
          <span className="font-black text-slate-900 uppercase tracking-wide">Pricing Note: </span>
          Rates below are starting estimates, not a binding quote. Final pricing depends on scope,
          integrations, content, design complexity, delivery schedule, and third-party costs.
        </div>
      </div>

      {/* Search & Official Category Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service name, range, or notes..."
            className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-[#1677FF] text-white shadow-xs font-black'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Services
          </button>
          {OFFICIAL_RATE_CARD_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#1677FF] text-white shadow-xs font-black'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Rate Card Services */}
      {loading ? (
        <div className="py-16 text-center text-slate-600 bg-white rounded-2xl border border-slate-200">
          <div className="inline-block animate-spin h-6 w-6 border-2 border-[#1677FF]/30 border-t-[#1677FF] rounded-full mb-2" />
          <p className="font-mono text-xs font-bold">Loading official rate card catalog...</p>
        </div>
      ) : filteredRateCards.length === 0 ? (
        <div className="py-16 bg-white rounded-2xl border border-slate-200 text-center text-slate-600">
          <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-[2.5]" />
          <p className="font-black text-slate-900 text-sm">No services match your criteria.</p>
          <button
            onClick={() => {
              setSearch('');
              setCategoryFilter('all');
            }}
            className="mt-3 text-xs font-bold text-[#1677FF] hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRateCards.map((service) => (
            <div
              key={service._id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Category & Status */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-md bg-blue-50 text-[#1677FF] border border-blue-200 uppercase tracking-wide">
                    {service.category}
                  </span>
                  {service.is_draft_suggestion && (
                    <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-300">
                      Indicative
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {service.service_name}
                </h3>
                <p className="text-xs font-bold text-slate-600 mt-1.5 leading-relaxed">
                  {service.description}
                </p>

                {/* Primary Indicative Price Range */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-black text-slate-500 uppercase block">
                      Starting Price (INR)
                    </span>
                    <span className="text-lg font-black text-slate-900 font-mono">
                      {service.price_range || formatINR(service.base_price)}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    {service.validity_period}
                  </span>
                </div>

                {/* Features Checklist */}
                {service.included_features?.length > 0 && (
                  <div className="mt-4 space-y-1.5 text-xs">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      Typical Scope:
                    </span>
                    {service.included_features.slice(0, 3).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-slate-800 text-xs font-semibold">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                    {service.included_features.length > 3 && (
                      <span className="text-xs text-[#1677FF] font-black block">
                        +{service.included_features.length - 3} more deliverables
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onQuickActionWithRateCard('new_quotation', service)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-black text-[#1677FF] hover:text-blue-800 hover:underline cursor-pointer"
                >
                  <span>Create Quote</span>
                  <span>→</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDuplicate(service._id)}
                    title="Duplicate Service"
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenForm(service)}
                    title="Edit Service"
                    className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id, service.service_name)}
                    title="Delete Service"
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Standard Commercial Terms Card (Always Visible on Page) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
          <ShieldCheck className="w-5 h-5 text-[#1677FF] stroke-[2.5]" />
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Standard Commercial Terms
            </h2>
            <p className="text-xs font-bold text-slate-500">
              Contractual terms applicable to StitchX Global Technology estimates and agreements
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OFFICIAL_COMMERCIAL_TERMS.map((term, tIdx) => (
            <div key={tIdx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#1677FF]" />
                <span className="font-black text-slate-900 uppercase tracking-wide text-[11px]">
                  {term.title}
                </span>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed pl-4">{term.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Rate Card Full Document Preview Modal */}
      {isSheetModalOpen && (
        <OfficialRateCardSheetModal
          rateCards={rateCards}
          onClose={() => setIsSheetModalOpen(false)}
        />
      )}

      {/* Add / Edit Rate Card Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#1677FF]/10 text-[#1677FF]">
                  <CreditCard className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingItem ? 'Edit Rate Card Service' : 'Add Rate Card Service'}
                  </h3>
                  <p className="text-xs font-bold text-slate-500">Configure service scope, indicative price range, and category</p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-black text-slate-700 uppercase mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.service_name}
                    onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                    placeholder="e.g. Business / static website"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-black text-slate-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
                  >
                    {OFFICIAL_RATE_CARD_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-black text-slate-700 uppercase mb-1">
                    Starting Price Range (Display) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price_range}
                    onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                    placeholder="e.g. ₹15,000–₹50,000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-black text-slate-700 uppercase mb-1">
                    Base Numerical Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-black text-slate-700 uppercase mb-1">
                  Typical Scope / Notes *
                </label>
                <textarea
                  rows="2"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Up to 5 pages; responsive design; contact form"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-black text-slate-700 uppercase mb-1">
                  Included Features (One per line)
                </label>
                <textarea
                  rows="3"
                  value={formData.included_features}
                  onChange={(e) => setFormData({ ...formData, included_features: e.target.value })}
                  placeholder="Up to 5 pages&#10;Responsive layout&#10;Contact form"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-black text-slate-700 uppercase mb-1">
                  Exclusions (One per line)
                </label>
                <textarea
                  rows="2"
                  value={formData.exclusions}
                  onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                  placeholder="Content copywriting&#10;Third-party hosting fees"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="isDraftCheck"
                  checked={formData.is_draft_suggestion}
                  onChange={(e) => setFormData({ ...formData, is_draft_suggestion: e.target.checked })}
                  className="w-4 h-4 text-[#1677FF] rounded"
                />
                <label htmlFor="isDraftCheck" className="text-xs text-slate-700 select-none font-bold">
                  Mark as <span className="font-black text-slate-900">Indicative Draft Estimate</span> (subject to final scope quote)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl font-black shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Dedicated Executive Modal for Full Printable Official Rate Card
function OfficialRateCardSheetModal({ rateCards, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-sm overflow-hidden select-none font-sans text-left">
      {/* Top Modal Header Bar - Non-overlapping */}
      <header className="h-16 px-4 sm:px-8 bg-[#0B1528] border-b border-[#1E2D4A] flex items-center justify-between text-white shrink-0 z-20 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1677FF] to-[#38BDF8] text-white flex items-center justify-center font-black text-sm shadow-md">
            SX
          </div>
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
              Official Document Preview
            </span>
            <p className="text-sm font-black text-white tracking-tight">STITCHX SERVICE RATE CARD</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black shadow-md border border-blue-400 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>Print / Save PDF</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors border border-slate-700 cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Printable Sheet Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-900/40">
        <div
          id="printable-rate-card-sheet"
          className="w-full max-w-4xl bg-white text-[#0B1220] rounded-2xl shadow-2xl p-8 sm:p-12 my-auto border border-slate-200 text-left relative font-sans print:p-0 print:m-0 print:border-none print:shadow-none print:rounded-none"
        >
          {/* Document Header */}
          <div className="pb-6 border-b-2 border-slate-300">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <img
                  src="/stitchx-logo.png"
                  alt="StitchX Global Technology"
                  className="h-16 w-auto max-w-[280px] object-contain shrink-0"
                />
                <div>
                  <h2 className="text-lg font-black text-[#1677FF] tracking-wide">
                    SERVICE RATE CARD
                  </h2>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">
                    Indicative pricing for India | Effective: FY 2026-27 | Valid: Fiscal Year 2026-27
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs font-bold text-slate-700 space-y-1">
                <p>Email: <span className="font-mono text-slate-900 font-bold">info@stitchxglobal.com</span></p>
                <p>Phone: <span className="font-mono text-slate-900 font-bold">9341660370</span></p>
                <p>Business structure: <span className="text-slate-900 font-bold">Sole proprietorship</span></p>
                <p>Business address: <span className="text-slate-900 font-bold">Sector 9A, Gurugram</span></p>
              </div>
            </div>
          </div>

          {/* Pricing Note Callout */}
          <div className="my-5 p-3.5 bg-blue-50/90 border border-blue-200 rounded-xl text-xs text-slate-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#1677FF] shrink-0 mt-0.5 stroke-[2.5]" />
            <div className="leading-relaxed">
              <span className="font-black text-slate-900 uppercase tracking-wide">Pricing note: </span>
              Rates below are starting estimates, not a binding quote. Final pricing depends on scope,
              integrations, content, design complexity, delivery schedule, and third-party costs.
            </div>
          </div>

          {/* Rate Card Tables by Official Categories */}
          <div className="space-y-6">
            {OFFICIAL_RATE_CARD_CATEGORIES.map((category) => {
              const servicesInCategory = rateCards.filter((s) => s.category === category);
              if (servicesInCategory.length === 0) return null;

              return (
                <div key={category} className="space-y-2">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1677FF]" />
                    <span>{category}</span>
                  </h3>

                  <div className="overflow-x-auto border border-slate-300 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300 text-slate-900 font-black uppercase text-[11px] font-mono tracking-wider">
                          <th className="py-2.5 px-3 w-1/3">Service</th>
                          <th className="py-2.5 px-3 w-1/3">Starting price (INR)</th>
                          <th className="py-2.5 px-3 w-1/3">Typical scope / notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-sans">
                        {servicesInCategory.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-bold text-slate-900">{item.service_name}</td>
                            <td className="py-3 px-3 font-mono font-black text-[#1677FF] text-xs">
                              {item.price_range || formatINR(item.base_price)}
                            </td>
                            <td className="py-3 px-3 text-slate-700 font-medium leading-relaxed">
                              {item.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Standard Commercial Terms Section */}
          <div className="mt-8 pt-5 border-t-2 border-slate-300 space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Standard commercial terms
            </h3>
            <ul className="text-xs text-slate-800 font-medium space-y-2 list-none">
              {OFFICIAL_COMMERCIAL_TERMS.map((term, tIdx) => (
                <li key={tIdx} className="flex items-start gap-2">
                  <span className="text-[#1677FF] font-black text-sm leading-none">•</span>
                  <span>{term.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Digitally Auto-Signed Endorsement */}
          <div className="mt-8 pt-5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <div>
              <p className="font-black text-slate-900 uppercase tracking-wider mb-1">For StitchX Global Technology</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#1677FF] font-mono font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Digitally Auto-Signed</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                This is a computer-generated document. No signature required.
              </p>
            </div>

            <div className="text-right text-[11px] font-mono font-bold text-slate-500">
              <p>Sector 9A, Gurugram</p>
              <p className="mt-0.5">Haryana, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RateCardsModule;
