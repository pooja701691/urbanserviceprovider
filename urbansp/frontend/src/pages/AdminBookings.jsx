import { useEffect, useState } from 'react';
import AdminSidebar from '../components/Sidebar';
import { getBookings, updateBookingStatus } from '../services/bookingService';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
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
    loadBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      setBookings((prev) => prev.map((booking) => (booking._id === id ? { ...booking, status } : booking)));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter.toLowerCase());

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Bookings Management</h1>
          <p>Track and manage all service bookings.</p>
        </header>

        <section className="admin-content">
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className={`button ${filter === 'all' ? '' : 'button-secondary'}`} onClick={() => setFilter('all')}>All</button>
            <button className={`button ${filter === 'completed' ? '' : 'button-secondary'}`} onClick={() => setFilter('completed')}>Completed</button>
            <button className={`button ${filter === 'accepted' ? '' : 'button-secondary'}`} onClick={() => setFilter('accepted')}>Accepted</button>
            <button className={`button ${filter === 'pending' ? '' : 'button-secondary'}`} onClick={() => setFilter('pending')}>Pending</button>
            <button className={`button ${filter === 'cancelled' ? '' : 'button-secondary'}`} onClick={() => setFilter('cancelled')}>Cancelled</button>
          </div>

          {loading ? (
            <p>Loading bookings...</p>
          ) : error ? (
            <p className="form-error">{error}</p>
          ) : (
            <div className="table-card">
              <div className="table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.user?.name || booking.user?.email || 'Customer'}</td>
                        <td>{booking.service?.title || 'Service'}</td>
                        <td>{booking.date} • {booking.time}</td>
                        <td>₹{booking.totalAmount || 0}</td>
                        <td>
                          <span className={`status-badge status-${booking.status}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                          >
                            {['pending', 'accepted', 'completed', 'cancelled'].map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
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
