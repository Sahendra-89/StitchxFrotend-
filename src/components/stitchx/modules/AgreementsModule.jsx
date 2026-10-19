import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  FileDown,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { docApi } from '../../../lib/docApi';
import { formatDate, getStatusBadge } from '../utils';

export function AgreementsModule({ onPreviewDoc, preselectedClient, onClearPreselectedClient }) {
  const [agreements, setAgreements] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [signingDoc, setSigningDoc] = useState(null);
  const [signatoryName, setSignatoryName] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form values
  const [agreementType, setAgreementType] = useState('mutual_nda');
  const [clientId, setClientId] = useState('');
  const [secondPartyName, setSecondPartyName] = useState('');
  const [secondPartyAddress, setSecondPartyAddress] = useState('');
  const [secondPartySignatory, setSecondPartySignatory] = useState('');
  const [purpose, setPurpose] = useState(
    'Evaluation of prospective commercial software engineering, technical architecture consulting, and product delivery engagements.'
  );
  const [termSurvival, setTermSurvival] = useState(
    'Effective for two (2) years from execution. Confidentiality covenants survive for three (3) years post-termination.'
  );
  const [governingLaw, setGoverningLaw] = useState(
    'This Agreement shall be governed by and construed in accordance with the Laws of India, subject to the jurisdiction of competent courts in India.'
  );

  useEffect(() => {
    loadAgreements();
    loadClientsList();
  }, [typeFilter, statusFilter, search, page]);

  useEffect(() => {
    if (preselectedClient) {
      handleOpenForm(null, preselectedClient);
      if (onClearPreselectedClient) onClearPreselectedClient();
    }
  }, [preselectedClient]);

  const loadAgreements = async () => {
    setLoading(true);
    try {
      const res = await docApi.getAgreements({
        agreement_type: typeFilter,
        status: statusFilter,
        search,
        page,
        limit: 15,
      });
      if (res.success) {
        setAgreements(res.agreements);
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

  const handleOpenForm = (agreement = null, client = null) => {
    setEditingDoc(agreement);
    setFormError('');
    if (agreement) {
      setAgreementType(agreement.agreement_type || 'mutual_nda');
      setClientId(agreement.client_id?._id || agreement.client_id || '');
      setSecondPartyName(agreement.second_party_name || '');
      setSecondPartyAddress(agreement.second_party_address || '');
      setSecondPartySignatory(agreement.second_party_signatory || '');
      setPurpose(agreement.purpose || '');
      setTermSurvival(agreement.term_and_survival || '');
      setGoverningLaw(agreement.governing_law || '');
    } else {
      setAgreementType('mutual_nda');
      setClientId(client?._id || '');
      setSecondPartyName(client?.name || '');
      setSecondPartyAddress(client?.billing_address || '');
      setSecondPartySignatory(client?.contact_person || '');
      setPurpose(
        'Evaluation of prospective commercial software engineering, technical architecture consulting, and product delivery engagements.'
      );
      setTermSurvival(
        'Effective for two (2) years from execution. Confidentiality covenants survive for three (3) years post-termination.'
      );
      setGoverningLaw(
        'This Agreement shall be governed by and construed in accordance with the Laws of India, subject to the jurisdiction of competent courts in India.'
      );
    }
    setIsFormOpen(true);
  };

  const handleSelectClient = (cId) => {
    setClientId(cId);
    const chosen = clients.find((c) => c._id === cId);
    if (chosen) {
      setSecondPartyName(chosen.name);
      setSecondPartyAddress(chosen.billing_address || '');
      setSecondPartySignatory(chosen.contact_person || '');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!secondPartyName.trim()) {
      setFormError('Second Party name is required.');
      return;
    }
    setFormError('');
    setSubmitting(true);

    const payload = {
      client_id: clientId || undefined,
      agreement_type: agreementType,
      second_party_name: secondPartyName.trim(),
      second_party_address: secondPartyAddress.trim(),
      second_party_signatory: secondPartySignatory.trim(),
      purpose,
      term_and_survival: termSurvival,
      governing_law: governingLaw,
    };

    try {
      if (editingDoc) {
        const res = await docApi.updateAgreement(editingDoc._id, payload);
        if (res.success) {
          setIsFormOpen(false);
          loadAgreements();
        } else {
          setFormError(res.error || 'Failed to update agreement.');
        }
      } else {
        const res = await docApi.createAgreement(payload);
        if (res.success) {
          setIsFormOpen(false);
          loadAgreements();
        } else {
          setFormError(res.error || 'Failed to create agreement.');
        }
      }
    } catch (err) {
      setFormError(err.message || 'Error processing agreement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenSignModal = (agr) => {
    setSigningDoc(agr);
    setSignatoryName(agr.second_party_signatory || '');
    setIsSignModalOpen(true);
  };

  const handleConfirmSignature = async (e) => {
    e.preventDefault();
    if (!signatoryName.trim()) return;
    try {
      const res = await docApi.markAgreementSigned(signingDoc._id, {
        signed_by_name: signatoryName.trim(),
        signed_at: new Date(),
      });
      if (res.success) {
        setIsSignModalOpen(false);
        loadAgreements();
      } else {
        alert(res.error || 'Failed to verify signature.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, number) => {
    if (!window.confirm(`Delete agreement ${number}?`)) return;
    try {
      const res = await docApi.deleteAgreement(id);
      if (res.success) loadAgreements();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            NDAs & Legal Agreements
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Mutual and One-Way confidentiality contracts under Indian jurisdiction with execution verification.
          </p>
        </div>

        <button
          onClick={() => handleOpenForm()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black transition-all shadow-md border border-blue-400 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Agreement</span>
        </button>
      </div>

      {/* Legal Notice Disclaimer Banner */}
      <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl text-xs text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 stroke-[2.5]" />
        <div>
          <span className="font-black uppercase tracking-wide">Compliance Advisory:</span> Use lawyer-reviewed standard terms. Generated NDAs
          serve standard commercial protection; specialized cross-border or high-liability contracts must be reviewed by
          qualified legal counsel. Never fabricate electronic signatures.
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agreement # or party name..."
            className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
          >
            <option value="all">All Agreement Types</option>
            <option value="mutual_nda">Mutual NDA</option>
            <option value="oneway_nda">One-Way NDA</option>
            <option value="msa">Master Service Agreement (MSA)</option>
            <option value="service_contract">Service Contract</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent for Signature</option>
            <option value="signed">Signed & Executed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-black uppercase text-[11px] tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4">Agreement #</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Second Party (Counterparty)</th>
                <th className="py-3.5 px-4">Date / Status</th>
                <th className="py-3.5 px-4">Signatory</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-600">
                    <div className="inline-block animate-spin h-5 w-5 border-2 border-[#1677FF]/30 border-t-[#1677FF] rounded-full mb-2" />
                    <p className="font-mono text-xs font-bold">Loading agreements...</p>
                  </td>
                </tr>
              ) : agreements.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-600">
                    <FileCheck2 className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-[2.5]" />
                    <p className="font-black text-slate-900 text-sm">No agreements generated yet.</p>
                  </td>
                </tr>
              ) : (
                agreements.map((a) => {
                  const badge = getStatusBadge(a.status);
                  return (
                    <tr key={a._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900">{a.agreement_number}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-bold text-slate-800 uppercase">
                          {a.agreement_type?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{a.second_party_name}</td>
                      <td className="py-3.5 px-4 text-xs font-bold">
                        <span className="text-slate-600 block">{formatDate(a.created_at)}</span>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border mt-1 ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-bold">
                        {a.signed_by_name ? (
                          <span className="text-emerald-700 font-black">✓ {a.signed_by_name}</span>
                        ) : (
                          <span className="text-slate-400 font-bold italic">Unsigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {a.status !== 'signed' && (
                            <button
                              onClick={() => handleOpenSignModal(a)}
                              title="Verify Signature"
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold text-[11px] hover:bg-emerald-100 transition-colors"
                            >
                              Verify Signed
                            </button>
                          )}
                          <button
                            onClick={() => onPreviewDoc('agreement', a)}
                            title="Print / View A4 PDF Preview"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => docApi.downloadAgreementPdf(a._id, a.agreement_number)}
                            title="Download Standard A4 PDF"
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => docApi.downloadAgreementDocx(a._id, a.agreement_number)}
                            title="Download Word Document (.docx)"
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenForm(a)}
                            title="Edit Draft"
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(a._id, a.agreement_number)}
                            title="Delete Agreement"
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

      {/* Agreement Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1220]">
                    {editingDoc ? `Edit ${editingDoc.agreement_number}` : 'Generate Confidentiality Agreement'}
                  </h3>
                  <p className="text-xs text-[#596579]">Sequential number starting from 1001 (e.g. SX/NDA/2026-27/1001) will be assigned</p>
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
                    Agreement Type
                  </label>
                  <select
                    value={agreementType}
                    onChange={(e) => setAgreementType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  >
                    <option value="mutual_nda">Mutual Non-Disclosure Agreement (Both Parties)</option>
                    <option value="oneway_nda">One-Way Non-Disclosure Agreement</option>
                    <option value="msa">Master Service Agreement (MSA)</option>
                    <option value="service_contract">Service Contract Agreement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Select Client (Auto-fill)
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => handleSelectClient(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  >
                    <option value="">-- Choose Client or enter custom --</option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Second Party (Client / Partner) Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={secondPartyName}
                    onChange={(e) => setSecondPartyName(e.target.value)}
                    placeholder="e.g. InnovateX Digital Ltd"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Signatory Name / Designation
                  </label>
                  <input
                    type="text"
                    value={secondPartySignatory}
                    onChange={(e) => setSecondPartySignatory(e.target.value)}
                    placeholder="e.g. Director or Managing Partner"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Second Party Address
                </label>
                <input
                  type="text"
                  value={secondPartyAddress}
                  onChange={(e) => setSecondPartyAddress(e.target.value)}
                  placeholder="Registered commercial address"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Purpose of Information Exchange
                </label>
                <textarea
                  rows="2"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Term & Survival Covenants
                </label>
                <textarea
                  rows="2"
                  value={termSurvival}
                  onChange={(e) => setTermSurvival(e.target.value)}
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
                  {submitting ? 'Saving...' : editingDoc ? 'Update Agreement' : 'Generate Agreement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verify Signature Modal */}
      {isSignModalOpen && signingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-left">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Verify Execution: {signingDoc.agreement_number}
            </h3>
            <p className="text-xs text-[#596579] mb-4">
              Enter the authorized signatory name who verified and countersigned this agreement.
            </p>
            <form onSubmit={handleConfirmSignature} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Signatory Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  placeholder="e.g. Vikash Sharma, Director"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSignModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Confirm Execution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
