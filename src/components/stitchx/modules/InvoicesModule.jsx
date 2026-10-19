import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  AlertCircle,
  FileDown,
  FileText,
  Ban,
  Send,
  Banknote,
} from 'lucide-react';
import { docApi } from '../../../lib/docApi';
import { formatINR, formatDate, getStatusBadge } from '../utils';

export function InvoicesModule({
  onPreviewDoc,
  onQuickRecordPayment,
  preselectedClient,
  onClearPreselectedClient,
}) {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellingInvoice, setCancellingInvoice] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [clientId, setClientId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10));
  const [taxTreatment, setTaxTreatment] = useState('commercial_nongst');
  const [paymentTerms, setPaymentTerms] = useState('Payment due within 15 days of invoice date.');
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { description: 'Professional Software Engineering Services', quantity: 1, unit_price: 35000, discount_percent: 0, tax_rate: 0 },
  ]);

  useEffect(() => {
    loadInvoices();
    loadClientsList();
    loadCompanySettings();
  }, [statusFilter, search, page]);

  useEffect(() => {
    if (preselectedClient) {
      handleOpenForm(null, preselectedClient);
      if (onClearPreselectedClient) onClearPreselectedClient();
    }
  }, [preselectedClient]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const res = await docApi.getInvoices({ status: statusFilter, search, page, limit: 15 });
      if (res.success) {
        setInvoices(res.invoices);
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
    } catch (err) {}
  };

  const loadCompanySettings = async () => {
    try {
      const res = await docApi.getCompanySettings();
      if (res.success) {
        setCompany(res.settings);
      }
    } catch (err) {}
  };

  const handleOpenForm = (inv = null, client = null) => {
    setEditingInvoice(inv);
    setFormError('');
    if (inv) {
      setClientId(inv.client_id?._id || inv.client_id || '');
      setInvoiceDate(new Date(inv.invoice_date).toISOString().slice(0, 10));
      setDueDate(new Date(inv.due_date).toISOString().slice(0, 10));
      setTaxTreatment(inv.tax_treatment || 'commercial_nongst');
      setPaymentTerms(inv.payment_terms || '');
      setPaymentInstructions(inv.payment_instructions || '');
      setNotes(inv.notes || '');
      setItems(inv.items?.length ? inv.items : [{ description: '', quantity: 1, unit_price: 0, discount_percent: 0, tax_rate: 0 }]);
    } else {
      setClientId(client?._id || (clients[0]?._id || ''));
      setInvoiceDate(new Date().toISOString().slice(0, 10));
      setDueDate(new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10));
      setTaxTreatment('commercial_nongst');
      setPaymentTerms(company?.default_payment_terms || 'Payment due within 15 days of invoice date.');
      setPaymentInstructions(
        company?.bank_account_number
          ? `Bank: ${company.bank_name || ''} | Account: ${company.bank_account_number} | IFSC: ${company.bank_ifsc || ''} | UPI: ${company.upi_id || ''}`
          : 'Please make payment to verified StitchX business bank account.'
      );
      setNotes('');
      setItems([{ description: 'Software Development & Technical Delivery', quantity: 1, unit_price: 35000, discount_percent: 0, tax_rate: 0 }]);
    }
    setIsFormOpen(true);
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, discount_percent: 0, tax_rate: 0 }]);
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

  // Live client totals
  const subtotal = items.reduce((sum, it) => sum + (Number(it.quantity) || 1) * (Number(it.unit_price) || 0), 0);
  const totalDiscount = items.reduce((sum, it) => {
    const gross = (Number(it.quantity) || 1) * (Number(it.unit_price) || 0);
    return sum + (gross * (Number(it.discount_percent) || 0)) / 100;
  }, 0);
  const taxAmount = taxTreatment === 'gst_tax_invoice'
    ? items.reduce((sum, it) => {
        const gross = (Number(it.quantity) || 1) * (Number(it.unit_price) || 0);
        const net = gross - (gross * (Number(it.discount_percent) || 0)) / 100;
        return sum + (net * (Number(it.tax_rate) || 0)) / 100;
      }, 0)
    : 0;
  const totalAmount = subtotal - totalDiscount + taxAmount;

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
      invoice_date: invoiceDate,
      due_date: dueDate,
      tax_treatment: taxTreatment,
      payment_terms: paymentTerms,
      payment_instructions: paymentInstructions,
      notes,
      items: items.map((it) => ({
        description: it.description,
        quantity: Number(it.quantity) || 1,
        unit_price: Number(it.unit_price) || 0,
        discount_percent: Number(it.discount_percent) || 0,
        tax_rate: taxTreatment === 'gst_tax_invoice' ? Number(it.tax_rate) || 0 : 0,
      })),
    };

    try {
      if (editingInvoice) {
        const res = await docApi.updateInvoice(editingInvoice._id, payload);
        if (res.success) {
          setIsFormOpen(false);
          loadInvoices();
        } else {
          setFormError(res.error || 'Failed to update invoice.');
        }
      } else {
        const res = await docApi.createInvoice(payload);
        if (res.success) {
          setIsFormOpen(false);
          loadInvoices();
        } else {
          setFormError(res.error || 'Failed to generate invoice.');
        }
      }
    } catch (err) {
      setFormError(err.message || 'Error processing invoice.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleIssueInvoice = async (inv) => {
    if (!window.confirm(`Issue Invoice ${inv.invoice_number}? This transitions it to an active billable record.`)) return;
    try {
      const res = await docApi.issueInvoice(inv._id);
      if (res.success) {
        loadInvoices();
      } else {
        alert(res.error || 'Failed to issue invoice.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenCancelModal = (inv) => {
    setCancellingInvoice(inv);
    setCancelReason('');
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;
    try {
      const res = await docApi.cancelInvoice(cancellingInvoice._id, cancelReason);
      if (res.success) {
        setIsCancelModalOpen(false);
        loadInvoices();
      } else {
        alert(res.error || 'Failed to cancel invoice.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, number) => {
    if (!window.confirm(`Delete draft invoice ${number}?`)) return;
    try {
      const res = await docApi.deleteInvoice(id);
      if (res.success) {
        loadInvoices();
      } else {
        alert(res.error || 'Failed to delete invoice.');
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
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Invoice Management</h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Sequential invoice numbering starting from SX/2026-27/1001 with commercial non-GST default and balance tracking.
          </p>
        </div>

        <button
          onClick={() => handleOpenForm()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black transition-all shadow-md border border-blue-400 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Tax Disclaimer Banner */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-slate-800 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5 stroke-[2.5]" />
        <div>
          <span className="font-black text-slate-900 uppercase tracking-wide">Tax Treatment Policy:</span> GST registration for StitchX Global
          Technology is unconfirmed. Invoices default strictly to Commercial Non-GST. GST Tax Invoices can only be issued
          if the owner configures a confirmed GSTIN in Company Settings.
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice # or client..."
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
            <option value="issued">Issued / Unpaid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-black uppercase text-[11px] tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Invoice Date / Due</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Amount Paid</th>
                <th className="py-3.5 px-4">Balance Due</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-600">
                    <div className="inline-block animate-spin h-5 w-5 border-2 border-[#1677FF]/30 border-t-[#1677FF] rounded-full mb-2" />
                    <p className="font-mono text-xs font-bold">Loading invoice ledger...</p>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-600">
                    <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-[2.5]" />
                    <p className="font-black text-slate-900 text-sm">No invoices found.</p>
                    <p className="text-xs font-bold mt-1 text-slate-500">Click "New Invoice" to generate a bill.</p>
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const badge = getStatusBadge(inv.status);
                  const isOverdue =
                    inv.status !== 'paid' && inv.status !== 'cancelled' && new Date(inv.due_date) < new Date();
                  return (
                    <tr key={inv._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                        {inv.invoice_number}
                        {inv.related_quotation_number && (
                          <span className="block text-[10px] font-mono font-bold text-slate-500 mt-0.5">
                            Ref: {inv.related_quotation_number}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {inv.client_snapshot?.name || inv.client_id?.name || 'Client'}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-600">
                        <div>{formatDate(inv.invoice_date)}</div>
                        <div className={isOverdue ? 'text-rose-700 font-black' : 'text-slate-500'}>
                          Due: {formatDate(inv.due_date)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">
                        {formatINR(inv.total_amount)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-700">
                        {formatINR(inv.amount_paid)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-rose-700 text-sm">
                        {formatINR(inv.outstanding_balance)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.status === 'draft' && (
                            <button
                              onClick={() => handleIssueInvoice(inv)}
                              title="Issue Invoice"
                              className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded font-semibold text-[11px] hover:bg-blue-100 transition-colors inline-flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span className="hidden lg:inline">Issue</span>
                            </button>
                          )}
                          {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                            <button
                              onClick={() => onQuickRecordPayment(inv)}
                              title="Record Payment"
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold text-[11px] hover:bg-emerald-100 transition-colors inline-flex items-center gap-1"
                            >
                              <Banknote className="w-3 h-3" />
                              <span className="hidden lg:inline">Pay</span>
                            </button>
                          )}
                          <button
                            onClick={() => onPreviewDoc('invoice', inv)}
                            title="Print / View A4 PDF Preview"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => docApi.downloadInvoicePdf(inv._id, inv.invoice_number)}
                            title="Download Standard A4 PDF"
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => docApi.downloadInvoiceDocx(inv._id, inv.invoice_number)}
                            title="Download Word Document (.docx)"
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                          {inv.status === 'draft' ? (
                            <>
                              <button
                                onClick={() => handleOpenForm(inv)}
                                title="Edit Draft"
                                className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(inv._id, inv.invoice_number)}
                                title="Delete Draft"
                                className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            inv.status !== 'cancelled' && (
                              <button
                                onClick={() => handleOpenCancelModal(inv)}
                                title="Cancel Invoice"
                                className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            )
                          )}
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

      {/* New / Edit Invoice Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#1677FF]/10 text-[#1677FF]">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1220]">
                    {editingInvoice ? `Edit Invoice ${editingInvoice.invoice_number}` : 'Generate Commercial Invoice'}
                  </h3>
                  <p className="text-xs text-[#596579]">Sequential number starting from 1001 (e.g. SX/2026-27/1001) will be assigned</p>
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
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    required
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Tax Treatment Configuration
                </label>
                <select
                  value={taxTreatment}
                  onChange={(e) => setTaxTreatment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                >
                  <option value="commercial_nongst">
                    Commercial Invoice (Unregistered for GST — No Tax Collected)
                  </option>
                  <option value="gst_tax_invoice">
                    GST Tax Invoice (Requires confirmed GSTIN in Company Settings)
                  </option>
                </select>
              </div>

              {/* Dynamic Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-mono font-bold text-slate-700 uppercase">
                    Deliverable / Service Items
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
                          placeholder="Description of service delivered..."
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

              {/* Totals Preview */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-xs text-[#596579]">
                  <span>Subtotal: {formatINR(subtotal)}</span>
                  {totalDiscount > 0 && <span className="ml-3 text-emerald-600">Discount: -{formatINR(totalDiscount)}</span>}
                  {taxAmount > 0 && <span className="ml-3 text-slate-800">GST: {formatINR(taxAmount)}</span>}
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#596579] block">Total Amount Due:</span>
                  <span className="text-xl font-extrabold font-mono text-slate-900">{formatINR(totalAmount)}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Payment Instructions & Bank Account
                </label>
                <textarea
                  rows="2"
                  value={paymentInstructions}
                  onChange={(e) => setPaymentInstructions(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
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
                  {submitting ? 'Generating...' : editingInvoice ? 'Update Invoice' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation Reason Modal */}
      {isCancelModalOpen && cancellingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-left">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Cancel Invoice {cancellingInvoice.invoice_number}
            </h3>
            <p className="text-xs text-[#596579] mb-4">
              Issued invoices cannot be deleted silently. Please specify a verifiable audit reason for cancelling this
              invoice.
            </p>
            <form onSubmit={handleConfirmCancel} className="space-y-4">
              <textarea
                required
                rows="3"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Billed under incorrect scope; revised replacement issued..."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-rose-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
