import { Link } from 'react-router-dom';
import { Shield, ArrowUp, Code2 } from 'lucide-react';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-5 border-top" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', marginTop: '5rem' }}>
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-4 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <div
                className="d-flex align-items-center justify-content-center rounded p-1 text-white"
                style={{ backgroundColor: 'var(--accent-primary)', width: '28px', height: '28px' }}
              >
                <Code2 size={16} />
              </div>
              <span className="fw-bold fs-5 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                RISHE S
              </span>
            </div>
            <p className="small mb-0 text-muted">
              AI & Machine Learning Engineer • Full Stack MERN Developer
            </p>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link
              to="/admin/login"
              className="btn btn-sm d-inline-flex align-items-center gap-1 rounded-3 px-3 py-1 border text-decoration-none"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
                fontSize: '0.84rem'
              }}
            >
              <Shield size={14} style={{ color: 'var(--accent-primary)' }} />
              <span>Admin Login</span>
            </Link>

            <button
              onClick={scrollToTop}
              className="btn d-flex align-items-center justify-content-center rounded-circle border"
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        <div className="pt-4 text-center">
          <p className="small text-muted mb-0">
            © {new Date().getFullYear()} RISHE S. Developed with React & Node.js. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
