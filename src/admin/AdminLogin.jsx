import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { api, setAuthToken } from '../services/api';
import styles from './AdminLogin.module.css';

function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login({ username, password });
      if (res.token) {
        setAuthToken(res.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={`${styles.loginCard} glass-card`}>
        <button onClick={() => navigate('/')} className={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Back to Portfolio</span>
        </button>

        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Shield size={28} />
          </div>
          <h2 className={styles.title}>Admin Portal</h2>
          <p className={styles.subtitle}>Sign in to manage projects, skills, and portfolio content.</p>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Username</label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.inputIcon} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin username"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={styles.input}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.loginBtn}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

          <div className={styles.credentialsHint}>
            <span>Default Admin: <strong>admin</strong> / <strong>admin123</strong></span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
