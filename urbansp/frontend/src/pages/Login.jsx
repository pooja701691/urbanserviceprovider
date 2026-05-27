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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(form);
      // Redirect based on role
      if (user?.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/user');
      }
    } catch (err) {
      setError(err.message || 'Unable to login.');
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <h2>Login to your account</h2>
        <p>Access services, view bookings, and manage requests.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
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
            {loading ? <Loader /> : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account? <Link to="/register" className="link-button">Register</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
