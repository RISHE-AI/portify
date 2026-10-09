import { useState } from 'react';
import { ExternalLink, Sparkles, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { GithubIcon } from './Icons';
import plantImg from '../assets/c19.png';
import ragImg from '../assets/travel.png';
import mathImg from '../assets/portfolio.png';

function Projects({ projects = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [cardImageIndices, setCardImageIndices] = useState({});

  const categories = ['All', 'AI & ML', 'Full Stack Web'];

  const defaultProjects = [
    {
      id: 'proj-1',
      title: 'Plant Disease Prediction',
      shortDescription: 'CNN-based plant disease prediction system classifying leaf images for early disease detection.',
      detailedDescription: 'Engineered an end-to-end computer vision pipeline using Convolutional Neural Networks (CNN) and MobileNet-SSD architecture. Real-time image pre-processing with OpenCV & NumPy, delivering high-accuracy crop disease diagnosis.',
      slides: [plantImg, ragImg, mathImg],
      technologies: ['Python', 'MobileNet-SSD', 'TensorFlow/Keras', 'OpenCV', 'NumPy', 'React.js'],
      category: 'AI & ML',
      githubUrl: 'https://github.com/RISHE-AI',
      demoUrl: '',
      featured: true,
      published: true
    },
    {
      id: 'proj-2',
      title: 'RAG-Powered Document Chatbot',
      shortDescription: 'Document chatbot enabling users to upload PDFs and receive context-aware answers based on content.',
      detailedDescription: 'Developed a Retrieval-Augmented Generation (RAG) document assistant. Integrates FAISS vector indices and Sentence Transformers for semantic chunking, enabling instant context-aware natural language Q&A over complex PDF files.',
      slides: [ragImg, plantImg, mathImg],
      technologies: ['Python', 'LLM', 'RAG', 'FAISS', 'Sentence Transformers', 'React JS'],
      category: 'AI & ML',
      githubUrl: 'https://github.com/RISHE-AI',
      demoUrl: '',
      featured: true,
      published: true
    },
    {
      id: 'proj-3',
      title: 'AI Study Buddy (Math Bot)',
      shortDescription: 'AI-powered math assistant solving problems from text, images, camera input, and handwritten equations.',
      detailedDescription: 'Built MathBot, an AI tutoring assistant capable of processing mathematical input from camera streams or uploads. Employs OCR and Computer Vision to segment handwritten equations and generate step-by-step solutions.',
      slides: [mathImg, plantImg, ragImg],
      technologies: ['Python', 'OCR', 'Computer Vision', 'LLM', 'OpenCV', 'React JS', 'MongoDB'],
      category: 'AI & ML',
      githubUrl: 'https://github.com/RISHE-AI',
      demoUrl: '',
      featured: true,
      published: true
    }
  ];

  const displayList = (projects.length > 0 ? projects : defaultProjects).filter((p) => p.published !== false);

  const filteredProjects = displayList.filter((proj) => {
    if (activeCategory === 'All') return true;
    return proj.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  const getProjectSlides = (proj) => {
    if (proj.slides && proj.slides.length > 0) return proj.slides;
    if (proj.image) return [proj.image, plantImg, ragImg];
    if (proj.id === 'proj-1') return [plantImg, ragImg, mathImg];
    if (proj.id === 'proj-2') return [ragImg, plantImg, mathImg];
    if (proj.id === 'proj-3') return [mathImg, plantImg, ragImg];
    return [plantImg];
  };

  const handleCardNextImage = (e, projId, slideLength) => {
    e.stopPropagation();
    setCardImageIndices((prev) => ({
      ...prev,
      [projId]: ((prev[projId] || 0) + 1) % slideLength
    }));
  };

  const handleCardPrevImage = (e, projId, slideLength) => {
    e.stopPropagation();
    setCardImageIndices((prev) => ({
      ...prev,
      [projId]: ((prev[projId] || 0) - 1 + slideLength) % slideLength
    }));
  };

  return (
    <section id="projects" className="py-5">
      <div className="container">
        <div className="section-header animate-fade-in">
          <span className="section-tag">Featured Work</span>
          <h2 className="section-title">Projects & AI Innovations</h2>
          <p className="section-subtitle">
            Real-world applications spanning Machine Learning, Computer Vision, RAG Systems, and Full-Stack Engineering.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-5 animate-fade-in">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn rounded-pill px-4 py-2 border ${
                activeCategory === cat ? 'btn-custom-primary' : 'btn-custom-secondary'
              }`}
              style={{ fontSize: '0.88rem' }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3-Column / 2-Column Responsive Side-by-Side Cards */}
        <div className="row g-4">
          {filteredProjects.map((proj, idx) => {
            const slides = getProjectSlides(proj);
            const activeSlideIdx = cardImageIndices[proj.id] || 0;

            return (
              <div key={proj.id} className="col-lg-4 col-md-6 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="card glass-card h-100 border-0 overflow-hidden d-flex flex-column">
                  {/* Card Image Banner with Mini Slide Controls */}
                  <div className="position-relative overflow-hidden" style={{ height: '210px', backgroundColor: 'var(--bg-secondary)' }}>
                    <img
                      src={slides[activeSlideIdx]}
                      alt={`${proj.title} slide ${activeSlideIdx + 1}`}
                      className="w-100 h-100 object-fit-cover"
                    />

                    {/* Category & Featured Badge */}
                    <span
                      className="position-absolute rounded-pill px-2 py-1 small fw-bold text-uppercase"
                      style={{
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(6px)',
                        color: '#ffffff',
                        fontSize: '0.72rem'
                      }}
                    >
                      {proj.category || 'AI & ML'}
                    </span>

                    {proj.featured && (
                      <span
                        className="position-absolute rounded-pill px-2 py-1 small fw-bold d-inline-flex align-items-center gap-1"
                        style={{
                          top: '12px',
                          right: '12px',
                          backgroundColor: 'var(--accent-primary)',
                          color: '#ffffff',
                          fontSize: '0.72rem'
                        }}
                      >
                        <Sparkles size={11} /> Featured
                      </span>
                    )}

                    {/* Per-Card Slide Buttons */}
                    {slides.length > 1 && (
                      <>
                        <button
                          onClick={(e) => handleCardPrevImage(e, proj.id, slides.length)}
                          className="btn position-absolute top-50 start-0 translate-middle-y d-flex align-items-center justify-content-center p-0 rounded-circle ms-2"
                          style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: 'rgba(0, 0, 0, 0.65)',
                            color: '#ffffff'
                          }}
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        <button
                          onClick={(e) => handleCardNextImage(e, proj.id, slides.length)}
                          className="btn position-absolute top-50 end-0 translate-middle-y d-flex align-items-center justify-content-center p-0 rounded-circle me-2"
                          style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: 'rgba(0, 0, 0, 0.65)',
                            color: '#ffffff'
                          }}
                          aria-label="Next image"
                        >
                          <ChevronRight size={16} />
                        </button>

                        <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-1 mb-2">
                          {slides.map((_, sIdx) => (
                            <span
                              key={sIdx}
                              className="rounded-circle"
                              style={{
                                width: sIdx === activeSlideIdx ? '16px' : '6px',
                                height: '6px',
                                borderRadius: sIdx === activeSlideIdx ? '4px' : '50%',
                                backgroundColor: sIdx === activeSlideIdx ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                                transition: 'all 0.2s ease'
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-4 d-flex flex-column flex-grow-1">
                    <h3 className="h5 fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {proj.title}
                    </h3>

                    <p className="small mb-3 flex-grow-1" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {proj.shortDescription}
                    </p>

                    {/* Tech Badges */}
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {proj.technologies?.slice(0, 5).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="badge px-2 py-1 rounded"
                          style={{
                            backgroundColor: 'var(--accent-soft)',
                            color: 'var(--accent-primary)',
                            fontSize: '0.74rem',
                            fontWeight: '500'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto" style={{ borderColor: 'var(--border-color)' }}>
                      <button
                        onClick={() => setSelectedProject(proj)}
                        className="btn btn-link text-decoration-none p-0 d-inline-flex align-items-center gap-1 fw-semibold small"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        <span>Details</span>
                        <ChevronRight size={15} />
                      </button>

                      <div className="d-flex align-items-center gap-2">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn d-flex align-items-center justify-content-center p-0 rounded-circle border"
                            style={{
                              width: '34px',
                              height: '34px',
                              backgroundColor: 'var(--bg-secondary)',
                              borderColor: 'var(--border-color)',
                              color: 'var(--text-secondary)'
                            }}
                            title="GitHub Source"
                          >
                            <GithubIcon size={16} />
                          </a>
                        )}

                        {proj.demoUrl && (
                          <a
                            href={proj.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn d-flex align-items-center justify-content-center p-0 rounded-circle border"
                            style={{
                              width: '34px',
                              height: '34px',
                              backgroundColor: 'var(--bg-secondary)',
                              borderColor: 'var(--border-color)',
                              color: 'var(--text-secondary)'
                            }}
                            title="Live Demo"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000
          }}
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="card glass-card p-4 rounded-4 position-relative border"
            style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm position-absolute top-0 end-0 m-3 rounded-circle p-1"
              style={{ color: 'var(--text-primary)' }}
              onClick={() => setSelectedProject(null)}
            >
              <X size={20} />
            </button>

            <span className="badge rounded-pill mb-2 align-self-start" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
              {selectedProject.category || 'AI & ML'}
            </span>

            <h2 className="h4 fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              {selectedProject.title}
            </h2>

            <div className="rounded-3 overflow-hidden mb-3" style={{ height: '240px' }}>
              <img
                src={getProjectSlides(selectedProject)[cardImageIndices[selectedProject.id] || 0]}
                alt={selectedProject.title}
                className="w-100 h-100 object-fit-cover"
              />
            </div>

            <div className="mb-3">
              <h4 className="h6 fw-bold mb-2" style={{ color: 'var(--accent-primary)' }}>
                Overview & Architecture
              </h4>
              <p className="small" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {selectedProject.detailedDescription || selectedProject.shortDescription}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="h6 fw-bold mb-2" style={{ color: 'var(--accent-primary)' }}>
                Technologies Used
              </h4>
              <div className="d-flex flex-wrap gap-2">
                {selectedProject.technologies?.map((tech, i) => (
                  <span key={i} className="badge p-2 rounded" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="d-flex gap-2">
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-custom-primary text-decoration-none"
                >
                  <GithubIcon size={16} />
                  <span>GitHub Repository</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Projects;
