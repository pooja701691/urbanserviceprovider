import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getBookings } from '../services/bookingService';

function ProviderDashboard() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookings()
      .then(data => setBookings(data.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pending = bookings.filter(b => b.status === 'pending').length;
  const active = bookings.filter(b => b.status === 'accepted').length;
  const completed = bookings.filter(b => b.status === 'completed').length;
  const revenue = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <section className="page-container dashboard-page">
      <div className="section-heading">
        <span className="eyebrow">Provider dashboard</span>
        <h2>Manage your service requests, {user?.name || 'Partner'}.</h2>
        <p>Track new leads, confirm jobs, and keep your ratings high.</p>
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-icon">🔔</div>
          <h3>New leads</h3>
          <p className="card-number">{loading ? '...' : pending}</p>
          <p className="card-text">requests waiting for confirmation.</p>
        </article>
        <article className="dashboard-card">
          <div className="card-icon">⏳</div>
          <h3>Active jobs</h3>
          <p className="card-number">{loading ? '...' : active}</p>
          <p className="card-text">appointments in progress.</p>
        </article>
        <article className="dashboard-card">
          <div className="card-icon">⭐</div>
          <h3>Completed</h3>
          <p className="card-number">{loading ? '...' : completed}</p>
          <p className="card-text">jobs completed successfully.</p>
        </article>
        <article className="dashboard-card">
          <div className="card-icon">💰</div>
          <h3>Total Earnings</h3>
          <p className="card-number">₹{loading ? '...' : revenue.toLocaleString('en-IN')}</p>
          <p className="card-text">from completed bookings.</p>
        </article>
      </div>

      <div className="dashboard-section">
        <h3>Recent Service Requests</h3>
        {loading ? (
          <p>Loading...</p>
        ) : bookings.length ? (
          <div className="requests-list">
            {bookings.slice(0, 5).map(b => (
              <div key={b._id} className="request-item">
                <div>
                  <strong>{b.service?.title || 'Service'}</strong>
                  <p>{b.date} at {b.time}</p>
                  <span className={`status-badge status-${b.status}`}>{b.status}</span>
                </div>
                <span style={{ fontWeight: 600 }}>₹{b.totalAmount || 0}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '2rem 0' }}>
            <p>No service requests yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProviderDashboard;
