/**
 * StitchX Global Technology API Client
 * Connects frontend views to database-backed backend endpoints.
 */

const ADMIN_TOKEN_KEY = 'stitchx_admin_token';
const LEGACY_TOKEN_KEY = 'techfusion_admin_token';
const ADMIN_USER_KEY = 'stitchx_admin_user';
const LEGACY_USER_KEY = 'techfusion_admin_user';

export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function apiUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${cleanPath}` : cleanPath;
}

export const authStorage = {
  getToken: () => localStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY),
  setToken: (token) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.setItem(LEGACY_TOKEN_KEY, token);
  },
  clearToken: () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
  },
  getUser: () => {
    const raw = localStorage.getItem(ADMIN_USER_KEY) || localStorage.getItem(LEGACY_USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    const serialized = JSON.stringify(user);
    localStorage.setItem(ADMIN_USER_KEY, serialized);
    localStorage.setItem(LEGACY_USER_KEY, serialized);
  },
};

/**
 * Public API client methods
 */
export const publicApi = {
  // Reviews
  getReviews: async (limit) => {
    const query = limit ? `?limit=${limit}` : '';
    const res = await fetch(apiUrl(`/api/reviews${query}`));
    return res.json();
  },
  submitReview: async (reviewData) => {
    const res = await fetch(apiUrl('/api/reviews'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    return res.json();
  },

  // Blog
  getBlogPosts: async ({ search, category, page, limit } = {}) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'All') params.set('category', category);
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await fetch(apiUrl(`/api/blog${query}`));
    return res.json();
  },
  getBlogPostBySlug: async (slug) => {
    const res = await fetch(apiUrl(`/api/blog/${encodeURIComponent(slug)}`));
    return res.json();
  },

  // Careers & Jobs
  getJobs: async ({ department, type } = {}) => {
    const params = new URLSearchParams();
    if (department && department !== 'All') params.set('department', department);
    if (type && type !== 'All') params.set('type', type);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await fetch(apiUrl(`/api/jobs${query}`));
    return res.json();
  },
  getJobById: async (id) => {
    const res = await fetch(apiUrl(`/api/jobs/${encodeURIComponent(id)}`));
    return res.json();
  },
  applyForJob: async (formData) => {
    const isFormData = formData instanceof FormData;
    const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
    const body = isFormData ? formData : JSON.stringify(formData);

    const res = await fetch(apiUrl('/api/jobs/apply'), {
      method: 'POST',
      headers,
      body,
    });
    return res.json();
  },

  // Contact
  getContactInfo: async () => {
    const res = await fetch(apiUrl('/api/contact/info'));
    return res.json();
  },
  submitContact: async (data) => {
    const res = await fetch(apiUrl('/api/contact'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

/**
 * Authenticated Admin API client methods
 */
function getCsrfTokenFromCookie() {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|;\s*)(?:__Host-sx-csrf-token|sx_csrf_token)=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

async function adminFetch(endpoint, options = {}) {
  const token = authStorage.getToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const csrfToken = getCsrfTokenFromCookie();
  if (csrfToken && !headers['X-CSRF-Token']) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  if (options.body && !(options.body instanceof FormData) && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(apiUrl(`/api/admin${endpoint}`), {
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

  return res.json();
}

export const adminApi = {
  // Auth
  login: async (username, password) => {
    const res = await fetch(apiUrl('/api/admin/login'), {
      method: 'POST',
      credentials: API_BASE ? 'include' : 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },
  logout: async () => {
    const res = await adminFetch('/logout', { method: 'POST' });
    authStorage.clearToken();
    return res;
  },
  getMe: () => adminFetch('/me'),
  getDashboardStats: () => adminFetch('/dashboard-stats'),

  // Upload image
  uploadImage: async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const token = authStorage.getToken();
    const res = await fetch(apiUrl('/api/admin/upload-image'), {
      method: 'POST',
      credentials: API_BASE ? 'include' : 'same-origin',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    return res.json();
  },

  // Reviews
  getReviews: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return adminFetch(`/reviews${qs ? `?${qs}` : ''}`);
  },
  createReview: (data) => adminFetch('/reviews', { method: 'POST', body: data }),
  updateReview: (id, data) => adminFetch(`/reviews/${id}`, { method: 'PUT', body: data }),
  updateReviewStatus: (id, status) => adminFetch(`/reviews/${id}/status`, { method: 'PATCH', body: { status } }),
  toggleReviewPublish: (id, is_published) => adminFetch(`/reviews/${id}/publish`, { method: 'PATCH', body: { is_published } }),
  reorderReviews: (items) => adminFetch('/reviews/reorder', { method: 'PUT', body: { items } }),
  deleteReview: (id) => adminFetch(`/reviews/${id}`, { method: 'DELETE' }),

  // Blog
  getBlogPosts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return adminFetch(`/blog${qs ? `?${qs}` : ''}`);
  },
  createBlogPost: (data) => adminFetch('/blog', { method: 'POST', body: data }),
  updateBlogPost: (id, data) => adminFetch(`/blog/${id}`, { method: 'PUT', body: data }),
  toggleBlogPostPublish: (id, is_published) => adminFetch(`/blog/${id}/publish`, { method: 'PATCH', body: { is_published } }),
  deleteBlogPost: (id) => adminFetch(`/blog/${id}`, { method: 'DELETE' }),

  // Careers & Jobs
  getJobs: () => adminFetch('/jobs'),
  createJob: (data) => adminFetch('/jobs', { method: 'POST', body: data }),
  updateJob: (id, data) => adminFetch(`/jobs/${id}`, { method: 'PUT', body: data }),
  updateJobStatus: (id, status) => adminFetch(`/jobs/${id}/status`, { method: 'PATCH', body: { status } }),
  toggleJobPublish: (id, is_published) => adminFetch(`/jobs/${id}/publish`, { method: 'PATCH', body: { is_published } }),
  deleteJob: (id) => adminFetch(`/jobs/${id}`, { method: 'DELETE' }),

  // Applications
  getApplications: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return adminFetch(`/applications${qs ? `?${qs}` : ''}`);
  },
  getApplicationById: (id) => adminFetch(`/applications/${id}`),
  updateApplication: (id, data) => adminFetch(`/applications/${id}`, { method: 'PATCH', body: data }),
  deleteApplication: (id) => adminFetch(`/applications/${id}`, { method: 'DELETE' }),
  downloadResume: async (id) => {
    const token = authStorage.getToken();
    const res = await fetch(apiUrl(`/api/admin/applications/${id}/resume`), {
      credentials: API_BASE ? 'include' : 'same-origin',
      headers: { Authorization: `Bearer ${token}` },
    });
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (data.externalUrl) {
        window.open(data.externalUrl, '_blank', 'noopener,noreferrer');
        return;
      }
      throw new Error(data.error || 'Failed to download resume');
    }

    const disposition = res.headers.get('content-disposition');
    let filename = `resume_${id}.pdf`;
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
  },

  // Contact Enquiries
  getEnquiries: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return adminFetch(`/enquiries${qs ? `?${qs}` : ''}`);
  },
  getEnquiryById: (id) => adminFetch(`/enquiries/${id}`),
  updateEnquiry: (id, data) => adminFetch(`/enquiries/${id}`, { method: 'PATCH', body: data }),
  deleteEnquiry: (id) => adminFetch(`/enquiries/${id}`, { method: 'DELETE' }),

  // Contact Settings
  getContactSettings: () => adminFetch('/contact-settings'),
  updateContactSettings: (data) => adminFetch('/contact-settings', { method: 'PUT', body: data }),
};

// Re-export StitchX Document Management API client
export { docApi } from './docApi.js';
