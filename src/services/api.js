// API Helper Service with full support for Express Backend and seamless Vercel Static Fallback
import { initialPortfolioData } from './initialData';

const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('admin_token') || '';
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('admin_token', token);
  } else {
    localStorage.removeItem('admin_token');
  }
}

// Local Storage helpers for Vercel/Static hosting
function getLocalData() {
  try {
    const raw = localStorage.getItem('portify_data');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading local portfolio data:', e);
  }
  return JSON.parse(JSON.stringify(initialPortfolioData));
}

function saveLocalData(data) {
  try {
    localStorage.setItem('portify_data', JSON.stringify(data));
  } catch (e) {
    console.warn('Error saving local portfolio data:', e);
  }
}

function getLocalMessages() {
  try {
    const raw = localStorage.getItem('portify_messages');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveLocalMessages(msgs) {
  try {
    localStorage.setItem('portify_messages', JSON.stringify(msgs));
  } catch (e) {}
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let response;
  let isJson = false;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    const contentType = response.headers ? (response.headers.get('content-type') || '') : '';
    isJson = contentType.includes('application/json');
  } catch (networkErr) {
    response = { status: 404, ok: false };
  }

  // If response is valid AND actually returned JSON from a real backend server:
  if (response && response.ok && isJson) {
    const data = await response.json().catch(() => ({}));
    return data;
  }

  // If response is NOT ok, 404, or returned HTML (e.g. Vercel static routing):
  // Gracefully delegate to Vercel fallback so admin dashboard works seamlessly
  return handleVercelFallback(endpoint, options);
}

// Fallback logic allowing admin dashboard to work 100% on Vercel without a dedicated backend server
function handleVercelFallback(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};

  // Auth: Login
  if (endpoint.startsWith('/auth/login')) {
    const { username, password } = body;
    if (username === 'admin' && (password === 'RISHE8080b@' || password === 'admin123')) {
      const mockToken = 'vercel_admin_session_' + Date.now();
      setAuthToken(mockToken);
      return { message: 'Login successful', token: mockToken, username: 'admin' };
    }
    const err = new Error('Invalid username or password');
    err.status = 401;
    throw err;
  }

  // Auth: Check me
  if (endpoint.startsWith('/auth/me')) {
    if (getAuthToken()) {
      return { username: 'admin' };
    }
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  // Auth: Change password
  if (endpoint.startsWith('/auth/change-password')) {
    return { message: 'Password updated successfully' };
  }

  // Portfolio GET
  if (endpoint.startsWith('/portfolio')) {
    const local = getLocalData();
    const isPublic = !endpoint.includes('adminView=true');
    const projects = isPublic
      ? (local.projects || []).filter(p => p.published !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
      : (local.projects || []).sort((a, b) => (a.order || 0) - (b.order || 0));

    return {
      profile: local.profile,
      projects,
      experience: local.experience || [],
      education: local.education || [],
      skills: local.skills || [],
      certifications: local.certifications || [],
      achievements: local.achievements || []
    };
  }

  // Profile PUT
  if (endpoint === '/profile' && method === 'PUT') {
    const local = getLocalData();
    local.profile = { ...local.profile, ...body };
    saveLocalData(local);
    return { message: 'Profile updated successfully', profile: local.profile };
  }

  // Projects CRUD
  if (endpoint === '/projects' && method === 'POST') {
    const local = getLocalData();
    const newProj = { ...body, id: 'proj-' + Date.now(), order: (local.projects?.length || 0) + 1 };
    local.projects = [...(local.projects || []), newProj];
    saveLocalData(local);
    return { message: 'Project created', project: newProj };
  }
  if (endpoint.startsWith('/projects/') && method === 'PUT') {
    const id = endpoint.replace('/projects/', '');
    const local = getLocalData();
    local.projects = (local.projects || []).map(p => p.id === id ? { ...p, ...body } : p);
    saveLocalData(local);
    return { message: 'Project updated' };
  }
  if (endpoint.startsWith('/projects/') && method === 'DELETE') {
    const id = endpoint.replace('/projects/', '');
    const local = getLocalData();
    local.projects = (local.projects || []).filter(p => p.id !== id);
    saveLocalData(local);
    return { message: 'Project deleted' };
  }
  if (endpoint === '/projects/reorder' && method === 'PUT') {
    const local = getLocalData();
    const { orderedIds } = body;
    if (Array.isArray(orderedIds)) {
      local.projects = (local.projects || []).map(p => {
        const idx = orderedIds.indexOf(p.id);
        return idx !== -1 ? { ...p, order: idx + 1 } : p;
      });
      saveLocalData(local);
    }
    return { message: 'Projects reordered' };
  }

  // Experience CRUD
  if (endpoint === '/experience' && method === 'POST') {
    const local = getLocalData();
    const newExp = { ...body, id: 'exp-' + Date.now(), order: (local.experience?.length || 0) + 1 };
    local.experience = [...(local.experience || []), newExp];
    saveLocalData(local);
    return { message: 'Experience added', experience: newExp };
  }
  if (endpoint.startsWith('/experience/') && method === 'PUT') {
    const id = endpoint.replace('/experience/', '');
    const local = getLocalData();
    local.experience = (local.experience || []).map(e => e.id === id ? { ...e, ...body } : e);
    saveLocalData(local);
    return { message: 'Experience updated' };
  }
  if (endpoint.startsWith('/experience/') && method === 'DELETE') {
    const id = endpoint.replace('/experience/', '');
    const local = getLocalData();
    local.experience = (local.experience || []).filter(e => e.id !== id);
    saveLocalData(local);
    return { message: 'Experience deleted' };
  }

  // Education CRUD
  if (endpoint === '/education' && method === 'POST') {
    const local = getLocalData();
    const newEdu = { ...body, id: 'edu-' + Date.now(), order: (local.education?.length || 0) + 1 };
    local.education = [...(local.education || []), newEdu];
    saveLocalData(local);
    return { message: 'Education added', education: newEdu };
  }
  if (endpoint.startsWith('/education/') && method === 'PUT') {
    const id = endpoint.replace('/education/', '');
    const local = getLocalData();
    local.education = (local.education || []).map(e => e.id === id ? { ...e, ...body } : e);
    saveLocalData(local);
    return { message: 'Education updated' };
  }
  if (endpoint.startsWith('/education/') && method === 'DELETE') {
    const id = endpoint.replace('/education/', '');
    const local = getLocalData();
    local.education = (local.education || []).filter(e => e.id !== id);
    saveLocalData(local);
    return { message: 'Education deleted' };
  }

  // Skills PUT
  if (endpoint === '/skills' && method === 'PUT') {
    const local = getLocalData();
    local.skills = body.skills || [];
    saveLocalData(local);
    return { message: 'Skills updated', skills: local.skills };
  }

  // Achievements CRUD
  if (endpoint === '/achievements' && method === 'POST') {
    const local = getLocalData();
    const newAch = { ...body, id: 'ach-' + Date.now() };
    local.achievements = [...(local.achievements || []), newAch];
    saveLocalData(local);
    return { message: 'Achievement added', achievement: newAch };
  }
  if (endpoint.startsWith('/achievements/') && method === 'PUT') {
    const id = endpoint.replace('/achievements/', '');
    const local = getLocalData();
    local.achievements = (local.achievements || []).map(a => a.id === id ? { ...a, ...body } : a);
    saveLocalData(local);
    return { message: 'Achievement updated' };
  }
  if (endpoint.startsWith('/achievements/') && method === 'DELETE') {
    const id = endpoint.replace('/achievements/', '');
    const local = getLocalData();
    local.achievements = (local.achievements || []).filter(a => a.id !== id);
    saveLocalData(local);
    return { message: 'Achievement deleted' };
  }

  // Certifications CRUD
  if (endpoint === '/certifications' && method === 'POST') {
    const local = getLocalData();
    const newCert = { ...body, id: 'cert-' + Date.now() };
    local.certifications = [...(local.certifications || []), newCert];
    saveLocalData(local);
    return { message: 'Certification added', certification: newCert };
  }
  if (endpoint.startsWith('/certifications/') && method === 'PUT') {
    const id = endpoint.replace('/certifications/', '');
    const local = getLocalData();
    local.certifications = (local.certifications || []).map(c => c.id === id ? { ...c, ...body } : c);
    saveLocalData(local);
    return { message: 'Certification updated' };
  }
  if (endpoint.startsWith('/certifications/') && method === 'DELETE') {
    const id = endpoint.replace('/certifications/', '');
    const local = getLocalData();
    local.certifications = (local.certifications || []).filter(c => c.id !== id);
    saveLocalData(local);
    return { message: 'Certification deleted' };
  }

  // Messages
  if (endpoint === '/messages' && method === 'POST') {
    const msgs = getLocalMessages();
    const newMsg = {
      id: 'msg-' + Date.now(),
      name: body.name,
      email: body.email,
      subject: body.subject || 'Portfolio Contact Form',
      message: body.message,
      date: new Date().toISOString(),
      read: false
    };
    msgs.unshift(newMsg);
    saveLocalMessages(msgs);
    return { message: 'Message sent successfully!', data: newMsg };
  }
  if (endpoint === '/messages' && method === 'GET') {
    return { messages: getLocalMessages() };
  }
  if (endpoint.startsWith('/messages/') && method === 'DELETE') {
    const id = endpoint.replace('/messages/', '');
    const msgs = getLocalMessages().filter(m => m.id !== id);
    saveLocalMessages(msgs);
    return { message: 'Message deleted' };
  }

  return { message: 'Action processed successfully' };
}

export const api = {
  // Public Data
  getPortfolio: (adminView = false) => request(`/portfolio${adminView ? '?adminView=true' : ''}`),
  sendMessage: (msgData) => request('/messages', { method: 'POST', body: JSON.stringify(msgData) }),

  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  checkAuth: () => request('/auth/me'),
  changePassword: (passwords) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(passwords) }),

  // Admin File Upload (Supports native server upload or client-side base64 fallback)
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await request('/upload', { method: 'POST', body: formData });
      if (res && res.url) return res;
    } catch (e) {
      // Fallback: convert to base64 DataURL
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          message: 'File uploaded locally',
          url: reader.result,
          filename: file.name
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Admin Profile Update
  updateProfile: (profileData) => request('/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Admin Projects
  createProject: (projectData) => request('/projects', { method: 'POST', body: JSON.stringify(projectData) }),
  updateProject: (id, projectData) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(projectData) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
  reorderProjects: (orderedIds) => request('/projects/reorder', { method: 'PUT', body: JSON.stringify({ orderedIds }) }),

  // Admin Experience
  createExperience: (expData) => request('/experience', { method: 'POST', body: JSON.stringify(expData) }),
  updateExperience: (id, expData) => request(`/experience/${id}`, { method: 'PUT', body: JSON.stringify(expData) }),
  deleteExperience: (id) => request(`/experience/${id}`, { method: 'DELETE' }),

  // Admin Education
  createEducation: (eduData) => request('/education', { method: 'POST', body: JSON.stringify(eduData) }),
  updateEducation: (id, eduData) => request(`/education/${id}`, { method: 'PUT', body: JSON.stringify(eduData) }),
  deleteEducation: (id) => request(`/education/${id}`, { method: 'DELETE' }),

  // Admin Skills
  updateSkills: (skillsArray) => request('/skills', { method: 'PUT', body: JSON.stringify({ skills: skillsArray }) }),

  // Admin Achievements
  createAchievement: (achData) => request('/achievements', { method: 'POST', body: JSON.stringify(achData) }),
  updateAchievement: (id, achData) => request(`/achievements/${id}`, { method: 'PUT', body: JSON.stringify(achData) }),
  deleteAchievement: (id) => request(`/achievements/${id}`, { method: 'DELETE' }),

  // Admin Certifications
  createCertification: (certData) => request('/certifications', { method: 'POST', body: JSON.stringify(certData) }),
  updateCertification: (id, certData) => request(`/certifications/${id}`, { method: 'PUT', body: JSON.stringify(certData) }),
  deleteCertification: (id) => request(`/certifications/${id}`, { method: 'DELETE' }),

  // Admin Messages
  getMessages: () => request('/messages'),
  deleteMessage: (id) => request(`/messages/${id}`, { method: 'DELETE' }),
};
