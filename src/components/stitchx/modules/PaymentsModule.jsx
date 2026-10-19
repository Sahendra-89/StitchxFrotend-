import React, { useState, useEffect } from 'react';
import {
  Banknote,
  Plus,
  Download,
  X,
} from 'lucide-react';
import { docApi } from '../../../lib/docApi';
import { formatINR, formatDate, exportToCSV } from '../utils';

export function PaymentsModule({ preselectedInvoice, onClearPreselectedInvoice }) {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  // Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form values
  const [invoiceId, setInvoiceId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('verified');

  useEffect(() => {
    loadPayments();
    loadUnpaidInvoices();
  }, [methodFilter, statusFilter, page]);

  useEffect(() => {
    if (preselectedInvoice) {
      handleOpenForm(preselectedInvoice);
      if (onClearPreselectedInvoice) onClearPreselectedInvoice();
    }
  }, [preselectedInvoice]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const res = await docApi.getPayments({
        payment_method: methodFilter,
        verification_status: statusFilter,
        page,
        limit: 15,
      });
      if (res.success) {
        setPayments(res.payments);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUnpaidInvoices = async () => {
    try {
      const res = await docApi.getInvoices({ status: 'all', limit: 100 });
      if (res.success) {
        // Show open invoices with balance > 0
        setInvoices(res.invoices.filter((inv) => inv.outstanding_balance > 0 || inv.status === 'issued'));
      }
    } catch (err) {}
  };

  const handleOpenForm = (invoice = null) => {
    setFormError('');
    if (invoice) {
      setInvoiceId(invoice._id);
      setAmount(String(invoice.outstanding_balance || ''));
    } else {
      setInvoiceId(invoices[0]?._id || '');
      setAmount(invoices[0]?.outstanding_balance ? String(invoices[0].outstanding_balance) : '');
    }
    setPaymentMethod('bank_transfer');
    setTransactionRef('');
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setNotes('');
    setVerificationStatus('verified');
    setIsFormOpen(true);
  };

  const handleInvoiceSelect = (id) => {
    setInvoiceId(id);
    const selected = invoices.find((inv) => inv._id === id);
    if (selected && selected.outstanding_balance) {
      setAmount(String(selected.outstanding_balance));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!invoiceId) {
      setFormError('Please select a target invoice.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setFormError('Please enter a valid positive payment amount.');
      return;
    }
    setFormError('');
    setSubmitting(true);

    try {
      const res = await docApi.createPayment({
        invoice_id: invoiceId,
        amount: Number(amount),
        payment_method: paymentMethod,
        transaction_reference: transactionRef,
        payment_date: paymentDate,
        notes,
        verification_status: verificationStatus,
      });

      if (res.success) {
        setIsFormOpen(false);
        loadPayments();
        loadUnpaidInvoices();
      } else {
        setFormError(res.error || 'Failed to record payment.');
      }
    } catch (err) {
      setFormError(err.message || 'Error recording payment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (payment) => {
    try {
      const res = await docApi.verifyPayment(payment._id);
      if (res.success) {
        loadPayments();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExportCSV = () => {
    const exportData = payments.map((p) => ({
      PaymentID: p.payment_id,
      InvoiceNumber: p.invoice_id?.invoice_number || p.invoice_number,
      Client: p.client_id?.name || 'Client',
      AmountINR: p.amount,
      Method: p.payment_method,
      TransactionReference: p.transaction_reference || 'N/A',
      PaymentDate: formatDate(p.payment_date),
      VerificationStatus: p.verification_status,
      RecordedBy: p.recorded_by,
    }));
    exportToCSV(`StitchX_Payments_${new Date().toISOString().slice(0, 10)}`, exportData);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Payment Collections</h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Log, verify, and reconcile manual and bank payments against client invoices with server-calculated balances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={payments.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleOpenForm()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black transition-all shadow-md border border-blue-400 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
          >
            <option value="all">All Methods</option>
            <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
            <option value="upi">UPI Transfer</option>
            <option value="cheque">Cheque</option>
            <option value="cash">Cash</option>
            <option value="card">Credit / Debit Card</option>
            <option value="payment_gateway">Payment Gateway</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending_verification">Pending Verification</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-black uppercase text-[11px] tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4">Payment ID</th>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Amount (INR)</th>
                <th className="py-3.5 px-4">Method & Ref</th>
                <th className="py-3.5 px-4">Payment Date</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-600">
                    <div className="inline-block animate-spin h-5 w-5 border-2 border-[#1677FF]/30 border-t-[#1677FF] rounded-full mb-2" />
                    <p className="font-mono text-xs font-bold">Loading payment transactions...</p>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-600">
                    <Banknote className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-[2.5]" />
                    <p className="font-black text-slate-900 text-sm">No payment receipts logged yet.</p>
                    <p className="text-xs font-bold mt-1 text-slate-500">Click "Record Payment" to reconcile an invoice collection.</p>
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900">{p.payment_id}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {p.invoice_id?.invoice_number || p.invoice_number}
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 font-bold">{p.client_id?.name || 'Client'}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-700 text-sm">
                      {formatINR(p.amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block capitalize">
                        {p.payment_method?.replace('_', ' ')}
                      </span>
                      {p.transaction_reference && (
                        <span className="font-mono font-bold text-[10px] text-slate-500 block truncate max-w-xs mt-0.5">
                          Ref: {p.transaction_reference}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-bold">{formatDate(p.payment_date)}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                          p.verification_status === 'verified'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-900 border-amber-300'
                        }`}
                      >
                        {p.verification_status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {p.verification_status !== 'verified' && (
                        <button
                          onClick={() => handleVerify(p)}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded font-semibold text-[11px] transition-colors"
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1220]">Record Invoice Payment</h3>
                  <p className="text-xs text-[#596579]">Auto-reconciles invoice balance and payment ledger</p>
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

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Target Invoice *
                </label>
                <select
                  required
                  value={invoiceId}
                  onChange={(e) => handleInvoiceSelect(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                >
                  <option value="">-- Choose Invoice to reconcile --</option>
                  {invoices.map((inv) => (
                    <option key={inv._id} value={inv._id}>
                      {inv.invoice_number} — {inv.client_snapshot?.name || 'Client'} (Bal: {formatINR(inv.outstanding_balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Amount Received (INR ₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  >
                    <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                    <option value="upi">UPI Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="cash">Cash Receipt</option>
                    <option value="card">Credit / Debit Card</option>
                    <option value="payment_gateway">Payment Gateway</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Transaction Ref / UTR / Cheque #
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="UTR / IMPS / Bank Ref"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Verification Status
                </label>
                <select
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                >
                  <option value="verified">Verified (Funds settled in company account)</option>
                  <option value="pending_verification">Pending Verification (Cheque clearance / reconciliation pending)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Transaction Notes
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes or depositor bank name..."
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Recording...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
