import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Download,
  MapPin,
  User,
} from 'lucide-react';
import { adminApi } from '../../../lib/api';

export function CareersModule({ onStatsChange }) {
  const [subTab, setSubTab] = useState('jobs'); // 'jobs' or 'applications'
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Job Modal State
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const initialJobForm = {
    title: '',
    department: 'Engineering',
    location: 'Hybrid / Gurugram or Remote (India)',
    jobType: 'Full-time',
    experience: '3-5 Years',
    salaryRange: '₹18,00,000 - ₹28,00,000 PA',
    applicationDeadline: '2026-12-31',
    shortDescription: '',
    responsibilities: '',
    requirements: '',
    niceToHave: '',
    benefits: '',
    status: 'active',
    is_published: 1,
  };
  const [jobForm, setJobForm] = useState(initialJobForm);
  const [savingJob, setSavingJob] = useState(false);

  // Application Detail Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [appNotes, setAppNotes] = useState('');
  const [appStatus, setAppStatus] = useState('New');
  const [savingApp, setSavingApp] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (subTab === 'jobs') {
        const res = await adminApi.getJobs();
        if (res?.success) setJobs(res.jobs || []);
      } else {
        const res = await adminApi.getApplications();
        if (res?.success) setApplications(res.applications || []);
      }
    } catch (err) {
      console.error('Failed to load careers data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [subTab]);

  const handleOpenAddJob = () => {
    setEditingJob(null);
    setJobForm(initialJobForm);
    setJobModalOpen(true);
  };

  const handleOpenEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || '',
      department: job.department || 'Engineering',
      location: job.location || '',
      jobType: job.jobType || 'Full-time',
      experience: job.experience || '',
      salaryRange: job.salaryRange || '',
      applicationDeadline: job.applicationDeadline || '',
      shortDescription: job.shortDescription || '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
      niceToHave: Array.isArray(job.niceToHave) ? job.niceToHave.join('\n') : '',
      benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : '',
      status: job.status || 'active',
      is_published: job.is_published ? 1 : 0,
    });
    setJobModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title.trim() || !jobForm.shortDescription.trim()) {
      alert('Job Title and Short Description are required.');
      return;
    }

    setSavingJob(true);
    try {
      const payload = {
        ...jobForm,
        responsibilities: jobForm.responsibilities.split('\n').map(s => s.trim()).filter(Boolean),
        requirements: jobForm.requirements.split('\n').map(s => s.trim()).filter(Boolean),
        niceToHave: jobForm.niceToHave.split('\n').map(s => s.trim()).filter(Boolean),
        benefits: jobForm.benefits.split('\n').map(s => s.trim()).filter(Boolean),
      };

      if (editingJob) {
        await adminApi.updateJob(editingJob.id, payload);
      } else {
        await adminApi.createJob(payload);
      }

      setJobModalOpen(false);
      loadData();
      onStatsChange?.();
    } catch (err) {
      alert(err.message || 'Failed to save job opening.');
    } finally {
      setSavingJob(false);
    }
  };

  const handleToggleJobPublish = async (id, currentVal) => {
    try {
      await adminApi.toggleJobPublish(id, currentVal ? 0 : 1);
      loadData();
      onStatsChange?.();
    } catch (err) {
      alert('Error updating status.');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job opening permanently?')) return;
    try {
      await adminApi.deleteJob(id);
      loadData();
      onStatsChange?.();
    } catch (err) {
      alert('Error deleting job.');
    }
  };

  const handleOpenAppDetail = (app) => {
    setSelectedApp(app);
    setAppStatus(app.status || 'New');
    setAppNotes(app.internal_notes || '');
  };

  const handleSaveAppUpdates = async () => {
    if (!selectedApp) return;
    setSavingApp(true);
    try {
      await adminApi.updateApplication(selectedApp.id, {
        status: appStatus,
        internal_notes: appNotes,
      });
      setSelectedApp(null);
      loadData();
      onStatsChange?.();
    } catch (err) {
      alert('Failed to update application.');
    } finally {
      setSavingApp(false);
    }
  };

  const handleDownloadResume = async (id) => {
    try {
      await adminApi.downloadResume(id);
    } catch (err) {
      alert(err.message || 'Error downloading resume.');
    }
  };

  const handleDeleteApp = async (id) => {
    if (!window.confirm('Delete this candidate application?')) return;
    try {
      await adminApi.deleteApplication(id);
      loadData();
      onStatsChange?.();
    } catch (err) {
      alert('Error deleting application.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#1677FF] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              TALENT PIPELINE & RECRUITMENT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Careers & Talent Management
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Publish job openings and review candidate applications with secure, authenticated resume downloads.
          </p>
        </div>
        {subTab === 'jobs' && (
          <button
            onClick={handleOpenAddJob}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black shadow-md border border-blue-400 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Post New Opening</span>
          </button>
        )}
      </div>

      {/* Subtabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSubTab('jobs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer ${
            subTab === 'jobs'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4 stroke-[2.5]" />
          <span>Active Openings ({jobs.length})</span>
        </button>
        <button
          onClick={() => setSubTab('applications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer ${
            subTab === 'applications'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4 stroke-[2.5]" />
          <span>Candidate Applications ({applications.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: JOBS LIST */}
      {subTab === 'jobs' && (
        <>
          {loading ? (
            <div className="p-16 text-center text-xs font-mono font-bold text-slate-500 bg-white rounded-2xl border border-slate-200">
              Loading job vacancies...
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-slate-900 mb-1">No Open Roles</h3>
              <p className="text-xs font-bold text-slate-500 mb-4">Post a new opening to start collecting candidate resumes.</p>
              <button
                onClick={handleOpenAddJob}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1677FF] text-white rounded-xl text-xs font-mono font-black"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Post First Opening</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 font-mono text-[11px] font-black text-slate-800 uppercase tracking-wider">
                      <th className="py-3 px-4">Role Title</th>
                      <th className="py-3 px-4">Department & Type</th>
                      <th className="py-3 px-4">Compensation & Exp</th>
                      <th className="py-3 px-4 text-center">Applications</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {jobs.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-black text-slate-900 text-sm">{j.title}</div>
                          <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
                            <span>{j.location}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-[10px] text-[#1677FF] font-black uppercase tracking-wider block w-fit mb-1">
                            {j.department}
                          </span>
                          <span className="text-[11px] font-bold text-slate-700">{j.jobType}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <div className="font-black text-slate-900">{j.salaryRange}</div>
                          <div className="text-[10px] font-bold text-slate-500">{j.experience}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 font-black text-slate-800 border border-slate-200">
                            {j.application_count || 0}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          <button
                            onClick={() => handleToggleJobPublish(j.id, j.is_published)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-black transition-colors cursor-pointer ${
                              j.is_published
                                ? 'bg-emerald-100 border border-emerald-300 text-emerald-900 hover:bg-emerald-200'
                                : 'bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {j.is_published ? <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" /> : <Clock className="w-3.5 h-3.5 stroke-[2.5]" />}
                            <span>{j.is_published ? 'Active' : 'Draft'}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditJob(j)}
                              className="p-1.5 text-slate-600 hover:text-[#1677FF] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Job"
                            >
                              <Edit className="w-4 h-4 stroke-[2.5]" />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(j.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Job"
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
        </>
      )}

      {/* SUBTAB 2: APPLICATIONS LIST */}
      {subTab === 'applications' && (
        <>
          {loading ? (
            <div className="p-16 text-center text-xs font-mono font-bold text-slate-500 bg-white rounded-2xl border border-slate-200">
              Loading candidate applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-slate-900 mb-1">No Applications Yet</h3>
              <p className="text-xs font-bold text-slate-500">Candidate submissions for open roles will appear here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 font-mono text-[11px] font-black text-slate-800 uppercase tracking-wider">
                      <th className="py-3 px-4">Candidate Name</th>
                      <th className="py-3 px-4">Position Applied</th>
                      <th className="py-3 px-4">Contact Info</th>
                      <th className="py-3 px-4">Resume File</th>
                      <th className="py-3 px-4 text-center">Hiring Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-black text-slate-900 text-sm">{app.name}</div>
                          <div className="text-[10px] font-bold text-slate-500">
                            {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recent'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-black text-slate-900 block">{app.job_title}</span>
                          <span className="text-[10px] font-bold text-slate-500">{app.experience || 'Experience unspecified'}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <div className="font-bold text-slate-800">{app.email}</div>
                          <div className="text-[10px] font-bold text-slate-500">{app.phone || 'No phone'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleDownloadResume(app.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#1677FF] hover:bg-blue-100 text-xs font-mono font-black transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Download PDF</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              app.status === 'Hired'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : app.status === 'Shortlisted'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : app.status === 'Rejected'
                                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                : app.status === 'Under Review'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-800 border border-slate-300'
                            }`}
                          >
                            {app.status || 'New'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenAppDetail(app)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-mono font-black transition-colors cursor-pointer"
                            >
                              Review & Notes
                            </button>
                            <button
                              onClick={() => handleDeleteApp(app.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Application"
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
        </>
      )}

      {/* JOB CREATION / EDIT MODAL */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-3xl p-6 sm:p-7 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-900 mb-1">
              {editingJob ? 'Edit Job Opening' : 'Post New Career Opportunity'}
            </h3>
            <p className="text-xs font-bold text-slate-600 mb-5">
              Specify role qualifications, CTC budget, and application deadline for StitchX Global Technology website listings.
            </p>

            <form onSubmit={handleSaveJob} className="space-y-4 text-left text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">ROLE TITLE *</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    required
                    placeholder="Senior Full Stack Engineer"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-[#1677FF] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">DEPARTMENT</label>
                  <select
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-[#1677FF] outline-none font-mono"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">UI/UX Design</option>
                    <option value="Product">Product & Delivery</option>
                    <option value="Sales">Sales & Growth</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">WORK LOCATION</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="Gurugram (Hybrid) / Remote"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">JOB TYPE</label>
                  <select
                    value={jobForm.jobType}
                    onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold font-mono"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">EXPERIENCE REQUIRED</label>
                  <input
                    type="text"
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    placeholder="3-5 Years"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">ANNUAL SALARY RANGE (CTC)</label>
                  <input
                    type="text"
                    value={jobForm.salaryRange}
                    onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                    placeholder="₹18,00,000 - ₹28,00,000 PA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">APPLICATION DEADLINE</label>
                  <input
                    type="date"
                    value={jobForm.applicationDeadline}
                    onChange={(e) => setJobForm({ ...jobForm, applicationDeadline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">SHORT SUMMARY *</label>
                <textarea
                  rows={2}
                  value={jobForm.shortDescription}
                  onChange={(e) => setJobForm({ ...jobForm, shortDescription: e.target.value })}
                  required
                  placeholder="Overview of the mission and impact of this role..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">RESPONSIBILITIES (ONE PER LINE)</label>
                <textarea
                  rows={4}
                  value={jobForm.responsibilities}
                  onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                  placeholder="Architect scalable cloud microservices&#10;Lead sprint design reviews&#10;Mentor junior engineers"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-medium leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">REQUIREMENTS (ONE PER LINE)</label>
                <textarea
                  rows={4}
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  placeholder="5+ years hands-on Node.js & React&#10;Strong MongoDB database optimization&#10;Docker & AWS ECS experience"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-medium leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">STATUS</label>
                  <select
                    value={jobForm.status}
                    onChange={(e) => setJobForm({
                      ...jobForm,
                      status: e.target.value,
                      is_published: e.target.value === 'active' ? 1 : 0
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black"
                  >
                    <option value="active">Active (Open)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="closed">Closed (Filled)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">WEBSITE PUBLISHED</label>
                  <select
                    value={jobForm.is_published}
                    onChange={(e) => setJobForm({
                      ...jobForm,
                      is_published: parseInt(e.target.value, 10),
                      status: parseInt(e.target.value, 10) === 1 ? 'active' : 'draft'
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black"
                  >
                    <option value={1}>Yes (Visible on /careers)</option>
                    <option value={0}>No (Internal Draft)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingJob}
                  className="px-5 py-2.5 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black transition-all shadow-md border border-blue-400 cursor-pointer disabled:opacity-50"
                >
                  {savingJob ? 'Saving...' : 'Save Job Opening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPLICATION REVIEW MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg p-6 shadow-2xl relative text-left text-xs">
            <h3 className="text-xl font-black text-slate-900 mb-1">Candidate Review</h3>
            <p className="text-xs font-bold text-slate-600 mb-4">
              Submitted for <span className="text-[#1677FF] font-black">{selectedApp.job_title}</span>
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mb-4 font-mono">
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Applicant:</span>
                <span className="font-black text-slate-900">{selectedApp.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Email:</span>
                <span className="font-black text-slate-900">{selectedApp.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Phone:</span>
                <span className="font-black text-slate-900">{selectedApp.phone || 'N/A'}</span>
              </div>
              {selectedApp.portfolio_url && (
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Portfolio:</span>
                  <a href={selectedApp.portfolio_url} target="_blank" rel="noreferrer" className="text-[#1677FF] font-black hover:underline truncate max-w-[200px]">
                    {selectedApp.portfolio_url}
                  </a>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                UPDATE PIPELINE STATUS
              </label>
              <select
                value={appStatus}
                onChange={(e) => setAppStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-black text-slate-900"
              >
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-mono font-black text-[11px] text-slate-800 mb-1">
                INTERNAL HIRING NOTES
              </label>
              <textarea
                rows={3}
                value={appNotes}
                onChange={(e) => setAppNotes(e.target.value)}
                placeholder="Private remarks, interview schedule, candidate rate expectations..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl leading-relaxed font-medium"
              />
            </div>

            <div className="flex justify-end gap-2.5 border-t border-slate-200 pt-3">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl font-black text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleSaveAppUpdates}
                disabled={savingApp}
                className="px-5 py-2.5 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl font-black transition-all shadow-md border border-blue-400 cursor-pointer"
              >
                {savingApp ? 'Saving...' : 'Save Status & Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CareersModule;
