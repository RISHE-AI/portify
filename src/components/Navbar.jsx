import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Shield, Code2, Menu, X } from 'lucide-react';
import { useTheme } from '../common/ThemeContext';

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#hero' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    if (isAdminPath) return;
    if (href.startsWith('#')) {
      e.preventDefault();
      setMobileMenuOpen(false);
      const targetEl = document.querySelector(href);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed-top transition-all ${scrolled ? 'shadow-sm py-2' : 'py-2 py-md-3'}`}
      style={{
        backgroundColor: scrolled ? 'var(--nav-bg)' : 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.3s ease',
        zIndex: 1050
      }}
    >
      <div className="container d-flex align-items-center justify-content-between">
        {/* Logo */}
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <div
            className="d-flex align-items-center justify-content-center rounded"
            style={{
              width: '34px',
              height: '34px',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff'
            }}
          >
            <Code2 size={18} />
          </div>
          <span className="fw-bold fs-5 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            RISHE<span style={{ color: 'var(--accent-primary)' }}>.</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="d-none d-md-flex align-items-center gap-4">
          {!isAdminPath &&
            navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-decoration-none fw-medium"
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.name}
              </a>
            ))}
          {isAdminPath && (
            <Link to="/" className="text-decoration-none fw-medium" style={{ color: 'var(--text-primary)' }}>
              ← Back to Portfolio
            </Link>
          )}
        </nav>

        {/* Actions (Theme Switch, Admin, Mobile Toggle) */}
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={toggleTheme}
            className="btn d-flex align-items-center justify-content-center p-0 rounded-3 border"
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <Link
            to="/admin/login"
            className="btn d-inline-flex align-items-center gap-1 rounded-3 px-3 py-1 border text-decoration-none"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}
          >
            <Shield size={15} style={{ color: 'var(--accent-primary)' }} />
            <span>Admin</span>
          </Link>

          <button
            className="btn d-md-none p-1 border-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'var(--text-primary)' }}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="d-md-none border-bottom p-4 animate-fade-in"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="d-flex flex-column gap-3">
            {!isAdminPath &&
              navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-decoration-none fw-semibold fs-6"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {link.name}
                </a>
              ))}
            {isAdminPath && (
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-decoration-none fw-semibold fs-6" style={{ color: 'var(--text-primary)' }}>
                ← Back to Portfolio
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
