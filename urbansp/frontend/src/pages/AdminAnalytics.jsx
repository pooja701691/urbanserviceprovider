import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/Sidebar';
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

function AdminAnalytics() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const response = await getAdminAnalytics();
        setStats(response);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Unable to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const revenueData = stats ? [
    { name: 'Users', value: stats.totalUsers },
    { name: 'Services', value: stats.totalServices },
    { name: 'Bookings', value: stats.totalBookings },
  ] : [];

  const categoryData = stats?.categoryStats?.map((entry, index) => ({
    name: entry.category,
    value: entry.count,
    color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5],
  })) || [];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Analytics</h1>
          <p>Insights and performance metrics for the platform.</p>
        </header>

        <section className="admin-content">
          {loading ? (
            <p>Loading analytics...</p>
          ) : error ? (
            <p className="form-error">{error}</p>
          ) : (
            <>
              <div className="stats-grid">
                <article className="stat-card">
                  <div className="stat-icon stat-icon-blue">👥</div>
                  <div>
                    <p className="stat-label">Total Users</p>
                    <p className="stat-value">{stats.totalUsers}</p>
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-icon stat-icon-green">📅</div>
                  <div>
                    <p className="stat-label">Total Bookings</p>
                    <p className="stat-value">{stats.totalBookings}</p>
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-icon stat-icon-orange">🔧</div>
                  <div>
                    <p className="stat-label">Total Services</p>
                    <p className="stat-value">{stats.totalServices}</p>
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-icon stat-icon-purple">💰</div>
                  <div>
                    <p className="stat-label">Total Revenue</p>
                    <p className="stat-value">₹{stats.totalRevenue}</p>
                  </div>
                </article>
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Platform activity</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Count" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h3>Service categories</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="table-card">
                <div className="table-header">
                  <h3>Booking status breakdown</h3>
                </div>
                <div className="table-container">
                  <table className="bookings-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Pending</td>
                        <td>{stats.pendingBookings}</td>
                      </tr>
                      <tr>
                        <td>Completed</td>
                        <td>{stats.completedBookings}</td>
                      </tr>
                      <tr>
                        <td>Cancelled</td>
                        <td>{stats.totalBookings - stats.completedBookings - stats.pendingBookings}</td>
                      </tr>
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

export default AdminAnalytics;
