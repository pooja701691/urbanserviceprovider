import { useEffect, useState } from 'react';
import AdminSidebar from '../components/Sidebar';
import { fetchServices } from '../services/serviceService';

function AdminProviders() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await fetchServices({ limit: 50 });
        setServices(data.services || []);
        setError('');
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Unable to load providers.');
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Providers Management</h1>
          <p>Manage the platform's active service providers and listings.</p>
        </header>

        <section className="admin-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Service Provider Listings</h3>
            <button className="button">📥 Export List</button>
          </div>

          {loading ? (
            <p>Loading providers...</p>
          ) : error ? (
            <p className="form-error">{error}</p>
          ) : (
            <div className="table-card">
              <div className="table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Provider</th>
                      <th>Service</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Reviews</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service._id}>
                        <td>{service.createdBy ? 'Verified Provider' : 'Platform'} </td>
                        <td>{service.title}</td>
                        <td>{service.category}</td>
                        <td>{[service.city, service.state].filter(Boolean).join(', ') || 'Unknown'}</td>
                        <td>{service.reviews?.length || 0}</td>
                        <td>
                          <button className="button button-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>View</button>
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

export default AdminProviders;
