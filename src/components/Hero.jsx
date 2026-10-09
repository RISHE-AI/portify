import { Download, ArrowRight, Mail, Award, Code, GraduationCap } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import heroImg from '../assets/hero-image.png';
import resumePdf from '../assets/resume.pdf';

function Hero({ profile }) {
  const pData = profile || {
    name: 'Rishe S',
    title: 'AI & Machine Learning Engineer • Full Stack Developer',
    statusText: 'Open for Internships & AI / Full-Stack Opportunities',
    summary: 'B.Tech in Artificial Intelligence & Machine Learning at Kongu Engineering College (CGPA 8.10). Passionate about deep learning, RAG conversational models, and engineering fast, reliable full-stack applications with MERN.',
    github: 'https://github.com/RISHE-AI',
    linkedin: 'https://linkedin.com/in/rishe-aiml/',
    email: 'rishe8080s@gmail.com',
    resumeUrl: resumePdf,
    badge1Title: '3+ AI Projects',
    badge1Sub: 'CNN, RAG, MathBot',
    badge2Title: '4 Awards Won',
    badge2Sub: 'PSG, KEC, BYTS',
    badge3Title: '8.10 CGPA',
    badge3Sub: 'Kongu Engg College'
  };

  return (
    <section id="hero" className="py-5" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', paddingTop: '6rem' }}>
      <div className="container py-lg-4">
        <div className="row align-items-center gy-5">
          {/* Left Column: Intro & Call-to-actions */}
          <div className="col-lg-7 text-center text-lg-start animate-fade-in">
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill border mb-4"
              style={{
                backgroundColor: 'var(--accent-soft)',
                borderColor: 'var(--border-color)',
                fontSize: '0.84rem',
                color: 'var(--text-secondary)'
              }}
            >
              <span
                className="rounded-circle pulse-glow"
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 8px #10b981'
                }}
              ></span>
              <span>{pData.statusText || 'Open for Internships & AI / Full-Stack Opportunities'}</span>
            </div>

            <h1 className="display-4 fw-bold mb-2 tracking-tight" style={{ color: 'var(--text-primary)', lineHeight: 1.15 }}>
              Hi, I&apos;m <span style={{ color: 'var(--accent-primary)' }}>{pData.name || 'Rishe S'}</span>
            </h1>

            <p className="fs-5 fw-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              {pData.title || 'AI & Machine Learning Engineer • Full Stack Developer'}
            </p>

            <p className="lead fs-6 mb-4 pe-lg-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '560px' }}>
              {pData.summary || 'B.Tech AIML student at Kongu Engineering College (CGPA 8.10). Passionate about deep learning, RAG conversational models, and engineering fast, reliable full-stack applications with MERN.'}
            </p>

            {/* CTAs */}
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-3 mb-4">
              <a href="#projects" className="btn-custom-primary text-decoration-none">
                <span>View Projects</span>
                <ArrowRight size={17} />
              </a>

              <a
                href={pData.resumeUrl || resumePdf}
                download="RISHE_S_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-custom-secondary text-decoration-none"
              >
                <Download size={17} />
                <span>Download Resume</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3">
              <span className="small fw-medium" style={{ color: 'var(--text-muted)' }}>
                Connect:
              </span>
              <div className="d-flex align-items-center gap-2">
                {pData.github && (
                  <a
                    href={pData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center justify-content-center rounded-3 border text-decoration-none p-2"
                    style={{
                      width: '38px',
                      height: '38px',
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.2s ease'
                    }}
                    aria-label="GitHub"
                  >
                    <GithubIcon size={18} />
                  </a>
                )}
                {pData.linkedin && (
                  <a
                    href={pData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center justify-content-center rounded-3 border text-decoration-none p-2"
                    style={{
                      width: '38px',
                      height: '38px',
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.2s ease'
                    }}
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon size={18} />
                  </a>
                )}
                {pData.email && (
                  <a
                    href={`mailto:${pData.email}`}
                    className="d-flex align-items-center justify-content-center rounded-3 border text-decoration-none p-2"
                    style={{
                      width: '38px',
                      height: '38px',
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.2s ease'
                    }}
                    aria-label="Email"
                  >
                    <Mail size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Avatar Card with Dynamic Floating Stat Badges */}
          <div className="col-lg-5 d-flex justify-content-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="position-relative" style={{ width: '100%', maxWidth: '360px' }}>
              {/* Profile Image Frame */}
              <div
                className="overflow-hidden rounded-4 border shadow-sm"
                style={{
                  aspectRatio: '1/1',
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  boxShadow: 'var(--card-hover-shadow)'
                }}
              >
                <img
                  src={pData.profileImage || heroImg}
                  alt={pData.name || 'Rishe S'}
                  className="w-100 h-100 object-fit-cover"
                  style={{ transition: 'transform 0.4s ease' }}
                />
              </div>

              {/* Floating Badge 1: AI Projects */}
              <div
                className="position-absolute d-flex align-items-center gap-2 p-2 px-3 rounded-4 glass-card animate-float"
                style={{
                  top: '-15px',
                  right: '-15px',
                  zIndex: 2,
                  animationDelay: '0s'
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 p-2"
                  style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                >
                  <Code size={18} />
                </div>
                <div>
                  <div className="fw-bold small" style={{ color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {pData.badge1Title || '3+ AI Projects'}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                    {pData.badge1Sub || 'CNN, RAG, MathBot'}
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Hackathon Awards */}
              <div
                className="position-absolute d-flex align-items-center gap-2 p-2 px-3 rounded-4 glass-card animate-float"
                style={{
                  bottom: '30px',
                  left: '-25px',
                  zIndex: 2,
                  animationDelay: '1.5s'
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 p-2"
                  style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                >
                  <Award size={18} />
                </div>
                <div>
                  <div className="fw-bold small" style={{ color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {pData.badge2Title || '4 Awards Won'}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                    {pData.badge2Sub || 'PSG, KEC, BYTS'}
                  </div>
                </div>
              </div>

              {/* Floating Badge 3: Academic CGPA */}
              <div
                className="position-absolute d-flex align-items-center gap-2 p-2 px-3 rounded-4 glass-card animate-float"
                style={{
                  bottom: '-15px',
                  right: '-10px',
                  zIndex: 2,
                  animationDelay: '3s'
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 p-2"
                  style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                >
                  <GraduationCap size={18} />
                </div>
                <div>
                  <div className="fw-bold small" style={{ color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {pData.badge3Title || '8.10 CGPA'}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                    {pData.badge3Sub || 'Kongu Engg College'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
