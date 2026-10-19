import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  FileSpreadsheet,
  FileSignature,
  FileCheck2,
  Receipt,
  X,
  Eye,
} from 'lucide-react';
import { docApi } from '../../../lib/docApi';
import { formatDate, formatINR, exportToCSV } from '../utils';

export function ClientsModule({ onQuickActionWithClient, onPreviewDoc }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);
  const [clientHistory, setClientHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    billing_address: '',
    service_address: '',
    gstin: '',
    status: 'active',
    notes: '',
  });

  useEffect(() => {
    loadClients();
  }, [search, statusFilter, page]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const res = await docApi.getClients({ search, status: statusFilter, page, limit: 15 });
      if (res.success) {
        setClients(res.clients);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (client = null) => {
    setEditingClient(client);
    setFormError('');
    if (client) {
      setFormData({
        name: client.name || '',
        contact_person: client.contact_person || '',
        email: client.email || '',
        phone: client.phone || '',
        billing_address: client.billing_address || '',
        service_address: client.service_address || '',
        gstin: client.gstin || '',
        status: client.status || 'active',
        notes: client.notes || '',
      });
    } else {
      setFormData({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        billing_address: '',
        service_address: '',
        gstin: '',
        status: 'active',
        notes: '',
      });
    }
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    try {
      if (editingClient) {
        const res = await docApi.updateClient(editingClient._id, formData);
        if (res.success) {
          setIsFormOpen(false);
          loadClients();
        } else {
          setFormError(res.error || 'Failed to update client.');
        }
      } else {
        const res = await docApi.createClient(formData);
        if (res.success) {
          setIsFormOpen(false);
          loadClients();
        } else {
          setFormError(res.error || 'Failed to create client.');
        }
      }
    } catch (err) {
      setFormError(err.message || 'Error saving client record.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteClient = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete client record "${name}"?`)) return;
    try {
      const res = await docApi.deleteClient(id);
      if (res.success) {
        loadClients();
      } else {
        alert(res.error || 'Failed to delete client.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleViewClientDetails = async (client) => {
    setViewingClient(client);
    setLoadingHistory(true);
    try {
      const res = await docApi.getClientById(client._id);
      if (res.success) {
        setClientHistory(res.history);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleExportClients = () => {
    const exportData = clients.map((c) => ({
      ClientID: c.client_id,
      Name: c.name,
      ContactPerson: c.contact_person,
      Email: c.email,
      Phone: c.phone,
      GSTIN: c.gstin || 'N/A',
      Status: c.status,
      BillingAddress: c.billing_address,
      CreatedDate: formatDate(c.created_at),
    }));
    exportToCSV(`StitchX_Clients_${new Date().toISOString().slice(0, 10)}`, exportData);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Client Management</h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Maintain verified customer records, contacts, billing details, and document transaction history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportClients}
            disabled={clients.length === 0}
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
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email, phone..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="lead">Lead</option>
          </select>
        </div>
      </div>

      {/* Clients Data Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-black uppercase text-[11px] tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4">Client ID</th>
                <th className="py-3.5 px-4">Business / Client Name</th>
                <th className="py-3.5 px-4">Contact Person</th>
                <th className="py-3.5 px-4">Email & Phone</th>
                <th className="py-3.5 px-4">GSTIN</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-600">
                    <div className="inline-block animate-spin h-5 w-5 border-2 border-[#1677FF]/30 border-t-[#1677FF] rounded-full mb-2" />
                    <p className="font-mono text-xs font-bold">Loading client records...</p>
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-600">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-[2.5]" />
                    <p className="font-black text-slate-900 text-sm">No client records found.</p>
                    <p className="text-xs font-bold mt-1 text-slate-500">Click "Add Client" to register a new client profile.</p>
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900">{client.client_id}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-slate-900 block hover:text-[#1677FF] cursor-pointer text-sm" onClick={() => handleViewClientDetails(client)}>
                        {client.name}
                      </span>
                      {client.billing_address && (
                        <span className="text-xs font-bold text-slate-500 truncate block max-w-xs mt-0.5">{client.billing_address}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{client.contact_person || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-900 font-bold block">{client.email}</span>
                      <span className="text-xs font-bold text-slate-500">{client.phone || '—'}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      {client.gstin ? (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-300 rounded font-black">
                          {client.gstin}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold">Unspecified</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                          client.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : client.status === 'lead'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewClientDetails(client)}
                          title="View Details & Documents"
                          className="p-1.5 text-slate-600 hover:text-[#1677FF] hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenForm(client)}
                          title="Edit Client"
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client._id, client.name)}
                          title="Delete Client"
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="p-3 border-t border-[#E2E7EF] flex justify-between items-center text-xs text-[#596579]">
            <span>Total records: {pagination.total}</span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
              >
                Previous
              </button>
              <span className="px-2 font-mono font-medium text-slate-800">
                {page} / {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Client Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#1677FF]/10 text-[#1677FF]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1220]">
                    {editingClient ? 'Edit Client Record' : 'Register New Client'}
                  </h3>
                  <p className="text-xs text-[#596579]">Fill in verified business and contact information</p>
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
              <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Client / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Acme Innovations Pvt Ltd"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@company.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Phone / Mobile
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Client GSTIN (if applicable)
                  </label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    placeholder="15-character GSTIN (optional)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Client Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  >
                    <option value="active">Active Client</option>
                    <option value="lead">Prospective Lead</option>
                    <option value="inactive">Inactive / Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Billing Address
                </label>
                <textarea
                  rows="2"
                  value={formData.billing_address}
                  onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })}
                  placeholder="Registered company billing address..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Internal Notes
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Private account notes, preferences, or project details..."
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
                  disabled={formSubmitting}
                  className="px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-lg font-bold shadow-xs transition-colors disabled:opacity-50"
                >
                  {formSubmitting ? 'Saving...' : editingClient ? 'Update Client' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Details & Full Document History Modal */}
      {viewingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    {viewingClient.client_id}
                  </span>
                  <h3 className="text-lg font-bold text-[#0B1220]">{viewingClient.name}</h3>
                </div>
                <p className="text-xs text-[#596579] mt-0.5">
                  {viewingClient.email} • {viewingClient.phone || 'No phone'} • Attn: {viewingClient.contact_person || 'N/A'}
                </p>
              </div>
              <button
                onClick={() => setViewingClient(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Dispatch Shortcuts for this Client */}
            <div className="p-4 bg-blue-50/50 border-b border-blue-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-[#1677FF] mr-1">New for Client:</span>
              <button
                onClick={() => {
                  onQuickActionWithClient('new_quotation', viewingClient);
                  setViewingClient(null);
                }}
                className="px-2.5 py-1 bg-white border border-blue-200 text-blue-700 rounded text-xs font-semibold hover:bg-blue-50 transition-colors shadow-2xs"
              >
                + Quotation
              </button>
              <button
                onClick={() => {
                  onQuickActionWithClient('new_proposal', viewingClient);
                  setViewingClient(null);
                }}
                className="px-2.5 py-1 bg-white border border-purple-200 text-purple-700 rounded text-xs font-semibold hover:bg-purple-50 transition-colors shadow-2xs"
              >
                + Proposal
              </button>
              <button
                onClick={() => {
                  onQuickActionWithClient('new_agreement', viewingClient);
                  setViewingClient(null);
                }}
                className="px-2.5 py-1 bg-white border border-emerald-200 text-emerald-700 rounded text-xs font-semibold hover:bg-emerald-50 transition-colors shadow-2xs"
              >
                + NDA
              </button>
              <button
                onClick={() => {
                  onQuickActionWithClient('new_invoice', viewingClient);
                  setViewingClient(null);
                }}
                className="px-2.5 py-1 bg-white border border-amber-200 text-amber-700 rounded text-xs font-semibold hover:bg-amber-50 transition-colors shadow-2xs"
              >
                + Invoice
              </button>
            </div>

            {/* History Tabs */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto text-xs">
              {loadingHistory ? (
                <div className="text-center py-8 text-[#596579]">Loading transaction records...</div>
              ) : (
                <>
                  {/* Linked Invoices */}
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                      <Receipt className="w-4 h-4 text-amber-600" />
                      <span>Issued Invoices ({clientHistory?.invoices?.length || 0})</span>
                    </h4>
                    {clientHistory?.invoices?.length > 0 ? (
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                        {clientHistory.invoices.map((inv) => (
                          <div
                            key={inv._id}
                            className="p-2.5 flex justify-between items-center hover:bg-slate-50 cursor-pointer"
                            onClick={() => onPreviewDoc('invoice', inv)}
                          >
                            <div>
                              <span className="font-mono font-bold text-slate-800">{inv.invoice_number}</span>
                              <span className="text-[11px] text-[#596579] ml-2">{formatDate(inv.invoice_date)}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-slate-900 block">{formatINR(inv.total_amount)}</span>
                              <span className="text-[10px] text-rose-600 font-medium">Bal: {formatINR(inv.outstanding_balance)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">No invoices linked.</p>
                    )}
                  </div>

                  {/* Linked Quotations */}
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                      <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                      <span>Quotations ({clientHistory?.quotations?.length || 0})</span>
                    </h4>
                    {clientHistory?.quotations?.length > 0 ? (
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                        {clientHistory.quotations.map((q) => (
                          <div
                            key={q._id}
                            className="p-2.5 flex justify-between items-center hover:bg-slate-50 cursor-pointer"
                            onClick={() => onPreviewDoc('quotation', q)}
                          >
                            <div>
                              <span className="font-mono font-bold text-slate-800">{q.quotation_number}</span>
                              <span className="text-[11px] text-[#596579] ml-2">{q.title}</span>
                            </div>
                            <span className="font-mono font-bold text-slate-900">{formatINR(q.grand_total)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">No quotations found.</p>
                    )}
                  </div>

                  {/* Linked Proposals & Agreements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                        <FileSignature className="w-4 h-4 text-purple-600" />
                        <span>Proposals ({clientHistory?.proposals?.length || 0})</span>
                      </h4>
                      {clientHistory?.proposals?.length > 0 ? (
                        <div className="space-y-1">
                          {clientHistory.proposals.map((p) => (
                            <div
                              key={p._id}
                              onClick={() => onPreviewDoc('proposal', p)}
                              className="p-2 bg-slate-50 rounded border border-slate-200 hover:border-purple-300 cursor-pointer"
                            >
                              <span className="font-mono font-bold text-slate-800 block">{p.proposal_number}</span>
                              <span className="text-[11px] text-[#596579]">{p.project_title}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">No proposals.</p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                        <FileCheck2 className="w-4 h-4 text-emerald-600" />
                        <span>Agreements / NDAs ({clientHistory?.agreements?.length || 0})</span>
                      </h4>
                      {clientHistory?.agreements?.length > 0 ? (
                        <div className="space-y-1">
                          {clientHistory.agreements.map((a) => (
                            <div
                              key={a._id}
                              onClick={() => onPreviewDoc('agreement', a)}
                              className="p-2 bg-slate-50 rounded border border-slate-200 hover:border-emerald-300 cursor-pointer"
                            >
                              <span className="font-mono font-bold text-slate-800 block">{a.agreement_number}</span>
                              <span className="text-[11px] text-[#596579] capitalize">{a.agreement_type?.replace('_', ' ')}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">No agreements.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
