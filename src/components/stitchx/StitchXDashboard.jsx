import React, { useState, useEffect } from 'react';
import { StitchXSidebar } from './StitchXSidebar';
import { StitchXNavbar } from './StitchXNavbar';
import { DocumentPrintPreviewModal } from './DocumentPrintPreviewModal';
import { OverviewModule } from './modules/OverviewModule';
import { ClientsModule } from './modules/ClientsModule';
import { AllDocumentsModule } from './modules/AllDocumentsModule';
import { RateCardsModule } from './modules/RateCardsModule';
import { QuotationsModule } from './modules/QuotationsModule';
import { ProposalsModule } from './modules/ProposalsModule';
import { AgreementsModule } from './modules/AgreementsModule';
import { InvoicesModule } from './modules/InvoicesModule';
import { PaymentsModule } from './modules/PaymentsModule';
import { ReviewsModule } from './modules/ReviewsModule';
import { BlogModule } from './modules/BlogModule';
import { CareersModule } from './modules/CareersModule';
import { ContactModule } from './modules/ContactModule';
import { FileStorageModule } from './modules/FileStorageModule';
import { ReportsModule } from './modules/ReportsModule';
import { CompanySettingsModule } from './modules/CompanySettingsModule';
import { UserManagementModule } from './modules/UserManagementModule';
import { ActivityLogsModule } from './modules/ActivityLogsModule';
import { docApi } from '../../lib/docApi';
import { adminApi } from '../../lib/api';

