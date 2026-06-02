import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return (
      <section className="auth-page">
        <div className="auth-panel" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
          <h2 style={{ margin: '0 0 0.5rem' }}>Access Denied</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
            This page is restricted to <strong>Admin</strong> accounts only.<br />
            Your current role is <span className="role-badge role-badge-user">User</span>
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="button" onClick={() => navigate('/dashboard/user')}>
              Go to My Dashboard
            </button>
            <button className="button button-secondary" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return children;
}

export default ProtectedRoute;
