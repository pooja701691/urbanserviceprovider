import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form);
      navigate(user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user');
    } catch (err) {
      // Unverified user — redirect to OTP page
      if (err.needsVerification) {
        navigate('/verify-otp', { state: { email: err.email } });
        return;
      }
      setError(err.message || 'Unable to login.');
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span className="brand-mark" style={{ margin: '0 auto 1rem', width: 56, height: 56, fontSize: '1.4rem', borderRadius: 18 }}>USP</span>
          <h2 style={{ margin: '0.75rem 0 0.25rem', fontWeight: 800 }}>Welcome back</h2>
          <p style={{ margin: 0, color: 'var(--muted)' }}>Login to access your dashboard</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <input required name="email" type="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input required name="password" type="password" value={form.password}
              onChange={handleChange} placeholder="••••••••" />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button-block" type="submit" disabled={loading}>
            {loading ? <Loader /> : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', padding: '0.9rem 1rem', background: 'rgba(59,130,246,0.06)', borderRadius: '14px', fontSize: '0.85rem', color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--text)' }}>Demo credentials:</strong><br />
          👤 User — user@usp.com / password123<br />
          🛡️ Admin — admin@usp.com / password123
        </div>

        <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--muted)' }}>
          Don't have an account? <Link to="/register" className="link-button">Register</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
