import { useState } from 'react';
import { Briefcase, GraduationCap, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import travelImg from '../assets/travel.png';
import portfolioImg from '../assets/portfolio.png';

function ExperienceEducation({ experience = [], education = [] }) {
  const [expImageIndices, setExpImageIndices] = useState({});

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

  const handleNextExpImage = (e, expId, slideLength) => {
    e.stopPropagation();
    setExpImageIndices((prev) => ({
      ...prev,
      [expId]: ((prev[expId] || 0) + 1) % slideLength
    }));
  };

  const handlePrevExpImage = (e, expId, slideLength) => {
    e.stopPropagation();
    setExpImageIndices((prev) => ({
      ...prev,
      [expId]: ((prev[expId] || 0) - 1 + slideLength) % slideLength
    }));
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
                        className="position-relative overflow-hidden"
                        style={{ height: '250px', backgroundColor: 'var(--bg-secondary)' }}
                      >
                        <img
                          src={slides[activeSlideIdx]}
                          alt={`${exp.role} work preview`}
                          className="w-100 h-100 object-fit-cover"
                        />

                        {/* Slide Navigation Controls */}
                        {slides.length > 1 && (
                          <>
                            <button
                              onClick={(e) => handlePrevExpImage(e, exp.id, slides.length)}
                              className="btn position-absolute top-50 start-0 translate-middle-y d-flex align-items-center justify-content-center p-0 rounded-circle ms-2"
                              style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: '#ffffff'
                              }}
                              aria-label="Previous work screenshot"
                            >
                              <ChevronLeft size={18} />
                            </button>

                            <button
                              onClick={(e) => handleNextExpImage(e, exp.id, slides.length)}
                              className="btn position-absolute top-50 end-0 translate-middle-y d-flex align-items-center justify-content-center p-0 rounded-circle me-2"
                              style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: '#ffffff'
                              }}
                              aria-label="Next work screenshot"
                            >
                              <ChevronRight size={18} />
                            </button>

                            <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-1 mb-3">
                              {slides.map((_, sIdx) => (
                                <span
                                  key={sIdx}
                                  style={{
                                    width: sIdx === activeSlideIdx ? '18px' : '7px',
                                    height: '7px',
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
    </section>
  );
}

export default ExperienceEducation;
