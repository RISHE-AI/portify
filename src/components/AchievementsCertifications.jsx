import { Trophy, Award, ShieldCheck } from 'lucide-react';

function AchievementsCertifications({ achievements = [], certifications = [] }) {
  const defaultAchievements = [
    {
      id: 'ach-1',
      title: '1st Place – Paper Presentation',
      organization: 'PSG College Coimbatore',
      description: 'Secured 1st rank for research presentation in paper presentation competition.',
      year: '2025',
      badge: '1st Prize'
    },
    {
      id: 'ach-2',
      title: '1st Place – Paper Presentation',
      organization: 'Kongu Engineering College (KEC), Erode',
      description: 'Won 1st prize at KEC technical symposium for innovative paper presentation.',
      year: '2025',
      badge: '1st Prize'
    },
    {
      id: 'ach-3',
      title: '3rd Prize – BYTS India Hackathon 2025',
      organization: 'BYTS India National 24-Hour AI Hackathon',
      description: 'Awarded 3rd prize in a 24-hour national level AI hackathon for building an end-to-end intelligent app.',
      year: '2025',
      badge: 'Hackathon Award'
    },
    {
      id: 'ach-4',
      title: '1st Prize – Interactive Tamil Language Chatbot',
      organization: 'Internal Club Competition (KEC)',
      description: 'Won 1st prize for constructing an interactive Tamil natural language chatbot.',
      year: '2024',
      badge: '1st Prize'
    }
  ];

  const defaultCertifications = [
    {
      id: 'cert-1',
      title: 'Java SE-17 Developer',
      issuer: 'Oracle / Certified Standard',
      date: '2024',
      badge: 'Verified'
    },
    {
      id: 'cert-2',
      title: 'MongoDB Associate Developer',
      issuer: 'MongoDB University',
      date: '2024',
      badge: 'Certified'
    }
  ];

  const achList = achievements.length > 0 ? achievements : defaultAchievements;
  const certList = certifications.length > 0 ? certifications : defaultCertifications;

  return (
    <section id="achievements" className="py-5">
      <div className="container">
        <div className="section-header animate-fade-in">
          <span className="section-tag">Recognition & Credentials</span>
          <h2 className="section-title">Achievements & Certifications</h2>
          <p className="section-subtitle">
            Hackathon prizes, symposium paper awards, and verified technical credentials.
          </p>
        </div>

        {/* Section 1: Honors & Competitions */}
        <div className="d-flex align-items-center gap-2 mb-4 animate-fade-in">
          <Trophy size={20} style={{ color: '#f59e0b' }} />
          <h3 className="h5 fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
            Hackathon & Symposium Honors
          </h3>
        </div>

        <div className="row g-4 mb-5">
          {achList.map((ach, idx) => (
            <div key={ach.id} className="col-lg-3 col-md-6 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="card glass-card h-100 border-0 p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded p-2"
                    style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}
                  >
                    <Trophy size={18} />
                  </div>
                  <span
                    className="badge rounded-pill border px-2 py-1"
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.12)',
                      borderColor: 'rgba(245, 158, 11, 0.3)',
                      color: '#d97706',
                      fontSize: '0.72rem'
                    }}
                  >
                    {ach.badge || 'Award'}
                  </span>
                </div>

                <h4 className="h6 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {ach.title}
                </h4>

                <div className="small fw-semibold mb-2" style={{ color: 'var(--accent-primary)' }}>
                  {ach.organization}
                </div>

                <p className="small mb-3 flex-grow-1" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {ach.description}
                </p>

                {ach.year && (
                  <div className="small text-muted text-end mt-auto pt-2 border-top" style={{ borderColor: 'var(--border-color)', fontSize: '0.78rem' }}>
                    {ach.year}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Industry Certifications */}
        <div className="d-flex align-items-center gap-2 mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <ShieldCheck size={20} style={{ color: 'var(--accent-primary)' }} />
          <h3 className="h5 fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
            Industry Certifications
          </h3>
        </div>

        <div className="row g-4">
          {certList.map((cert, idx) => (
            <div key={cert.id} className="col-md-6 animate-fade-in" style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
              <div className="card glass-card border-0 p-4 d-flex flex-row align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 p-3 flex-shrink-0"
                  style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                >
                  <Award size={26} />
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h4 className="h6 fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                      {cert.title}
                    </h4>
                    <span
                      className="badge rounded-pill border px-2 py-1"
                      style={{
                        backgroundColor: 'var(--accent-soft)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--accent-primary)',
                        fontSize: '0.72rem'
                      }}
                    >
                      {cert.badge || 'Certified'}
                    </span>
                  </div>

                  <div className="small" style={{ color: 'var(--text-secondary)' }}>
                    {cert.issuer}
                  </div>

                  {cert.date && (
                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                      Issued: {cert.date}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AchievementsCertifications;
