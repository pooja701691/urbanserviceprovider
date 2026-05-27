import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getBookings, cancelBooking } from '../services/bookingService';

function UserDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const data = await getBookings();
        setBookings(data.bookings || []);
        setError('');
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Unable to load bookings.');
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to cancel booking.');
    }
  };

  const upcoming = bookings.filter(b => b.status === 'pending' || b.status === 'accepted').length;
  const completed = bookings.filter(b => b.status === 'completed').length;
  const cancelled = bookings.filter(b => b.status === 'cancelled').length;

  return (
    <section className="page-container dashboard-page">
      <div className="section-heading">
        <span className="eyebrow">User dashboard</span>
        <h2>Welcome back, {user?.name || 'Customer'}.</h2>
        <p>Manage your requests, upcoming bookings, and service history.</p>
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-icon">📅</div>
          <h3>Active bookings</h3>
          <p className="card-number">{upcoming}</p>
          <p className="card-text">scheduled appointments.</p>
        </article>
        <article className="dashboard-card">
          <div className="card-icon">⭐</div>
          <h3>Completed jobs</h3>
          <p className="card-number">{completed}</p>
          <p className="card-text">services completed successfully.</p>
        </article>
        <article className="dashboard-card">
          <div className="card-icon">🧾</div>
          <h3>Total requests</h3>
          <p className="card-number">{bookings.length}</p>
          <p className="card-text">bookings in your account.</p>
        </article>
        <article className="dashboard-card">
          <div className="card-icon">❌</div>
          <h3>Cancelled</h3>
          <p className="card-number">{cancelled}</p>
          <p className="card-text">cancelled bookings.</p>
        </article>
      </div>

      <div className="dashboard-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Your Bookings</h3>
          <button className="button" onClick={() => navigate('/booking')}>+ New Booking</button>
        </div>
        {loading ? (
          <p>Loading booking history...</p>
        ) : error ? (
          <p className="form-error">{error}</p>
        ) : bookings.length ? (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-item">
                <div>
                  <h4>{booking.service?.title ?? 'Service booked'}</h4>
                  <p>{booking.date} • {booking.time}</p>
                  <p style={{ fontSize: '0.85rem', color: '#888' }}>{booking.address}</p>
                  <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <span style={{ fontWeight: 600 }}>₹{booking.totalAmount || 0}</span>
                  {(booking.status === 'pending' || booking.status === 'accepted') && (
                    <button
                      className="button button-secondary"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', color: '#ef4444', borderColor: '#ef4444' }}
                      onClick={() => handleCancel(booking._id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No bookings yet</h2>
            <p>Book a service to get started with your first request.</p>
            <button className="button" onClick={() => navigate('/booking')}>Book a Service</button>
          </div>
        )}
      </div>
    </section>
  );
}

export default UserDashboard;
