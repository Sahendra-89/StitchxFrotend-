import React, { useState, useEffect } from 'react';
import {
  FolderLock,
  Upload,
  Search,
  Download,
  Trash2,
} from 'lucide-react';
import { docApi } from '../../../lib/docApi';
import { formatDate } from '../utils';

export function FileStorageModule() {
  const [files, setFiles] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  // Upload modal
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general_attachment');
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadFiles();
    loadClientsList();
  }, [categoryFilter, search, page]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const res = await docApi.getFiles({ category: categoryFilter, search, page, limit: 15 });
      if (res.success) {
        setFiles(res.files);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadClientsList = async () => {
    try {
      const res = await docApi.getClients({ limit: 100 });
      if (res.success) setClients(res.clients);
    } catch (err) {}
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setSelectedFile(f);
      if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }
    setUploadError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('category', category);
    if (clientId) formData.append('client_id', clientId);
    if (description) formData.append('description', description);

    try {
      const res = await docApi.uploadFile(formData);
      if (res.success) {
        setIsUploadOpen(false);
        setSelectedFile(null);
        setTitle('');
        setDescription('');
        loadFiles();
      } else {
        setUploadError(res.error || 'Upload failed.');
      }
    } catch (err) {
      setUploadError(err.message || 'Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete protected file "${name}"?`)) return;
    try {
      const res = await docApi.deleteFile(id);
      if (res.success) loadFiles();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Protected File Storage</h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
            Private server-side storage adapter with MIME validation, path traversal defense, and authenticated downloads.
          </p>
        </div>

        <button
          onClick={() => {
            setUploadError('');
            setSelectedFile(null);
            setIsUploadOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-mono font-black transition-all shadow-md border border-blue-400 cursor-pointer"
        >
          <Upload className="w-4 h-4 stroke-[2.5]" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Security Info Banner */}
      <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-2xl text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5 stroke-[2.5]" />
        <div>
          <span className="font-black uppercase tracking-wide">Zero Public Exposure Architecture:</span> Files are stored securely off public
          web roots. Every download request enforces session token authorization and streams directly to authorized
          personnel only. Executable formats (.exe, .sh, .php) are strictly rejected.
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or filename..."
            className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#1677FF]"
          >
            <option value="all">All File Categories</option>
            <option value="signed_agreement">Signed Agreements</option>
            <option value="invoice">Invoices / Proofs</option>
            <option value="quotation">Quotations</option>
            <option value="proposal">Proposals</option>
            <option value="client_id">Client Identification</option>
            <option value="contract">Legal Contracts</option>
            <option value="general_attachment">General Attachments</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-black uppercase text-[11px] tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4">File ID</th>
                <th className="py-3.5 px-4">Document Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Size & Type</th>
                <th className="py-3.5 px-4">Uploaded Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-600">
                    <div className="inline-block animate-spin h-5 w-5 border-2 border-[#1677FF]/30 border-t-[#1677FF] rounded-full mb-2" />
                    <p className="font-mono text-xs font-bold">Loading secure files...</p>
                  </td>
                </tr>
              ) : files.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-600">
                    <FolderLock className="w-8 h-8 text-slate-300 mx-auto mb-2 stroke-[2.5]" />
                    <p className="font-black text-slate-900 text-sm">No stored documents found.</p>
                    <p className="text-xs font-bold mt-1 text-slate-500">Click "Upload File" to securely archive documents.</p>
                  </td>
                </tr>
              ) : (
                files.map((file) => (
                  <tr key={file._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900">{file.file_id}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block text-sm">{file.title}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500 truncate block max-w-xs mt-0.5">
                        {file.original_filename}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] font-black px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-300 capitalize">
                        {file.category?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{file.client_id?.name || '—'}</td>
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-600">
                      <div>{formatFileSize(file.file_size)}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{file.mime_type}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-600">{formatDate(file.created_at)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => docApi.downloadFile(file._id, file.original_filename)}
                          title="Secure Download"
                          className="p-1.5 text-slate-600 hover:text-[#1677FF] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(file._id, file.title)}
                          title="Delete File"
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-50 text-[#1677FF]">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1220]">Upload Protected File</h3>
                  <p className="text-xs text-[#596579]">PDF, DOCX, XLSX, Images, CSV (Max 15MB)</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Choose File *
                </label>
                <input
                  type="file"
                  required
                  onChange={handleFileChange}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Countersigned Agreement Copy"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  >
                    <option value="general_attachment">General Attachment</option>
                    <option value="signed_agreement">Signed Agreement Copy</option>
                    <option value="invoice">Invoice / Payment Proof</option>
                    <option value="quotation">Quotation Reference</option>
                    <option value="proposal">Proposal Document</option>
                    <option value="client_id">Client Identification</option>
                    <option value="contract">Legal Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                    Associate with Client
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                  >
                    <option value="">-- None / Internal --</option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Description / Context
                </label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional context or verification details..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1677FF]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-lg font-bold shadow-xs transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Encrypting & Storing...' : 'Upload & Protect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
