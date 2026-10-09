import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { readDB, writeDB } from '../db.js';
import { verifyToken } from './auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'file-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// File upload endpoint (Protected)
router.post('/upload', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname
  });
});

// GET full public portfolio data
router.get('/portfolio', (req, res) => {
  const db = readDB();
  // Filter published projects for non-admin visitors if query param isn't requesting admin view
  const isPublic = req.query.adminView !== 'true';

  const projects = isPublic
    ? db.projects.filter(p => p.published !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
    : db.projects.sort((a, b) => (a.order || 0) - (b.order || 0));

  res.json({
    profile: db.profile,
    projects: projects,
    experience: db.experience || [],
    education: db.education || [],
    skills: db.skills || [],
    certifications: db.certifications || [],
    achievements: db.achievements || []
  });
});

// Submit contact message (Public)
router.post('/messages', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required fields' });
  }

  const db = readDB();
  const newMessage = {
    id: 'msg-' + Date.now(),
    name,
    email,
    subject: subject || 'Portfolio Contact Form',
    message,
    date: new Date().toISOString(),
    read: false
  };

  db.messages = db.messages || [];
  db.messages.unshift(newMessage);
  writeDB(db);

  res.status(201).json({ message: 'Message sent successfully!', data: newMessage });
});

// ================= ADMIN PROTECTED ROUTES ================= //

// Update Profile / About Me
router.put('/profile', verifyToken, (req, res) => {
  const db = readDB();
  db.profile = { ...db.profile, ...req.body };
  writeDB(db);
  res.json({ message: 'Profile updated successfully', profile: db.profile });
});

// Projects Management
router.post('/projects', verifyToken, (req, res) => {
  const db = readDB();
  const newProject = {
    id: 'proj-' + Date.now(),
    title: req.body.title || 'Untitled Project',
    shortDescription: req.body.shortDescription || '',
    detailedDescription: req.body.detailedDescription || '',
    technologies: Array.isArray(req.body.technologies) ? req.body.technologies : [],
    category: req.body.category || 'AI & ML',
    image: req.body.image || '',
    githubUrl: req.body.githubUrl || '',
    demoUrl: req.body.demoUrl || '',
    featured: req.body.featured ?? true,
    published: req.body.published ?? true,
    order: db.projects.length + 1,
    createdAt: new Date().toISOString()
  };

  db.projects.push(newProject);
  writeDB(db);
  res.status(201).json({ message: 'Project created successfully', project: newProject });
});

router.put('/projects/reorder', verifyToken, (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds array required' });
  }

  const db = readDB();
  db.projects = db.projects.map(proj => {
    const idx = orderedIds.indexOf(proj.id);
    if (idx !== -1) {
      proj.order = idx + 1;
    }
    return proj;
  }).sort((a, b) => (a.order || 0) - (b.order || 0));

  writeDB(db);
  res.json({ message: 'Projects reordered successfully', projects: db.projects });
});

router.put('/projects/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.projects.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  db.projects[index] = { ...db.projects[index], ...req.body, id };
  writeDB(db);
  res.json({ message: 'Project updated successfully', project: db.projects[index] });
});

router.delete('/projects/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.projects = db.projects.filter(p => p.id !== id);
  writeDB(db);
  res.json({ message: 'Project deleted successfully' });
});

// Experience Management
router.post('/experience', verifyToken, (req, res) => {
  const db = readDB();
  const newExp = {
    id: 'exp-' + Date.now(),
    role: req.body.role || '',
    company: req.body.company || '',
    location: req.body.location || '',
    period: req.body.period || '',
    description: req.body.description || '',
    technologies: Array.isArray(req.body.technologies) ? req.body.technologies : [],
    slides: Array.isArray(req.body.slides) ? req.body.slides : (req.body.image ? [req.body.image] : []),
    image: req.body.image || '',
    order: (db.experience || []).length + 1
  };
  db.experience = db.experience || [];
  db.experience.push(newExp);
  writeDB(db);
  res.status(201).json({ message: 'Experience added', experience: newExp });
});

