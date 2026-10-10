import { useState, useEffect } from 'react';
import { Briefcase, GraduationCap, Calendar, MapPin, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import travelImg from '../assets/travel.png';
import portfolioImg from '../assets/portfolio.png';

function ExperienceEducation({ experience = [], education = [] }) {
  const [expImageIndices, setExpImageIndices] = useState({});
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchCurrentX, setTouchCurrentX] = useState(0);

  // Lightbox Modal state for full-screen uncropped view
  const [expLightbox, setExpLightbox] = useState(null);
  const [expLightboxIndex, setExpLightboxIndex] = useState(0);
  const [lightboxTouchStartX, setLightboxTouchStartX] = useState(0);
  const [lightboxTouchCurrentX, setLightboxTouchCurrentX] = useState(0);

  const defaultExperience = [
    {
      id: 'exp-1',
      role: 'Full Stack Website Development',
      company: 'Pluto Intero',
      location: 'Remote',
      period: '2024 - Present',
      description: 'Developed a full-stack website for a startup focused on selling eco-friendly decoration lamps made from reused plastics. Implemented features for product display, user authentication, and online interaction using the MERN stack and Firebase.',
      technologies: ['MERN Stack', 'Firebase', 'React.js', 'Node.js', 'MongoDB'],
      slides: [travelImg, portfolioImg]
    }
  ];

  const defaultEducation = [
    {
      id: 'edu-1',
      degree: 'B.Tech In AIML',
      institution: 'Kongu Engineering College, Erode',
      period: '2023 - 2027',
      score: 'CGPA: 8.10',
      details: 'Specialization in Artificial Intelligence & Machine Learning with coursework in Deep Learning, Data Analytics, Computer Vision, and Software Engineering.'
    },
    {
      id: 'edu-2',
      degree: '12th Standard (HSC)',
      institution: 'Sri Vidya Mandir Matric Hr Sec School, Namakkal',
      period: '2022 - 2023',
      score: '88%',
      details: 'Higher Secondary Specialization in Mathematics, Physics, Chemistry, and Computer Science.'
    },
    {
      id: 'edu-3',
      degree: '10th Standard (SSLC)',
      institution: 'Sri Vidya Mandir Matric Hr Sec School, Namakkal',
      period: '2020 - 2021',
      score: '88%',
      details: 'Secondary School Education with distinction.'
    }
  ];

  const expList = experience.length > 0 ? experience : defaultExperience;
  const eduList = education.length > 0 ? education : defaultEducation;

  const getExpSlides = (exp) => {
    if (exp.slides && exp.slides.length > 0) return exp.slides;
    if (exp.image) return [exp.image];
    return [travelImg, portfolioImg];
  };

  const openExpLightbox = (exp, slideIndex = 0) => {
    setExpLightbox(exp);
    setExpLightboxIndex(slideIndex);
  };

  const closeExpLightbox = () => {
    setExpLightbox(null);
  };

  const handleExpLightboxNext = () => {
    if (!expLightbox) return;
    const slides = getExpSlides(expLightbox);
    setExpLightboxIndex((prev) => (prev + 1) % slides.length);
  };

  const handleExpLightboxPrev = () => {
    if (!expLightbox) return;
    const slides = getExpSlides(expLightbox);
    setExpLightboxIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Keyboard navigation for Experience Lightbox
  useEffect(() => {
    if (!expLightbox) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeExpLightbox();
      if (e.key === 'ArrowRight') handleExpLightboxNext();
      if (e.key === 'ArrowLeft') handleExpLightboxPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expLightbox]);

  const handleNextExpImage = (e, expId, slideLength) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setExpImageIndices((prev) => ({
      ...prev,
      [expId]: ((prev[expId] || 0) + 1) % slideLength
    }));
  };

  const handlePrevExpImage = (e, expId, slideLength) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setExpImageIndices((prev) => ({
      ...prev,
      [expId]: ((prev[expId] || 0) - 1 + slideLength) % slideLength
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

  const handleTouchEnd = (expId, slideCount) => {
    const deltaX = touchStartX - touchCurrentX;
    const minSwipeDistance = 40;
    if (deltaX > minSwipeDistance && slideCount > 1) {
      handleNextExpImage(null, expId, slideCount);
    } else if (deltaX < -minSwipeDistance && slideCount > 1) {
      handlePrevExpImage(null, expId, slideCount);
    }
    setTouchStartX(0);
    setTouchCurrentX(0);
  };

  return (
    <section id="experience" className="py-5">
      <div className="container">
        <div className="section-header animate-fade-in">
          <span className="section-tag">Career & Academics</span>
          <h2 className="section-title">Experience & Education</h2>
          <p className="section-subtitle">
            Hands-on software development experience alongside a strong academic track record.
          </p>
        </div>

        <div className="row g-5">
          {/* Work Experience Column with Image Carousel */}
          <div className="col-lg-6 animate-fade-in">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 p-2"
                style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
              >
                <Briefcase size={22} />
              </div>
              <h3 className="h4 fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                Work Experience
              </h3>
            </div>

            <div className="d-flex flex-column gap-4">
              {expList.map((exp) => {
                const slides = getExpSlides(exp);
                const activeSlideIdx = expImageIndices[exp.id] || 0;

                return (
                  <div key={exp.id} className="card glass-card border-0 overflow-hidden">
                    {/* Work Experience Image Carousel Banner */}
                    {slides.length > 0 && (
                      <div
                        className="position-relative overflow-hidden user-select-none d-flex align-items-center justify-content-center"
                        style={{
                          height: '250px',
                          backgroundColor: 'rgba(0, 0, 0, 0.45)',
                          touchAction: 'pan-y',
                          cursor: 'pointer'
                        }}
                        onClick={() => openExpLightbox(exp, activeSlideIdx)}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => handleTouchEnd(exp.id, slides.length)}
                        title="Click to view image in full-screen"
                      >
                        {/* Ambient subtle blurred backdrop */}
                        <img
                          src={slides[activeSlideIdx]}
                          alt=""
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'blur(20px) brightness(0.35)',
                            transform: 'scale(1.2)',
                            opacity: 0.55,
                            pointerEvents: 'none'
                          }}
                        />

                        {/* True Real-Size Uncropped Foreground Image */}
                        <img
                          src={slides[activeSlideIdx]}
                          alt={`${exp.role} work preview`}
                          className="position-relative w-100 h-100"
                          style={{
                            objectFit: 'contain',
                            pointerEvents: 'none',
                            userSelect: 'none',
                            padding: '6px'
                          }}
                          draggable={false}
                        />

                        {/* Expand Pill */}
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

                        {/* Slide Navigation Controls */}
                        {slides.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrevExpImage(e, exp.id, slides.length);
                              }}
                              className="btn position-absolute top-50 start-0 translate-middle-y d-flex align-items-center justify-content-center p-0 rounded-circle ms-2"
                              style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: '#ffffff',
                                zIndex: 3
                              }}
                              aria-label="Previous work screenshot"
                            >
                              <ChevronLeft size={18} />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNextExpImage(e, exp.id, slides.length);
                              }}
                              className="btn position-absolute top-50 end-0 translate-middle-y d-flex align-items-center justify-content-center p-0 rounded-circle me-2"
                              style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: '#ffffff',
                                zIndex: 3
                              }}
                              aria-label="Next work screenshot"
                            >
                              <ChevronRight size={18} />
                            </button>

                            <div
                              className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-1 mb-2"
                              style={{ zIndex: 3 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {slides.map((_, sIdx) => (
                                <span
                                  key={sIdx}
                                  style={{
                                    width: sIdx === activeSlideIdx ? '18px' : '7px',
                                    height: '7px',
                                    borderRadius: sIdx === activeSlideIdx ? '4px' : '50%',
                                    backgroundColor: sIdx === activeSlideIdx ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpImageIndices((prev) => ({ ...prev, [exp.id]: sIdx }));
                                  }}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Work Experience Details */}
                    <div className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h4 className="h6 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                            {exp.role}
                          </h4>
                          <div className="fw-semibold small" style={{ color: 'var(--accent-primary)' }}>
                            {exp.company}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-3 text-muted small mb-3">
                        <span className="d-inline-flex align-items-center gap-1">
                          <Calendar size={14} /> {exp.period}
                        </span>
                        {exp.location && (
                          <span className="d-inline-flex align-items-center gap-1">
                            <MapPin size={14} /> {exp.location}
                          </span>
                        )}
                      </div>

                      <p className="small mb-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {exp.description}
                      </p>

                      {exp.technologies && (
                        <div className="d-flex flex-wrap gap-1">
                          {exp.technologies.map((t, idx) => (
                            <span
                              key={idx}
                              className="badge rounded border"
                              style={{
                                backgroundColor: 'var(--bg-secondary)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-secondary)',
                                fontSize: '0.74rem'
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Education Journey Column */}
          <div className="col-lg-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 p-2"
                style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
              >
                <GraduationCap size={22} />
              </div>
              <h3 className="h4 fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                Education Journey
              </h3>
            </div>

            <div className="d-flex flex-column gap-3">
              {eduList.map((edu) => (
                <div key={edu.id} className="card glass-card border-0 p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h4 className="h6 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {edu.degree}
                      </h4>
                      <div className="fw-semibold small" style={{ color: 'var(--accent-primary)' }}>
                        {edu.institution}
                      </div>
                    </div>
                    {edu.score && (
                      <span
                        className="badge rounded-pill border px-3 py-1"
                        style={{
                          backgroundColor: 'var(--accent-soft)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--accent-primary)',
                          fontSize: '0.78rem'
                        }}
                      >
                        {edu.score}
                      </span>
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                    <Calendar size={14} />
                    <span>{edu.period}</span>
                  </div>

                  {edu.details && (
                    <p className="small mb-0" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {edu.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Experience Image Lightbox Modal */}
      {expLightbox && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-between p-3 animate-fade-in"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.94)',
            backdropFilter: 'blur(12px)',
            zIndex: 3000,
            userSelect: 'none'
          }}
          onClick={closeExpLightbox}
        >
          {/* Header */}
          <div
            className="w-100 d-flex align-items-center justify-content-between px-3 py-2"
            style={{ maxWidth: '1100px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span
                className="badge rounded-pill px-2 py-1 text-uppercase me-2"
                style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff', fontSize: '0.72rem' }}
              >
                Experience
              </span>
              <span className="text-white fw-bold">{expLightbox.role}</span>
              <span className="text-white-50 ms-2 small">({expLightbox.company})</span>
            </div>

            <div className="d-flex align-items-center gap-3">
              <span className="small text-white-50 fw-semibold">
                {expLightboxIndex + 1} / {getExpSlides(expLightbox).length}
              </span>
              <button
                className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: '38px', height: '38px', borderColor: 'rgba(255,255,255,0.3)' }}
                onClick={closeExpLightbox}
                aria-label="Close lightbox"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main Stage Image */}
          <div
            className="position-relative w-100 d-flex align-items-center justify-content-center flex-grow-1 my-2 overflow-hidden"
            style={{ maxWidth: '1100px', maxHeight: '76vh', touchAction: 'pan-y' }}
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
              const slides = getExpSlides(expLightbox);
              if (deltaX > 40 && slides.length > 1) {
                handleExpLightboxNext();
              } else if (deltaX < -40 && slides.length > 1) {
                handleExpLightboxPrev();
              }
              setLightboxTouchStartX(0);
              setLightboxTouchCurrentX(0);
            }}
          >
            <img
              src={getExpSlides(expLightbox)[expLightboxIndex]}
              alt={`${expLightbox.role} screenshot ${expLightboxIndex + 1}`}
              className="img-fluid rounded-3 shadow-lg"
              style={{
                maxHeight: '74vh',
                maxWidth: '92vw',
                objectFit: 'contain',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
              }}
              draggable={false}
            />

            {/* Left Chevron */}
            {getExpSlides(expLightbox).length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpLightboxPrev();
                }}
                className="btn position-absolute top-50 start-0 translate-middle-y rounded-circle d-flex align-items-center justify-content-center ms-2 ms-md-4 shadow"
                style={{
                  width: '46px',
                  height: '46px',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff'
                }}
                aria-label="Previous screenshot"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Right Chevron */}
            {getExpSlides(expLightbox).length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpLightboxNext();
                }}
                className="btn position-absolute top-50 end-0 translate-middle-y rounded-circle d-flex align-items-center justify-content-center me-2 me-md-4 shadow"
                style={{
                  width: '46px',
                  height: '46px',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff'
                }}
                aria-label="Next screenshot"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Footer Thumbnail Strip */}
          <div
            className="w-100 d-flex flex-column align-items-center gap-2 pb-2"
            style={{ maxWidth: '1100px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {getExpSlides(expLightbox).length > 1 && (
              <div
                className="d-flex align-items-center gap-2 overflow-x-auto py-2 px-3 rounded-pill"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  maxWidth: '90vw',
                  scrollbarWidth: 'none'
                }}
              >
                {getExpSlides(expLightbox).map((slideUrl, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => setExpLightboxIndex(sIdx)}
                    className="p-0 border-0 rounded overflow-hidden"
                    style={{
                      width: '48px',
                      height: '36px',
                      opacity: expLightboxIndex === sIdx ? 1 : 0.45,
                      outline: expLightboxIndex === sIdx ? '2px solid var(--accent-primary)' : 'none',
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }}
                  >
                    <img src={slideUrl} alt={`Thumb ${sIdx + 1}`} className="w-100 h-100 object-fit-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default ExperienceEducation;
