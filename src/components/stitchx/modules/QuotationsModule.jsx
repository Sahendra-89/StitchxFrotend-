import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Receipt,
  X,
  AlertCircle,
  Calendar,
  FileDown,
  FileText,
} from 'lucide-react';
import { docApi } from '../../../lib/docApi';
import { formatINR, formatDate, getStatusBadge } from '../utils';

export const OFFICIAL_STANDARD_COMMERCIAL_TERMS = [
  'Suggested payment schedule for fixed-price projects: 50% kickoff, 30% milestone approval, 20% before final handover; amend per project.',
  'Rates exclude domain, hosting, paid themes/plugins, stock assets, SMS/email, payment gateway, app-store, advertising, and other third-party charges unless expressly included.',
  'Client supplies accurate content, credentials, approvals, and lawful rights to all materials. Delays in client feedback may shift delivery dates.',
  'Includes 2 revision rounds for the agreed design deliverables. New scope or additional revisions are quoted separately.',
  'Support/warranty: 30 days for reproducible defects in agreed deliverables; excludes third-party outages, misuse, and new feature requests.',
  'Tax treatment: GST is not added in this quotation (Commercial non-GST quotation under threshold exemption). Do not describe this as a GST tax invoice.',
];

export const OFFICIAL_TERMS_TEXT = OFFICIAL_STANDARD_COMMERCIAL_TERMS.map((t) => `• ${t}`).join('\n');

export const DEFAULT_PRICING_NOTE = 'Rates below are starting estimates, not a binding quote. Final pricing depends on scope, integrations, content, design complexity, delivery schedule, and third-party costs.';