export function StitchXDashboard({ adminUser, onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [websiteStats, setWebsiteStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [statusDistribution, setStatusDistribution] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [company, setCompany] = useState(null);

  // Cross-module action state
  const [preselectedClient, setPreselectedClient] = useState(null);
  const [preselectedInvoice, setPreselectedInvoice] = useState(null);
  const [preselectedRateCard, setPreselectedRateCard] = useState(null);

  // Print Preview Modal State
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    docType: null,
    doc: null,
  });

  useEffect(() => {
    loadStats();
    loadCompanySettings();
  }, []);

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      // Load both Document Stats and Website Operations Stats concurrently
      const [res, webRes] = await Promise.allSettled([
        docApi.getDashboardStats(),
        adminApi.getDashboardStats(),
      ]);

      if (res.status === 'fulfilled' && res.value?.success) {
        setStats(res.value.stats);
        setRecent(res.value.recent);
        setStatusDistribution(res.value.statusDistribution);
      }

      if (webRes.status === 'fulfilled' && webRes.value?.success) {
        setWebsiteStats(webRes.value.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadCompanySettings = async () => {
    try {
      const res = await docApi.getCompanySettings();
      if (res.success) setCompany(res.settings);
    } catch (err) {}
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'new_quotation':
        setActiveSection('quotations');
        break;
      case 'new_proposal':
        setActiveSection('proposals');
        break;
      case 'new_agreement':
        setActiveSection('agreements');
        break;
      case 'new_invoice':
        setActiveSection('invoices');
        break;
      case 'new_client':
        setActiveSection('clients');
        break;
      case 'new_payment':
        setActiveSection('payments');
        break;
      case 'new_review':
        setActiveSection('reviews');
        break;
      case 'new_job':
        setActiveSection('careers');
        break;
      case 'new_blog':
        setActiveSection('blog');
        break;
      default:
        break;
    }
  };

  const handleQuickActionWithClient = (action, client) => {
    setPreselectedClient(client);
    handleQuickAction(action);
  };

  const handleQuickActionWithRateCard = (action, rateCard) => {
    setPreselectedRateCard(rateCard);
    handleQuickAction(action);
  };

  const handleQuickRecordPayment = (invoice) => {
    setPreselectedInvoice(invoice);
    setActiveSection('payments');
  };

  const handlePreviewDoc = (docType, doc) => {
    setPreviewModal({
      isOpen: true,
      docType,
      doc,
    });
  };

  const handleDownloadDocx = (id, docNumber) => {
    if (previewModal.docType === 'quotation') {
      docApi.downloadQuotationDocx(id, docNumber);
    } else if (previewModal.docType === 'invoice') {
      docApi.downloadInvoiceDocx(id, docNumber);
    } else if (previewModal.docType === 'proposal') {
      docApi.downloadProposalDocx(id, docNumber);
    } else if (previewModal.docType === 'agreement') {
      docApi.downloadAgreementDocx(id, docNumber);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1220] flex font-sans selection:bg-[#1677FF] selection:text-white">
      {/* Unified Master Sidebar */}
      <StitchXSidebar
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          setMobileSidebarOpen(false);
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        userRole={adminUser?.role || 'admin'}
        stats={stats}
        websiteStats={websiteStats}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <StitchXNavbar
          activeSection={activeSection}
          adminUser={adminUser}
          onLogout={onLogout}
          onQuickAction={handleQuickAction}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Overview Master Dashboard */}
            {activeSection === 'dashboard' && (
              <OverviewModule
                stats={stats}
                websiteStats={websiteStats}
                recent={recent}
                statusDistribution={statusDistribution}
                loading={loadingStats}
                onRefresh={loadStats}
                onNavigate={setActiveSection}
                onQuickAction={handleQuickAction}
              />
            )}

            {/* Commercial & Document Management Modules */}
            {activeSection === 'clients' && (
              <ClientsModule
                onQuickActionWithClient={handleQuickActionWithClient}
                onPreviewDoc={handlePreviewDoc}
              />
            )}

            {activeSection === 'all_documents' && (
              <AllDocumentsModule onPreviewDoc={handlePreviewDoc} />
            )}

            {activeSection === 'rate_cards' && (
              <RateCardsModule onQuickActionWithRateCard={handleQuickActionWithRateCard} />
            )}

            {activeSection === 'quotations' && (
              <QuotationsModule
                onPreviewDoc={handlePreviewDoc}
                preselectedClient={preselectedClient}
                onClearPreselectedClient={() => setPreselectedClient(null)}
                preselectedRateCard={preselectedRateCard}
                onClearPreselectedRateCard={() => setPreselectedRateCard(null)}
              />
            )}

            {activeSection === 'proposals' && (
              <ProposalsModule
                onPreviewDoc={handlePreviewDoc}
                preselectedClient={preselectedClient}
                onClearPreselectedClient={() => setPreselectedClient(null)}
              />
            )}

            {activeSection === 'agreements' && (
              <AgreementsModule
                onPreviewDoc={handlePreviewDoc}
                preselectedClient={preselectedClient}
                onClearPreselectedClient={() => setPreselectedClient(null)}
              />
            )}

            {activeSection === 'invoices' && (
              <InvoicesModule
                onPreviewDoc={handlePreviewDoc}
                onQuickRecordPayment={handleQuickRecordPayment}
                preselectedClient={preselectedClient}
                onClearPreselectedClient={() => setPreselectedClient(null)}
              />
            )}

            {activeSection === 'payments' && (
              <PaymentsModule
                preselectedInvoice={preselectedInvoice}
                onClearPreselectedInvoice={() => setPreselectedInvoice(null)}
              />
            )}

            {/* Website & Content Management Modules */}
            {activeSection === 'reviews' && (
              <ReviewsModule onStatsChange={loadStats} />
            )}

            {activeSection === 'blog' && (
              <BlogModule onStatsChange={loadStats} />
            )}

            {activeSection === 'careers' && (
              <CareersModule onStatsChange={loadStats} />
            )}

            {activeSection === 'contact' && (
              <ContactModule onStatsChange={loadStats} />
            )}

            {/* Storage & Intelligence Modules */}
            {activeSection === 'file_storage' && <FileStorageModule />}

            {activeSection === 'reports' && <ReportsModule />}

            {/* Administration & Security Modules */}
            {activeSection === 'company_settings' && <CompanySettingsModule />}

            {activeSection === 'users' && <UserManagementModule />}

            {activeSection === 'activity_logs' && <ActivityLogsModule />}
          </div>
        </main>
      </div>

      {/* High-Resolution Print / A4 Preview Modal */}
      <DocumentPrintPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, docType: null, doc: null })}
        docType={previewModal.docType}
        doc={previewModal.doc}
        company={company}
        onDownloadDocx={handleDownloadDocx}
      />
    </div>
  );
}

export default StitchXDashboard;
