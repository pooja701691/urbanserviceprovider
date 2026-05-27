import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function ProviderDashboard() {
  const { user } = useContext(AuthContext);

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
          <p className="card-number">4</p>
          <p className="card-text">requests waiting for confirmation.</p>
        </article>
        <article className="dashboard-card">
          <div className="card-icon">⏳</div>
          <h3>Active jobs</h3>
          <p className="card-number">2</p>
          <p className="card-text">appointments scheduled for today.</p>
        </article>
        <article className="dashboard-card">
          <div className="card-icon">⭐</div>
          <h3>Performance</h3>
          <p className="card-number">4.8</p>
          <p className="card-text">average rating across 154 reviews.</p>
        </article>
        <article className="dashboard-card">
          <div className="card-icon">💰</div>
          <h3>Total Earnings</h3>
          <p className="card-number">₹28,500</p>
          <p className="card-text">this month so far.</p>
        </article>
      </div>

      <div className="dashboard-section">
        <h3>Recent Service Requests</h3>
        <div className="requests-list">
          <div className="request-item">
            <div><strong>Home Cleaning</strong><br /><small>May 20, 2025 at 10:00 AM</small></div>
            <button className="button button-secondary">Accept</button>
          </div>
          <div className="request-item">
            <div><strong>Kitchen Deep Cleaning</strong><br /><small>May 21, 2025 at 02:00 PM</small></div>
            <button className="button button-secondary">Accept</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProviderDashboard;
