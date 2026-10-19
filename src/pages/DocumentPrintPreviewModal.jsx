import React from 'react';
import {
  X,
  Printer,
  Download,
  FileText,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  FileSpreadsheet,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Shield,
  CreditCard,
  Briefcase,
} from 'lucide-react';
import { formatINR, formatDate, getStatusBadge } from './utils';
import { apiUrl } from '../lib/api';

export function DocumentPrintPreviewModal({ isOpen, onClose, docType, doc, company, onDownloadDocx, onDownloadPdf }) {
  if (!isOpen || !doc) return null;

  const bizName = company?.business_name || 'StitchX Global Technology';
  const bizEmail = company?.email || 'info@stitchxglobal.com';
  const bizPhone = company?.phone || '9341660370';
  const rawBizAddress = company?.address || 'Sector 9A, Gurugram';
  const bizAddress = rawBizAddress.replace(/\s+,/g, ',').trim();
  const bizStructure = company?.structure || 'Software Development & Digital Solutions';
  const bizWebsite = company?.website || 'https://stitchxglobal.com';

  const isInvoice = docType === 'invoice';
  const isQuotation = docType === 'quotation';
  const isProposal = docType === 'proposal';
  const isAgreement = docType === 'agreement';

  // Enterprise Document Titles
  const docTitle = isInvoice
    ? doc.tax_treatment === 'gst_tax_invoice'
      ? 'TAX INVOICE'
      : 'COMMERCIAL INVOICE'
    : isQuotation
    ? 'PROJECT QUOTATION'
    : isProposal
    ? 'PROJECT PROPOSAL'
    : doc.agreement_type === 'msa'
    ? 'MASTER SERVICES AGREEMENT'
    : doc.agreement_type === 'service_contract'
    ? 'SOFTWARE SERVICE CONTRACT'
    : doc.agreement_type === 'oneway_nda'
    ? 'NON-DISCLOSURE AGREEMENT'
    : 'MUTUAL NON-DISCLOSURE AGREEMENT';

  // Normalized Document Number (guarantee Q- / P- standard)
  const rawDocNumber =
    doc.invoice_number ||
    doc.quotation_number ||
    doc.proposal_number ||
    doc.agreement_number ||
    'DOC-2026-27';
  const docNumber = rawDocNumber
    .replace(/^SX\/P\//i, 'P-')
    .replace(/^SX\/P-/i, 'P-')
    .replace(/^SX\/Q\//i, 'Q-')
    .replace(/^SX\/Q-/i, 'Q-');

  const docDate = doc.invoice_date || doc.quotation_date || doc.created_at;
  const statusBadge = getStatusBadge(doc.status);

  // Compute Total for Milestone Schedule Calculations
  const grandTotalValue = Number(
    doc.grand_total ||
    doc.total_amount ||
    doc.total_budget ||
    doc.subtotal ||
    0
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDirectPdf = () => {
    if (onDownloadPdf) {
      onDownloadPdf(doc._id, docNumber);
      return;
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('sx_admin_token') : '';
    const safeDocNumber = docNumber || 'Document';
    const endpointMap = {
      quotation: `/api/docs/quotations/${doc._id}/export-pdf`,
      proposal: `/api/docs/proposals/${doc._id}/export-pdf`,
      agreement: `/api/docs/agreements/${doc._id}/export-pdf`,
      invoice: `/api/docs/invoices/${doc._id}/export-pdf`,
    };
    const endpoint = endpointMap[docType] || `/api/docs/quotations/${doc._id}/export-pdf`;

    fetch(apiUrl(endpoint), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('PDF export failed with status: ' + res.status);
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${safeDocNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.warn('Direct PDF export error, falling back to print dialog:', err);
        window.print();
      });
  };

  return (
    <div className="stitchx-doc-modal-root fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-sm overflow-hidden select-none print:static print:bg-white print:overflow-visible print:p-0 print:m-0 print:block">
      {/* High-fidelity Print & PDF Styles strictly enforcing A4 dimensions (210x297mm) and margins (12mm/14mm) */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 12mm 14mm 12mm 14mm;
        }
        *, *::before, *::after {
          box-sizing: border-box !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            background: #FFFFFF !important;
            color: #0B1220 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
            font-size: 11px !important;
            line-height: 1.4 !important;
          }
          /* Reset React root containers so flex or min-height 100vh does not distort print layout */
          #root,
          #root > div {
            display: block !important;
            position: static !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #FFFFFF !important;
            overflow: visible !important;
          }
          /* Hide all sibling elements of the preview modal completely */
          #root > div > *:not(.stitchx-doc-modal-root),
          aside,
          nav,
          main,
          .print\\:hidden,
          header.print\\:hidden {
            display: none !important;
          }
          .stitchx-doc-modal-root,
          .stitchx-doc-modal-root * {
            visibility: visible !important;
          }
          .stitchx-doc-modal-root,
          .stitchx-doc-modal-viewport {
            position: static !important;
            display: block !important;
            overflow: visible !important;
            background: #FFFFFF !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 182mm !important;
          }
          .quotation-page,
          #printable-document-sheet {
            position: static !important;
            display: block !important;
            width: 100% !important;
            max-width: 182mm !important;
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #FFFFFF !important;
            overflow: visible !important;
            box-sizing: border-box !important;
          }
          .quotation-section,
          .payment-table,
          .commercial-terms,
          .commercial-terms-section {
            max-width: 100% !important;
            break-inside: auto !important;
            page-break-inside: auto !important;
          }
          /* CRITICAL: Overflows must be visible so Chrome doesn't slice rows across pages */
          .overflow-x-auto {
            overflow: visible !important;
            display: block !important;
            width: 100% !important;
            max-width: 182mm !important;
          }
          table {
            width: 100% !important;
            max-width: 182mm !important;
            border-collapse: collapse !important;
            page-break-inside: auto !important;
            break-inside: auto !important;
            table-layout: fixed !important;
          }
          thead {
            display: table-header-group !important;
          }
          tbody {
            display: table-row-group !important;
          }
          tfoot {
            display: table-footer-group !important;
          }
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: auto !important;
            break-after: auto !important;
          }
          td, th {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          h1, h2, h3, h4, .section-heading, .print-heading {
            page-break-after: avoid !important;
            break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .commercial-terms-section {
            break-inside: auto !important;
            page-break-inside: auto !important;
          }
          .commercial-terms-section .section-heading {
            break-after: avoid !important;
            page-break-after: avoid !important;
          }
          .commercial-terms-container {
            display: block !important;
            columns: 2 !important;
            column-gap: 16px !important;
            break-before: avoid !important;
            page-break-before: avoid !important;
            break-inside: auto !important;
            page-break-inside: auto !important;
          }
          .rule-clause-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 6px !important;
            display: flex !important;
          }
          .financial-summary-block {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .signature-block,
          .signature-footer-block,
          .print-signature-section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .doc-footer {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Top Modal Header Bar - Non-overlapping, fixed at top */}
      <header className="h-16 px-4 sm:px-8 bg-[#0B1528] border-b border-[#1E2D4A] flex items-center justify-between text-white shrink-0 z-20 print:hidden">
        <div className="flex items-center gap-3 text-left">
          <img
            src="/stitchx-logo.png"
            alt="StitchX Global Technology"
            className="h-8.5 w-auto max-w-[150px] object-contain rounded-lg bg-white/10 p-1 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
                Official A4 Document Preview
              </span>
              <span className="text-slate-600 font-bold">•</span>
              <span className="text-[10px] font-mono font-black text-[#38BDF8] uppercase tracking-wider">
                {docTitle}
              </span>
            </div>
            <p className="text-sm font-black text-white tracking-tight">{docNumber}</p>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/70 border border-blue-500/30 rounded-xl text-[11px] font-mono text-blue-200">
            <span className="font-bold text-sky-400">Print Dialog:</span>
            <span>Paper: <strong className="text-white">A4</strong></span>
            <span className="text-slate-500">•</span>
            <span>Margins: <strong className="text-white">None</strong></span>
            <span className="text-slate-500">•</span>
            <span>Scale: <strong className="text-white">100%</strong></span>
          </div>
          <button
            onClick={handleDownloadDirectPdf}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold border border-emerald-400 transition-all shadow-sm cursor-pointer"
            title="Download Standard A4 PDF"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download PDF</span>
          </button>
          {onDownloadDocx && (
            <button
              onClick={() => onDownloadDocx(doc._id, docNumber)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold border border-slate-700 hover:border-slate-500 transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-400 stroke-[2.5]" />
              <span>Download .docx</span>
            </button>
          )}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black shadow-md border border-blue-400 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>Print / Save PDF (A4)</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors border border-slate-700 cursor-pointer"
            title="Close Preview"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Printable Sheet Viewport - Simulated True A4 Dimensions (210mm x 297mm with 12mm / 14mm padding) */}
      <div className="stitchx-doc-modal-viewport flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start bg-slate-950/80 print:static print:bg-white print:overflow-visible print:p-0 print:m-0 print:block">
        <div
          id="printable-document-sheet"
          className="quotation-page w-[210mm] max-w-full min-h-[297mm] bg-white text-[#0B1220] rounded-xl shadow-2xl p-[12mm_14mm] my-3 mx-auto border border-slate-200 text-left relative selection:bg-blue-100 font-sans print:w-[182mm] print:max-w-[182mm] print:min-h-0 print:h-auto print:p-0 print:m-0 print:border-none print:shadow-none print:rounded-none print:static print:block box-border"
        >
          {/* ========================================================= */}
          {/* 1. ENTERPRISE HEADER DESIGN (Always strict horizontal row) */}
          {/* ========================================================= */}
          <div className="flex flex-row justify-between items-center pb-3 border-b-2 border-slate-200 gap-4">
            {/* Left: Official Brand Logo */}
            <div className="min-w-0 flex-1">
              <img
                src={company?.logo_url || '/stitchx-logo.png'}
                alt={bizName}
                className="h-14 sm:h-16 w-auto max-w-[280px] object-contain shrink-0"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/stitchx-logo.png';
                }}
              />
            </div>

            {/* Right: Company Contact Details (Strict right-aligned) */}
            <div className="text-right shrink-0 text-[11px] text-slate-600 font-medium space-y-0.5">
              <p className="font-bold text-slate-800">{bizAddress}, Haryana, India</p>
              <p>
                Email: <span className="font-bold text-slate-900">{bizEmail}</span>
              </p>
              <p>
                Phone: <span className="font-bold text-slate-900 whitespace-nowrap">+91 {bizPhone}</span>
              </p>
              {bizWebsite && (
                <p>
                  Web: <span className="font-bold text-slate-900">{bizWebsite}</span>
                </p>
              )}
            </div>
          </div>

          {/* Thin Royal Blue Divider */}
          <div className="w-full h-0.5 bg-gradient-to-r from-[#1677FF] via-[#38BDF8] to-slate-200 rounded-full mb-3 mt-1.5" />

          {/* ========================================================= */}
          {/* 2. DOCUMENT INFORMATION & STATUS BAR (Compact Row)         */}
          {/* ========================================================= */}
          <div className="py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-lg mb-3 flex flex-row justify-between items-center gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block px-2 py-0.5 bg-blue-100/90 border border-blue-300 text-[#1677FF] text-[10px] font-mono font-black rounded uppercase tracking-wider whitespace-nowrap">
                  {docTitle}
                </span>
                <span className="text-slate-400 font-bold">•</span>
                <span className="text-[10px] font-mono text-slate-500 font-bold">
                  FY 2026-27
                </span>
              </div>
              <p className="text-sm sm:text-base font-mono font-black text-slate-900 tracking-tight whitespace-nowrap [word-break:keep-all] break-keep select-all mt-0.5">
                {docNumber}
              </p>
            </div>

            <div className="flex flex-row items-center justify-end gap-3 text-xs">
              <div className="text-right">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                  Issue Date
                </span>
                <span className="font-bold text-slate-900 whitespace-nowrap text-[11px]">
                  {formatDate(docDate)}
                </span>
              </div>

              {(doc.expiry_date || doc.due_date) && (
                <div className="text-right pl-3 border-l border-slate-200">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                    {doc.due_date ? 'Due Date' : 'Valid Until'}
                  </span>
                  <span
                    className={`font-black whitespace-nowrap text-[11px] ${
                      doc.due_date ? 'text-rose-700' : 'text-amber-800'
                    }`}
                  >
                    {formatDate(doc.due_date || doc.expiry_date)}
                  </span>
                </div>
              )}

              <div className="pl-3 border-l border-slate-200">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                  Status
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${statusBadge.bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                  <span>{statusBadge.label}</span>
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. CLIENT DETAILS ("PREPARED FOR") (Compact 2-Column Card) */}
          {/* ========================================================= */}
          <div className="grid grid-cols-2 gap-4 p-3 rounded-lg border border-slate-200 bg-white mb-3 text-xs font-sans">
            <div className="min-w-0">
              <span className="text-[9px] font-mono font-black text-[#1677FF] uppercase tracking-wider block mb-0.5">
                {isAgreement ? 'SECOND PARTY (RECIPIENT / CLIENT):' : 'PREPARED FOR:'}
              </span>
              <p className="text-sm font-black text-slate-900 break-words leading-tight">
                {doc.client_snapshot?.name ||
                  doc.second_party_name ||
                  doc.client_id?.name ||
                  'Client Enterprise Representative'}
              </p>
              {doc.client_snapshot?.contact_person && (
                <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                  Attn: {doc.client_snapshot.contact_person}
                </p>
              )}
              {doc.second_party_signatory && !doc.client_snapshot?.contact_person && (
                <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                  Signatory: {doc.second_party_signatory}
                </p>
              )}
              {doc.client_snapshot?.email && (
                <p className="text-[10px] font-medium text-slate-600 mt-0.5 break-all">
                  {doc.client_snapshot.email}
                </p>
              )}
              {doc.client_snapshot?.phone && (
                <p className="text-[10px] font-medium text-slate-600">
                  +91 {doc.client_snapshot.phone}
                </p>
              )}
              {(doc.client_snapshot?.billing_address || doc.second_party_address) && (
                <p className="text-[10px] font-medium text-slate-600 mt-0.5 whitespace-pre-line leading-snug">
                  {doc.client_snapshot?.billing_address || doc.second_party_address}
                </p>
              )}
              {doc.client_snapshot?.gstin && (
                <p className="text-[10px] font-mono font-black text-slate-900 mt-0.5">
                  GSTIN: {doc.client_snapshot.gstin}
                </p>
              )}
            </div>

            <div className="text-right shrink-0 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-wider block mb-0.5">
                  ENGAGEMENT CONTEXT:
                </span>
                <p className="text-[11px] font-bold text-slate-800 leading-tight">
                  {doc.title || doc.project_title || 'Custom Engineering & Digital Architecture'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Currency: <strong className="font-mono text-slate-800">INR (₹)</strong>
                </p>
                {doc.related_quotation_number && (
                  <p className="text-[10px] font-mono font-bold text-slate-600 mt-0.5 whitespace-nowrap">
                    Ref Quote:{' '}
                    {doc.related_quotation_number.replace(/^SX\/Q\//i, 'Q-').replace(/^SX\/Q-/i, 'Q-')}
                  </p>
                )}
                {doc.related_proposal_number && (
                  <p className="text-[10px] font-mono font-bold text-slate-600 mt-0.5 whitespace-nowrap">
                    Ref Proposal:{' '}
                    {doc.related_proposal_number.replace(/^SX\/P\//i, 'P-').replace(/^SX\/P-/i, 'P-')}
                  </p>
                )}
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-100">
                <span className="text-[9px] font-mono font-bold text-slate-500 block">
                  Tax Treatment:
                </span>
                <span className="text-[10px] font-bold text-slate-700">
                  {doc.tax_treatment === 'gst_tax_invoice'
                    ? 'GST Registered Tax Invoice'
                    : 'Commercial Non-GST • Small-Scale Threshold Exemption'}
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. LINE ITEMS / PRICING TABLE (QUOTATIONS & INVOICES)      */}
          {/* ========================================================= */}
          {(isInvoice || isQuotation) && (
            <div className="quotation-section space-y-3 mb-3">
              {/* Optional Starting Estimate Note */}
              {isQuotation && (
                <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded-lg text-[11px] text-slate-700 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#1677FF] shrink-0 mt-0.5 stroke-[2.5]" />
                  <div className="leading-snug">
                    <strong className="font-black text-slate-900">Quotation Scope: </strong>
                    {doc.notes ||
                      'Deliverables below specify engineering scope and modular milestones. Final deployment incorporates agreed integrations, UI wireframes, and deployment specifications.'}
                  </div>
                </div>
              )}

              {/* Pricing Table with strict fixed column widths inside 182mm */}
              <div className="overflow-x-auto print:overflow-visible rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs border-collapse table-fixed">
                  <colgroup>
                    <col style={{ width: '38px' }} />
                    <col style={{ width: 'auto' }} />
                    <col style={{ width: '48px' }} />
                    <col style={{ width: '100px' }} />
                    {doc.total_discount > 0 && <col style={{ width: '65px' }} />}
                    <col style={{ width: '115px' }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-300 text-slate-800 uppercase font-mono font-black text-[10px] tracking-wider">
                      <th className="py-2 px-2 text-center whitespace-nowrap">#</th>
                      <th className="py-2 px-3">Service Description / Deliverables</th>
                      <th className="py-2 px-2 text-center whitespace-nowrap">Qty</th>
                      <th className="py-2 px-2 text-right whitespace-nowrap">Unit Price</th>
                      {doc.total_discount > 0 && <th className="py-2 px-2 text-right whitespace-nowrap">Disc %</th>}
                      <th className="py-2 px-2 text-right whitespace-nowrap">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {(doc.items || []).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-500 whitespace-nowrap">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-slate-900 break-words leading-snug whitespace-normal">
                            {item.description}
                          </p>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-700 whitespace-nowrap">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-700 whitespace-nowrap">
                          {formatINR(item.unit_price)}
                        </td>
                        {doc.total_discount > 0 && (
                          <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-700 whitespace-nowrap">
                            {item.discount_percent ? `${item.discount_percent}%` : '—'}
                          </td>
                        )}
                        <td className="py-2.5 px-2 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                          {formatINR(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Summary & Grand Total Area (Strict 2-Column Row) */}
              <div className="financial-summary-block flex flex-row justify-between items-start pt-2 border-t border-slate-200 gap-4">
                <div className="text-xs text-slate-600 flex-1 min-w-0 pr-2">
                  {isInvoice ? (
                    <>
                      <p className="font-black text-slate-900 uppercase tracking-wider text-[10px] mb-1">
                        Payment Instructions:
                      </p>
                      <p className="whitespace-pre-line font-medium leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-800 text-[11px]">
                        {doc.payment_instructions || company?.bank_account_number
                          ? `Bank Name: ${company?.bank_name || ''}\nAccount No: ${company?.bank_account_number || ''}\nIFSC Code: ${company?.bank_ifsc || ''}\nUPI ID: ${company?.upi_id || ''}`
                          : 'Settlement via direct NEFT / RTGS / IMPS / UPI bank transfer.'}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-black text-slate-900 uppercase tracking-wider text-[10px] mb-1">
                        Quotation Validity & Acceptance:
                      </p>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-800 space-y-0.5 text-[11px]">
                        <p className="font-bold text-slate-900">
                          Valid Until:{' '}
                          <span className="text-[#1677FF] font-mono">
                            {formatDate(doc.expiry_date)}
                          </span>
                        </p>
                        <p className="text-[10px] font-medium text-slate-600 leading-snug">
                          Engineering initiates upon written approval and advance disbursement. To accept,
                          endorse below or email confirmation to{' '}
                          <strong className="text-slate-900 font-bold">{bizEmail}</strong>.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="w-68 space-y-1.5 text-xs text-right font-sans shrink-0">
                  <div className="flex justify-between py-0.5 text-slate-600 font-bold text-[11px]">
                    <span>Subtotal:</span>
                    <span className="font-mono text-slate-900">{formatINR(doc.subtotal)}</span>
                  </div>
                  {doc.total_discount > 0 && (
                    <div className="flex justify-between py-0.5 text-emerald-700 font-bold text-[11px]">
                      <span>Discount:</span>
                      <span className="font-mono">-{formatINR(doc.total_discount)}</span>
                    </div>
                  )}
                  {doc.tax_amount > 0 && (
                    <div className="flex justify-between py-0.5 text-slate-600 font-bold text-[11px]">
                      <span>Tax (GST):</span>
                      <span className="font-mono">{formatINR(doc.tax_amount)}</span>
                    </div>
                  )}

                  {/* Highlighted Grand Total Box */}
                  <div className="p-2.5 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-blue-50/90 rounded-lg border-2 border-blue-300 flex justify-between items-center text-slate-900 font-black">
                    <span className="uppercase tracking-wider text-[11px] font-black text-slate-800">
                      Grand Total:
                    </span>
                    <span className="text-base sm:text-lg font-mono text-[#1677FF] font-black whitespace-nowrap">
                      {formatINR(doc.grand_total || doc.total_amount)}
                    </span>
                  </div>

                  {isInvoice && (
                    <div className="pt-1.5 space-y-1 border-t border-slate-200 text-[11px]">
                      <div className="flex justify-between py-0.5 text-emerald-700 font-bold">
                        <span>Amount Disbursed:</span>
                        <span className="font-mono">{formatINR(doc.amount_paid)}</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-t border-slate-200 text-rose-700 font-black">
                        <span className="uppercase tracking-wide">Balance Outstanding:</span>
                        <span className="font-mono text-sm font-black">
                          {formatINR(doc.outstanding_balance)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. STRUCTURED MILESTONE PAYMENT SCHEDULE (QUOTATIONS)     */}
          {/*    (Corrected 56px Stage column to eliminate letter wrap)  */}
          {/* ========================================================= */}
          {isQuotation && (
            <div className="payment-table mt-3 pt-3 border-t border-slate-200">
              <div className="section-heading flex flex-row justify-between items-center gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#1677FF] stroke-[2.5]" />
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
                    Structured Milestone Payment Schedule
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-600">
                  Total Contract Value:{' '}
                  <strong className="text-[#1677FF] font-black">
                    {formatINR(grandTotalValue)}
                  </strong>
                </span>
              </div>

              <div className="overflow-x-auto print:overflow-visible rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs border-collapse table-fixed">
                  <colgroup>
                    <col style={{ width: '56px' }} />
                    <col style={{ width: 'auto' }} />
                    <col style={{ width: '60px' }} />
                    <col style={{ width: '110px' }} />
                    <col style={{ width: '135px' }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-800 font-mono font-black uppercase tracking-wider text-[10px]">
                      <th className="py-2 px-1 text-center whitespace-nowrap">Stage</th>
                      <th className="py-2 px-2.5">Milestone Deliverable / Description</th>
                      <th className="py-2 px-1 text-center whitespace-nowrap">Share %</th>
                      <th className="py-2 px-2 text-right whitespace-nowrap">Amount (INR)</th>
                      <th className="py-2 px-2 text-center whitespace-nowrap">Release Condition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-sans text-[11px]">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2 px-1 text-center font-mono font-black text-slate-700 whitespace-nowrap">M1</td>
                      <td className="py-2 px-2.5">
                        <p className="font-bold text-slate-900 leading-snug">Project Mobilization & Architecture Approval</p>
                        <p className="text-[10px] text-slate-600 leading-tight">
                          Requirement freezing, technical architecture lock, and UI/UX prototypes
                        </p>
                      </td>
                      <td className="py-2 px-1 text-center font-mono font-bold text-slate-800 whitespace-nowrap">30%</td>
                      <td className="py-2 px-2 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                        {formatINR(grandTotalValue * 0.3)}
                      </td>
                      <td className="py-2 px-2 text-center text-[9.5px] font-bold text-blue-700 leading-tight whitespace-normal break-words">
                        Contract Execution
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2 px-1 text-center font-mono font-black text-slate-700 whitespace-nowrap">M2</td>
                      <td className="py-2 px-2.5">
                        <p className="font-bold text-slate-900 leading-snug">Beta Delivery & Core Functional Platform</p>
                        <p className="text-[10px] text-slate-600 leading-tight">
                          Frontend UI integration, secure backend APIs, database models & live demo review
                        </p>
                      </td>
                      <td className="py-2 px-1 text-center font-mono font-bold text-slate-800 whitespace-nowrap">40%</td>
                      <td className="py-2 px-2 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                        {formatINR(grandTotalValue * 0.4)}
                      </td>
                      <td className="py-2 px-2 text-center text-[9.5px] font-bold text-emerald-700 leading-tight whitespace-normal break-words">
                        Beta UAT Demonstration
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-2 px-1 text-center font-mono font-black text-slate-700 whitespace-nowrap">M3</td>
                      <td className="py-2 px-2.5">
                        <p className="font-bold text-slate-900 leading-snug">Production Handover, Cloud Launch & Sign-off</p>
                        <p className="text-[10px] text-slate-600 leading-tight">
                          Final quality testing, live server deployment, documentation & repository transfer
                        </p>
                      </td>
                      <td className="py-2 px-1 text-center font-mono font-bold text-slate-800 whitespace-nowrap">30%</td>
                      <td className="py-2 px-2 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                        {formatINR(grandTotalValue * 0.3)}
                      </td>
                      <td className="py-2 px-2 text-center text-[9.5px] font-bold text-slate-800 leading-tight whitespace-normal break-words">
                        Final Acceptance & Handover
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-blue-50/80 border-t border-slate-300 font-mono font-black text-[11px] text-slate-900">
                      <td colSpan="2" className="py-2 px-2.5 uppercase tracking-wider text-left">
                        Total Contract Investment:
                      </td>
                      <td className="py-2 px-1 text-center text-[#1677FF] whitespace-nowrap">100%</td>
                      <td className="py-2 px-2 text-right text-sm text-[#1677FF] whitespace-nowrap">
                        {formatINR(grandTotalValue)}
                      </td>
                      <td className="py-2 px-2 text-center text-[10px] text-slate-600 font-sans font-bold whitespace-nowrap">
                        Commercial Non-GST
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. PROPOSALS DETAIL SECTION                                */}
          {/* ========================================================= */}
          {isProposal && (
            <div className="quotation-section py-4 space-y-4 text-xs font-sans">
              {doc.project_title && (
                <div className="p-3 bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-transparent rounded-lg border border-blue-200">
                  <span className="text-[9px] font-mono font-black uppercase tracking-wider text-[#1677FF] block mb-0.5">
                    Proposed Project Scope
                  </span>
                  <h2 className="text-base font-black text-slate-900 tracking-tight">
                    {doc.project_title}
                  </h2>
                </div>
              )}

              <div>
                <h2 className="section-heading text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
                  1. Executive Summary
                </h2>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {doc.executive_summary || 'N/A'}
                </p>
              </div>

              {doc.client_requirements && (
                <div>
                  <h2 className="section-heading text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
                    2. Client Requirements & Objectives
                  </h2>
                  <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                    {doc.client_requirements}
                  </p>
                </div>
              )}

              {doc.proposed_solution && (
                <div>
                  <h2 className="section-heading text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
                    3. Proposed Solution Architecture
                  </h2>
                  <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                    {doc.proposed_solution}
                  </p>
                </div>
              )}

              {doc.deliverables?.length > 0 && (
                <div>
                  <h2 className="section-heading text-xs font-black text-slate-900 mb-1.5 uppercase tracking-wide">
                    4. Key Deliverables
                  </h2>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 font-medium">
                    {doc.deliverables.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {doc.tech_stack?.length > 0 && (
                <div>
                  <h2 className="section-heading text-xs font-black text-slate-900 mb-1.5 uppercase tracking-wide">
                    5. Recommended Technology Stack
                  </h2>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {doc.tech_stack.map((t, i) => (
                      <span
                        key={i}
                        className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-300 text-slate-800 text-[10px] font-mono font-bold rounded shadow-2xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Structured Milestone Payment Schedule */}
              <div className="payment-table pt-2">
                <div className="section-heading flex flex-row justify-between items-center gap-1 mb-2">
                  <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    6. Structured Milestone Payment Schedule
                  </h2>
                  <span className="text-[10px] font-mono font-bold text-slate-600">
                    Total Contract Value:{' '}
                    <strong className="text-[#1677FF] font-black">
                      {formatINR(doc.total_budget)}
                    </strong>
                  </span>
                </div>

                <div className="overflow-x-auto print:overflow-visible rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse table-fixed">
                    <colgroup>
                      <col style={{ width: '56px' }} />
                      <col style={{ width: 'auto' }} />
                      <col style={{ width: '60px' }} />
                      <col style={{ width: '110px' }} />
                      <col style={{ width: '135px' }} />
                    </colgroup>
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-800 font-mono font-black uppercase tracking-wider text-[10px]">
                        <th className="py-2 px-1 text-center whitespace-nowrap">Stage</th>
                        <th className="py-2 px-2.5">Milestone Deliverable / Description</th>
                        <th className="py-2 px-1 text-center whitespace-nowrap">Share %</th>
                        <th className="py-2 px-2 text-right whitespace-nowrap">Amount (INR)</th>
                        <th className="py-2 px-2 text-center whitespace-nowrap">Release Condition</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-sans text-[11px]">
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-2 px-1 text-center font-mono font-black text-slate-700 whitespace-nowrap">M1</td>
                        <td className="py-2 px-2.5">
                          <p className="font-bold text-slate-900 leading-snug">Project Kickoff & Architecture Approval</p>
                          <p className="text-[10px] text-slate-600 leading-tight">
                            Requirement freezing, technical architecture lock, and UI/UX prototypes
                          </p>
                        </td>
                        <td className="py-2.5 px-1 text-center font-mono font-bold text-slate-800 whitespace-nowrap">30%</td>
                        <td className="py-2.5 px-2 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                          {formatINR((doc.total_budget || 0) * 0.3)}
                        </td>
                        <td className="py-2.5 px-2 text-center text-[9.5px] font-bold text-blue-700 leading-tight whitespace-normal break-words">
                          Contract Execution
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-2 px-1 text-center font-mono font-black text-slate-700 whitespace-nowrap">M2</td>
                        <td className="py-2 px-2.5">
                          <p className="font-bold text-slate-900 leading-snug">Beta Delivery & Core Functional Platform</p>
                          <p className="text-[10px] text-slate-600 leading-tight">
                            Frontend console, secure backend APIs, database models & live demo review
                          </p>
                        </td>
                        <td className="py-2.5 px-1 text-center font-mono font-bold text-slate-800 whitespace-nowrap">40%</td>
                        <td className="py-2.5 px-2 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                          {formatINR((doc.total_budget || 0) * 0.4)}
                        </td>
                        <td className="py-2.5 px-2 text-center text-[9.5px] font-bold text-emerald-700 leading-tight whitespace-normal break-words">
                          Beta UAT Demonstration
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-2 px-1 text-center font-mono font-black text-slate-700 whitespace-nowrap">M3</td>
                        <td className="py-2 px-2.5">
                          <p className="font-bold text-slate-900 leading-snug">Production Handover, Cloud Launch & Sign-off</p>
                          <p className="text-[10px] text-slate-600 leading-tight">
                            Final QA testing, cloud server launch, documentation & repo handover
                          </p>
                        </td>
                        <td className="py-2.5 px-1 text-center font-mono font-bold text-slate-800 whitespace-nowrap">30%</td>
                        <td className="py-2.5 px-2 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                          {formatINR((doc.total_budget || 0) * 0.3)}
                        </td>
                        <td className="py-2.5 px-2 text-center text-[9.5px] font-bold text-slate-800 leading-tight whitespace-normal break-words">
                          Final Acceptance & Handover
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-blue-50/80 border-t border-slate-300 font-mono font-black text-[11px] text-slate-900">
                        <td colSpan="2" className="py-2 px-2.5 uppercase tracking-wider text-left">
                          Total Contract Investment:
                        </td>
                        <td className="py-2 px-1 text-center text-[#1677FF] whitespace-nowrap">100%</td>
                        <td className="py-2 px-2 text-right text-sm text-[#1677FF] whitespace-nowrap">
                          {formatINR(doc.total_budget)}
                        </td>
                        <td className="py-2 px-2 text-center text-[10px] text-slate-600 font-sans font-bold whitespace-nowrap">
                          Commercial Non-GST
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. AGREEMENTS / NDAS SECTION                               */}
          {/* ========================================================= */}
          {isAgreement && (
            <div className="quotation-section py-4 space-y-4 text-xs font-sans text-slate-800 leading-relaxed">
              {/* Header Recital Box */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900 mb-1.5">
                  This Agreement is entered into by and between:
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-wider block">
                      First Party (Discloser / Service Provider):
                    </span>
                    <strong className="text-slate-900 text-xs block font-black">{bizName}</strong>
                    <span className="text-slate-600 block text-[10px]">
                      {bizStructure} • {bizAddress}
                    </span>
                    <span className="text-slate-600 block text-[10px]">
                      Email: {bizEmail} • Phone: +91 {bizPhone}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-wider block">
                      Second Party (Recipient / Client):
                    </span>
                    <strong className="text-slate-900 text-xs block font-black">
                      {doc.second_party_name}
                    </strong>
                    <span className="text-slate-600 block text-[10px]">
                      {doc.second_party_address || 'Address on file'}
                    </span>
                    {doc.second_party_signatory && (
                      <span className="text-slate-600 block text-[10px]">
                        Signatory: {doc.second_party_signatory}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <h3 className="section-heading text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                  1. Purpose of Agreement
                </h3>
                <p className="text-slate-700 font-medium text-[11px]">
                  {doc.purpose ||
                    'Evaluation and execution of digital product engineering, technical consulting, and prospective commercial software engagements.'}
                </p>
              </div>

              {/* Structured Milestone Payment Schedule for Agreements */}
              <div className="payment-table space-y-2">
                <div className="section-heading flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#1677FF] stroke-[2.5]" />
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
                    2. Commercial Consideration & Structured Payment Schedule
                  </h3>
                </div>

                <div className="overflow-x-auto print:overflow-visible rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse table-fixed">
                    <colgroup>
                      <col style={{ width: '56px' }} />
                      <col style={{ width: 'auto' }} />
                      <col style={{ width: '70px' }} />
                      <col style={{ width: '125px' }} />
                      <col style={{ width: '110px' }} />
                    </colgroup>
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-800 font-mono font-black uppercase tracking-wider text-[10px]">
                        <th className="py-2 px-1 text-center whitespace-nowrap">Stage</th>
                        <th className="py-2 px-2.5">Milestone Deliverable / Description</th>
                        <th className="py-2 px-1 text-center whitespace-nowrap">Share %</th>
                        <th className="py-2 px-2 text-center whitespace-nowrap">Payment Release Trigger</th>
                        <th className="py-2 px-2 text-center whitespace-nowrap">Settlement Window</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-sans text-[11px]">
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-2 px-1 text-center font-mono font-black text-slate-700 whitespace-nowrap">M1</td>
                        <td className="py-2 px-2.5">
                          <p className="font-bold text-slate-900 leading-snug">Contract Execution & Architecture Mobilization</p>
                          <p className="text-[10px] text-slate-600 leading-tight">
                            Requirement freezing, technical architecture lock, UI/UX design prototype sign-off
                          </p>
                        </td>
                        <td className="py-2.5 px-1 text-center font-mono font-bold text-slate-800 whitespace-nowrap">
                          30% Advance
                        </td>
                        <td className="py-2.5 px-2 text-center text-[9.5px] font-bold text-blue-700 whitespace-nowrap">
                          Contract Signing
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-[10px] text-slate-700 whitespace-nowrap">
                          Within 7 Days
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-2 px-1 text-center font-mono font-black text-slate-700 whitespace-nowrap">M2</td>
                        <td className="py-2 px-2.5">
                          <p className="font-bold text-slate-900 leading-snug">Beta Functional Delivery & Core Sprint Review</p>
                          <p className="text-[10px] text-slate-600 leading-tight">
                            Frontend console, secure backend APIs, integrated database & live staging demo
                          </p>
                        </td>
                        <td className="py-2.5 px-1 text-center font-mono font-bold text-slate-800 whitespace-nowrap">
                          40% Interim
                        </td>
                        <td className="py-2.5 px-2 text-center text-[9.5px] font-bold text-emerald-700 whitespace-nowrap">
                          Beta UAT Demonstration
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-[10px] text-slate-700 whitespace-nowrap">
                          Within 7 Days
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-2 px-1 text-center font-mono font-black text-slate-700 whitespace-nowrap">M3</td>
                        <td className="py-2 px-2.5">
                          <p className="font-bold text-slate-900 leading-snug">Final Acceptance, Cloud Launch & Code Handover</p>
                          <p className="text-[10px] text-slate-600 leading-tight">
                            Production deployment, QA verification, technical documentation & repo handover
                          </p>
                        </td>
                        <td className="py-2.5 px-1 text-center font-mono font-bold text-slate-800 whitespace-nowrap">
                          30% Final
                        </td>
                        <td className="py-2.5 px-2 text-center text-[9.5px] font-bold text-slate-800 whitespace-nowrap">
                          Final Acceptance
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-[10px] text-slate-700 whitespace-nowrap">
                          Prior to Handover
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-blue-50/80 border-t border-slate-300 font-mono font-black text-[11px] text-slate-900">
                        <td colSpan="2" className="py-2 px-2.5 uppercase tracking-wider text-left">
                          Standard Milestone Payment Model:
                        </td>
                        <td className="py-2.5 px-1 text-center text-[#1677FF] whitespace-nowrap">100% Total</td>
                        <td colSpan="2" className="py-2.5 px-2 text-right text-[10px] text-slate-700 font-sans font-bold whitespace-nowrap">
                          Disbursed via Direct Bank Transfer (NEFT / RTGS / UPI)
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 p-2.5 space-y-1 text-[10.5px] text-slate-700 font-medium">
                  <p>
                    • <strong>Invoicing & Disbursement:</strong> Milestone invoices are raised electronically upon milestone completion. The Client agrees to disburse funds within seven (7) business days from date of invoice receipt.
                  </p>
                  <p>
                    • <strong>Default / Late Settlement:</strong> Payments in arrears exceeding fifteen (15) calendar days shall attract statutory interest at 1.5% per month and authorize the Service Provider to pause active development sprints without breach of contract.
                  </p>
                  <p>
                    • <strong>Third-Party Direct Pass-Through Costs:</strong> Domain registration fees, cloud hosting server subscriptions (AWS, GCP, Vercel), external paid API licenses, payment gateway merchant commissions, and developer store accounts are direct liabilities of the Client.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 8. COMMERCIAL RULES, REGULATIONS & PROJECT GOVERNANCE      */}
          {/*    (Heading & Container kept intact via break rules)      */}
          {/* ========================================================= */}
          <div className="commercial-terms-section quotation-section mt-3 pt-3 border-t border-slate-200">
            <div className="section-heading flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1677FF] stroke-[2.5]" />
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
                {isAgreement
                  ? '3. Standard Rules, Regulations & Covenants'
                  : isProposal
                  ? '7. Commercial Rules, Regulations & Project Governance'
                  : 'Standard Commercial Terms, Rules & Regulations'}
              </h3>
            </div>

            {/* In Quotation: 2-column compact grid on screen; columns: 2 in print */}
            <div className={`commercial-terms-container bg-slate-50/90 rounded-lg border border-slate-200 p-3 text-[10px] sm:text-[10.5px] text-slate-700 font-medium leading-relaxed ${isQuotation ? 'grid grid-cols-2 gap-x-4 gap-y-2' : 'space-y-2'}`}>
              <div className="rule-clause-item flex items-start gap-1.5">
                <span className="font-mono font-black text-[#1677FF]">1.</span>
                <div>
                  <strong className="font-black text-slate-900">Milestone Payment: </strong>
                  Invoices are issued upon milestone completion. Client clears disbursements within 7 business days via NEFT/RTGS/UPI. Next sprint commences upon receipt confirmation.
                </div>
              </div>

              <div className="rule-clause-item flex items-start gap-1.5">
                <span className="font-mono font-black text-[#1677FF]">2.</span>
                <div>
                  <strong className="font-black text-slate-900">Acceptance Window: </strong>
                  Client has seven (7) business days following staging demo to review, test, and provide written sign-off or defect report. Silence after 7 days is deemed acceptance.
                </div>
              </div>

              <div className="rule-clause-item flex items-start gap-1.5">
                <span className="font-mono font-black text-[#1677FF]">3.</span>
                <div>
                  <strong className="font-black text-slate-900">IP Transfer: </strong>
                  {doc.ip_terms ||
                    'Upon 100% full settlement of contracted fees, ownership of bespoke deliverable code and design transfers exclusively to Client. Pre-existing frameworks remain StitchX IP.'}
                </div>
              </div>

              <div className="rule-clause-item flex items-start gap-1.5">
                <span className="font-mono font-black text-[#1677FF]">4.</span>
                <div>
                  <strong className="font-black text-slate-900">Change Requests: </strong>
                  New features or wireframe alterations outside agreed scope are quoted separately as a Change Request (CR) with independent timeline and pricing.
                </div>
              </div>

              <div className="rule-clause-item flex items-start gap-1.5">
                <span className="font-mono font-black text-[#1677FF]">5.</span>
                <div>
                  <strong className="font-black text-slate-900">30-Day Warranty: </strong>
                  StitchX provides thirty (30) days of complimentary post-deployment warranty for reproducible defect remediation within contracted scope. Excludes 3rd-party outages.
                </div>
              </div>

              <div className="rule-clause-item flex items-start gap-1.5">
                <span className="font-mono font-black text-[#1677FF]">6.</span>
                <div>
                  <strong className="font-black text-slate-900">3rd-Party Exclusions: </strong>
                  Domain, cloud hosting (AWS/GCP/Vercel), paid external APIs, SMS/email gateways, and Apple/Google store developer fees are direct client liabilities.
                </div>
              </div>

              <div className="rule-clause-item flex items-start gap-1.5">
                <span className="font-mono font-black text-[#1677FF]">7.</span>
                <div>
                  <strong className="font-black text-slate-900">Confidentiality: </strong>
                  Both parties mutually agree to treat all exchanged technical data, architectures, customer records, and commercial terms with strict confidentiality for 3 years.
                </div>
              </div>

              <div className="rule-clause-item flex items-start gap-1.5">
                <span className="font-mono font-black text-[#1677FF]">8.</span>
                <div>
                  <strong className="font-black text-slate-900">Non-Solicitation: </strong>
                  Neither party shall solicit or hire any software engineer, consultant, or staff member of the other party for 18 months post-execution without written consent.
                </div>
              </div>

              <div className="rule-clause-item flex items-start gap-1.5">
                <span className="font-mono font-black text-[#1677FF]">9.</span>
                <div>
                  <strong className="font-black text-slate-900">Non-GST Status: </strong>
                  Commercial non-GST quotation executed under statutory small-scale threshold exemption. When tax registration applies, invoices will be lawfully adjusted.
                </div>
              </div>

              <div className="rule-clause-item flex items-start gap-1.5">
                <span className="font-mono font-black text-[#1677FF]">10.</span>
                <div>
                  <strong className="font-black text-slate-900">Governing Law: </strong>
                  Governed by the substantive Laws of India. Any unresolved controversy shall be subject to the exclusive jurisdiction of competent courts in Gurugram, Haryana.
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 9. ACCEPTANCE, SIGNATURES & ENTERPRISE FOOTER               */}
          {/*    (Kept together via .signature-footer-block)            */}
          {/* ========================================================= */}
          <div className="signature-footer-block signature-block mt-4 pt-3 border-t-2 border-slate-200">
            <div className="print-signature-section flex flex-row justify-between items-end gap-6 text-xs font-sans">
              {/* Left: Company Digitally Auto-Signed */}
              <div className="min-w-0">
                <p className="font-black text-slate-900 text-[11px] uppercase tracking-wider mb-1">
                  For {bizName}
                </p>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-[#1677FF] font-mono font-bold text-[10px]">
                  <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                  <span>Digitally Auto-Signed</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                  This is a computer-generated document. No signature required.
                </p>
                <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                  Ref: {docNumber} • {formatDate(docDate)}
                </p>
              </div>

              {/* Right: Client Signature Required */}
              <div className="w-60 border-t border-dashed border-slate-300 pt-2 text-right shrink-0">
                <p className="font-black text-slate-900 text-[11px] uppercase tracking-wider">
                  Client Acceptance & Signature
                </p>
                <p className="text-[10px] font-bold text-slate-700 mt-0.5 truncate">
                  {doc.client_snapshot?.name ||
                    doc.second_party_name ||
                    doc.client_id?.name ||
                    'Client Representative'}
                </p>
                {doc.client_snapshot?.contact_person && (
                  <p className="text-[9px] text-slate-500 font-semibold truncate">
                    Attn: {doc.client_snapshot.contact_person}
                  </p>
                )}
                <div className="h-7 my-0.5 flex items-center justify-end">
                  <span className="text-[10px] font-mono text-slate-400 italic">
                    ( Authorized Signature / Seal )
                  </span>
                </div>
                <p className="text-[9px] font-mono text-slate-500 font-semibold">
                  Date: ________________________
                </p>
              </div>
            </div>

            {/* Discreet Enterprise Footer */}
            <div className="doc-footer mt-4 pt-2 border-t border-slate-200 text-[9px] font-mono text-slate-400 flex flex-row justify-between items-center print:mt-3">
              <div className="flex items-center gap-2">
                <img
                  src="/stitchx-logo.png"
                  alt="StitchX"
                  className="h-3.5 w-auto object-contain opacity-80"
                />
                <span>• Software Development & Digital Solutions</span>
              </div>
              <div className="text-center font-bold text-slate-500">
                <span>Ref: {docNumber} • Standard A4 Format</span>
              </div>
              <span>
                {bizAddress}, Haryana • {bizEmail} • +91 {bizPhone}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentPrintPreviewModal;
