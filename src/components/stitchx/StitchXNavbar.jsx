import React, { useState } from 'react';
import {
  Search,
  Plus,
  FileSpreadsheet,
  FileSignature,
  FileCheck2,
  Receipt,
  UserPlus,
  Banknote,
  LogOut,
  User,
  ChevronDown,
  Building,
  Star,
  Briefcase,
  BookOpen,
  Menu,
} from 'lucide-react';

export function StitchXNavbar({
  activeSection,
  adminUser,
  onLogout,
  onQuickAction,
  company,
  onOpenMobileSidebar,
}) {
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'clients':
        return 'Client Management';
      case 'all_documents':
        return 'All Documents Repository';
      case 'rate_cards':
        return 'Rate Card & Service Catalog';
      case 'quotations':
        return 'Quotation Management';
      case 'proposals':
        return 'Proposal Management';
      case 'agreements':
        return 'NDAs & Legal Agreements';
      case 'invoices':
        return 'Invoice & Billing Management';
      case 'payments':
        return 'Payment Tracking & Collections';
      case 'reviews':
        return 'Customer Reviews & Moderation';
      case 'blog':
        return 'Engineering Blog & Articles';
      case 'careers':
        return 'Careers & Hiring Pipeline';
      case 'contact':
        return 'Client Inquiries & Contact Channels';
      case 'file_storage':
        return 'Protected Document Storage';
      case 'reports':
        return 'Financial Reports & Analytics';
      case 'company_settings':
        return 'StitchX Company Settings';
      case 'users':
        return 'User & Role Management';
      case 'activity_logs':
        return 'Audit Logs & Security Trail';
      default:
        return 'Admin Dashboard';
    }
  };

  return (
    <header className="h-16 bg-[#0B1528] border-b border-[#131F37] text-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      {/* Left: Hamburger Button on Mobile + Breadcrumbs */}
      <div className="flex items-center gap-2.5 text-left">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="p-1.5 rounded-lg border border-[#1E2D4A] text-slate-300 hover:text-white hover:bg-[#131F37] transition-colors lg:hidden cursor-pointer"
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 stroke-[2.5]" />
        </button>
        <span className="text-xs font-mono font-bold text-slate-400 hidden sm:inline">StitchX Global</span>
        <span className="text-xs font-mono font-black text-slate-600 hidden sm:inline">/</span>
        <h2 className="text-sm sm:text-base font-black tracking-tight text-white truncate max-w-[170px] sm:max-w-none">{getBreadcrumbTitle()}</h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Action Button */}
        <div className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black transition-all shadow-md border border-blue-400 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Quick Create</span>
            <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {showQuickMenu && (
            <div
              className="absolute right-0 mt-2 w-64 bg-[#0B1528] border border-[#1E2D4A] rounded-xl shadow-2xl py-1.5 z-50 text-left text-xs font-mono"
              onMouseLeave={() => setShowQuickMenu(false)}
            >
              <div className="px-3.5 py-1.5 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-[#1E2D4A]">
                Commercial Documents
              </div>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('new_quotation');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#131F37] font-bold transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-blue-400 stroke-[2.5]" />
                <span>New Quotation</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('new_proposal');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#131F37] font-bold transition-colors cursor-pointer"
              >
                <FileSignature className="w-4 h-4 text-purple-400 stroke-[2.5]" />
                <span>New Proposal</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('new_agreement');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#131F37] font-bold transition-colors cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                <span>New NDA / Agreement</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('new_invoice');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#131F37] font-bold transition-colors cursor-pointer"
              >
                <Receipt className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                <span>New Invoice</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('new_client');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#131F37] font-bold transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-sky-400 stroke-[2.5]" />
                <span>Add Client Record</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('new_payment');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#131F37] font-bold transition-colors cursor-pointer"
              >
                <Banknote className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                <span>Record Payment</span>
              </button>

              <div className="px-3.5 py-1.5 text-[10px] text-slate-400 font-black uppercase tracking-wider border-t border-b border-[#1E2D4A] mt-1">
                Website & Content
              </div>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('new_review');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#131F37] font-bold transition-colors cursor-pointer"
              >
                <Star className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                <span>Add Client Review</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('new_job');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#131F37] font-bold transition-colors cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-sky-400 stroke-[2.5]" />
                <span>Post Job Vacancy</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('new_blog');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#131F37] font-bold transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-indigo-400 stroke-[2.5]" />
                <span>Write Blog Article</span>
              </button>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F172A] border border-[#1E2D4A] text-xs font-mono">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <User className="w-3.5 h-3.5 text-[#38BDF8] stroke-[2.5]" />
          <span className="text-white font-black">{adminUser?.username || 'admin'}</span>
        </div>

        {/* Sign Out */}
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 hover:bg-red-900/50 hover:text-white text-xs font-mono font-black transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}

export default StitchXNavbar;
