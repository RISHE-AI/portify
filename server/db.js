import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const INITIAL_DATA_FILE = path.join(__dirname, '..', 'src', 'services', 'initialData.js');

const getDefaultData = () => {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('RISHE8080b@', salt);

  return {
    lastUpdated: Date.now(),
    admin: {
      username: 'admin',
      passwordHash: passwordHash,
    },
    profile: {
      name: 'Rishe S',
      title: 'AI & Machine Learning Engineer • Full Stack Developer',
      statusText: 'Open for Internships & AI / Full-Stack Opportunities',
      summary: 'B.Tech in Artificial Intelligence & Machine Learning at Kongu Engineering College (CGPA 8.10). Passionate about deep learning, RAG conversational models, and engineering fast, reliable full-stack applications with MERN.',
      email: 'rishe8080s@gmail.com',
      phone: '+91 63832 40322',
      location: 'Namakkal / Erode, Tamil Nadu, India',
      github: 'https://github.com/RISHE-AI',
      linkedin: 'https://linkedin.com/in/rishe-aiml/',
      resumeUrl: '/assets/resume.pdf',
      profileImage: '',
      interests: ['Machine Learning', 'Web Development', 'Data Analytics'],
      badge1Title: '3+ AI Projects',
      badge1Sub: 'CNN, RAG, MathBot',
      badge2Title: '4 Awards Won',
      badge2Sub: 'PSG, KEC, BYTS',
      badge3Title: '8.10 CGPA',
      badge3Sub: 'Kongu Engg College',
      emailjsServiceId: 'service_htjutg8',
      emailjsTemplateId: 'template_9755cdk',
      emailjsPublicKey: 'O-98xkd9yq2ghtwlC'
    },
    projects: [],
    experience: [],
    education: [
      {
        id: 'edu-1',
        degree: 'B.Tech in Artificial Intelligence & Machine Learning',
        institution: 'Kongu Engineering College, Erode',
        period: '2023 - 2027',
        score: 'CGPA: 8.10',
        details: 'Specialization in AIML. Active participant in paper presentations, hackathons, and technical projects.',
        order: 1
      },
      {
        id: 'edu-2',
        degree: '12th Standard (HSC)',
        institution: 'Sri Vidya Mandir Matric Hr Sec School, Namakkal',
        period: '2022 - 2023',
        score: '88%',
        details: 'Higher Secondary Specialization in Physics, Chemistry, Mathematics, and Computer Science.',
        order: 2
      },
      {
        id: 'edu-3',
        degree: '10th Standard (SSLC)',
        institution: 'Sri Vidya Mandir Matric Hr Sec School, Namakkal',
        period: '2020 - 2021',
        score: '88%',
        details: 'Secondary School Education with distinction.',
        order: 3
      }
    ],
    skills: [
      {
        category: 'Programming Languages',
        items: [
          { name: 'Java' },
          { name: 'JavaScript' },
          { name: 'Python' }
        ]
      },
      {
        category: 'Frontend Development',
        items: [
          { name: 'React JS' },
          { name: 'HTML5' },
          { name: 'CSS3' }
        ]
      },
      {
        category: 'Backend Development',
        items: [
          { name: 'Node JS' },
          { name: 'Express JS' }
        ]
      },
      {
        category: 'Database & Cloud',
        items: [
          { name: 'MongoDB' },
          { name: 'Firebase' }
        ]
      },
      {
        category: 'Tools & AI Technologies',
        items: [
          { name: 'Git & GitHub' },
          { name: 'OpenCV & OCR' },
          { name: 'TensorFlow / Keras' },
          { name: 'FAISS & RAG' }
        ]
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        title: 'Java SE-17 Developer',
        issuer: 'Oracle / Industry Standard',
        date: '2024',
        badge: 'Verified',
        link: ''
      },
      {
        id: 'cert-2',
        title: 'MongoDB Associate Developer',
        issuer: 'MongoDB University',
        date: '2024',
        badge: 'Certified',
        link: ''
      }
    ],
    achievements: [
      {
        id: 'ach-1',
        title: '1st Place – Paper Presentation',
        organization: 'PSG College Coimbatore',
        description: 'Secured 1st rank for presenting research work on Machine Learning and AI applications.',
        year: '2025',
        badge: '1st Prize'
      },
      {
        id: 'ach-2',
        title: '1st Place – Paper Presentation',
        organization: 'Kongu Engineering College (KEC), Erode',
        description: 'Won 1st prize at KEC technical symposium for innovative paper presentation in AIML.',
        year: '2025',
        badge: '1st Prize'
      },
      {
        id: 'ach-3',
        title: '3rd Prize – BYTS India Hackathon 2025',
        organization: 'BYTS India (24-Hour AI Hackathon)',
        description: 'Secured 3rd prize in a high-intensity 24-hour national AI hackathon for building an end-to-end intelligent web application.',
        year: '2025',
        badge: 'Hackathon Award'
      },
      {
        id: 'ach-4',
        title: '1st Prize – Interactive Tamil Language Chatbot',
        organization: 'Internal Club (KEC Erode)',
        description: 'Awarded 1st prize for creating an interactive NLP chatbot speaking in Tamil language.',
        year: '2024',
        badge: '1st Prize'
      }
    ],
    messages: []
  };
};

// Guarantee Data directory and JSON DB exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Automatically hardcode the latest Admin Dashboard data into src/services/initialData.js
// so all visitors on Vercel / production always see the exact admin-configured portfolio
export function syncInitialDataFile(data) {
  try {
    const publicData = {
      lastUpdated: data.lastUpdated || Date.now(),
      profile: data.profile || {},
      projects: (data.projects || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
      experience: (data.experience || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
      education: (data.education || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
      skills: data.skills || [],
      certifications: data.certifications || [],
      achievements: data.achievements || []
    };
    const fileContent = `// Auto-synced from Admin Dashboard — hardcoded portfolio data for all visitors\nexport const initialPortfolioData = ${JSON.stringify(publicData, null, 2)};\n`;
    fs.writeFileSync(INITIAL_DATA_FILE, fileContent, 'utf-8');
  } catch (err) {
    console.error('Error syncing initialData.js:', err);
  }
}

export function initDB() {
  const data = getDefaultData();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  syncInitialDataFile(data);
  return data;
}

if (!fs.existsSync(DB_FILE)) {
  initDB();
} else {
  // Merge any missing fields into existing database.json
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const existing = JSON.parse(raw);
    const defaults = getDefaultData();

    // Ensure profile has all badges and statusText
    existing.profile = { ...defaults.profile, ...existing.profile };
    existing.lastUpdated = existing.lastUpdated || Date.now();

    // Ensure experience has slides array
    if (existing.experience) {
      existing.experience = existing.experience.map(e => ({
        slides: [],
        ...e
      }));
    }

    fs.writeFileSync(DB_FILE, JSON.stringify(existing, null, 2), 'utf-8');
    syncInitialDataFile(existing);
  } catch (e) {
    initDB();
  }
}

export function readDB() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, re-initializing...', err);
    const data = getDefaultData();
    writeDB(data);
    return data;
  }
}

export function writeDB(data) {
  try {
    data.lastUpdated = Date.now();
    const tempFile = DB_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    syncInitialDataFile(data);
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}
