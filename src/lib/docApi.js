import { authStorage, API_BASE, apiUrl } from './api';

/**
 * Authenticated API fetch helper for StitchX Document Management
 */
async function docFetch(endpoint, options = {}) {
  const token = authStorage.getToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is NOT FormData and not already stringified, set application/json
  if (options.body && !(options.body instanceof FormData) && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(apiUrl(`/api/docs${endpoint}`), {
    credentials: API_BASE ? 'include' : 'same-origin',
    ...options,
    headers,
  });

  if (res.status === 401) {
    authStorage.clearToken();
    if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login?expired=1';
    }
  }

  // Handle binary downloads (e.g. DOCX or files)
  const contentType = res.headers.get('content-type') || '';
  if (
    contentType.includes('application/vnd.openxmlformats-officedocument') ||
    contentType.includes('application/octet-stream') ||
    contentType.includes('application/pdf')
  ) {
    if (!res.ok) {
      throw new Error('Download failed with status: ' + res.status);
    }
    return res.blob();
  }

  return res.json();
}

/**
 * Triggers an authenticated file download in the browser using Blob URL
 */
async function triggerBlobDownload(endpoint, fallbackFilename) {
  const token = authStorage.getToken();
  const res = await fetch(apiUrl(`/api/docs${endpoint}`), {
    credentials: API_BASE ? 'include' : 'same-origin',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || `Download failed with status ${res.status}`);
  }

  const disposition = res.headers.get('content-disposition');
  let filename = fallbackFilename;
  if (disposition && disposition.includes('filename=')) {
    const match = disposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) filename = match[1];
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export const docApi = {
  // Dashboard Metrics
  getDashboardStats: () => docFetch('/dashboard-stats'),

  // Clients
  getClients: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return docFetch(`/clients${qs ? `?${qs}` : ''}`);
  },
  getClientById: (id) => docFetch(`/clients/${id}`),
  createClient: (data) => docFetch('/clients', { method: 'POST', body: data }),
  updateClient: (id, data) => docFetch(`/clients/${id}`, { method: 'PUT', body: data }),
  deleteClient: (id) => docFetch(`/clients/${id}`, { method: 'DELETE' }),

  // Rate Cards
  getRateCards: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return docFetch(`/rate-cards${qs ? `?${qs}` : ''}`);
  },
  createRateCard: (data) => docFetch('/rate-cards', { method: 'POST', body: data }),
  updateRateCard: (id, data) => docFetch(`/rate-cards/${id}`, { method: 'PUT', body: data }),
  duplicateRateCard: (id) => docFetch(`/rate-cards/${id}/duplicate`, { method: 'POST' }),
  deleteRateCard: (id) => docFetch(`/rate-cards/${id}`, { method: 'DELETE' }),

  // Quotations
  getQuotations: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return docFetch(`/quotations${qs ? `?${qs}` : ''}`);
  },
  getQuotationById: (id) => docFetch(`/quotations/${id}`),
  createQuotation: (data) => docFetch('/quotations', { method: 'POST', body: data }),
  updateQuotation: (id, data) => docFetch(`/quotations/${id}`, { method: 'PUT', body: data }),
  convertToInvoice: (id) => docFetch(`/quotations/${id}/convert-to-invoice`, { method: 'POST' }),
  downloadQuotationDocx: (id, docNumber) =>
    triggerBlobDownload(`/quotations/${id}/export-docx`, `${docNumber || 'Quotation'}.docx`),
  downloadQuotationPdf: (id, docNumber) =>
    triggerBlobDownload(`/quotations/${id}/export-pdf`, `${docNumber || 'Quotation'}.pdf`),
  deleteQuotation: (id) => docFetch(`/quotations/${id}`, { method: 'DELETE' }),

  // Proposals
  getProposals: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return docFetch(`/proposals${qs ? `?${qs}` : ''}`);
  },
  getProposalById: (id) => docFetch(`/proposals/${id}`),
  createProposal: (data) => docFetch('/proposals', { method: 'POST', body: data }),
  updateProposal: (id, data) => docFetch(`/proposals/${id}`, { method: 'PUT', body: data }),
  downloadProposalDocx: (id, docNumber) =>
    triggerBlobDownload(`/proposals/${id}/export-docx`, `${docNumber || 'Proposal'}.docx`),
  downloadProposalPdf: (id, docNumber) =>
    triggerBlobDownload(`/proposals/${id}/export-pdf`, `${docNumber || 'Proposal'}.pdf`),
  deleteProposal: (id) => docFetch(`/proposals/${id}`, { method: 'DELETE' }),

  // Agreements & NDAs
  getAgreements: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return docFetch(`/agreements${qs ? `?${qs}` : ''}`);
  },
  getAgreementById: (id) => docFetch(`/agreements/${id}`),
  createAgreement: (data) => docFetch('/agreements', { method: 'POST', body: data }),
  updateAgreement: (id, data) => docFetch(`/agreements/${id}`, { method: 'PUT', body: data }),
  markAgreementSigned: (id, data) => docFetch(`/agreements/${id}/mark-signed`, { method: 'POST', body: data }),
  downloadAgreementDocx: (id, docNumber) =>
    triggerBlobDownload(`/agreements/${id}/export-docx`, `${docNumber || 'Agreement'}.docx`),
  downloadAgreementPdf: (id, docNumber) =>
    triggerBlobDownload(`/agreements/${id}/export-pdf`, `${docNumber || 'Agreement'}.pdf`),
  deleteAgreement: (id) => docFetch(`/agreements/${id}`, { method: 'DELETE' }),

  // Invoices
  getInvoices: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return docFetch(`/invoices${qs ? `?${qs}` : ''}`);
  },
  getInvoiceById: (id) => docFetch(`/invoices/${id}`),
  createInvoice: (data) => docFetch('/invoices', { method: 'POST', body: data }),
  updateInvoice: (id, data) => docFetch(`/invoices/${id}`, { method: 'PUT', body: data }),
  issueInvoice: (id) => docFetch(`/invoices/${id}/issue`, { method: 'POST' }),
  cancelInvoice: (id, reason) => docFetch(`/invoices/${id}/cancel`, { method: 'POST', body: { reason } }),
  downloadInvoiceDocx: (id, docNumber) =>
    triggerBlobDownload(`/invoices/${id}/export-docx`, `${docNumber || 'Invoice'}.docx`),
  downloadInvoicePdf: (id, docNumber) =>
    triggerBlobDownload(`/invoices/${id}/export-pdf`, `${docNumber || 'Invoice'}.pdf`),
  deleteInvoice: (id) => docFetch(`/invoices/${id}`, { method: 'DELETE' }),

  // Payments
  getPayments: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return docFetch(`/payments${qs ? `?${qs}` : ''}`);
  },
  createPayment: (data) => docFetch('/payments', { method: 'POST', body: data }),
  verifyPayment: (id) => docFetch(`/payments/${id}/verify`, { method: 'PUT' }),

  // File Storage & Attachments
  getFiles: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return docFetch(`/files${qs ? `?${qs}` : ''}`);
  },
  uploadFile: async (formData) => {
    const token = authStorage.getToken();
    const res = await fetch(apiUrl('/api/docs/files/upload'), {
      method: 'POST',
      credentials: API_BASE ? 'include' : 'same-origin',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return res.json();
  },
  downloadFile: (id, filename) => triggerBlobDownload(`/files/${id}/download`, filename || 'document'),
  deleteFile: (id) => docFetch(`/files/${id}`, { method: 'DELETE' }),

  // Company Settings
  getCompanySettings: () => docFetch('/company-settings'),
  updateCompanySettings: (data) => docFetch('/company-settings', { method: 'PUT', body: data }),

  // Reports
  getReportsSummary: () => docFetch('/reports/summary'),

  // Users & Roles
  getUsers: () => docFetch('/users'),
  createUser: (data) => docFetch('/users', { method: 'POST', body: data }),
  updateUserRole: (id, role) => docFetch(`/users/${id}/role`, { method: 'PUT', body: { role } }),

  // Activity Logs
  getActivityLogs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return docFetch(`/activity-logs${qs ? `?${qs}` : ''}`);
  },

  // Unified Search
  getAllDocuments: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return docFetch(`/all-documents${qs ? `?${qs}` : ''}`);
  },
};
