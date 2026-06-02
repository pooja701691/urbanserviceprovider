import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const HERO_IMG = 'https://ik.imagekit.io/8czehsmp7/Screenshot%202026-05-26%20130459.png';

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    role: 'user', address: '', city: '', state: '', pincode: '', landmark: '',
  });
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (e) => {
    const { name, value } = e.target;
    // Allow only digits for phone field
    if (name === 'phone') {
      setForm(p => ({ ...p, phone: value.replace(/\D/g, '').slice(0, 10) }));
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
  };

  const validate = () => {
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.phone && form.phone.length !== 10) return 'Phone number must be exactly 10 digits.';
    if (!form.city || !form.state || !form.pincode) return 'City, State and Pincode are required.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setError(''); setLoading(true);
    try {
      const user = await register({
        name: form.name, email: form.email, phone: form.phone,
        password: form.password, role: form.role,
        address: form.address, city: form.city, state: form.state,
        pincode: form.pincode, landmark: form.landmark,
      });
      navigate(user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user');
    } catch (err) {
      setError(err.message || 'Unable to register.');
      setLoading(false);
    }
  };

  return (
    <div className="rp-page">
      {/* LEFT — image only */}
      <div className="rp-left">
        <img src={HERO_IMG} alt="USP" className="rp-bg-img" />
      </div>

      {/* RIGHT — form */}
      <div className="rp-right">
        <div className="rp-card">
          <div className="rp-card-head">
            <span className="rp-free-badge">✨ Free Registration</span>
            <h2 className="rp-card-h2">Create your account</h2>
            <p className="rp-card-sub">Fill in your details to get started instantly</p>
          </div>

          <form onSubmit={handleSubmit} className="rp-form">

            {/* Name + Phone */}
            <div className="rp-row">
              <div className="rp-field">
                <label>Full Name *</label>
                <div className="rp-inp-wrap">
                  <span className="rp-inp-ico">👤</span>
                  <input required name="name" value={form.name} onChange={set} placeholder="John Doe" />
                </div>
              </div>
              <div className="rp-field">
                <label>
                  Phone Number
                  {form.phone.length > 0 && form.phone.length < 10 && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', marginLeft: '0.4rem' }}>
                      {10 - form.phone.length} more digits
                    </span>
                  )}
                  {form.phone.length === 10 && (
                    <span style={{ color: '#22c55e', fontSize: '0.75rem', marginLeft: '0.4rem' }}>✓</span>
                  )}
                </label>
                <div className="rp-inp-wrap">
                  <span className="rp-inp-ico">📱</span>
                  <input
                    name="phone" type="tel" inputMode="numeric"
                    value={form.phone} onChange={set}
                    placeholder="10-digit number"
                    maxLength={10}
                    style={{ letterSpacing: form.phone.length > 0 ? '0.1rem' : 'normal' }}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="rp-field">
              <label>Email Address *</label>
              <div className="rp-inp-wrap">
                <span className="rp-inp-ico">✉️</span>
                <input required name="email" type="email" value={form.email} onChange={set} placeholder="you@example.com" />
              </div>
            </div>

            {/* Passwords */}
            <div className="rp-row">
              <div className="rp-field">
                <label>Password *</label>
                <div className="rp-inp-wrap">
                  <span className="rp-inp-ico">🔒</span>
                  <input required name="password" type={showPass ? 'text' : 'password'}
                    value={form.password} onChange={set} placeholder="Min. 6 characters" />
                  <button type="button" className="rp-eye" onClick={() => setShowPass(p => !p)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="rp-field">
                <label>Confirm Password *</label>
                <div className="rp-inp-wrap">
                  <span className="rp-inp-ico">🔒</span>
                  <input required name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword} onChange={set} placeholder="Re-enter password" />
                  <button type="button" className="rp-eye" onClick={() => setShowConfirm(p => !p)}>
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="rp-field">
              <label>Permanent Address</label>
              <div className="rp-inp-wrap">
                <span className="rp-inp-ico">🏠</span>
                <input name="address" value={form.address} onChange={set} placeholder="House / Flat / Street" />
              </div>
            </div>

            <div className="rp-row">
              <div className="rp-field">
                <label>City *</label>
                <div className="rp-inp-wrap">
                  <span className="rp-inp-ico">🏙️</span>
                  <input required name="city" value={form.city} onChange={set} placeholder="e.g. Delhi" />
                </div>
              </div>
              <div className="rp-field">
                <label>State *</label>
                <div className="rp-inp-wrap">
                  <span className="rp-inp-ico">📍</span>
                  <input required name="state" value={form.state} onChange={set} placeholder="e.g. Delhi" />
                </div>
              </div>
            </div>

            <div className="rp-row">
              <div className="rp-field">
                <label>Pincode *</label>
                <div className="rp-inp-wrap">
                  <span className="rp-inp-ico">🔢</span>
                  <input required name="pincode" value={form.pincode}
                    onChange={e => setForm(p => ({ ...p, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                    placeholder="6-digit pincode" maxLength={6} inputMode="numeric" />
                </div>
              </div>
              <div className="rp-field">
                <label>Nearby Landmark</label>
                <div className="rp-inp-wrap">
                  <span className="rp-inp-ico">🗺️</span>
                  <input name="landmark" value={form.landmark} onChange={set} placeholder="e.g. Near Metro Station" />
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="rp-role-section">
              <span className="rp-role-label">Select Your Role</span>
              <div className="rp-role-grid">
                <label className={`rp-role-card ${form.role === 'user' ? 'rp-role-user-on' : ''}`}>
                  <input type="radio" name="role" value="user" checked={form.role === 'user'} onChange={set} />
                  <div className="rp-role-ico rp-role-ico-user">👤</div>
                  <div className="rp-role-txt">
                    <strong>User</strong>
                    <p>Book services &amp; track orders</p>
                  </div>
                  <div className={`rp-check ${form.role === 'user' ? 'rp-check-on' : ''}`}>✓</div>
                </label>
                <label className={`rp-role-card ${form.role === 'admin' ? 'rp-role-admin-on' : ''}`}>
                  <input type="radio" name="role" value="admin" checked={form.role === 'admin'} onChange={set} />
                  <div className="rp-role-ico rp-role-ico-admin">🛡️</div>
                  <div className="rp-role-txt">
                    <strong>Admin</strong>
                    <p>Manage platform &amp; analytics</p>
                  </div>
                  <div className={`rp-check ${form.role === 'admin' ? 'rp-check-on rp-check-admin' : ''}`}>✓</div>
                </label>
              </div>
            </div>

            {error && <div className="rp-error">⚠️ {error}</div>}

            <button type="submit" disabled={loading}
              className={`rp-btn ${form.role === 'admin' ? 'rp-btn-admin' : 'rp-btn-user'}`}>
              {loading ? <Loader /> : (form.role === 'admin' ? '🛡️ Create Admin Account' : '🚀 Create User Account')}
            </button>

          </form>

          <p className="rp-signin">
            Already have an account? <Link to="/login">Sign in here →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
