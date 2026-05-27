import { useEffect, useState } from 'react';
import AdminSidebar from '../components/Sidebar';
import { fetchServices, createService, deleteService } from '../services/serviceService';

const CATEGORIES = ['Cleaning', 'Repair', 'Beauty', 'Moving', 'Plumber', 'Electrician', 'AC', 'Pest Control', 'Other'];

const emptyForm = { title: '', category: '', description: '', price: '', city: '', state: '', address: '' };

function AdminServices() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newService, setNewService] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const result = await fetchServices({ limit: 50 });
        setServices(result.services || []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Unable to load services.');
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const handleAddService = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      // Use FormData to support image uploads
      const formData = new FormData();
      Object.entries(newService).forEach(([key, val]) => {
        if (val) formData.append(key, val);
      });
      images.forEach(file => formData.append('images', file));

      const created = await createService(formData);
      setServices(prev => [created.service, ...prev]);
      setNewService(emptyForm);
      setImages([]);
      setShowForm(false);
      setSuccess('Service created successfully.');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to create service.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await deleteService(id);
      setServices(prev => prev.filter(s => s._id !== id));
      setSuccess('Service deleted.');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to delete service.');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-header">
          <h1>Services Management</h1>
          <p>Add, edit, and manage service listings on the platform.</p>
        </header>

        <section className="admin-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>All Services ({services.length})</h3>
            <button className="button" onClick={() => { setShowForm(prev => !prev); setError(''); setSuccess(''); }}>
              {showForm ? '✕ Cancel' : '+ Add Service'}
            </button>
          </div>

          {error && <p className="form-error" style={{ marginBottom: '1rem' }}>{error}</p>}
          {success && <p className="success-message" style={{ marginBottom: '1rem' }}>{success}</p>}

          {showForm && (
            <div className="table-card" style={{ marginBottom: '1.5rem' }}>
              <form onSubmit={handleAddService} style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  Service Title *
                  <input required value={newService.title} onChange={e => setNewService({ ...newService, title: e.target.value })} placeholder="e.g. AC Repair" />
                </label>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  Category *
                  <select required value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  Description *
                  <textarea required value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} rows="3" placeholder="Describe the service..." />
                </label>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  Price (₹) *
                  <input required type="number" min="0" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} placeholder="e.g. 800" />
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <label style={{ display: 'grid', gap: '0.5rem' }}>
                    City
                    <input value={newService.city} onChange={e => setNewService({ ...newService, city: e.target.value })} placeholder="e.g. Lucknow" />
                  </label>
                  <label style={{ display: 'grid', gap: '0.5rem' }}>
                    State
                    <input value={newService.state} onChange={e => setNewService({ ...newService, state: e.target.value })} placeholder="e.g. Uttar Pradesh" />
                  </label>
                </div>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  Address
                  <input value={newService.address} onChange={e => setNewService({ ...newService, address: e.target.value })} placeholder="Full address" />
                </label>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  Images (up to 6)
                  <input type="file" accept="image/*" multiple onChange={e => setImages(Array.from(e.target.files).slice(0, 6))} />
                </label>
                <button type="submit" className="button" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Service'}
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <p>Loading services...</p>
          ) : (
            <div className="table-card">
              <div className="table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Reviews</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.length ? services.map(service => (
                      <tr key={service._id}>
                        <td>{service.title}</td>
                        <td>{service.category}</td>
                        <td>{[service.city, service.state].filter(Boolean).join(', ') || '—'}</td>
                        <td>₹{service.price}</td>
                        <td>{service.reviews?.length || 0}</td>
                        <td>
                          <button
                            className="button button-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#ef4444', borderColor: '#ef4444' }}
                            onClick={() => handleDelete(service._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>No services yet</td></tr>
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

export default AdminServices;
