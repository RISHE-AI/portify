import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import emailjs from 'emailjs-com';
import { GithubIcon, LinkedinIcon } from './Icons';
import { api } from '../services/api';

function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const pData = profile || {
    name: 'Rishe S',
    email: 'rishe8080s@gmail.com',
    phone: '+91 63832 40322',
    location: 'Namakkal / Erode, Tamil Nadu, India',
    github: 'https://github.com/RISHE-AI',
    linkedin: 'https://linkedin.com/in/rishe-aiml/',
    emailjsServiceId: 'service_htjutg8',
    emailjsTemplateId: 'template_9755cdk',
    emailjsPublicKey: 'O-98xkd9yq2ghtwlC'
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', text: 'Please fill in all required fields (Name, Email, Message).' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', text: '' });

    const serviceId = pData.emailjsServiceId || 'service_htjutg8';
    const templateId = pData.emailjsTemplateId || 'template_9755cdk';
    const publicKey = pData.emailjsPublicKey || 'O-98xkd9yq2ghtwlC';

    let emailJsSuccess = false;
    let apiSuccess = false;
    let lastError = null;

    // 1. Send via EmailJS directly to Rishe's configured mail account
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject || 'Portfolio Inquiry from ' + form.name,
          message: form.message,
          to_name: pData.name || 'Rishe S',
          reply_to: form.email
        },
        publicKey
      );
      emailJsSuccess = true;
    } catch (err) {
      console.warn('EmailJS dispatch notice:', err);
      lastError = err;
    }

    // 2. Also persist to backend database so Admin Dashboard tracks it
    try {
      await api.sendMessage({
        name: form.name,
        email: form.email,
        subject: form.subject || 'Portfolio Contact Form',
        message: form.message,
        emailSent: emailJsSuccess
      });
      apiSuccess = true;
    } catch (err) {
      console.warn('API message save notice:', err);
      if (!lastError) lastError = err;
    }

    if (emailJsSuccess || apiSuccess) {
      setStatus({
        type: 'success',
        text: 'Thank you! Your message has been sent successfully. I will get back to you shortly.'
      });
      setForm({ name: '', email: '', subject: '', message: '' });
    } else {
      setStatus({
        type: 'error',
        text: lastError?.text || lastError?.message || 'Failed to send message. Please email directly to ' + (pData.email || 'rishe8080s@gmail.com')
      });
    }

    setLoading(false);
  };

  return (
    <section id="contact" className="py-5">
      <div className="container">
        <div className="section-header animate-fade-in">
          <span className="section-tag">Direct Communication</span>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Interested in hiring me, exploring collaboration, or discussing an AI project? Reach out below.
          </p>
        </div>

        <div className="row g-5">
          {/* Left Column: Direct Contact Info Cards */}
          <div className="col-lg-5 animate-fade-in">
            <h3 className="h4 fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Contact Information
            </h3>
            <p className="small mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Feel free to reach out directly via email, phone, or LinkedIn. I am always open to exploring exciting engineering challenges and internship opportunities.
            </p>

            <div className="d-flex flex-column gap-3 mb-4">
              <div className="card glass-card border-0 p-3 d-flex flex-row align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 p-2"
                  style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                >
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-muted text-uppercase" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                    Email
                  </div>
                  <a href={`mailto:${pData.email}`} className="text-decoration-none fw-semibold small" style={{ color: 'var(--text-primary)' }}>
                    {pData.email || 'rishe8080s@gmail.com'}
                  </a>
                </div>
              </div>

              <div className="card glass-card border-0 p-3 d-flex flex-row align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 p-2"
                  style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                >
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-muted text-uppercase" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                    Phone
                  </div>
                  <a href={`tel:${pData.phone}`} className="text-decoration-none fw-semibold small" style={{ color: 'var(--text-primary)' }}>
                    {pData.phone || '+91 63832 40322'}
                  </a>
                </div>
              </div>

              <div className="card glass-card border-0 p-3 d-flex flex-row align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 p-2"
                  style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                >
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-muted text-uppercase" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                    Location
                  </div>
                  <div className="fw-semibold small" style={{ color: 'var(--text-primary)' }}>
                    {pData.location || 'Namakkal / Erode, Tamil Nadu'}
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <span className="small fw-medium text-muted">Follow Me:</span>
              <div className="d-flex align-items-center gap-2">
                {pData.github && (
                  <a
                    href={pData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn d-flex align-items-center justify-content-center p-0 rounded-circle border text-decoration-none"
                    style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)'
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
                    className="btn d-flex align-items-center justify-content-center p-0 rounded-circle border text-decoration-none"
                    style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)'
                    }}
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="col-lg-7 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="card glass-card border-0 p-4 p-md-5">
              <h3 className="h4 fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Send a Message
              </h3>

              {status.text && (
                <div
                  className={`alert d-flex align-items-center gap-2 mb-4 border rounded-3 small ${
                    status.type === 'success' ? 'alert-success' : 'alert-danger'
                  }`}
                >
                  {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{status.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="form-control rounded-3 p-2 px-3 border"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>
                      Your Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="form-control rounded-3 p-2 px-3 border"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Project Inquiry / Job Opportunity"
                    value={form.subject}
                    onChange={handleChange}
                    className="form-control rounded-3 p-2 px-3 border"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Type your message here..."
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="form-control rounded-3 p-2 px-3 border"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  ></textarea>
                </div>

                <button type="submit" disabled={loading} className="btn-custom-primary">
                  {loading ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
