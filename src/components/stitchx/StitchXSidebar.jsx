import React from 'react';
import {
  LayoutDashboard,
  Users,
  Files,
  CreditCard,
  FileSpreadsheet,
  FileSignature,
  FileCheck2,
  Receipt,
  Banknote,
  FolderLock,
  BarChart3,
  Building2,
  UserCog,
  History,
  ChevronLeft,
  ChevronRight,
  Globe,
  Star,
  BookOpen,
  Briefcase,
  Mail,
  ExternalLink,
  X,
} from 'lucide-react';

export function StitchXSidebar({
  activeSection,
  onSelectSection,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  userRole = 'admin',
  stats,
  websiteStats,
}) {
  const navSections = [
    {
      group: 'MAIN OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'clients', label: 'Clients', icon: Users, badge: stats?.totalClients },
        { id: 'all_documents', label: 'All Documents', icon: Files, badge: stats?.totalDocuments },
        { id: 'rate_cards', label: 'Rate Cards', icon: CreditCard },
      ],
    },
    {
      group: 'COMMERCIAL DOCUMENTS',
      items: [
        { id: 'quotations', label: 'Quotations', icon: FileSpreadsheet },
        { id: 'proposals', label: 'Proposals', icon: FileSignature },
        { id: 'agreements', label: 'NDAs & Agreements', icon: FileCheck2 },
        { id: 'invoices', label: 'Invoices', icon: Receipt, badge: stats?.issuedInvoices ? `${stats.issuedInvoices} live` : null },
        { id: 'payments', label: 'Payments', icon: Banknote },
      ],
    },
    {
      group: 'WEBSITE & PORTAL',
      items: [
        {
          id: 'reviews',
          label: 'Reviews Moderation',
          icon: Star,
          badge: websiteStats?.reviews?.pending ? `${websiteStats.reviews.pending} pending` : null,
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        },
        {
          id: 'blog',
          label: 'Blog Posts',
          icon: BookOpen,
        },
        {
          id: 'careers',
          label: 'Careers & Talent',
          icon: Briefcase,
          badge: websiteStats?.applications?.new ? `${websiteStats.applications.new} new` : null,
          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        },
        {
          id: 'contact',
          label: 'Client Inquiries',
          icon: Mail,
          badge: websiteStats?.enquiries?.new ? `${websiteStats.enquiries.new} new` : null,
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        },
      ],
    },
    {
      group: 'STORAGE & INTELLIGENCE',
      items: [
        { id: 'file_storage', label: 'File Storage', icon: FolderLock },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
      ],
    },
    {
      group: 'ADMINISTRATION',
      items: [
        { id: 'company_settings', label: 'Company Settings', icon: Building2 },
        { id: 'users', label: 'User & Role Mgmt', icon: UserCog, roles: ['owner', 'admin'] },
        { id: 'activity_logs', label: 'Activity Logs', icon: History, roles: ['owner', 'admin'] },
      ],
    },
  ];

  const isEffectiveCollapsed = collapsed && !mobileOpen;

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`bg-[#060C1B] border-r border-[#131F37] text-white flex flex-col transition-all duration-300 z-50 select-none
          fixed inset-y-0 left-0 lg:static lg:translate-x-0
          ${mobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'lg:w-18' : 'lg:w-64'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#131F37]">
          {!isEffectiveCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src="/stitchx-logo.png"
                alt="StitchX Global Technology"
                className="h-8.5 w-auto max-w-[170px] object-contain shrink-0 bg-white/10 p-1 rounded-lg"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-white/10 p-1 flex items-center justify-center mx-auto shadow-md overflow-hidden">
              <img
                src="/stitchx-logo.png"
                alt="SX"
                className="h-full w-full object-cover object-left"
              />
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131F37] transition-colors cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4 stroke-[2.5]" /> : <ChevronLeft className="w-4 h-4 stroke-[2.5]" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="flex lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131F37] transition-colors cursor-pointer"
            title="Close Navigation Drawer"
            aria-label="Close Navigation Drawer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4 no-scrollbar text-left">
        {navSections.map((group, gIdx) => {
          const visibleItems = group.items.filter((item) => {
            if (!item.roles) return true;
            return item.roles.includes(userRole) || userRole === 'owner' || userRole === 'admin';
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx}>
              {!isEffectiveCollapsed && (
                <p className="px-3 mb-2 text-[10px] font-mono font-black tracking-widest text-slate-400 uppercase">
                  {group.group}
                </p>
              )}
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectSection(item.id)}
                      title={isEffectiveCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-[#1677FF] text-white font-black shadow-md border border-blue-400/40'
                          : 'text-slate-300 hover:text-white hover:bg-[#0F1E36] font-bold'
                      } ${isEffectiveCollapsed ? 'justify-center px-0' : ''}`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 stroke-[2.5] ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      {!isEffectiveCollapsed && (
                        <div className="flex-1 flex items-center justify-between text-left">
                          <span className="truncate">{item.label}</span>
                          {item.badge !== undefined && item.badge !== null && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                                item.badgeColor
                                  ? item.badgeColor
                                  : isActive
                                  ? 'bg-white/25 text-white border-white/30'
                                  : 'bg-[#1E2D4A] text-sky-300 border-blue-900/50'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Website Footer Link */}
      <div className="p-3 border-t border-[#131F37]">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0B1528] hover:bg-[#131F37] text-slate-300 hover:text-white transition-colors border border-[#1E2D4A] text-xs font-mono cursor-pointer ${
            isEffectiveCollapsed ? 'justify-center p-2' : ''
          }`}
          title="Visit Public Live Website (StitchX Global Technology)"
        >
          <Globe className="w-4 h-4 text-[#38BDF8] shrink-0 stroke-[2.5]" />
          {!isEffectiveCollapsed && (
            <div className="text-left truncate flex-1 flex items-center justify-between">
              <div>
                <span className="block font-black text-white truncate text-xs">Public Website</span>
                <span className="block text-[10px] font-bold text-slate-400 truncate">View Live Site</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 stroke-[2.5]" />
            </div>
          )}
        </a>
      </div>
      </aside>
    </>
  );
}

export default StitchXSidebar;
