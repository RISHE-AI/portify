import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Sparkles, X, ChevronRight, ChevronLeft, Maximize2 } from 'lucide-react';
import { GithubIcon } from './Icons';
import plantImg from '../assets/c19.png';
import ragImg from '../assets/travel.png';
import mathImg from '../assets/portfolio.png';

function Projects({ projects = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [cardImageIndices, setCardImageIndices] = useState({});
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchCurrentX, setTouchCurrentX] = useState(0);

  // Lightbox Modal state for full-screen carousel view
  const [lightboxProject, setLightboxProject] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxTouchStartX, setLightboxTouchStartX] = useState(0);
  const [lightboxTouchCurrentX, setLightboxTouchCurrentX] = useState(0);

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

  const categories = ['All', ...new Set(['AI & ML', 'Full Stack Web', ...displayList.map((p) => p.category).filter(Boolean)])];

  const filteredProjects = displayList.filter((proj) => {
    if (activeCategory === 'All') return true;
    return proj.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  const getProjectSlides = (proj) => {
    if (!proj) return [plantImg];
    if (Array.isArray(proj.slides) && proj.slides.length > 0) return proj.slides;
    if (proj.image) return [proj.image];
    if (proj.id === 'proj-1') return [plantImg, ragImg, mathImg];
    if (proj.id === 'proj-2') return [ragImg, plantImg, mathImg];
    if (proj.id === 'proj-3') return [mathImg, plantImg, ragImg];
    return [plantImg];
  };

  const openLightbox = (proj, slideIndex = 0) => {
    setLightboxProject(proj);
    setLightboxIndex(slideIndex);
  };

  const closeLightbox = () => {
    setLightboxProject(null);
  };

  const handleLightboxNext = () => {
    if (!lightboxProject) return;
    const slides = getProjectSlides(lightboxProject);
    setLightboxIndex((prev) => (prev + 1) % slides.length);
  };

  const handleLightboxPrev = () => {
    if (!lightboxProject) return;
    const slides = getProjectSlides(lightboxProject);
    setLightboxIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Keyboard controls for Lightbox (Esc, Left, Right)
  useEffect(() => {
    if (!lightboxProject) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') handleLightboxNext();
      if (e.key === 'ArrowLeft') handleLightboxPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxProject]);

  const handleCardNextImage = (e, projId, slideLength) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setCardImageIndices((prev) => ({
      ...prev,
      [projId]: ((prev[projId] || 0) + 1) % slideLength
    }));
  };

  const handleCardPrevImage = (e, projId, slideLength) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setCardImageIndices((prev) => ({
      ...prev,
      [projId]: ((prev[projId] || 0) - 1 + slideLength) % slideLength
    }));
  };

  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    setTouchCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = (projId, slideCount) => {
    const deltaX = touchStartX - touchCurrentX;
    const minSwipeDistance = 40;
    if (deltaX > minSwipeDistance && slideCount > 1) {
      handleCardNextImage(null, projId, slideCount);
    } else if (deltaX < -minSwipeDistance && slideCount > 1) {
      handleCardPrevImage(null, projId, slideCount);
    }
    setTouchStartX(0);
    setTouchCurrentX(0);
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
                  {/* Card Image Banner with Mini Slide Controls, Finger Swipe & Click to Expand */}
                  <div
                    className="position-relative overflow-hidden user-select-none"
                    style={{
                      height: '220px',
                      backgroundColor: '#0b0f19',
                      touchAction: 'pan-y',
                      cursor: 'pointer'
                    }}
                    onClick={() => openLightbox(proj, activeSlideIdx)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={() => handleTouchEnd(proj.id, slides.length)}
                    title="Click to view image in full-screen carousel"
                  >
                    {/* 100% Real-Size Uncropped Image */}
                    <img
                      src={slides[activeSlideIdx]}
                      alt={`${proj.title} slide ${activeSlideIdx + 1}`}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '8px',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        display: 'block'
                      }}
                      draggable={false}
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
                        fontSize: '0.72rem',
                        zIndex: 2
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
                          fontSize: '0.72rem',
                          zIndex: 2
                        }}
                      >
                        <Sparkles size={11} /> Featured
                      </span>
                    )}

                    {/* Expand Badge */}
                    <span
                      className="position-absolute d-inline-flex align-items-center gap-1 rounded-pill px-2 py-1 small"
                      style={{
                        bottom: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.72)',
                        backdropFilter: 'blur(6px)',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        pointerEvents: 'none',
                        zIndex: 2
                      }}
                    >
                      <Maximize2 size={12} />
                      <span>{slides.length > 1 ? `${slides.length} Photos` : 'Expand'}</span>
                    </span>

                    {/* Per-Card Slide Buttons */}
                    {slides.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardPrevImage(e, proj.id, slides.length);
                          }}
                          className="btn position-absolute top-50 start-0 translate-middle-y d-flex align-items-center justify-content-center p-0 rounded-circle ms-2"
                          style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: 'rgba(0, 0, 0, 0.65)',
                            color: '#ffffff',
                            zIndex: 3
                          }}
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardNextImage(e, proj.id, slides.length);
                          }}
                          className="btn position-absolute top-50 end-0 translate-middle-y d-flex align-items-center justify-content-center p-0 rounded-circle me-2"
                          style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: 'rgba(0, 0, 0, 0.65)',
                            color: '#ffffff',
                            zIndex: 3
                          }}
                          aria-label="Next image"
                        >
                          <ChevronRight size={16} />
                        </button>

                        <div
                          className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-1 mb-2"
                          style={{ zIndex: 3 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {slides.map((_, sIdx) => (
                            <span
                              key={sIdx}
                              className="rounded-circle"
                              style={{
                                width: sIdx === activeSlideIdx ? '16px' : '6px',
                                height: '6px',
                                borderRadius: sIdx === activeSlideIdx ? '4px' : '50%',
                                backgroundColor: sIdx === activeSlideIdx ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardImageIndices((prev) => ({ ...prev, [proj.id]: sIdx }));
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

      {/* Case Study Modal rendered at document.body level above Navbar */}
      {selectedProject &&
        createPortal(
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 99998
            }}
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="card glass-card p-4 rounded-4 position-relative border"
              style={{ width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="btn btn-sm position-absolute top-0 end-0 m-3 rounded-circle p-1"
                style={{ color: 'var(--text-primary)', zIndex: 5 }}
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

              <div
                className="rounded-3 overflow-hidden mb-3 user-select-none position-relative"
                style={{
                  height: '280px',
                  backgroundColor: '#0b0f19',
                  touchAction: 'pan-y',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  const currentIdx = cardImageIndices[selectedProject.id] || 0;
                  openLightbox(selectedProject, currentIdx);
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd(selectedProject.id, getProjectSlides(selectedProject).length)}
                title="Click to view full-screen image carousel"
              >
                {/* 100% Real Uncropped Image */}
                <img
                  src={getProjectSlides(selectedProject)[cardImageIndices[selectedProject.id] || 0]}
                  alt={selectedProject.title}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '10px',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    display: 'block'
                  }}
                  draggable={false}
                />

                {getProjectSlides(selectedProject).length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardPrevImage(e, selectedProject.id, getProjectSlides(selectedProject).length);
                      }}
                      className="btn position-absolute top-50 start-0 translate-middle-y d-flex align-items-center justify-content-center p-0 rounded-circle ms-2"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: '#ffffff',
                        zIndex: 3
                      }}
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardNextImage(e, selectedProject.id, getProjectSlides(selectedProject).length);
                      }}
                      className="btn position-absolute top-50 end-0 translate-middle-y d-flex align-items-center justify-content-center p-0 rounded-circle me-2"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: '#ffffff',
                        zIndex: 3
                      }}
                      aria-label="Next image"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                <span
                  className="position-absolute d-inline-flex align-items-center gap-1 rounded-pill px-2 py-1 small"
                  style={{
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(6px)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    zIndex: 3
                  }}
                >
                  <Maximize2 size={12} />
                  <span>Expand Image ({getProjectSlides(selectedProject).length})</span>
                </span>
              </div>

              <div className="mb-3">
                <h4 className="h6 fw-bold mb-2" style={{ color: 'var(--accent-primary)' }}>
                  Overview & Architecture
                </h4>
                <div
                  className="small"
                  style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 1.75,
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                    fontSize: '0.92rem'
                  }}
                >
                  {selectedProject.detailedDescription || selectedProject.shortDescription}
                </div>
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

              <div className="d-flex flex-wrap gap-2">
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
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-custom-secondary text-decoration-none"
                  >
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* High-Resolution Image Carousel / Lightbox Modal rendered via createPortal above Navbar */}
      {lightboxProject &&
        createPortal(
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-between p-2 p-md-3 animate-fade-in"
            style={{
              backgroundColor: 'rgba(5, 8, 16, 0.96)',
              backdropFilter: 'blur(14px)',
              zIndex: 99999,
              userSelect: 'none'
            }}
            onClick={closeLightbox}
          >
            {/* Lightbox Header Bar */}
            <div
              className="w-100 d-flex align-items-center justify-content-between px-3 py-2 flex-shrink-0"
              style={{ maxWidth: '1200px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex align-items-center gap-2 overflow-hidden">
                <span
                  className="badge rounded-pill px-2 py-1 text-uppercase flex-shrink-0"
                  style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff', fontSize: '0.72rem' }}
                >
                  {lightboxProject.category || 'AI & ML'}
                </span>
                <h3 className="h6 mb-0 text-white fw-bold text-truncate">
                  {lightboxProject.title}
                </h3>
              </div>

              <div className="d-flex align-items-center gap-3 flex-shrink-0 ms-2">
                <span className="small text-white-50 fw-semibold">
                  {lightboxIndex + 1} / {getProjectSlides(lightboxProject).length}
                </span>
                <button
                  className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: '38px', height: '38px', borderColor: 'rgba(255,255,255,0.35)' }}
                  onClick={closeLightbox}
                  aria-label="Close lightbox"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Stage Image with Controls and Swipe — 100% Uncropped Fit */}
            <div
              className="position-relative w-100"
              style={{
                flex: '1 1 0%',
                minHeight: 0,
                maxWidth: '1200px',
                touchAction: 'pan-y'
              }}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                if (e.touches && e.touches.length > 0) {
                  setLightboxTouchStartX(e.touches[0].clientX);
                  setLightboxTouchCurrentX(e.touches[0].clientX);
                }
              }}
              onTouchMove={(e) => {
                if (e.touches && e.touches.length > 0) {
                  setLightboxTouchCurrentX(e.touches[0].clientX);
                }
              }}
              onTouchEnd={() => {
                const deltaX = lightboxTouchStartX - lightboxTouchCurrentX;
                const slides = getProjectSlides(lightboxProject);
                if (deltaX > 40 && slides.length > 1) {
                  handleLightboxNext();
                } else if (deltaX < -40 && slides.length > 1) {
                  handleLightboxPrev();
                }
                setLightboxTouchStartX(0);
                setLightboxTouchCurrentX(0);
              }}
            >
              {/* Absolute stage box guaranteeing 100% of image height & width fit with zero clipping */}
              <div
                style={{
                  position: 'absolute',
                  inset: '8px 54px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={getProjectSlides(lightboxProject)[lightboxIndex]}
                  alt={`${lightboxProject.title} screenshot ${lightboxIndex + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 16px 40px rgba(0, 0, 0, 0.75))'
                  }}
                  draggable={false}
                />
              </div>

              {/* Left Chevron */}
              {getProjectSlides(lightboxProject).length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLightboxPrev();
                  }}
                  className="btn position-absolute top-50 start-0 translate-middle-y rounded-circle d-flex align-items-center justify-content-center ms-1 ms-md-2 shadow"
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    zIndex: 5
                  }}
                  aria-label="Previous screenshot"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Right Chevron */}
              {getProjectSlides(lightboxProject).length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLightboxNext();
                  }}
                  className="btn position-absolute top-50 end-0 translate-middle-y rounded-circle d-flex align-items-center justify-content-center me-1 me-md-2 shadow"
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    zIndex: 5
                  }}
                  aria-label="Next screenshot"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* Lightbox Footer & Thumbnail Strip */}
            <div
              className="w-100 d-flex flex-column align-items-center gap-2 pt-2 pb-1 flex-shrink-0"
              style={{ maxWidth: '1200px' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Thumbnail Strip */}
              {getProjectSlides(lightboxProject).length > 1 && (
                <div
                  className="d-flex align-items-center gap-2 overflow-x-auto py-2 px-3 rounded-pill"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    maxWidth: '92vw',
                    scrollbarWidth: 'none'
                  }}
                >
                  {getProjectSlides(lightboxProject).map((slideUrl, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => setLightboxIndex(sIdx)}
                      className="p-0 border-0 rounded overflow-hidden"
                      style={{
                        width: '54px',
                        height: '38px',
                        backgroundColor: '#0b0f19',
                        opacity: lightboxIndex === sIdx ? 1 : 0.45,
                        outline: lightboxIndex === sIdx ? '2px solid var(--accent-primary)' : 'none',
                        transition: 'all 0.2s ease',
                        flexShrink: 0
                      }}
                    >
                      <img
                        src={slideUrl}
                        alt={`Thumb ${sIdx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Action Button: View Full Project Details */}
              <button
                onClick={() => {
                  const targetProj = lightboxProject;
                  closeLightbox();
                  setSelectedProject(targetProj);
                }}
                className="btn btn-sm btn-custom-primary rounded-pill px-4 py-2"
              >
                <span>View Full Project Details</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}

export default Projects;
