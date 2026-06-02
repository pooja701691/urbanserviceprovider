import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

function VerifyOTP() {
  const { verify, resend } = useContext(AuthContext);
  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = location.state?.email || '';

  const [otp,      setOtp]      = useState('');
  const [loading,  setLoading]  = useState(false);
  const [resending,setResending]= useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [timer,    setTimer]    = useState(300); // 5 min

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const mm = String(Math.floor(timer / 60)).padStart(2, '0');
  const ss = String(timer % 60).padStart(2, '0');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setError('Enter a valid 6-digit OTP.'); return; }
    setError(''); setLoading(true);
    try {
      const user = await verify({ email, otp });
      navigate(user.role === 'admin' ? '/dashboard/admin' : '/dashboard/user');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(''); setSuccess(''); setResending(true);
    try {
      await resend(email);
      setTimer(300);
      setOtp('');
      setSuccess('New OTP sent to your email!');
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  if (!email) return (
    <section className="auth-page">
      <div className="auth-panel" style={{ textAlign: 'center' }}>
        <p>No email found. <Link to="/register" className="link-button">Register again</Link></p>
      </div>
    </section>
  );

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📧</div>
          <h2 style={{ margin: '0 0 0.4rem', fontWeight: 800 }}>Verify your email</h2>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>
            We sent a 6-digit OTP to<br />
            <strong style={{ color: 'var(--text)' }}>{email}</strong>
          </p>
        </div>

        {/* Dev hint */}
        {import.meta.env.DEV && (
          <div style={{
            marginBottom: '1rem', padding: '0.75rem 1rem',
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '12px', fontSize: '0.82rem', color: '#92400e',
          }}>
            <strong>Dev mode:</strong> If email is not configured, check the <strong>backend server console</strong> for the OTP.
          </div>
        )}

        {/* Timer */}
        <div style={{
          textAlign: 'center', padding: '0.7rem 1rem', marginBottom: '1.25rem',
          borderRadius: '12px', fontWeight: 700, fontSize: '1rem',
          background: timer > 60 ? 'rgba(59,130,246,0.08)' : 'rgba(239,68,68,0.08)',
          color: timer > 60 ? '#2563eb' : '#dc2626',
        }}>
          ⏱️ {mm}:{ss} {timer === 0 && '— OTP expired'}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Enter OTP
            <input
              required maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="• • • • • •"
              style={{ fontSize: '1.6rem', letterSpacing: '0.6rem', textAlign: 'center', fontWeight: 800 }}
            />
          </label>

          {error   && <p className="form-error">{error}</p>}
          {success && <p className="success-message" style={{ margin: 0 }}>{success}</p>}

          <button className="button button-block" type="submit" disabled={loading || timer === 0}>
            {loading ? <Loader /> : '✅ Verify & Continue'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.5rem', color: 'var(--muted)', fontSize: '0.88rem' }}>
            Didn't receive the OTP?
          </p>
          <button
            className="link-button"
            onClick={handleResend}
            disabled={resending || timer > 240}
          >
            {resending ? 'Sending...' : timer > 240 ? `Resend available in ${timer - 240}s` : '🔁 Resend OTP'}
          </button>
        </div>

        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--muted)' }}>
          Wrong email? <Link to="/register" className="link-button">Go back</Link>
        </p>
      </div>
    </section>
  );
}

export default VerifyOTP;
