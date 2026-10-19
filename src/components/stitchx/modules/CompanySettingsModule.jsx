import React, { useState, useEffect } from 'react';
import {
  Save,
  AlertTriangle,
  CheckCircle,
  Building,
  CreditCard,
  Hash,
  ShieldAlert,
} from 'lucide-react';
import { docApi } from '../../../lib/docApi';

export function CompanySettingsModule() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await docApi.getCompanySettings();
      if (res.success) {
        setSettings(res.settings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess(false);
    setSubmitting(true);

    try {
      const res = await docApi.updateCompanySettings(settings);
      if (res.success) {
        setSettings(res.settings);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setSaveError(res.error || 'Failed to save settings.');
      }
    } catch (err) {
      setSaveError(err.message || 'Error updating company settings.');
    } finally {
      setSubmitting(false);
    }
  };

  // Check if essential details are incomplete
  const isIncomplete =
    !settings?.proprietor_name || !settings?.address || !settings?.bank_account_number;

  return (
    <div className="space-y-6 text-left max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Company Settings</h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Configure enterprise profile, numbering conventions, and commercial terms for StitchX Global Technology.
          </p>
        </div>

        <button
          form="settingsForm"
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black shadow-md border border-blue-400 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
          <span>Company profile and numbering preferences saved successfully!</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.5]" />
          <span>{saveError}</span>
        </div>
      )}

      {isIncomplete && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-amber-950 text-xs flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 stroke-[2.5]" />
          <div>
            <span className="font-black uppercase tracking-wide">Important Notice: Official details incomplete.</span>
            <p className="mt-1 font-semibold text-amber-900">
              Proprietor legal name, official business address, and bank account information are currently unconfigured.
              In accordance with corporate governance rules, official credentials are never auto-fabricated. Please fill
              in verified business information below.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-600">
          <div className="inline-block animate-spin h-6 w-6 border-2 border-[#1677FF]/30 border-t-[#1677FF] rounded-full mb-2" />
          <p className="font-mono text-xs font-bold">Loading company configuration...</p>
        </div>
      ) : (
        <form id="settingsForm" onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Business Identity */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
                <Building className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span>1. Business Identity & Structure</span>
            </h2>

            {/* Official Brand Logo Showcase */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0">
                  <img
                    src={settings?.logo_url || '/stitchx-logo.png'}
                    alt="StitchX Official Logo"
                    className="h-12 w-auto max-w-[220px] object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/stitchx-logo.png';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    Official Corporate Brand Logo
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Rendered across all official StitchX A4 Quotations, Invoices, Proposals, and Agreements.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-black text-slate-800 uppercase mb-1.5">
                  Business Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={settings?.business_name || ''}
                  onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Business Structure
                </label>
                <input
                  type="text"
                  value={settings?.structure || 'Sole proprietorship'}
                  onChange={(e) => setSettings({ ...settings, structure: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Proprietor's Legal Full Name
                </label>
                <input
                  type="text"
                  value={settings?.proprietor_name || ''}
                  onChange={(e) => setSettings({ ...settings, proprietor_name: e.target.value })}
                  placeholder="Enter proprietor's name (never invented)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Official Business Email *
                </label>
                <input
                  type="email"
                  required
                  value={settings?.email || ''}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Primary Phone *
                </label>
                <input
                  type="text"
                  required
                  value={settings?.phone || ''}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={settings?.website || ''}
                  onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                Official Business Address
              </label>
              <textarea
                rows="2"
                value={settings?.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="Physical / commercial business office address in India"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
              />
            </div>
          </div>

          {/* Section 2: Taxation & Statutory Configuration */}
          <div className="bg-white border border-[#E2E7EF] rounded-xl p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-[#0B1220] border-b border-slate-100 pb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>2. Tax & Statutory Compliance</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  GST Registration Status
                </label>
                <select
                  value={settings?.tax_status || 'not_registered'}
                  onChange={(e) => setSettings({ ...settings, tax_status: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                >
                  <option value="not_registered">Unregistered / Not Confirmed (Default Commercial)</option>
                  <option value="registered">Registered for GST (Enables GST Tax Invoices)</option>
                  <option value="composition">Composition Scheme</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Business GSTIN (if officially registered)
                </label>
                <input
                  type="text"
                  value={settings?.gstin || ''}
                  onChange={(e) => setSettings({ ...settings, gstin: e.target.value.toUpperCase() })}
                  placeholder="Enter 15-char GSTIN only when confirmed"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Proprietor / Firm PAN
                </label>
                <input
                  type="text"
                  value={settings?.pan || ''}
                  onChange={(e) => setSettings({ ...settings, pan: e.target.value.toUpperCase() })}
                  placeholder="10-digit PAN"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Document Numbering Prefixes */}
          <div className="bg-white border border-[#E2E7EF] rounded-xl p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-[#0B1220] border-b border-slate-100 pb-2 flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-purple-600" />
                <span>3. Document Numbering & Sequence (India FY: 2026-27)</span>
              </div>
              <span className="text-xs font-mono font-black text-[#1677FF] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                Starts at: {settings?.start_sequence || 1001}
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Start Sequence #
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings?.start_sequence || 1001}
                  onChange={(e) => setSettings({ ...settings, start_sequence: Number(e.target.value) || 1001 })}
                  placeholder="1001"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold focus:outline-hidden focus:border-[#1677FF]"
                />
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">e.g. 1001</span>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Invoice Prefix
                </label>
                <input
                  type="text"
                  value={settings?.prefix_invoice || 'SX/'}
                  onChange={(e) => setSettings({ ...settings, prefix_invoice: e.target.value })}
                  placeholder="SX/"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:border-[#1677FF]"
                />
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">e.g. SX/2026-27/1001</span>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Quotation Prefix
                </label>
                <input
                  type="text"
                  value={settings?.prefix_quotation || 'Q-'}
                  onChange={(e) => setSettings({ ...settings, prefix_quotation: e.target.value })}
                  placeholder="Q-"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:border-[#1677FF]"
                />
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">e.g. Q-2026-27-1001</span>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Proposal Prefix
                </label>
                <input
                  type="text"
                  value={settings?.prefix_proposal || 'P-'}
                  onChange={(e) => setSettings({ ...settings, prefix_proposal: e.target.value })}
                  placeholder="P-"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:border-[#1677FF]"
                />
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">e.g. P-2026-27-1001</span>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Agreement Prefix
                </label>
                <input
                  type="text"
                  value={settings?.prefix_agreement || 'SX/NDA/'}
                  onChange={(e) => setSettings({ ...settings, prefix_agreement: e.target.value })}
                  placeholder="SX/NDA/"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:border-[#1677FF]"
                />
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">e.g. SX/NDA/2026-27/1001</span>
              </div>
            </div>
          </div>

          {/* Section 4: Bank Details & Payment Instructions */}
          <div className="bg-white border border-[#E2E7EF] rounded-xl p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-[#0B1220] border-b border-slate-100 pb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>4. Bank Details & Settlement Instructions</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={settings?.bank_name || ''}
                  onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                  placeholder="e.g. HDFC Bank Ltd"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Account Name / Beneficiary
                </label>
                <input
                  type="text"
                  value={settings?.bank_account_name || ''}
                  onChange={(e) => setSettings({ ...settings, bank_account_name: e.target.value })}
                  placeholder="Account holder legal name"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={settings?.bank_account_number || ''}
                  onChange={(e) => setSettings({ ...settings, bank_account_number: e.target.value })}
                  placeholder="Bank account number"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={settings?.bank_ifsc || ''}
                  onChange={(e) => setSettings({ ...settings, bank_ifsc: e.target.value.toUpperCase() })}
                  placeholder="11-character IFSC code"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  UPI VPA / ID
                </label>
                <input
                  type="text"
                  value={settings?.upi_id || ''}
                  onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                  placeholder="e.g. stitchx@upi"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  value={settings?.bank_branch || ''}
                  onChange={(e) => setSettings({ ...settings, bank_branch: e.target.value })}
                  placeholder="Branch location"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
