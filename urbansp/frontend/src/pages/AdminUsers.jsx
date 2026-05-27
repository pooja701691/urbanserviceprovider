import { useEffect, useState } from 'react';
import AdminSidebar from '../components/Sidebar';
import api from '../api/axios';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users');
        setUsers(response.data.users || []);
        setError('');
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Unable to load users.');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/users/role/${id}`, { role });
      setUsers((prev) => prev.map((user) => (user._id === id ? { ...user, role } : user)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Users Management</h1>
          <p>View and manage platform users.</p>
        </header>

        <section className="admin-content">
          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="form-error">{error}</p>
          ) : (
            <>
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Total Users: {users.length}</h3>
                <button className="button">📥 Export Users</button>
              </div>
              <div className="table-card">
                <div className="table-container">
                  <table className="bookings-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>{user.role}</td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="button button-secondary"
                              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                              onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'user' : 'admin')}
                            >
                              {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                            </button>
                          </td>
                        </tr>
                      ))}
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

export default AdminUsers;
