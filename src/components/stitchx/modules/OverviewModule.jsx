import React from 'react';
import {
  FileText,
  Users,
  FileEdit,
  Clock,
  Receipt,
  AlertCircle,
  Banknote,
  DollarSign,
  RefreshCw,
  ArrowRight,
  ChevronRight,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  FileSignature,
  FileCheck2,
  Star,
  BookOpen,
  Briefcase,
  Mail,
  Sparkles,
} from 'lucide-react';
import { formatINR, formatDate, getStatusBadge } from '../utils';

export function OverviewModule({
  stats,
  websiteStats,
  recent,
  statusDistribution,
  loading,
  onRefresh,
  onNavigate,
  onQuickAction,
}) {
  const cards = [
    {
      title: 'Total Documents',
      value: stats?.totalDocuments || 0,
      sub: 'All registered company files',
      icon: FileText,
      color: 'text-slate-900',
      iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
      borderAccent: 'border-t-4 border-t-blue-600',
      action: () => onNavigate('all_documents'),
    },
    {
      title: 'Total Clients',
      value: stats?.totalClients || 0,
      sub: 'Active accounts & leads',
      icon: Users,
      color: 'text-slate-900',
      iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      borderAccent: 'border-t-4 border-t-indigo-600',
      action: () => onNavigate('clients'),
    },
    {
      title: 'Draft Documents',
      value: stats?.draftDocuments || 0,
      sub: 'In preparation or review',
      icon: FileEdit,
      color: 'text-amber-800',
      iconBg: 'bg-amber-50 text-amber-800 border-amber-200',
      borderAccent: 'border-t-4 border-t-amber-500',
      action: () => onNavigate('quotations'),
    },
    {
      title: 'Awaiting Approval',
      value: stats?.documentsAwaitingApproval || 0,
      sub: 'Proposals & agreements in review',
      icon: Clock,
      color: 'text-purple-800',
      iconBg: 'bg-purple-50 text-purple-800 border-purple-200',
      borderAccent: 'border-t-4 border-t-purple-600',
      action: () => onNavigate('proposals'),
    },
    {
      title: 'Issued Invoices',
      value: stats?.issuedInvoices || 0,
      sub: 'Sent to clients for payment',
      icon: Receipt,
      color: 'text-blue-700',
      iconBg: 'bg-sky-50 text-sky-700 border-sky-200',
      borderAccent: 'border-t-4 border-t-sky-600',
      action: () => onNavigate('invoices'),
    },
    {
      title: 'Overdue Invoices',
      value: stats?.overdueInvoices || 0,
      sub: 'Past agreed payment due dates',
      icon: AlertCircle,
      color: 'text-rose-700',
      iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
      borderAccent: 'border-t-4 border-t-rose-600',
      action: () => onNavigate('invoices'),
    },
    {
      title: 'Payments Received',
      value: formatINR(stats?.paymentsReceived),
      sub: 'Total verified collections',
      icon: Banknote,
      color: 'text-emerald-700',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderAccent: 'border-t-4 border-t-emerald-600',
      action: () => onNavigate('payments'),
      isCurrency: true,
    },
    {
      title: 'Outstanding Amount',
      value: formatINR(stats?.outstandingAmount),
      sub: 'Unpaid balance on live invoices',
      icon: DollarSign,
      color: 'text-rose-700',
      iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
      borderAccent: 'border-t-4 border-t-rose-600',
      action: () => onNavigate('invoices'),
      isCurrency: true,
    },
  ];

  const websiteCards = [
    {
      title: 'Reviews Section',
      value: websiteStats?.reviews?.total || 0,
      sub: `${websiteStats?.reviews?.published || 0} Published • ${websiteStats?.reviews?.pending || 0} Pending`,
      icon: Star,
      color: 'text-amber-800',
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
      borderAccent: 'border-t-4 border-t-amber-500',
      action: () => onNavigate('reviews'),
    },
    {
      title: 'Engineering Blog',
      value: websiteStats?.blog?.total || 0,
      sub: `${websiteStats?.blog?.published || 0} Published • ${websiteStats?.blog?.drafts || 0} Drafts`,
      icon: BookOpen,
      color: 'text-blue-800',
      iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
      borderAccent: 'border-t-4 border-t-blue-600',
      action: () => onNavigate('blog'),
    },
    {
      title: 'Careers & Talent',
      value: websiteStats?.jobs?.active || 0,
      sub: `${websiteStats?.applications?.total || 0} Applications • ${websiteStats?.applications?.new || 0} New`,
      icon: Briefcase,
      color: 'text-indigo-800',
      iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      borderAccent: 'border-t-4 border-t-indigo-600',
      action: () => onNavigate('careers'),
      suffix: 'Jobs',
    },
    {
      title: 'Client Inquiries',
      value: websiteStats?.enquiries?.total || 0,
      sub: `${websiteStats?.enquiries?.new || 0} Unread • ${websiteStats?.enquiries?.converted || 0} Converted`,
      icon: Mail,
      color: 'text-emerald-800',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderAccent: 'border-t-4 border-t-emerald-600',
      action: () => onNavigate('contact'),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#1677FF] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              ENTERPRISE REGISTRY & WEBSITE CONSOLE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Master Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Unified live operations for StitchX Global documents, client accounting, and public website management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 stroke-[2.5] ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh All Metrics</span>
          </button>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-[#060C1B] via-[#0B192C] to-[#0A2540] text-white p-6 rounded-2xl shadow-xl border border-[#1E2D4A] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/20 text-[#38BDF8] border border-blue-400/30 text-[10px] font-mono font-black uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse"></span>
            QUICK DISPATCH
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1.5 tracking-tight">
            Generate Official Client Documents
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-bold mt-1">
            Sequential numbering SX/2026-27 with snapshot pricing and compliance protection
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onQuickAction('new_quotation')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-white border border-blue-400/40 rounded-xl text-xs font-mono font-bold shadow-xs hover:border-blue-400 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-400 stroke-[2.5]" />
            <span>New Quotation</span>
          </button>
          <button
            onClick={() => onQuickAction('new_proposal')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-white border border-purple-400/40 rounded-xl text-xs font-mono font-bold shadow-xs hover:border-purple-400 transition-all cursor-pointer"
          >
            <FileSignature className="w-4 h-4 text-purple-400 stroke-[2.5]" />
            <span>New Proposal</span>
          </button>
          <button
            onClick={() => onQuickAction('new_agreement')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-white border border-emerald-400/40 rounded-xl text-xs font-mono font-bold shadow-xs hover:border-emerald-400 transition-all cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            <span>New NDA</span>
          </button>
          <button
            onClick={() => onQuickAction('new_invoice')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1677FF] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-xs font-mono font-black shadow-lg shadow-blue-500/25 border border-blue-400 transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-white stroke-[2.5]" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* 8 Primary Summary Cards (Commercial & Document KPIs) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-700">
            Document & Commercial Financials (SX/2026-27)
          </span>
          <span className="text-xs font-mono font-bold text-slate-500">Live Accounting</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={card.action}
                className={`p-4.5 rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer group relative overflow-hidden ${card.borderAccent}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                    {card.title}
                  </span>
                  <div className={`p-2 rounded-lg border ${card.iconBg} font-bold`}>
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className={`text-2xl sm:text-3xl font-black tracking-tight ${card.color}`}>
                    {card.value}
                  </span>
                  <p className="text-xs font-bold text-slate-600 mt-1">{card.sub}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-[#1677FF] font-black group-hover:text-blue-800 transition-colors">
                  <span>View records</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 stroke-[2.5] transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Website Operations Summary Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 pt-2">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-700">
            Public Website & Inbound Pipeline
          </span>
          <span className="text-xs font-mono font-bold text-slate-500">Live Website Portal</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {websiteCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={card.action}
                className={`p-4.5 rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer group relative overflow-hidden ${card.borderAccent}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                    {card.title}
                  </span>
                  <div className={`p-2 rounded-lg border ${card.iconBg} font-bold`}>
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className={`text-2xl sm:text-3xl font-black tracking-tight ${card.color}`}>
                    {card.value} {card.suffix && <span className="text-xs font-bold text-slate-500">{card.suffix}</span>}
                  </span>
                  <p className="text-xs font-bold text-slate-600 mt-1">{card.sub}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-[#1677FF] font-black group-hover:text-blue-800 transition-colors">
                  <span>Open module</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 stroke-[2.5] transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Access Module Cards (Reviews & Hiring Pipeline) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-[#1677FF] stroke-[2.5]" />
              <span>Reviews Moderation Engine</span>
            </h3>
            <button
              onClick={() => onNavigate('reviews')}
              className="text-xs font-mono font-black text-[#1677FF] hover:underline cursor-pointer"
            >
              Open Module →
            </button>
          </div>
          <p className="text-xs font-bold text-slate-600 leading-relaxed">
            Only approved and published customer reviews appear on the live website. Control the display order, approve candidate reviews, or add verified corporate client endorsements.
          </p>
          <div className="pt-1 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('reviews')}
              className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-xs font-mono font-black text-[#1677FF] hover:bg-blue-100 transition-colors cursor-pointer"
            >
              + Create New Review
            </button>
            <button
              onClick={() => onNavigate('reviews')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 text-xs font-mono font-black text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Review Pending Approvals ({websiteStats?.reviews?.pending || 0})
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-[#1677FF] stroke-[2.5]" />
              <span>Hiring Pipeline & Job Openings</span>
            </h3>
            <button
              onClick={() => onNavigate('careers')}
              className="text-xs font-mono font-black text-[#1677FF] hover:underline cursor-pointer"
            >
              Open Module →
            </button>
          </div>
          <p className="text-xs font-bold text-slate-600 leading-relaxed">
            Manage vacancies for engineering and design roles. Candidates submit secure resume uploads which can be downloaded directly and confidentially by authenticated admins.
          </p>
          <div className="pt-1 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('careers')}
              className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-xs font-mono font-black text-[#1677FF] hover:bg-blue-100 transition-colors cursor-pointer"
            >
              + Post New Opening
            </button>
            <button
              onClick={() => onNavigate('careers')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 text-xs font-mono font-black text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              View Candidate Applications ({websiteStats?.applications?.total || 0})
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Recent Documents & Upcoming Due Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-1">
        {/* Recent Invoices & Documents (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Invoices */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
                  <Receipt className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Recent Invoices</h3>
              </div>
              <button
                onClick={() => onNavigate('invoices')}
                className="text-xs font-mono font-black text-[#1677FF] hover:text-blue-800 hover:underline inline-flex items-center cursor-pointer"
              >
                View all <ChevronRight className="w-3.5 h-3.5 ml-0.5 stroke-[2.5]" />
              </button>
            </div>

            {recent?.invoices?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 font-mono text-[11px] font-black text-slate-800 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Invoice No.</th>
                      <th className="py-2.5 px-3">Client</th>
                      <th className="py-2.5 px-3">Due Date</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recent.invoices.map((inv) => (
                      <tr key={inv._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono font-black text-slate-900">{inv.invoice_number}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{inv.client_id?.name || 'Client'}</td>
                        <td className="py-3 px-3 text-slate-600 font-mono font-bold">{formatDate(inv.payment_terms?.due_date)}</td>
                        <td className="py-3 px-3 text-right font-mono font-black text-slate-900">{formatINR(inv.pricing?.grand_total)}</td>
                        <td className="py-3 px-3 text-center">
                          {(() => {
                            const b = getStatusBadge(inv.status);
                            return (
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${b.bg}`}>
                                {b.label}
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-500 py-4 text-center">No recent invoices found.</p>
            )}
          </div>

          {/* Recent Quotations */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
                  <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Recent Quotations</h3>
              </div>
              <button
                onClick={() => onNavigate('quotations')}
                className="text-xs font-mono font-black text-[#1677FF] hover:text-blue-800 hover:underline inline-flex items-center cursor-pointer"
              >
                View all <ChevronRight className="w-3.5 h-3.5 ml-0.5 stroke-[2.5]" />
              </button>
            </div>

            {recent?.quotations?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 font-mono text-[11px] font-black text-slate-800 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Quotation No.</th>
                      <th className="py-2.5 px-3">Client</th>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recent.quotations.map((q) => (
                      <tr key={q._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono font-black text-slate-900">{q.quotation_number}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{q.client_id?.name || 'Client'}</td>
                        <td className="py-3 px-3 text-slate-700 font-bold max-w-[160px] truncate">{q.subject}</td>
                        <td className="py-3 px-3 text-right font-mono font-black text-slate-900">{formatINR(q.pricing?.grand_total)}</td>
                        <td className="py-3 px-3 text-center">
                          {(() => {
                            const b = getStatusBadge(q.status);
                            return (
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${b.bg}`}>
                                {b.label}
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-500 py-4 text-center">No recent quotations found.</p>
            )}
          </div>
        </div>

        {/* Sidebar Widgets (1 col) */}
        <div className="space-y-6">
          {/* Upcoming Due Dates */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-200 mb-3.5">
              <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700">
                <Calendar className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Upcoming Invoice Due Dates</h3>
            </div>

            {recent?.upcomingDueInvoices?.length > 0 ? (
              <div className="divide-y divide-slate-100 text-xs">
                {recent.upcomingDueInvoices.map((inv) => (
                  <div key={inv._id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-black text-slate-900 block">{inv.invoice_number}</span>
                      <span className="text-xs font-bold text-slate-600 mt-0.5 block">{inv.client_id?.name || 'Client'}</span>
                      <span className="text-[11px] font-bold text-rose-700 mt-0.5 block">
                        Due: {formatDate(inv.payment_terms?.due_date)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-black text-slate-900 block">{formatINR(inv.pricing?.grand_total)}</span>
                      {(() => {
                        const b = getStatusBadge(inv.status);
                        return (
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black border mt-1 ${b.bg}`}>
                            {b.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 stroke-[2.5]" />
                <p className="text-xs font-black text-slate-900">No Pending Due Dates</p>
                <p className="text-[11px] font-bold text-slate-500 mt-0.5">All issued invoices are up to date.</p>
              </div>
            )}
          </div>

          {/* Recent Payments */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <Banknote className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Recent Collections</h3>
              </div>
              <button
                onClick={() => onNavigate('payments')}
                className="text-xs font-mono font-black text-[#1677FF] hover:text-blue-800 hover:underline cursor-pointer"
              >
                All
              </button>
            </div>

            {recent?.payments?.length > 0 ? (
              <div className="divide-y divide-slate-100 text-xs">
                {recent.payments.map((pay) => (
                  <div key={pay._id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-black text-slate-900 block">
                        {pay.payment_method?.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-slate-600 mt-0.5 block">
                        {pay.client_id?.name || 'Client'} • {formatDate(pay.payment_date)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-black text-emerald-700 text-sm block">{formatINR(pay.amount)}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">{pay.payment_id}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-500 py-4 text-center">No payment entries recorded yet.</p>
            )}
          </div>

          {/* Recently Added Clients */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700">
                  <Users className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Recent Clients</h3>
              </div>
              <button
                onClick={() => onNavigate('clients')}
                className="text-xs font-mono font-black text-[#1677FF] hover:text-blue-800 hover:underline cursor-pointer"
              >
                All
              </button>
            </div>

            {recent?.clients?.length > 0 ? (
              <div className="divide-y divide-slate-100 text-xs">
                {recent.clients.map((c) => (
                  <div key={c._id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{c.name}</span>
                      <span className="text-xs font-bold text-slate-600 mt-0.5 block">{c.email}</span>
                    </div>
                    <span className="text-[11px] font-mono font-black px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                      {c.client_id}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-500 py-4 text-center">No clients added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewModule;
