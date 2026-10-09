// API Helper Service for Portfolio

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

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Public Data
  getPortfolio: (adminView = false) => request(`/portfolio${adminView ? '?adminView=true' : ''}`),
  sendMessage: (msgData) => request('/messages', { method: 'POST', body: JSON.stringify(msgData) }),

  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  checkAuth: () => request('/auth/me'),
  changePassword: (passwords) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(passwords) }),

  // Admin File Upload
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/upload', { method: 'POST', body: formData });
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
