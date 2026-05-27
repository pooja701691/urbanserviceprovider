import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getAdminAnalytics } from '../services/adminService';
import { getBookings } from '../services/bookingService';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [analyticsData, bookingsData] = await Promise.all([
          getAdminAnalytics(),
          getBookings(),
        ]);
        setStats(analyticsData);
        setRecentBookings((bookingsData.bookings || []).slice(0, 5));
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const monthlyData = stats?.monthlyBookings?.map(item => ({
    month: MONTH_NAMES[(item._id || 1) - 1],
    bookings: item.count,
    revenue: item.revenue,
  })) || [];

  const categoryData = stats?.categoryStats?.map((entry, index) => ({
    name: entry.category,
    value: entry.count,
    color: PIE_COLORS[index % PIE_COLORS.length],
  })) || [];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name || 'Administrator'}.</p>
        </header>

        <section className="admin-content">
          {loading ? (
            <p>Loading dashboard...</p>
          ) : error ? (
            <p className="form-error">{error}</p>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="stats-grid">
                <article className="stat-card">
                  <div className="stat-icon stat-icon-blue">👥</div>
                  <div>
                    <p className="stat-label">Total Users</p>
                    <p className="stat-value">{stats?.totalUsers ?? 0}</p>
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-icon stat-icon-green">📅</div>
                  <div>
                    <p className="stat-label">Total Bookings</p>
                    <p className="stat-value">{stats?.totalBookings ?? 0}</p>
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-icon stat-icon-orange">🔧</div>
                  <div>
                    <p className="stat-label">Total Services</p>
                    <p className="stat-value">{stats?.totalServices ?? 0}</p>
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-icon stat-icon-purple">💰</div>
                  <div>
                    <p className="stat-label">Total Revenue</p>
                    <p className="stat-value">₹{(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}</p>
                  </div>
                </article>
              </div>

              {/* Charts */}
              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Monthly Bookings &amp; Revenue</h3>
                  {monthlyData.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="#3b82f6" name="Bookings" />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue (₹)" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No booking data yet</p>
                  )}
                </div>

                <div className="chart-card">
                  <h3>Services by Category</h3>
                  {categoryData.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={90}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No services yet</p>
                  )}
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="table-card">
                <div className="table-header">
                  <h3>Recent Bookings</h3>
                  <button className="link-button" onClick={() => navigate('/dashboard/admin/bookings')}>View All</button>
                </div>
                <div className="table-container">
                  <table className="bookings-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.length ? recentBookings.map(booking => (
                        <tr key={booking._id}>
                          <td>{booking.user?.name || booking.user?.email || 'Customer'}</td>
                          <td>{booking.service?.title || 'Service'}</td>
                          <td>{booking.date} • {booking.time}</td>
                          <td>
                            <span className={`status-badge status-${booking.status}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td>₹{booking.totalAmount || 0}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>No bookings yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
