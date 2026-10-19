import React, { useState, useEffect } from 'react';
import {
  FileSignature,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  FileDown,
  FileText,
} from 'lucide-react';
import { docApi } from '../../../lib/docApi';
import { formatINR, getStatusBadge } from '../utils';

export function ProposalsModule({ onPreviewDoc, preselectedClient, onClearPreselectedClient }) {
  const [proposals, setProposals] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  // Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form values
  const [clientId, setClientId] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [execSummary, setExecSummary] = useState('');
  const [clientReqs, setClientReqs] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [techStack, setTechStack] = useState('React, Node.js, Express, MongoDB, Tailwind CSS');
  const [totalBudget, setTotalBudget] = useState(75000);
  const [paymentSchedule, setPaymentSchedule] = useState('30% Advance on signing, 40% on Beta Milestone, 30% on Final Deployment.');
  const [status, setStatus] = useState('draft');

  useEffect(() => {
    loadProposals();
    loadClientsList();
  }, [statusFilter, search, page]);

  useEffect(() => {
    if (preselectedClient) {
      handleOpenForm(null, preselectedClient);
      if (onClearPreselectedClient) onClearPreselectedClient();
    }
  }, [preselectedClient]);

  const loadProposals = async () => {
    setLoading(true);
    try {
      const res = await docApi.getProposals({ status: statusFilter, search, page, limit: 15 });
      if (res.success) {
        setProposals(res.proposals);
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

  const handleOpenForm = (proposal = null, client = null) => {
    setEditingDoc(proposal);
    setFormError('');
    if (proposal) {
      setClientId(proposal.client_id?._id || proposal.client_id || '');
      setProjectTitle(proposal.project_title || '');
      setExecSummary(proposal.executive_summary || '');
      setClientReqs(proposal.client_requirements || '');
      setProposedSolution(proposal.proposed_solution || '');
      setDeliverables((proposal.deliverables || []).join('\n'));
      setTechStack((proposal.tech_stack || []).join(', '));
      setTotalBudget(proposal.total_budget || 0);
      setPaymentSchedule(proposal.fees_and_payment_schedule || '');
      setStatus(proposal.status || 'draft');
    } else {
      setClientId(client?._id || (clients[0]?._id || ''));
      setProjectTitle('Enterprise Digital Transformation & Web Engineering');
      setExecSummary('StitchX proposes to engineer a bespoke, secure, cloud-native digital platform to streamline core client business operations and customer acquisition.');
      setClientReqs('Scalable architecture, responsive customer interface, sub-second API performance, and role-based administrative governance.');
      setProposedSolution('Full-stack solution utilizing modern component-driven frontend architecture, hardened Node.js microservices, and MongoDB document database.');
      setDeliverables('UI/UX Interactive Prototypes\nProduction Frontend & Admin Console\nSecure REST API Backend\nAutomated CI/CD Cloud Deployment');
      setTechStack('React 19, Node.js, Express, MongoDB, Tailwind CSS');
      setTotalBudget(75000);
      setPaymentSchedule('30% advance on execution, 40% on milestone beta, 30% upon final sign-off.');
      setStatus('draft');
    }
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!clientId) {
      setFormError('Please select a client.');
      return;
    }
    setFormError('');
    setSubmitting(true);

    const payload = {
      client_id: clientId,
      project_title: projectTitle,
      executive_summary: execSummary,
      client_requirements: clientReqs,
      proposed_solution: proposedSolution,
      deliverables: deliverables.split('\n').map((s) => s.trim()).filter(Boolean),
      tech_stack: techStack.split(',').map((s) => s.trim()).filter(Boolean),
      total_budget: Number(totalBudget) || 0,
      fees_and_payment_schedule: paymentSchedule,
      status,
    };

    try {
      if (editingDoc) {
        const res = await docApi.updateProposal(editingDoc._id, payload);
        if (res.success) {
          setIsFormOpen(false);
          loadProposals();
        } else {
          setFormError(res.error || 'Failed to update proposal.');
        }
      } else {
        const res = await docApi.createProposal(payload);
        if (res.success) {
          setIsFormOpen(false);
          loadProposals();
        } else {
          setFormError(res.error || 'Failed to create proposal.');
        }
      }
    } catch (err) {
      setFormError(err.message || 'Error saving proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, number) => {
    if (!window.confirm(`Delete proposal ${number}?`)) return;
    try {
      const res = await docApi.deleteProposal(id);
      if (res.success) loadProposals();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Proposal Management</h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Create high-converting technical proposals starting from P-2026-27-1001 with executive summaries and milestones.
          </p>
        </div>

        <button
          onClick={() => handleOpenForm()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black transition-all shadow-md border border-blue-400 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Proposal</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proposal # or title..."
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
            <option value="in_review">In Review / Awaiting Approval</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-black uppercase text-[11px] tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4">Proposal #</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Project Title</th>
                <th className="py-3.5 px-4">Budget (INR)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-600">
                    <div className="inline-block animate-spin h-5 w-5 border-2 border-[#1677FF]/30 border-t-[#1677FF] rounded-full mb-2" />
                    <p className="font-mono text-xs font-bold">Loading proposals...</p>
                  </td>
                </tr>
              ) : proposals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-600">
                    <FileSignature className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-[2.5]" />
                    <p className="font-black text-slate-900 text-sm">No project proposals created yet.</p>
                  </td>
                </tr>
              ) : (
                proposals.map((p) => {
                  const badge = getStatusBadge(p.status);
                  return (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900">{p.proposal_number}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {p.client_snapshot?.name || p.client_id?.name || 'Client'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700 truncate max-w-sm">{p.project_title}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">{formatINR(p.total_budget)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPreviewDoc('proposal', p)}
                            title="Preview / Print A4"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => docApi.downloadProposalPdf(p._id, p.proposal_number)}
                            title="Download Standard A4 PDF"
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => docApi.downloadProposalDocx(p._id, p.proposal_number)}
                            title="Download Word Document (.docx)"
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenForm(p)}
                            title="Edit Proposal"
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id, p.proposal_number)}
                            title="Delete Proposal"
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

      {/* Proposal Builder Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <FileSignature className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1220]">
                    {editingDoc ? `Edit Proposal ${editingDoc.proposal_number}` : 'Generate Project Proposal'}
                  </h3>
                  <p className="text-xs text-[#596579]">Sequential number starting from 1001 (e.g. P-2026-27-1001) will be assigned</p>
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

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    Proposal Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  >
                    <option value="draft">Draft</option>
                    <option value="in_review">In Review / Awaiting Approval</option>
                    <option value="sent">Sent to Client</option>
                    <option value="accepted">Accepted / Approved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. NextGen Web Architecture & Digital Automation"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Executive Summary
                </label>
                <textarea
                  rows="3"
                  value={execSummary}
                  onChange={(e) => setExecSummary(e.target.value)}
                  placeholder="High-level business and technical goals..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Deliverables (One item per line)
                </label>
                <textarea
                  rows="3"
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  placeholder="Frontend UI Architecture&#10;Backend API & Database&#10;QA Test Suite"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Technology Stack (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    placeholder="React, Node.js, Express, MongoDB"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Total Project Investment (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Milestones & Payment Schedule
                </label>
                <textarea
                  rows="2"
                  value={paymentSchedule}
                  onChange={(e) => setPaymentSchedule(e.target.value)}
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
                  {submitting ? 'Saving...' : editingDoc ? 'Update Proposal' : 'Generate Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