router.put('/experience/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const idx = db.experience.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Experience not found' });

  db.experience[idx] = { ...db.experience[idx], ...req.body, id };
  writeDB(db);
  res.json({ message: 'Experience updated', experience: db.experience[idx] });
});

router.delete('/experience/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.experience = (db.experience || []).filter(e => e.id !== id);
  writeDB(db);
  res.json({ message: 'Experience deleted' });
});

// Education Management
router.post('/education', verifyToken, (req, res) => {
  const db = readDB();
  const newEdu = {
    id: 'edu-' + Date.now(),
    degree: req.body.degree || '',
    institution: req.body.institution || '',
    period: req.body.period || '',
    score: req.body.score || '',
    details: req.body.details || '',
    order: (db.education || []).length + 1
  };
  db.education = db.education || [];
  db.education.push(newEdu);
  writeDB(db);
  res.status(201).json({ message: 'Education added', education: newEdu });
});

router.put('/education/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const idx = db.education.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Education not found' });

  db.education[idx] = { ...db.education[idx], ...req.body, id };
  writeDB(db);
  res.json({ message: 'Education updated', education: db.education[idx] });
});

router.delete('/education/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.education = (db.education || []).filter(e => e.id !== id);
  writeDB(db);
  res.json({ message: 'Education deleted' });
});

// Skills Management
router.put('/skills', verifyToken, (req, res) => {
  const db = readDB();
  if (!Array.isArray(req.body.skills)) {
    return res.status(400).json({ error: 'Skills must be an array' });
  }
  db.skills = req.body.skills;
  writeDB(db);
  res.json({ message: 'Skills updated successfully', skills: db.skills });
});

// Achievements Management
router.post('/achievements', verifyToken, (req, res) => {
  const db = readDB();
  const newAch = {
    id: 'ach-' + Date.now(),
    title: req.body.title || '',
    organization: req.body.organization || '',
    description: req.body.description || '',
    year: req.body.year || '',
    badge: req.body.badge || 'Award'
  };
  db.achievements = db.achievements || [];
  db.achievements.push(newAch);
  writeDB(db);
  res.status(201).json({ message: 'Achievement added', achievement: newAch });
});

router.put('/achievements/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const idx = db.achievements.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Achievement not found' });

  db.achievements[idx] = { ...db.achievements[idx], ...req.body, id };
  writeDB(db);
  res.json({ message: 'Achievement updated', achievement: db.achievements[idx] });
});

router.delete('/achievements/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.achievements = (db.achievements || []).filter(a => a.id !== id);
  writeDB(db);
  res.json({ message: 'Achievement deleted' });
});

// Certifications Management
router.post('/certifications', verifyToken, (req, res) => {
  const db = readDB();
  const newCert = {
    id: 'cert-' + Date.now(),
    title: req.body.title || '',
    issuer: req.body.issuer || '',
    date: req.body.date || '',
    badge: req.body.badge || 'Certified',
    link: req.body.link || ''
  };
  db.certifications = db.certifications || [];
  db.certifications.push(newCert);
  writeDB(db);
  res.status(201).json({ message: 'Certification added', certification: newCert });
});

router.put('/certifications/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const idx = db.certifications.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Certification not found' });

  db.certifications[idx] = { ...db.certifications[idx], ...req.body, id };
  writeDB(db);
  res.json({ message: 'Certification updated', certification: db.certifications[idx] });
});

router.delete('/certifications/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.certifications = (db.certifications || []).filter(c => c.id !== id);
  writeDB(db);
  res.json({ message: 'Certification deleted' });
});

// Messages Management (Admin)
router.get('/messages', verifyToken, (req, res) => {
  const db = readDB();
  res.json({ messages: db.messages || [] });
});

router.delete('/messages/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.messages = (db.messages || []).filter(m => m.id !== id);
  writeDB(db);
  res.json({ message: 'Message deleted' });
});

export default router;
