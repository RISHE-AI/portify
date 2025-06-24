import { useState } from 'react';
import styles from './ContactStyles.module.css';
import emailjs from 'emailjs-com';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    emailjs.send(
      'service_htjutg8', // replace with your EmailJS service ID
      'template_9755cdk', // replace with your EmailJS template ID
      {
        from_name: form.name,
        from_email: form.email,
        subject: form.subject,
        message: form.message,
      },
      'O-98xkd9yq2ghtwlC' // replace with your EmailJS public key
    )
    .then(() => {
      setStatus('Message sent!');
      setForm({ name: '', email: '', subject: '', message: '' });
    })
    .catch(() => {
      setStatus('Failed to send. Please try again.');
    });
  };

  return (
    <section id="contact" className={styles.container}>
      <div className={styles.contactContainer}>
        <div className={styles.contactInfo}>
          <h1 className={styles.title}>want to connect</h1>
          
          <div className={styles.infoSection}>
            <h2 className={styles.subtitle}>Email</h2>
            <p className={styles.infoText}>rishe8080s@gmail.com</p>
           
          </div>
          

          
          <div className={styles.infoSection}>
            <h2 className={styles.subtitle}>Phone</h2>
            <p className={styles.infoText}>+91 63832 40322</p>
          </div>
        </div>
        
        <div className={styles.contactForm}>
          <h2 className={styles.formTitle}>Get In Touch</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input 
                type="text" 
                name="name"
                placeholder="Your Name *"
                className={styles.formInput}
                value={form.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <input 
                type="email" 
                name="email"
                placeholder="Your Email *"
                className={styles.formInput}
                value={form.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <input 
                type="text" 
                name="subject"
                placeholder="Your Subject *"
                className={styles.formInput}
                value={form.subject}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <textarea 
                name="message"
                placeholder="Your Message *"
                className={styles.formTextarea}
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <button type="submit" className={styles.submitButton}>Contact Us</button>
            {status && <p style={{marginTop: '1rem'}}>{status}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;