export function QuotationsModule({
  onPreviewDoc,
  preselectedClient,
  onClearPreselectedClient,
  preselectedRateCard,
  onClearPreselectedRateCard,
}) {
  const [quotations, setQuotations] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  // Modal form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form values
  const [clientId, setClientId] = useState('');
  const [title, setTitle] = useState('Service Quotation');
  const [quotationDate, setQuotationDate] = useState(new Date().toISOString().slice(0, 10));
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  );
  const [terms, setTerms] = useState(OFFICIAL_TERMS_TEXT);
  const [notes, setNotes] = useState(DEFAULT_PRICING_NOTE);
  const [items, setItems] = useState([
    { description: 'Business Website Architecture & Frontend Engineering', quantity: 1, unit_price: 25000, discount_percent: 0 },
  ]);

  useEffect(() => {
    loadQuotations();
    loadClientsList();
  }, [statusFilter, search, page]);

  useEffect(() => {
    if (preselectedClient) {
      handleOpenForm(null, preselectedClient);
      if (onClearPreselectedClient) onClearPreselectedClient();
    }
  }, [preselectedClient]);

  useEffect(() => {
    if (preselectedRateCard) {
      handleOpenFormWithRateCard(preselectedRateCard);
      if (onClearPreselectedRateCard) onClearPreselectedRateCard();
    }
  }, [preselectedRateCard]);

  const loadQuotations = async () => {
    setLoading(true);
    try {
      const res = await docApi.getQuotations({ status: statusFilter, search, page, limit: 15 });
      if (res.success) {
        setQuotations(res.quotations);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadClientsList = async () => {
    try {
      const res = await docApi.getClients({ limit: 100 });
      if (res.success) setClients(res.clients);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenFormWithRateCard = (rateCard) => {
    setEditingDoc(null);
    setFormError('');
    setClientId(clients[0]?._id || '');
    setTitle(`${rateCard.service_name} — Digital Engineering Scope`);
    setQuotationDate(new Date().toISOString().slice(0, 10));
    setExpiryDate(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
    setTerms(OFFICIAL_TERMS_TEXT);
    setNotes(DEFAULT_PRICING_NOTE);
    setItems([
      {
        description: `${rateCard.service_name} (${rateCard.description || rateCard.category})`,
        quantity: 1,
        unit_price: rateCard.base_price || 15000,
        discount_percent: 0,
      },
    ]);
    setIsFormOpen(true);
  };

  const handleOpenForm = (quote = null, client = null) => {
    setEditingDoc(quote);
    setFormError('');
    if (quote) {
      setClientId(quote.client_id?._id || quote.client_id || '');
      setTitle(quote.title || 'Service Quotation');
      setQuotationDate(new Date(quote.quotation_date).toISOString().slice(0, 10));
      setExpiryDate(new Date(quote.expiry_date).toISOString().slice(0, 10));
      setTerms(quote.terms_conditions || OFFICIAL_TERMS_TEXT);
      setNotes(quote.notes || DEFAULT_PRICING_NOTE);
      setItems(quote.items?.length ? quote.items : [{ description: '', quantity: 1, unit_price: 0, discount_percent: 0 }]);
    } else {
      setClientId(client?._id || (clients[0]?._id || ''));
      setTitle('Digital Engineering & Service Quotation');
      setQuotationDate(new Date().toISOString().slice(0, 10));
      setExpiryDate(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
      setTerms(OFFICIAL_TERMS_TEXT);
      setNotes(DEFAULT_PRICING_NOTE);
      setItems([{ description: 'Custom Software Development & Implementation', quantity: 1, unit_price: 25000, discount_percent: 0 }]);
    }
    setIsFormOpen(true);
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, discount_percent: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Live client preview calculation
  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 1) * (Number(item.unit_price) || 0), 0);
  const totalDiscount = items.reduce((sum, item) => {
    const gross = (Number(item.quantity) || 1) * (Number(item.unit_price) || 0);
    return sum + (gross * (Number(item.discount_percent) || 0)) / 100;
  }, 0);
  const grandTotal = subtotal - totalDiscount;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!clientId) {
      setFormError('Please select a valid client.');
      return;
    }
    setFormError('');
    setSubmitting(true);

    const payload = {
      client_id: clientId,
      title,
      quotation_date: quotationDate,
      expiry_date: expiryDate,
      items: items.map((it) => ({
        description: it.description,
        quantity: Number(it.quantity) || 1,
        unit_price: Number(it.unit_price) || 0,
        discount_percent: Number(it.discount_percent) || 0,
      })),
      terms_conditions: terms,
      notes,
    };

    try {
      if (editingDoc) {
        const res = await docApi.updateQuotation(editingDoc._id, payload);
        if (res.success) {
          setIsFormOpen(false);
          loadQuotations();
        } else {
          setFormError(res.error || 'Failed to update quotation.');
        }
      } else {
        const res = await docApi.createQuotation(payload);
        if (res.success) {
          setIsFormOpen(false);
          loadQuotations();
        } else {
          setFormError(res.error || 'Failed to create quotation.');
        }
      }
    } catch (err) {
      setFormError(err.message || 'Error saving quotation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConvertToInvoice = async (quote) => {
    if (!window.confirm(`Convert quotation ${quote.quotation_number} into an official commercial invoice?`)) return;
    try {
      const res = await docApi.convertToInvoice(quote._id);
      if (res.success) {
        alert(`Successfully converted to Invoice ${res.invoice.invoice_number}!`);
        loadQuotations();
      } else {
        alert(res.error || 'Failed to convert quotation.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, number) => {
    if (!window.confirm(`Delete quotation record ${number}?`)) return;
    try {
      const res = await docApi.deleteQuotation(id);
      if (res.success) {
        loadQuotations();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Quotation Management</h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Issue formal estimates starting from Q-2026-27-1001 with 1-click invoice conversion.
          </p>
        </div>

        <button
          onClick={() => handleOpenForm()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black transition-all shadow-md border border-blue-400 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Quotation</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by quote # or client name..."
            className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="converted_to_invoice">Converted to Invoice</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-black uppercase text-[11px] tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4">Quotation #</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Date / Expiry</th>
                <th className="py-3.5 px-4">Grand Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-600">
                    <div className="inline-block animate-spin h-5 w-5 border-2 border-[#1677FF]/30 border-t-[#1677FF] rounded-full mb-2" />
                    <p className="font-mono text-xs font-bold">Loading quotations...</p>
                  </td>
                </tr>
              ) : quotations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-600">
                    <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-[2.5]" />
                    <p className="font-black text-slate-900 text-sm">No quotation records found.</p>
                    <p className="text-xs font-bold mt-1 text-slate-500">Click "New Quotation" to generate an official commercial estimate.</p>
                  </td>
                </tr>
              ) : (
                quotations.map((q) => {
                  const badge = getStatusBadge(q.status);
                  return (
                    <tr key={q._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900">{q.quotation_number}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {q.client_snapshot?.name || q.client_id?.name || 'Client'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700 truncate max-w-xs">{q.title}</td>
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-600">
                        <div>Issued: {formatDate(q.quotation_date)}</div>
                        <div className="text-amber-700 font-bold">Expires: {formatDate(q.expiry_date)}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">
                        {formatINR(q.grand_total)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        {q.converted_invoice_number && (
                          <span className="block text-[10px] font-mono font-black text-purple-700 mt-1">
                            → {q.converted_invoice_number}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {q.status !== 'converted_to_invoice' && (
                            <button
                              onClick={() => handleConvertToInvoice(q)}
                              title="Convert to Invoice"
                              className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded font-semibold text-[11px] hover:bg-purple-100 transition-colors inline-flex items-center gap-1"
                            >
                              <Receipt className="w-3 h-3" />
                              <span className="hidden lg:inline">To Invoice</span>
                            </button>
                          )}
                          <button
                            onClick={() => onPreviewDoc('quotation', q)}
                            title="Print / View A4 PDF Preview"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => docApi.downloadQuotationPdf(q._id, q.quotation_number)}
                            title="Download Standard A4 PDF"
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => docApi.downloadQuotationDocx(q._id, q.quotation_number)}
                            title="Download Word Document (.docx)"
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenForm(q)}
                            title="Edit Quotation"
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(q._id, q.quotation_number)}
                            title="Delete Quotation"
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New / Edit Quotation Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#1677FF]/10 text-[#1677FF]">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1220]">
                    {editingDoc ? `Edit Quotation ${editingDoc.quotation_number}` : 'Generate Quotation'}
                  </h3>
                  <p className="text-xs text-[#596579]">Sequential number starting from 1001 (e.g. Q-2026-27-1001) will be assigned</p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              {/* Header Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Select Client *
                  </label>
                  <select
                    required
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  >
                    <option value="">-- Choose Client --</option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.client_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Quotation Date
                  </label>
                  <input
                    type="date"
                    required
                    value={quotationDate}
                    onChange={(e) => setQuotationDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Valid Until (Expiry)
                  </label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Quotation Title / Engagement Scope
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Corporate Web Application Engineering"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              {/* Dynamic Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-mono font-bold text-slate-700 uppercase">
                    Service Line Items
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-mono font-bold text-[#1677FF] hover:underline"
                  >
                    + Add Line Item
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-12 gap-2 items-center"
                    >
                      <div className="col-span-12 sm:col-span-6">
                        <input
                          type="text"
                          required
                          placeholder="Service description..."
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded text-xs focus:outline-hidden focus:border-[#1677FF]"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded text-xs font-mono text-right"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <input
                          type="number"
                          min="0"
                          placeholder="Rate ₹"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded text-xs font-mono text-right"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Disc%"
                          value={item.discount_percent}
                          onChange={(e) => handleItemChange(idx, 'discount_percent', e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded text-xs font-mono text-right"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Summary Preview */}
              <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-xs text-slate-700">
                  <span className="font-bold">Subtotal: {formatINR(subtotal)}</span>
                  {totalDiscount > 0 && <span className="ml-3 font-bold text-emerald-700">Discount: -{formatINR(totalDiscount)}</span>}
                  <span className="ml-3 font-bold text-slate-500 uppercase tracking-wide">GST: ₹0.00 (Non-GST Threshold Exemption)</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Grand Total (Calculated):</span>
                  <span className="text-2xl font-black font-mono text-[#1677FF]">{formatINR(grandTotal)}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Pricing Note & Notes
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Pricing note / Scope guidelines..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Standard Commercial Terms & Conditions (Pre-filled)
                </label>
                <textarea
                  rows="6"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-lg font-bold shadow-xs transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Generating...' : editingDoc ? 'Update Quotation' : 'Create Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
