import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Trophy,
  Award,
  User,
  MessageSquare,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { api, setAuthToken, getAuthToken } from '../services/api';
import styles from './AdminDashboard.module.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState({ type: '', text: '' });

  // Data states
  const [portfolioData, setPortfolioData] = useState({
    profile: {},
    projects: [],
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    achievements: []
  });
  const [messages, setMessages] = useState([]);

  // Modals / Edit Forms
  const [editingProject, setEditingProject] = useState(null);
  const [editingExp, setEditingExp] = useState(null);
  const [editingEdu, setEditingEdu] = useState(null);
  const [editingAch, setEditingAch] = useState(null);
  const [editingCert, setEditingCert] = useState(null);
  const [profileForm, setProfileForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  // Skill Add States
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSkillInput, setNewSkillInput] = useState({});

  // Upload Progress & Project Slide Inputs
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newProjectSlideUrl, setNewProjectSlideUrl] = useState('');

  useEffect(() => {
    checkAuthenticationAndFetch();
  }, []);

  const checkAuthenticationAndFetch = async () => {
    setLoading(true);
    const token = getAuthToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      await api.checkAuth();
      await fetchAllAdminData();
    } catch (err) {
      setAuthToken('');
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAdminData = async () => {
    try {
      const data = await api.getPortfolio(true); // adminView = true
      setPortfolioData(data);
      setProfileForm(data.profile || {});

      const msgRes = await api.getMessages();
      setMessages(msgRes.messages || []);
    } catch (err) {
      showBanner('error', err.message || 'Failed to load portfolio data');
    }
  };

  const showBanner = (type, text) => {
    setBanner({ type, text });
    setTimeout(() => setBanner({ type: '', text: '' }), 4000);
  };

  const handleLogout = () => {
    setAuthToken('');
    navigate('/admin/login');
  };

  // Generic Image Upload
  const handleImageUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadFile(file);
      callback(res.url);
      showBanner('success', 'File uploaded successfully!');
    } catch (err) {
      showBanner('error', err.message || 'File upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  // ================= PROJECTS ================= //
  const handleSaveProject = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slides = Array.isArray(editingProject.slides) ? editingProject.slides : [];
      const primaryImage = slides.length > 0 ? slides[0] : (editingProject.image || '');
      const projectToSave = {
        ...editingProject,
        slides,
        image: primaryImage
      };

      if (editingProject.id) {
        await api.updateProject(editingProject.id, projectToSave);
        showBanner('success', 'Project updated successfully!');
      } else {
        await api.createProject(projectToSave);
        showBanner('success', 'Project created successfully!');
      }
      setEditingProject(null);
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleStartEditProject = (proj) => {
    const slides = Array.isArray(proj.slides) && proj.slides.length > 0
      ? proj.slides
      : (proj.image ? [proj.image] : []);
    setEditingProject({
      ...proj,
      slides,
      image: slides[0] || proj.image || ''
    });
  };

  const handleAddProjectSlideUrl = () => {
    if (!newProjectSlideUrl.trim() || !editingProject) return;
    const url = newProjectSlideUrl.trim();
    const currentSlides = Array.isArray(editingProject.slides)
      ? editingProject.slides
      : (editingProject.image ? [editingProject.image] : []);
    const updated = [...currentSlides, url];
    setEditingProject({
      ...editingProject,
      slides: updated,
      image: updated[0] || ''
    });
    setNewProjectSlideUrl('');
    showBanner('success', 'Image URL added to project slides!');
  };

  const handleMultipleProjectImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !editingProject) return;

    setUploadingImage(true);
    try {
      const urls = [];
      for (const file of files) {
        const res = await api.uploadFile(file);
        if (res && res.url) {
          urls.push(res.url);
        }
      }
      if (urls.length > 0) {
        const currentSlides = Array.isArray(editingProject.slides)
          ? editingProject.slides
          : (editingProject.image ? [editingProject.image] : []);
        const updated = [...currentSlides, ...urls];
        setEditingProject((prev) => ({
          ...prev,
          slides: updated,
          image: updated[0] || prev?.image || ''
        }));
        showBanner('success', `${urls.length} image(s) uploaded successfully!`);
      }
    } catch (err) {
      showBanner('error', err.message || 'File upload failed');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveProjectSlide = (indexToRemove) => {
    if (!editingProject) return;
    const currentSlides = Array.isArray(editingProject.slides) ? editingProject.slides : [];
    const updated = currentSlides.filter((_, idx) => idx !== indexToRemove);
    setEditingProject({
      ...editingProject,
      slides: updated,
      image: updated[0] || ''
    });
  };

  const handleSetCoverProjectSlide = (index) => {
    if (!editingProject) return;
    const currentSlides = Array.isArray(editingProject.slides) ? [...editingProject.slides] : [];
    if (index <= 0 || index >= currentSlides.length) return;
    const [selected] = currentSlides.splice(index, 1);
    currentSlides.unshift(selected);
    setEditingProject({
      ...editingProject,
      slides: currentSlides,
      image: currentSlides[0]
    });
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.deleteProject(id);
      showBanner('success', 'Project deleted');
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', err.message || 'Delete failed');
    }
  };

  const handleTogglePublishProject = async (proj) => {
    try {
      await api.updateProject(proj.id, { published: !proj.published });
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', 'Toggle publish failed');
    }
  };

  const handleReorderProject = async (index, direction) => {
    const list = [...portfolioData.projects];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const orderedIds = list.map(p => p.id);
    try {
      await api.reorderProjects(orderedIds);
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', 'Reorder failed');
    }
  };

  // ================= SKILLS ================= //
  const handleAddSkillCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const currentSkills = [...(portfolioData.skills || [])];
    currentSkills.push({
      category: newCategoryName.trim(),
      items: []
    });

    try {
      await api.updateSkills(currentSkills);
      setNewCategoryName('');
      showBanner('success', 'Skill category added!');
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', 'Failed to add category');
    }
  };

  const handleDeleteSkillCategory = async (catIndex) => {
    if (!window.confirm('Delete this skill category and all its skills?')) return;

    const currentSkills = [...(portfolioData.skills || [])];
    currentSkills.splice(catIndex, 1);

    try {
      await api.updateSkills(currentSkills);
      showBanner('success', 'Category deleted');
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', 'Failed to delete category');
    }
  };

  const handleAddSkillToCategory = async (catIndex) => {
    const skillName = (newSkillInput[catIndex] || '').trim();
    if (!skillName) return;

    const currentSkills = [...(portfolioData.skills || [])];
    currentSkills[catIndex].items = currentSkills[catIndex].items || [];
    currentSkills[catIndex].items.push({ name: skillName });

    try {
      await api.updateSkills(currentSkills);
      setNewSkillInput({ ...newSkillInput, [catIndex]: '' });
      showBanner('success', 'Skill added!');
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', 'Failed to add skill');
    }
  };

  const handleDeleteSkillItem = async (catIndex, skillIndex) => {
    const currentSkills = [...(portfolioData.skills || [])];
    currentSkills[catIndex].items.splice(skillIndex, 1);

    try {
      await api.updateSkills(currentSkills);
      showBanner('success', 'Skill removed');
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', 'Failed to remove skill');
    }
  };

  // ================= EXPERIENCE ================= //
  const handleSaveExp = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingExp.id) {
        await api.updateExperience(editingExp.id, editingExp);
        showBanner('success', 'Experience updated!');
      } else {
        await api.createExperience(editingExp);
        showBanner('success', 'Experience created!');
      }
      setEditingExp(null);
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', 'Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExp = async (id) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      await api.deleteExperience(id);
      showBanner('success', 'Experience deleted');
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', 'Delete failed');
    }
  };

  const handleAddExpSlide = (slideUrl) => {
    const currentSlides = editingExp.slides ? [...editingExp.slides] : [];
    currentSlides.push(slideUrl);
    setEditingExp({ ...editingExp, slides: currentSlides, image: currentSlides[0] });
  };

  const handleRemoveExpSlide = (index) => {
    const currentSlides = editingExp.slides ? [...editingExp.slides] : [];
    currentSlides.splice(index, 1);
    setEditingExp({ ...editingExp, slides: currentSlides, image: currentSlides[0] || '' });
  };

  // ================= EDUCATION ================= //
  const handleSaveEdu = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingEdu.id) {
        await api.updateEducation(editingEdu.id, editingEdu);
        showBanner('success', 'Education updated!');
      } else {
        await api.createEducation(editingEdu);
        showBanner('success', 'Education created!');
      }
      setEditingEdu(null);
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', 'Failed to save education');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEdu = async (id) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      await api.deleteEducation(id);
      showBanner('success', 'Education deleted');
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', 'Delete failed');
    }
  };

  // ================= ACHIEVEMENTS ================= //
  const handleSaveAch = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingAch.id) {
        await api.updateAchievement(editingAch.id, editingAch);
        showBanner('success', 'Achievement updated!');
      } else {
        await api.createAchievement(editingAch);
        showBanner('success', 'Achievement created!');
      }
      setEditingAch(null);
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', 'Failed to save achievement');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAch = async (id) => {
    if (!window.confirm('Delete this achievement?')) return;
    try {
      await api.deleteAchievement(id);
      showBanner('success', 'Achievement deleted');
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', 'Delete failed');
    }
  };

  // ================= CERTIFICATIONS ================= //
  const handleSaveCert = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCert.id) {
        await api.updateCertification(editingCert.id, editingCert);
        showBanner('success', 'Certification updated!');
      } else {
        await api.createCertification(editingCert);
        showBanner('success', 'Certification created!');
      }
      setEditingCert(null);
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', 'Failed to save certification');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      await api.deleteCertification(id);
      showBanner('success', 'Certification deleted');
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', 'Delete failed');
    }
  };

  // ================= PROFILE & HERO BADGES ================= //
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile(profileForm);
      showBanner('success', 'Profile and Hero badges updated!');
      await fetchAllAdminData();
    } catch (err) {
      showBanner('error', err.message || 'Profile update failed');
    } finally {
      setSaving(false);
    }
  };

  // ================= PASSWORD ================= //
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.changePassword(passwordForm);
      showBanner('success', 'Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      showBanner('error', err.message || 'Password update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <RefreshCw size={32} className={styles.spinner} />
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <LayoutDashboard size={22} />
            <span>Admin Control</span>
          </div>
        </div>

        <nav className={styles.navMenu}>
          <button
            className={`${styles.navItem} ${activeTab === 'projects' ? styles.activeNavItem : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FolderGit2 size={18} />
            <span>Projects ({portfolioData.projects?.length || 0})</span>
          </button>

          <button
            className={`${styles.navItem} ${activeTab === 'skills' ? styles.activeNavItem : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <Cpu size={18} />
            <span>Skills ({portfolioData.skills?.length || 0})</span>
          </button>

          <button
            className={`${styles.navItem} ${activeTab === 'experience' ? styles.activeNavItem : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            <Briefcase size={18} />
            <span>Experience ({portfolioData.experience?.length || 0})</span>
          </button>

          <button
            className={`${styles.navItem} ${activeTab === 'education' ? styles.activeNavItem : ''}`}
            onClick={() => setActiveTab('education')}
          >
            <GraduationCap size={18} />
            <span>Education ({portfolioData.education?.length || 0})</span>
          </button>

          <button
            className={`${styles.navItem} ${activeTab === 'achievements' ? styles.activeNavItem : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            <Trophy size={18} />
            <span>Achievements ({portfolioData.achievements?.length || 0})</span>
          </button>

          <button
            className={`${styles.navItem} ${activeTab === 'certifications' ? styles.activeNavItem : ''}`}
            onClick={() => setActiveTab('certifications')}
          >
            <Award size={18} />
            <span>Certifications ({portfolioData.certifications?.length || 0})</span>
          </button>

          <button
            className={`${styles.navItem} ${activeTab === 'profile' ? styles.activeNavItem : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>Profile & Badges</span>
          </button>

          <button
            className={`${styles.navItem} ${activeTab === 'messages' ? styles.activeNavItem : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <MessageSquare size={18} />
            <span>Messages ({messages.length})</span>
          </button>

          <button
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.activeNavItem : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Lock size={18} />
            <span>Settings</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={() => navigate('/')} className={styles.publicBtn}>
            <ExternalLink size={16} />
            <span>View Website</span>
          </button>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Banner Alert */}
        {banner.text && (
          <div className={`${styles.banner} ${banner.type === 'success' ? styles.bannerSuccess : styles.bannerError}`}>
            {banner.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{banner.text}</span>
          </div>
        )}

        {/* ================= TAB 1: PROJECTS ================= */}
        {activeTab === 'projects' && (
          <div className={styles.tabContainer}>
            <div className={styles.tabHeader}>
              <div>
                <h2>Projects Management</h2>
                <p>Manage all projects shown on your portfolio website.</p>
              </div>
              <button
                onClick={() =>
                  setEditingProject({
                    title: '',
                    shortDescription: '',
                    detailedDescription: '',
                    technologies: [],
                    category: 'AI & ML',
                    image: '',
                    slides: [],
                    githubUrl: '',
                    demoUrl: '',
                    featured: true,
                    published: true
                  })
                }
                className={styles.addBtn}
              >
                <Plus size={18} />
                <span>Add New Project</span>
              </button>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Tech Stack</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.projects?.map((proj, idx) => (
                    <tr key={proj.id}>
                      <td>
                        <div className={styles.reorderGroup}>
                          <button onClick={() => handleReorderProject(idx, -1)} disabled={idx === 0}>
                            <MoveUp size={14} />
                          </button>
                          <button onClick={() => handleReorderProject(idx, 1)} disabled={idx === portfolioData.projects.length - 1}>
                            <MoveDown size={14} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className={styles.thumbWrapper}>
                          {proj.image ? (
                            <img src={proj.image} alt={proj.title} className={styles.thumbImg} />
                          ) : (
                            <div className={styles.noThumb}>No Img</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <strong>{proj.title}</strong>
                        {proj.featured && <span className={styles.featuredBadge}>Featured</span>}
                      </td>
                      <td>
                        <span className={styles.categoryPill}>{proj.category}</span>
                      </td>
                      <td>
                        <div className={styles.techCell}>
                          {proj.technologies?.slice(0, 3).join(', ')}
                          {proj.technologies?.length > 3 && ` +${proj.technologies.length - 3}`}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleTogglePublishProject(proj)}
                          className={`${styles.statusBtn} ${proj.published !== false ? styles.published : styles.draft}`}
                        >
                          {proj.published !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                          <span>{proj.published !== false ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>
                      <td>
                        <div className={styles.actionRow}>
                          <button onClick={() => handleStartEditProject(proj)} className={styles.editBtn}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteProject(proj.id)} className={styles.deleteBtn}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Project Edit/Add Modal */}
            {editingProject && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalCard}>
                  <h3>{editingProject.id ? 'Edit Project' : 'Add New Project'}</h3>
                  <form onSubmit={handleSaveProject} className={styles.modalForm}>
                    <div className={styles.formRow}>
                      <div className={styles.fieldGroup}>
                        <label>Title *</label>
                        <input
                          type="text"
                          value={editingProject.title}
                          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                          required
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label>Category *</label>
                        <select
                          value={editingProject.category}
                          onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                          className={styles.input}
                        >
                          <option value="AI & ML">AI & ML</option>
                          <option value="Full Stack Web">Full Stack Web</option>
                          <option value="NLP & RAG">NLP & RAG</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Short Description *</label>
                      <input
                        type="text"
                        value={editingProject.shortDescription}
                        onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                        required
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Detailed Overview & Architecture</label>
                      <textarea
                        rows="6"
                        value={editingProject.detailedDescription}
                        onChange={(e) => setEditingProject({ ...editingProject, detailedDescription: e.target.value })}
                        className={styles.textarea}
                        placeholder="Paste your architecture notes, pipeline steps, or paragraph line-by-line. Line breaks and indentation will be preserved."
                        style={{ minHeight: '130px', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}
                      ></textarea>
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>
                        💡 Line breaks and bullet formatting are preserved and rendered line-by-line on your portfolio.
                      </small>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Technologies (comma separated)</label>
                      <input
                        type="text"
                        value={Array.isArray(editingProject.technologies) ? editingProject.technologies.join(', ') : ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            technologies: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean)
                          })
                        }
                        placeholder="Python, TensorFlow, React JS"
                        className={styles.input}
                      />
                    </div>

                    {/* Multi-Image Gallery Manager */}
                    <div className={styles.fieldGroup}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label style={{ margin: 0, fontWeight: '700' }}>
                          Project Images & Screenshots ({editingProject.slides?.length || 0})
                        </label>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Add as many images as you wish
                        </span>
                      </div>

                      {/* Upload and URL input controls */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <label className={styles.uploadBtn} style={{ cursor: uploadingImage ? 'wait' : 'pointer' }}>
                            <Upload size={16} />
                            <span>{uploadingImage ? 'Uploading Image(s)...' : 'Upload Images (Select Multiple)'}</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              disabled={uploadingImage}
                              onChange={handleMultipleProjectImageUpload}
                              style={{ display: 'none' }}
                            />
                          </label>

                          <div style={{ display: 'flex', flex: '1', minWidth: '220px', gap: '6px' }}>
                            <input
                              type="text"
                              value={newProjectSlideUrl}
                              onChange={(e) => setNewProjectSlideUrl(e.target.value)}
                              placeholder="Or paste image URL here..."
                              className={styles.input}
                              style={{ flex: 1 }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddProjectSlideUrl();
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={handleAddProjectSlideUrl}
                              className={styles.uploadBtn}
                              style={{ padding: '0.75rem 1rem' }}
                            >
                              <Plus size={16} />
                              <span>Add URL</span>
                            </button>
                          </div>
                        </div>

                        <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          💡 The first image serves as the main Cover. Click &quot;Make Cover&quot; on any image to set it as primary. All images will be interactive in the website carousel &amp; zoom lightbox.
                        </small>
                      </div>

                      {/* Thumbnail Gallery Grid */}
                      {Array.isArray(editingProject.slides) && editingProject.slides.length > 0 ? (
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                            gap: '12px',
                            marginTop: '12px',
                            padding: '10px',
                            backgroundColor: 'var(--bg-card)',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            maxHeight: '260px',
                            overflowY: 'auto'
                          }}
                        >
                          {editingProject.slides.map((slideUrl, sIdx) => (
                            <div
                              key={sIdx}
                              style={{
                                position: 'relative',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: sIdx === 0 ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-secondary)',
                                display: 'flex',
                                flexDirection: 'column'
                              }}
                            >
                              <div style={{ position: 'relative', height: '80px', width: '100%' }}>
                                <img
                                  src={slideUrl}
                                  alt={`Slide ${sIdx + 1}`}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                {sIdx === 0 ? (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      top: '4px',
                                      left: '4px',
                                      fontSize: '0.65rem',
                                      fontWeight: '700',
                                      backgroundColor: 'var(--accent-primary)',
                                      color: '#ffffff',
                                      padding: '2px 6px',
                                      borderRadius: '4px'
                                    }}
                                  >
                                    Cover
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      top: '4px',
                                      left: '4px',
                                      fontSize: '0.65rem',
                                      fontWeight: '600',
                                      backgroundColor: 'rgba(0,0,0,0.65)',
                                      color: '#ffffff',
                                      padding: '2px 5px',
                                      borderRadius: '4px'
                                    }}
                                  >
                                    #{sIdx + 1}
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleRemoveProjectSlide(sIdx)}
                                  title="Delete screenshot"
                                  style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(239, 68, 68, 0.85)',
                                    color: '#ffffff',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    padding: 0
                                  }}
                                >
                                  <X size={12} />
                                </button>
                              </div>

                              {sIdx !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverProjectSlide(sIdx)}
                                  style={{
                                    fontSize: '0.7rem',
                                    padding: '4px 6px',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: 'var(--accent-primary)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    borderTop: '1px solid var(--border-color)'
                                  }}
                                >
                                  Make Cover
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          style={{
                            padding: '16px',
                            textAlign: 'center',
                            borderRadius: '10px',
                            border: '1px dashed var(--border-color)',
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                            marginTop: '8px'
                          }}
                        >
                          No screenshots added yet. Upload files or enter image URLs above.
                        </div>
                      )}
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.fieldGroup}>
                        <label>GitHub Repository URL</label>
                        <input
                          type="url"
                          value={editingProject.githubUrl || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label>Live Demo URL</label>
                        <input
                          type="url"
                          value={editingProject.demoUrl || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.checkboxRow}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={editingProject.featured ?? true}
                          onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                        />
                        <span>Featured Project</span>
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={editingProject.published ?? true}
                          onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                        />
                        <span>Published on Website</span>
                      </label>
                    </div>

                    <div className={styles.modalActions}>
                      <button type="button" onClick={() => setEditingProject(null)} className={styles.cancelBtn}>
                        Cancel
                      </button>
                      <button type="submit" disabled={saving} className={styles.saveBtn}>
                        <Save size={16} />
                        <span>{saving ? 'Saving...' : 'Save Project'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: SKILLS ================= */}
        {activeTab === 'skills' && (
          <div className={styles.tabContainer}>
            <div className={styles.tabHeader}>
              <div>
                <h2>Skills Management</h2>
                <p>Manage skill categories and technical skills.</p>
              </div>
            </div>

            {/* Add New Category Card */}
            <form onSubmit={handleAddSkillCategory} className={styles.formCard} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Add New Skill Category</h3>
              <div className={styles.uploadRow}>
                <input
                  type="text"
                  placeholder="e.g. Cloud & DevOps, Machine Learning"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className={styles.input}
                  required
                />
                <button type="submit" className={styles.addBtn}>
                  <Plus size={16} />
                  <span>Add Category</span>
                </button>
              </div>
            </form>

            {/* Category Cards with Skills */}
            <div className="row g-4">
              {portfolioData.skills?.map((cat, catIdx) => (
                <div key={catIdx} className="col-lg-6">
                  <div className={styles.formCard} style={{ height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{cat.category}</h3>
                      <button
                        onClick={() => handleDeleteSkillCategory(catIdx)}
                        className={styles.deleteBtn}
                        title="Delete entire category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Skill Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      {cat.items?.map((item, itemIdx) => (
                        <span
                          key={itemIdx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.4rem 0.8rem',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <span>{item.name}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteSkillItem(catIdx, itemIdx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', padding: 0, cursor: 'pointer' }}
                            title="Delete skill"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                      {(!cat.items || cat.items.length === 0) && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>No skills added yet.</p>
                      )}
                    </div>

                    {/* Add Skill to this Category Form */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <input
                        type="text"
                        placeholder="Add skill name (e.g. Docker, PyTorch)"
                        value={newSkillInput[catIdx] || ''}
                        onChange={(e) => setNewSkillInput({ ...newSkillInput, [catIdx]: e.target.value })}
                        className={styles.input}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkillToCategory(catIdx);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSkillToCategory(catIdx)}
                        className={styles.addBtn}
                        style={{ padding: '0.6rem 1rem' }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: EXPERIENCE ================= */}
        {activeTab === 'experience' && (
          <div className={styles.tabContainer}>
            <div className={styles.tabHeader}>
              <div>
                <h2>Work Experience Management</h2>
                <p>Manage work experience entries and work screenshot carousels.</p>
              </div>
              <button
                onClick={() =>
                  setEditingExp({
                    role: '',
                    company: '',
                    location: 'Remote',
                    period: '2024 - Present',
                    description: '',
                    technologies: [],
                    slides: [],
                    image: ''
                  })
                }
                className={styles.addBtn}
              >
                <Plus size={18} />
                <span>Add Experience</span>
              </button>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Company</th>
                    <th>Period</th>
                    <th>Screenshots / Carousel</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.experience?.map((exp) => (
                    <tr key={exp.id}>
                      <td>
                        <strong>{exp.role}</strong>
                      </td>
                      <td>{exp.company}</td>
                      <td>{exp.period}</td>
                      <td>
                        <span className={styles.categoryPill}>
                          {exp.slides?.length || (exp.image ? 1 : 0)} slide(s)
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionRow}>
                          <button onClick={() => setEditingExp(exp)} className={styles.editBtn}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteExp(exp.id)} className={styles.deleteBtn}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!portfolioData.experience || portfolioData.experience.length === 0) && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No experience records found. Click &apos;Add Experience&apos; to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Experience Edit Modal with Multi-Image Carousel Upload */}
            {editingExp && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalCard}>
                  <h3>{editingExp.id ? 'Edit Experience' : 'Add Experience'}</h3>
                  <form onSubmit={handleSaveExp} className={styles.modalForm}>
                    <div className={styles.formRow}>
                      <div className={styles.fieldGroup}>
                        <label>Role / Position *</label>
                        <input
                          type="text"
                          value={editingExp.role}
                          onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                          required
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label>Company / Startup *</label>
                        <input
                          type="text"
                          value={editingExp.company}
                          onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                          required
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.fieldGroup}>
                        <label>Period *</label>
                        <input
                          type="text"
                          value={editingExp.period}
                          onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                          placeholder="e.g. 2024 - Present"
                          required
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label>Location</label>
                        <input
                          type="text"
                          value={editingExp.location || ''}
                          onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                          placeholder="e.g. Remote, On-site"
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Job Description & Responsibilities *</label>
                      <textarea
                        rows="3"
                        value={editingExp.description}
                        onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                        required
                        className={styles.textarea}
                      ></textarea>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Technologies Used (comma separated)</label>
                      <input
                        type="text"
                        value={Array.isArray(editingExp.technologies) ? editingExp.technologies.join(', ') : ''}
                        onChange={(e) =>
                          setEditingExp({
                            ...editingExp,
                            technologies: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean)
                          })
                        }
                        placeholder="React.js, Node.js, MongoDB, Firebase"
                        className={styles.input}
                      />
                    </div>

                    {/* Multi-Image Carousel Screenshots for Experience Card */}
                    <div className={styles.fieldGroup}>
                      <label>Work Screenshot Carousel (upload multiple slides)</label>
                      <div className={styles.uploadRow}>
                        <label className={styles.uploadBtn} style={{ cursor: 'pointer' }}>
                          <Upload size={16} />
                          <span>{uploadingImage ? 'Uploading...' : 'Upload Work Screenshot'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (url) => handleAddExpSlide(url))}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>

                      {/* Display Uploaded Slide Previews with Remove Buttons */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem' }}>
                        {editingExp.slides?.map((slideUrl, sIdx) => (
                          <div
                            key={sIdx}
                            style={{
                              position: 'relative',
                              width: '100px',
                              height: '70px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              border: '1px solid var(--border-color)'
                            }}
                          >
                            <img src={slideUrl} alt={`Slide ${sIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => handleRemoveExpSlide(sIdx)}
                              style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                background: 'rgba(0,0,0,0.7)',
                                border: 'none',
                                color: '#ef4444',
                                borderRadius: '50%',
                                padding: '2px',
                                cursor: 'pointer'
                              }}
                              title="Remove slide"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.modalActions}>
                      <button type="button" onClick={() => setEditingExp(null)} className={styles.cancelBtn}>
                        Cancel
                      </button>
                      <button type="submit" disabled={saving} className={styles.saveBtn}>
                        <Save size={16} />
                        <span>{saving ? 'Saving...' : 'Save Experience'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: EDUCATION ================= */}
        {activeTab === 'education' && (
          <div className={styles.tabContainer}>
            <div className={styles.tabHeader}>
              <div>
                <h2>Education Management</h2>
                <p>Manage academic degrees, institutions, and scores.</p>
              </div>
              <button
                onClick={() =>
                  setEditingEdu({
                    degree: '',
                    institution: '',
                    period: '',
                    score: '',
                    details: ''
                  })
                }
                className={styles.addBtn}
              >
                <Plus size={18} />
                <span>Add Education</span>
              </button>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Degree</th>
                    <th>Institution</th>
                    <th>Period</th>
                    <th>Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.education?.map((edu) => (
                    <tr key={edu.id}>
                      <td>
                        <strong>{edu.degree}</strong>
                      </td>
                      <td>{edu.institution}</td>
                      <td>{edu.period}</td>
                      <td>
                        <span className={styles.categoryPill}>{edu.score}</span>
                      </td>
                      <td>
                        <div className={styles.actionRow}>
                          <button onClick={() => setEditingEdu(edu)} className={styles.editBtn}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteEdu(edu.id)} className={styles.deleteBtn}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Education Edit Modal */}
            {editingEdu && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalCard}>
                  <h3>{editingEdu.id ? 'Edit Education' : 'Add Education'}</h3>
                  <form onSubmit={handleSaveEdu} className={styles.modalForm}>
                    <div className={styles.fieldGroup}>
                      <label>Degree / Qualification *</label>
                      <input
                        type="text"
                        value={editingEdu.degree}
                        onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                        required
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Institution / College / School *</label>
                      <input
                        type="text"
                        value={editingEdu.institution}
                        onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                        required
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.fieldGroup}>
                        <label>Period *</label>
                        <input
                          type="text"
                          value={editingEdu.period}
                          onChange={(e) => setEditingEdu({ ...editingEdu, period: e.target.value })}
                          placeholder="e.g. 2023 - 2027"
                          required
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label>Grade / Score</label>
                        <input
                          type="text"
                          value={editingEdu.score || ''}
                          onChange={(e) => setEditingEdu({ ...editingEdu, score: e.target.value })}
                          placeholder="e.g. CGPA: 8.10 or 88%"
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Coursework / Academic Details</label>
                      <textarea
                        rows="3"
                        value={editingEdu.details || ''}
                        onChange={(e) => setEditingEdu({ ...editingEdu, details: e.target.value })}
                        className={styles.textarea}
                      ></textarea>
                    </div>

                    <div className={styles.modalActions}>
                      <button type="button" onClick={() => setEditingEdu(null)} className={styles.cancelBtn}>
                        Cancel
                      </button>
                      <button type="submit" disabled={saving} className={styles.saveBtn}>
                        <Save size={16} />
                        <span>{saving ? 'Saving...' : 'Save Education'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: ACHIEVEMENTS ================= */}
        {activeTab === 'achievements' && (
          <div className={styles.tabContainer}>
            <div className={styles.tabHeader}>
              <div>
                <h2>Achievements Management</h2>
                <p>Manage hackathons, symposiums, and competition prizes.</p>
              </div>
              <button
                onClick={() =>
                  setEditingAch({
                    title: '',
                    organization: '',
                    description: '',
                    year: '2025',
                    badge: '1st Prize'
                  })
                }
                className={styles.addBtn}
              >
                <Plus size={18} />
                <span>Add Achievement</span>
              </button>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Organization / Event</th>
                    <th>Badge</th>
                    <th>Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.achievements?.map((ach) => (
                    <tr key={ach.id}>
                      <td>
                        <strong>{ach.title}</strong>
                      </td>
                      <td>{ach.organization}</td>
                      <td>
                        <span className={styles.featuredBadge}>{ach.badge}</span>
                      </td>
                      <td>{ach.year}</td>
                      <td>
                        <div className={styles.actionRow}>
                          <button onClick={() => setEditingAch(ach)} className={styles.editBtn}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteAch(ach.id)} className={styles.deleteBtn}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Achievement Edit Modal */}
            {editingAch && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalCard}>
                  <h3>{editingAch.id ? 'Edit Achievement' : 'Add Achievement'}</h3>
                  <form onSubmit={handleSaveAch} className={styles.modalForm}>
                    <div className={styles.fieldGroup}>
                      <label>Achievement Title *</label>
                      <input
                        type="text"
                        value={editingAch.title}
                        onChange={(e) => setEditingAch({ ...editingAch, title: e.target.value })}
                        required
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Organization / Event *</label>
                      <input
                        type="text"
                        value={editingAch.organization}
                        onChange={(e) => setEditingAch({ ...editingAch, organization: e.target.value })}
                        required
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.fieldGroup}>
                        <label>Badge / Award Level</label>
                        <input
                          type="text"
                          value={editingAch.badge || ''}
                          onChange={(e) => setEditingAch({ ...editingAch, badge: e.target.value })}
                          placeholder="e.g. 1st Prize, Hackathon Award"
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label>Year</label>
                        <input
                          type="text"
                          value={editingAch.year || ''}
                          onChange={(e) => setEditingAch({ ...editingAch, year: e.target.value })}
                          placeholder="e.g. 2025"
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Description</label>
                      <textarea
                        rows="3"
                        value={editingAch.description || ''}
                        onChange={(e) => setEditingAch({ ...editingAch, description: e.target.value })}
                        className={styles.textarea}
                      ></textarea>
                    </div>

                    <div className={styles.modalActions}>
                      <button type="button" onClick={() => setEditingAch(null)} className={styles.cancelBtn}>
                        Cancel
                      </button>
                      <button type="submit" disabled={saving} className={styles.saveBtn}>
                        <Save size={16} />
                        <span>{saving ? 'Saving...' : 'Save Achievement'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 6: CERTIFICATIONS ================= */}
        {activeTab === 'certifications' && (
          <div className={styles.tabContainer}>
            <div className={styles.tabHeader}>
              <div>
                <h2>Certifications Management</h2>
                <p>Manage industry credentials and certifications.</p>
              </div>
              <button
                onClick={() =>
                  setEditingCert({
                    title: '',
                    issuer: '',
                    date: '2024',
                    badge: 'Certified',
                    link: ''
                  })
                }
                className={styles.addBtn}
              >
                <Plus size={18} />
                <span>Add Certification</span>
              </button>
            </div>

            <div className={styles.tableCard}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Issuer</th>
                    <th>Date</th>
                    <th>Badge</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.certifications?.map((cert) => (
                    <tr key={cert.id}>
                      <td>
                        <strong>{cert.title}</strong>
                      </td>
                      <td>{cert.issuer}</td>
                      <td>{cert.date}</td>
                      <td>
                        <span className={styles.categoryPill}>{cert.badge}</span>
                      </td>
                      <td>
                        <div className={styles.actionRow}>
                          <button onClick={() => setEditingCert(cert)} className={styles.editBtn}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteCert(cert.id)} className={styles.deleteBtn}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Certification Edit Modal */}
            {editingCert && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalCard}>
                  <h3>{editingCert.id ? 'Edit Certification' : 'Add Certification'}</h3>
                  <form onSubmit={handleSaveCert} className={styles.modalForm}>
                    <div className={styles.fieldGroup}>
                      <label>Certification Title *</label>
                      <input
                        type="text"
                        value={editingCert.title}
                        onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                        required
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Issuer / Organization *</label>
                      <input
                        type="text"
                        value={editingCert.issuer}
                        onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                        required
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.fieldGroup}>
                        <label>Issued Date</label>
                        <input
                          type="text"
                          value={editingCert.date || ''}
                          onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                          placeholder="e.g. 2024"
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label>Badge</label>
                        <input
                          type="text"
                          value={editingCert.badge || ''}
                          onChange={(e) => setEditingCert({ ...editingCert, badge: e.target.value })}
                          placeholder="e.g. Verified, Certified"
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.modalActions}>
                      <button type="button" onClick={() => setEditingCert(null)} className={styles.cancelBtn}>
                        Cancel
                      </button>
                      <button type="submit" disabled={saving} className={styles.saveBtn}>
                        <Save size={16} />
                        <span>{saving ? 'Saving...' : 'Save Certification'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 7: PROFILE & HERO BADGES ================= */}
        {activeTab === 'profile' && (
          <div className={styles.tabContainer}>
            <div className={styles.tabHeader}>
              <div>
                <h2>Profile, Bio & Hero Badges</h2>
                <p>Customize your personal introduction, contact links, and the 3 floating Hero badges.</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className={styles.formCard}>
              <h3 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                Hero Header & Bio
              </h3>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Title / Subtitle</label>
                  <input
                    type="text"
                    value={profileForm.title || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label>Status Banner Text (Hero Pill)</label>
                <input
                  type="text"
                  value={profileForm.statusText || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, statusText: e.target.value })}
                  placeholder="e.g. Open for Internships & AI / Full-Stack Opportunities"
                  className={styles.input}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Profession Summary</label>
                <textarea
                  rows="3"
                  value={profileForm.summary || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
                  className={styles.textarea}
                ></textarea>
              </div>

              {/* FLOATING HERO BADGES CUSTOMIZER */}
              <h3 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: '1.5rem 0 1rem 0' }}>
                Hero Floating Achievement Badges
              </h3>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label>Badge 1 Title (Top-Right)</label>
                  <input
                    type="text"
                    value={profileForm.badge1Title || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, badge1Title: e.target.value })}
                    placeholder="e.g. 3+ AI Projects"
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Badge 1 Subtitle</label>
                  <input
                    type="text"
                    value={profileForm.badge1Sub || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, badge1Sub: e.target.value })}
                    placeholder="e.g. CNN, RAG, MathBot"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label>Badge 2 Title (Bottom-Left)</label>
                  <input
                    type="text"
                    value={profileForm.badge2Title || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, badge2Title: e.target.value })}
                    placeholder="e.g. 4 Awards Won"
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Badge 2 Subtitle</label>
                  <input
                    type="text"
                    value={profileForm.badge2Sub || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, badge2Sub: e.target.value })}
                    placeholder="e.g. PSG, KEC, BYTS"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label>Badge 3 Title (Bottom-Right)</label>
                  <input
                    type="text"
                    value={profileForm.badge3Title || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, badge3Title: e.target.value })}
                    placeholder="e.g. 8.10 CGPA"
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Badge 3 Subtitle</label>
                  <input
                    type="text"
                    value={profileForm.badge3Sub || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, badge3Sub: e.target.value })}
                    placeholder="e.g. Kongu Engg College"
                    className={styles.input}
                  />
                </div>
              </div>

              {/* CONTACT & SOCIAL DETAILS */}
              <h3 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: '1.5rem 0 1rem 0' }}>
                Contact & Social Links
              </h3>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileForm.email || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label>Location</label>
                <input
                  type="text"
                  value={profileForm.location || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  placeholder="e.g. Namakkal / Erode, Tamil Nadu, India"
                  className={styles.input}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label>GitHub URL</label>
                  <input
                    type="url"
                    value={profileForm.github || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>LinkedIn URL</label>
                  <input
                    type="url"
                    value={profileForm.linkedin || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* AVATAR & RESUME UPLOADS */}
              <h3 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: '1.5rem 0 1rem 0' }}>
                Profile Photo & Resume PDF
              </h3>

              <div className={styles.fieldGroup}>
                <label>Profile Avatar Image</label>
                <div className={styles.uploadRow}>
                  <input
                    type="text"
                    value={profileForm.profileImage || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, profileImage: e.target.value })}
                    placeholder="Image URL or upload"
                    className={styles.input}
                  />
                  <label className={styles.uploadBtn}>
                    <Upload size={16} />
                    <span>Upload Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (url) => setProfileForm({ ...profileForm, profileImage: url }))}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                {profileForm.profileImage && (
                  <div style={{ marginTop: '0.5rem', width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden' }}>
                    <img src={profileForm.profileImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label>Resume File URL / Upload PDF</label>
                <div className={styles.uploadRow}>
                  <input
                    type="text"
                    value={profileForm.resumeUrl || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
                    className={styles.input}
                  />
                  <label className={styles.uploadBtn}>
                    <Upload size={16} />
                    <span>Upload PDF</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleImageUpload(e, (url) => setProfileForm({ ...profileForm, resumeUrl: url }))}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* EMAILJS CONFIGURATION */}
              <h3 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: '1.5rem 0 1rem 0' }}>
                EmailJS Contact Integration
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Messages submitted via the contact form are dispatched directly to your email using EmailJS and saved locally in the Messages tab.
              </p>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label>EmailJS Service ID</label>
                  <input
                    type="text"
                    value={profileForm.emailjsServiceId || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, emailjsServiceId: e.target.value })}
                    placeholder="e.g. service_htjutg8"
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>EmailJS Template ID</label>
                  <input
                    type="text"
                    value={profileForm.emailjsTemplateId || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, emailjsTemplateId: e.target.value })}
                    placeholder="e.g. template_9755cdk"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label>EmailJS Public Key</label>
                <input
                  type="text"
                  value={profileForm.emailjsPublicKey || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, emailjsPublicKey: e.target.value })}
                  placeholder="e.g. O-98xkd9yq2ghtwlC"
                  className={styles.input}
                />
              </div>

              <button type="submit" disabled={saving} className={styles.saveBtn} style={{ marginTop: '1.5rem', alignSelf: 'flex-start' }}>
                <Save size={18} />
                <span>{saving ? 'Saving...' : 'Save Profile & Settings'}</span>
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 8: MESSAGES ================= */}
        {activeTab === 'messages' && (
          <div className={styles.tabContainer}>
            <div className={styles.tabHeader}>
              <div>
                <h2>Visitor Messages</h2>
                <p>Messages submitted by recruiters and visitors through the contact form.</p>
              </div>
            </div>

            <div className={styles.messagesList}>
              {messages.length === 0 ? (
                <div className={styles.emptyState}>
                  <MessageSquare size={36} />
                  <p>No messages received yet.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`${styles.messageCard} glass-card`}>
                    <div className={styles.msgTop}>
                      <div>
                        <strong>{msg.name}</strong> ({msg.email})
                        <span className={styles.msgDate}>{new Date(msg.date).toLocaleString()}</span>
                      </div>
                      <button
                        onClick={async () => {
                          if (window.confirm('Delete message?')) {
                            await api.deleteMessage(msg.id);
                            setMessages(messages.filter((m) => m.id !== msg.id));
                          }
                        }}
                        className={styles.deleteBtn}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className={styles.msgSubject}>Subject: {msg.subject}</p>
                    <p className={styles.msgBody}>{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 9: SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className={styles.tabContainer}>
            <div className={styles.tabHeader}>
              <div>
                <h2>Admin Settings</h2>
                <p>Change your secure login password.</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className={styles.formCard} style={{ maxWidth: '500px' }}>
              <div className={styles.fieldGroup}>
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.fieldGroup} style={{ marginTop: '1rem' }}>
                <label>New Password (min 6 characters)</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  className={styles.input}
                />
              </div>

              <button type="submit" disabled={saving} className={styles.saveBtn} style={{ marginTop: '1.5rem', alignSelf: 'flex-start' }}>
                <Lock size={18} />
                <span>{saving ? 'Updating...' : 'Update Password'}</span>
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
