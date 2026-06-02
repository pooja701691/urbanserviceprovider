import { useEffect, useState } from 'react';
import AdminSidebar from '../components/Sidebar';
import { getBookings, updateBookingStatus } from '../services/bookingService';

const STATUSES = ['all', 'pending', 'accepted', 'completed', 'cancelled'];

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getBookings();
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Unable to load bookings.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Status update failed.');
    }
  };

  const filtered = bookings
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        b.user?.name?.toLowerCase().includes(q) ||
        b.user?.email?.toLowerCase().includes(q) ||
        b.service?.title?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q)
      );
    });

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = s === 'all' ? bookings.length : bookings.filter(b => b.status === s).length;
    return acc;
  }, {});

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-header">
          <h1>Bookings Management</h1>
          <p>View all booking requests, user details, and update statuses.</p>
        </header>

        <section className="admin-content">
          {/* Summary cards */}
          <div className="stats-grid">
            <article className="stat-card">
              <div className="stat-icon stat-icon-blue">📋</div>
              <div>
                <p className="stat-label">Total Bookings</p>
                <p className="stat-value">{bookings.length}</p>
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-icon stat-icon-orange">⏳</div>
              <div>
                <p className="stat-label">Pending</p>
                <p className="stat-value">{counts.pending}</p>
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-icon stat-icon-green">✅</div>
              <div>
                <p className="stat-label">Completed</p>
                <p className="stat-value">{counts.completed}</p>
              </div>
            </article>
            <article className="stat-card">
              <div className="stat-icon stat-icon-purple">💰</div>
              <div>
                <p className="stat-label">Revenue</p>
                <p className="stat-value">
                  ₹{bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.totalAmount || 0), 0).toLocaleString('en-IN')}
                </p>
              </div>
            </article>
          </div>

          {/* Filters + Search */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {STATUSES.map(s => (
                <button
                  key={s}
                  className={`button ${filter === s ? '' : 'button-secondary'}`}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', textTransform: 'capitalize' }}
                  onClick={() => setFilter(s)}
                >
                  {s} ({counts[s]})
                </button>
              ))}
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by user, service, address..."
              style={{ padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', flex: '1', minWidth: '200px', background: 'var(--surface)', color: 'var(--text)' }}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          {loading ? (
            <p>Loading bookings...</p>
          ) : (
            <div className="table-card">
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Showing {filtered.length} booking{filtered.length !== 1 ? 's' : ''}</span>
                <span style={{ fontSize: '0.85rem', color: '#888' }}>Click a row to see full details</span>
              </div>
              <div className="table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Service</th>
                      <th>Date & Time</th>
                      <th>Address</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length ? filtered.map((booking, i) => (
                      <>
                        <tr
                          key={booking._id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                        >
                          <td style={{ color: '#888', fontSize: '0.85rem' }}>{i + 1}</td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{booking.user?.name || 'Customer'}</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{booking.user?.email || '—'}</div>
                          </td>
                          <td style={{ fontSize: '0.9rem' }}>{booking.user?.phone || '—'}</td>
                          <td style={{ fontWeight: 500 }}>{booking.service?.title || 'Service'}</td>
                          <td>
                            <div>{booking.date}</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{booking.time}</div>
                          </td>
                          <td style={{ maxWidth: '160px', fontSize: '0.85rem', color: '#888' }}>
                            {booking.address || '—'}
                          </td>
                          <td style={{ fontWeight: 600 }}>₹{booking.totalAmount || 0}</td>
                          <td>
                            <span className={`status-badge status-${booking.status}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td onClick={e => e.stopPropagation()}>
                            <select
                              value={booking.status}
                              onChange={e => handleStatusUpdate(booking._id, e.target.value)}
                              style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.85rem' }}
                            >
                              {['pending', 'accepted', 'completed', 'cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                        {expandedId === booking._id && (
                          <tr key={`${booking._id}-detail`} style={{ background: 'rgba(59,130,246,0.04)' }}>
                            <td colSpan={9} style={{ padding: '1rem 1.5rem' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
                                <div>
                                  <strong>👤 Customer Details</strong>
                                  <p style={{ margin: '0.4rem 0 0', color: '#888' }}>
                                    Name: {booking.user?.name || '—'}<br />
                                    Email: {booking.user?.email || '—'}<br />
                                    Phone: {booking.user?.phone || '—'}
                                  </p>
                                </div>
                                <div>
                                  <strong>🔧 Service Details</strong>
                                  <p style={{ margin: '0.4rem 0 0', color: '#888' }}>
                                    Service: {booking.service?.title || '—'}<br />
                                    Category: {booking.service?.category || '—'}<br />
                                    Price: ₹{booking.service?.price || booking.totalAmount || 0}
                                  </p>
                                </div>
                                <div>
                                  <strong>📍 Booking Details</strong>
                                  <p style={{ margin: '0.4rem 0 0', color: '#888' }}>
                                    Date: {booking.date}<br />
                                    Time: {booking.time}<br />
                                    Address: {booking.address || '—'}
                                  </p>
                                </div>
                                <div>
                                  <strong>📅 Created</strong>
                                  <p style={{ margin: '0.4rem 0 0', color: '#888' }}>
                                    {booking.createdAt ? new Date(booking.createdAt).toLocaleString('en-IN') : '—'}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )) : (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', color: '#888', padding: '3rem' }}>
                          No bookings found for this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminBookings;
