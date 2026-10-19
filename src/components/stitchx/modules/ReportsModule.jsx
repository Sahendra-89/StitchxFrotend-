import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Download,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { docApi } from '../../../lib/docApi';
import { formatINR, exportToCSV } from '../utils';

export function ReportsModule() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await docApi.getReportsSummary();
      if (res.success) {
        setReport(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAgingCSV = () => {
    if (!report?.aging) return;
    const data = [
      { Bracket: 'Current (Not Overdue)', AmountINR: report.aging.current },
      { Bracket: '1 to 30 Days Overdue', AmountINR: report.aging.days1To30 },
      { Bracket: '31 to 60 Days Overdue', AmountINR: report.aging.days31To60 },
      { Bracket: '60+ Days Overdue', AmountINR: report.aging.days60Plus },
      { Bracket: 'Total Outstanding Balance', AmountINR: report.aging.totalOutstanding },
    ];
    exportToCSV(`StitchX_InvoiceAging_${new Date().toISOString().slice(0, 10)}`, data);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Financial Reports & Aging</h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Accounts receivable aging analysis, monthly payment collections, and payment method reconciliation.
          </p>
        </div>

        <button
          onClick={handleExportAgingCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Export Aging Report</span>
        </button>
      </div>

      {/* Invoice Aging Breakdown */}
      <div>
        <h2 className="text-sm font-black text-slate-900 uppercase font-mono tracking-wider mb-3.5 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-700 stroke-[2.5]" />
          <span>Accounts Receivable Aging Schedule</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
          <div className="p-5 bg-white border border-slate-200 border-t-4 border-t-emerald-600 rounded-2xl shadow-xs">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wide block">Current (Not Overdue)</span>
            <span className="text-2xl font-black font-mono text-emerald-700 mt-2 block">
              {formatINR(report?.aging?.current)}
            </span>
            <span className="text-xs font-bold text-slate-500 mt-1 block">Within payment term window</span>
          </div>

          <div className="p-5 bg-white border border-slate-200 border-t-4 border-t-amber-500 rounded-2xl shadow-xs">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wide block">1 - 30 Days Overdue</span>
            <span className="text-2xl font-black font-mono text-amber-800 mt-2 block">
              {formatINR(report?.aging?.days1To30)}
            </span>
            <span className="text-xs font-bold text-slate-500 mt-1 block">Requires follow-up notice</span>
          </div>

          <div className="p-5 bg-white border border-slate-200 border-t-4 border-t-orange-500 rounded-2xl shadow-xs">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wide block">31 - 60 Days Overdue</span>
            <span className="text-2xl font-black font-mono text-orange-700 mt-2 block">
              {formatINR(report?.aging?.days31To60)}
            </span>
            <span className="text-xs font-bold text-slate-500 mt-1 block">Escalated collections</span>
          </div>

          <div className="p-5 bg-white border border-slate-200 border-t-4 border-t-rose-600 rounded-2xl shadow-xs">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wide block">60+ Days Overdue</span>
            <span className="text-2xl font-black font-mono text-rose-700 mt-2 block">
              {formatINR(report?.aging?.days60Plus)}
            </span>
            <span className="text-xs font-bold text-slate-500 mt-1 block">High collection risk</span>
          </div>
        </div>
      </div>

      {/* 2-Column: Monthly Collections & Method Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Collections */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-200 mb-4">
            <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Monthly Collection Reconciliation</h3>
          </div>

          {report?.monthlyCollections?.length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {report.monthlyCollections.map((m, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <span className="font-mono font-black text-slate-900 text-sm">{m._id}</span>
                  <div className="text-right">
                    <span className="font-mono font-black text-emerald-700 text-sm block">{formatINR(m.total)}</span>
                    <span className="text-[11px] font-bold text-slate-500 mt-0.5 block">{m.count} verified transaction(s)</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-bold text-slate-500 py-8 text-center">No verified payment records found.</p>
          )}
        </div>

        {/* Method Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-200 mb-4">
            <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
              <CreditCard className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Collections by Payment Channel</h3>
          </div>

          {report?.methodDistribution?.length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {report.methodDistribution.map((m, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <span className="font-bold capitalize text-slate-900 text-sm">{m._id?.replace('_', ' ')}</span>
                  <div className="text-right">
                    <span className="font-mono font-black text-slate-900 text-sm block">{formatINR(m.total)}</span>
                    <span className="text-[11px] font-bold text-slate-500 mt-0.5 block">{m.count} transaction(s)</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-bold text-slate-500 py-8 text-center">No channel data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
