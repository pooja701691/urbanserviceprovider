import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function AuthModal({ isOpen, onClose, onSuccess }) {
  const { login, register } = useContext(AuthContext);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <h2>{mode === 'login' ? 'Welcome Back' : 'Join Us'}</h2>
          <p>
            {mode === 'login'
              ? 'Login to book services and manage your requests.'
              : 'Sign up to explore services and book appointments.'}
          </p>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <label>
                Full name
                <input required name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
              </label>
              <label>
                Phone number
                <input required name="phone" type="text" value={form.phone} onChange={handleChange} placeholder="Your phone" />
              </label>
            </>
          )}

          <label>
            Email address
            <input required name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input required name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="button button-block" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        <div className="modal-divider">
          <span>or</span>
        </div>

        <div className="modal-footer">
          {mode === 'login' ? (
            <>
              <p>New to USP?</p>
              <button type="button" className="link-button" onClick={() => { setMode('register'); setError(''); }}>
                Create an account
              </button>
            </>
          ) : (
            <>
              <p>Already have an account?</p>
              <button type="button" className="link-button" onClick={() => { setMode('login'); setError(''); }}>
                Login instead
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
