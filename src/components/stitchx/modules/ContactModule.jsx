import React, { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  Trash2,
  CheckCircle,
  Settings,
  Save,
} from 'lucide-react';
import { adminApi } from '../../../lib/api';

export function ContactModule({ onStatsChange }) {
  const [subTab, setSubTab] = useState('enquiries'); // 'enquiries' or 'settings'
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Selected Enquiry Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [enquiryStatus, setEnquiryStatus] = useState('New');
  const [privateNotes, setPrivateNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [savingEnquiry, setSavingEnquiry] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    email: '',
    phone: '',
    address: '',
    business_hours: '',
    social_links: {},
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (subTab === 'enquiries') {
        const res = await adminApi.getEnquiries({ status: statusFilter, search });
        if (res?.success) setEnquiries(res.enquiries || []);
      } else {
        const res = await adminApi.getContactSettings();
        if (res?.success && res.settings) {
          setSettings(res.settings);
        }
      }
    } catch (err) {
      console.error('Failed to load contact data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [subTab, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleOpenEnquiry = (enq) => {
    setSelectedEnquiry(enq);
    setEnquiryStatus(enq.status || 'New');
    setPrivateNotes(enq.private_notes || '');
    setAssignedTo(enq.assigned_to || '');
  };

  const handleSaveEnquiry = async () => {
    if (!selectedEnquiry) return;
    setSavingEnquiry(true);
    try {
      await adminApi.updateEnquiry(selectedEnquiry.id, {
        status: enquiryStatus,
        private_notes: privateNotes,
        assigned_to: assignedTo,
      });
      setSelectedEnquiry(null);
      loadData();
      onStatsChange?.();
    } catch (err) {
      alert('Failed to update enquiry.');
    } finally {
      setSavingEnquiry(false);
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    try {
      await adminApi.deleteEnquiry(id);
      loadData();
      onStatsChange?.();
    } catch (err) {
      alert('Failed to delete inquiry.');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);
    try {
      const res = await adminApi.updateContactSettings(settings);
      if (res?.success) {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 4000);
      } else {
        alert(res?.error || 'Failed to update contact info.');
      }
    } catch (err) {
      alert('Error updating contact information.');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#1677FF] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              INBOUND PIPELINE & LEADS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Client Inquiries & Contact Leads
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Track business inquiries submitted via the website contact form, assign ownership, and manage public contact channels.
          </p>
        </div>
      </div>

      {/* Subtabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSubTab('enquiries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer ${
            subTab === 'enquiries'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4 stroke-[2.5]" />
          <span>Inbound Inquiries ({enquiries.length})</span>
        </button>
        <button
          onClick={() => setSubTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer ${
            subTab === 'settings'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 stroke-[2.5]" />
          <span>Public Contact Info</span>
        </button>
      </div>

      {/* SUBTAB 1: ENQUIRIES */}
      {subTab === 'enquiries' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {['all', 'New', 'Contacted', 'In Discussion', 'Converted', 'Archived'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sender, email, company..."
                className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#1677FF]"
              />
            </form>
          </div>

          {loading ? (
            <div className="p-16 text-center text-xs font-mono font-bold text-slate-500 bg-white rounded-2xl border border-slate-200">
              Loading contact inquiries...
            </div>
          ) : enquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-slate-900 mb-1">No Inquiries Found</h3>
              <p className="text-xs font-bold text-slate-500">Contact form submissions from potential enterprise clients will appear here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 font-mono text-[11px] font-black text-slate-800 uppercase tracking-wider">
                      <th className="py-3 px-4">Client / Prospect</th>
                      <th className="py-3 px-4">Subject & Requirements</th>
                      <th className="py-3 px-4">Service & Budget</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {enquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-black text-slate-900 text-sm">{enq.name}</div>
                          <div className="text-[11px] font-bold text-slate-600">{enq.company || 'Individual / Enterprise'}</div>
                          <div className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">{enq.email}</div>
                        </td>
                        <td className="py-3.5 px-4 max-w-sm">
                          <div className="font-bold text-slate-900 mb-0.5">{enq.subject || 'Project Inquiry'}</div>
                          <p className="text-slate-600 line-clamp-2 leading-relaxed font-medium">
                            {enq.message}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-[10px] text-[#1677FF] font-black uppercase tracking-wider block w-fit mb-1">
                            {enq.service || 'Custom Development'}
                          </span>
                          <span className="font-bold text-slate-700">{enq.budget || 'Budget unspecified'}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              enq.status === 'Converted'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : enq.status === 'In Discussion'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : enq.status === 'Contacted'
                                ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                : enq.status === 'Archived'
                                ? 'bg-slate-100 text-slate-700 border border-slate-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {enq.status || 'New'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEnquiry(enq)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-mono font-black transition-colors cursor-pointer"
                            >
                              Review & Notes
                            </button>
                            <button
                              onClick={() => handleDeleteEnquiry(enq.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: PUBLIC CONTACT SETTINGS */}
      {subTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl shadow-xs">
          <h3 className="text-xl font-black text-slate-900 mb-1">Public Contact Channels</h3>
          <p className="text-xs font-bold text-slate-600 mb-6">
            Update the support email, phone numbers, and address displayed across the live website footer and contact page.
          </p>

          {settingsSuccess && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center gap-2">
              <CheckCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Contact settings updated successfully! Changes are live immediately.</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-left text-xs">
            <div>
              <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                PRIMARY SUPPORT EMAIL *
              </label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                required
                placeholder="info@stitchxglobal.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-[#1677FF] outline-none"
              />
            </div>

            <div>
              <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                TELEPHONE / WHATSAPP NUMBER *
              </label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                required
                placeholder="+91 9341660370"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-[#1677FF] outline-none"
              />
            </div>

            <div>
              <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                OFFICE / HEADQUARTERS ADDRESS
              </label>
              <textarea
                rows={3}
                value={settings.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="StitchX Global Technology, India"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-[#1677FF] outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                BUSINESS OPERATING HOURS
              </label>
              <input
                type="text"
                value={settings.business_hours || ''}
                onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
                placeholder="Monday - Friday: 9:00 AM - 6:30 PM IST"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-[#1677FF] outline-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black transition-all shadow-md border border-blue-400 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>{savingSettings ? 'Saving...' : 'Save Contact Channels'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ENQUIRY REVIEW MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg p-6 shadow-2xl relative text-left text-xs">
            <h3 className="text-xl font-black text-slate-900 mb-1">Review Prospect Inquiry</h3>
            <p className="text-xs font-bold text-slate-600 mb-4">
              Submitted by <span className="text-[#1677FF] font-black">{selectedEnquiry.name}</span>
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mb-4 font-mono">
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Sender:</span>
                <span className="font-black text-slate-900">{selectedEnquiry.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Email:</span>
                <span className="font-black text-slate-900">{selectedEnquiry.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Phone:</span>
                <span className="font-black text-slate-900">{selectedEnquiry.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Company:</span>
                <span className="font-black text-slate-900">{selectedEnquiry.company || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Service:</span>
                <span className="font-black text-slate-900">{selectedEnquiry.service || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Budget:</span>
                <span className="font-black text-slate-900">{selectedEnquiry.budget || 'N/A'}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                MESSAGE BODY
              </label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed max-h-36 overflow-y-auto font-medium">
                {selectedEnquiry.message}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                  UPDATE PIPELINE STATUS
                </label>
                <select
                  value={enquiryStatus}
                  onChange={(e) => setEnquiryStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-black text-slate-900"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Converted">Converted</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                  ASSIGNED STAFF
                </label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="Sales Director"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                INTERNAL CONVERSION NOTES
              </label>
              <textarea
                rows={2}
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                placeholder="Internal remarks, next follow-up dates..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl leading-relaxed font-medium"
              />
            </div>

            <div className="flex justify-end gap-2.5 border-t border-slate-200 pt-3">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl font-black text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleSaveEnquiry}
                disabled={savingEnquiry}
                className="px-5 py-2.5 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl font-black transition-all shadow-md border border-blue-400 cursor-pointer"
              >
                {savingEnquiry ? 'Saving...' : 'Save Status & Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactModule;
