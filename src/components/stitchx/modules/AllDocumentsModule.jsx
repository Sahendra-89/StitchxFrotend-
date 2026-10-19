import React, { useState, useEffect } from 'react';
import {
  Files,
  Search,
  Eye,
  FileSpreadsheet,
  FileSignature,
  FileCheck2,
  Receipt,
  FileText,
} from 'lucide-react';
import { docApi } from '../../../lib/docApi';
import { formatINR, formatDate, getStatusBadge } from '../utils';

export function AllDocumentsModule({ onPreviewDoc }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadDocuments();
  }, [typeFilter, statusFilter, query]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const res = await docApi.getAllDocuments({ query, type: typeFilter, status: statusFilter });
      if (res.success) {
        setDocuments(res.documents);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDocIcon = (docType) => {
    switch (docType) {
      case 'invoice':
        return <Receipt className="w-4 h-4 text-amber-600" />;
      case 'quotation':
        return <FileSpreadsheet className="w-4 h-4 text-blue-600" />;
      case 'proposal':
        return <FileSignature className="w-4 h-4 text-purple-600" />;
      case 'agreement':
        return <FileCheck2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleDocClick = async (doc) => {
    try {
      let fullDoc = null;
      if (doc.docType === 'invoice') {
        const res = await docApi.getInvoiceById(doc.id);
        fullDoc = res.invoice;
      } else if (doc.docType === 'quotation') {
        const res = await docApi.getQuotationById(doc.id);
        fullDoc = res.quotation;
      } else if (doc.docType === 'proposal') {
        const res = await docApi.getProposalById(doc.id);
        fullDoc = res.proposal;
      } else if (doc.docType === 'agreement') {
        const res = await docApi.getAgreementById(doc.id);
        fullDoc = res.agreement;
      }
      if (fullDoc) {
        onPreviewDoc(doc.docType, fullDoc);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">All Documents Directory</h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Centralized index of all quotations, proposals, legal NDAs, invoices, and company file attachments.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all document types & numbers..."
            className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
          >
            <option value="all">All Document Types</option>
            <option value="invoice">Invoices</option>
            <option value="quotation">Quotations</option>
            <option value="proposal">Proposals</option>
            <option value="agreement">NDAs & Agreements</option>
            <option value="file">File Attachments</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="issued">Issued</option>
            <option value="paid">Paid</option>
            <option value="signed">Signed</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-black uppercase text-[11px] tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Document #</th>
                <th className="py-3.5 px-4">Title / Purpose</th>
                <th className="py-3.5 px-4">Client / Party</th>
                <th className="py-3.5 px-4">Financial Value</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-600">
                    <div className="inline-block animate-spin h-5 w-5 border-2 border-[#1677FF]/30 border-t-[#1677FF] rounded-full mb-2" />
                    <p className="font-mono text-xs font-bold">Searching documents...</p>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-600">
                    <Files className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-[2.5]" />
                    <p className="font-black text-slate-900 text-sm">No documents found matching filters.</p>
                  </td>
                </tr>
              ) : (
                documents.map((doc, idx) => {
                  const badge = getStatusBadge(doc.status);
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => handleDocClick(doc)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {getDocIcon(doc.docType)}
                          <span className="font-mono font-black uppercase text-xs text-slate-800">
                            {doc.docType}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900">{doc.number}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 truncate max-w-xs">{doc.title}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{doc.client}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">
                        {doc.amount > 0 ? formatINR(doc.amount) : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-600">{formatDate(doc.date)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDocClick(doc);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Preview Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
