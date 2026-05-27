import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

function Register() {
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      await register(form);
      navigate('/dashboard/user');
    } catch (err) {
      setError(err.message || 'Unable to register.');
      setLoading(false);
    }
  };

  return (
    <section
      className="register-page"
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
      }}
    >
      {/* LEFT SIDE IMAGE SECTION */}
      <div
        className="register-left"
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.7))',
            zIndex: 1,
          }}
        ></div>

        <img
          src="https://ik.imagekit.io/8czehsmp7/usp.jpeg"
          alt="Trusted professionals"
          className="register-image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* RIGHT SIDE REGISTER FORM */}
      <div
        className="register-right"
        style={{
          flex: 1,
          background: '#000',
          color: '#fff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
        }}
      >
        <div
          className="auth-panel"
          style={{
            width: '100%',
            maxWidth: '420px',
            background: '#111',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid #222',
            boxShadow: '0 0 35px rgba(255,255,255,0.06)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            className="register-tag"
            style={{
              color: '#fff',
            }}
          >
            Create Account
          </div>

          <h2
            style={{
              color: '#fff',
            }}
          >
            Welcome Back 👋
          </h2>

          <p
            style={{
              color: '#d1d1d1',
            }}
          >
            Join Urban Service Provider Platform and book services instantly.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label
              style={{
                color: '#fff',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              Full Name
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={inputStyle}
              />
            </label>

            <label
              style={{
                color: '#fff',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              Email Address
              <input
                required
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={inputStyle}
              />
            </label>

            <label
              style={{
                color: '#fff',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              Password
              <input
                required
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                style={inputStyle}
              />
            </label>

            <label
              style={{
                color: '#fff',
                display: 'block',
                marginBottom: '20px',
              }}
            >
              Phone Number
              <input
                required
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                style={inputStyle}
              />
            </label>

            {error && (
              <p
                className="form-error"
                style={{
                  color: '#ff6b6b',
                }}
              >
                {error}
              </p>
            )}

            <button
              className="button button-block"
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                border: 'none',
                borderRadius: '12px',
                background: '#fff',
                color: '#000',
                fontWeight: '600',
                cursor: 'pointer',
                transition: '0.3s ease',
              }}
            >
              {loading ? <Loader /> : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

const inputStyle = {
  width: '100%',
  marginTop: '8px',
  padding: '13px',
  borderRadius: '12px',
  border: '1px solid #333',
  background: '#1a1a1a',
  color: '#fff',
  outline: 'none',
  fontSize: '15px',
};

export default Register;