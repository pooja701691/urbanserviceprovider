import { useEffect, useState } from 'react';
import AdminSidebar from '../components/Sidebar';
import { fetchServices, createService, updateService, deleteService } from '../services/serviceService';

const CATEGORIES = ['Cleaning', 'Repair', 'Beauty', 'Moving', 'Plumber', 'Electrician', 'AC', 'Pest Control', 'Other'];
const emptyForm = { title: '', category: '', description: '', price: '', city: '', state: '', address: '' };

function AdminServices() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadServices = async () => {
    try {
      setLoading(true);
      const result = await fetchServices({ limit: 100 });
      setServices(result.services || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadServices(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImages([]);
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const openEdit = (service) => {
    setEditingId(service._id);
    setForm({
      title: service.title || '',
      category: service.category || '',
      description: service.description || '',
      price: service.price || '',
      city: service.city || '',
      state: service.state || '',
      address: service.address || '',
    });
    setImages([]);
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setImages([]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => { if (val) formData.append(key, val); });
      images.forEach(file => formData.append('images', file));

      if (editingId) {
        const updated = await updateService(editingId, formData);
        setServices(prev => prev.map(s => s._id === editingId ? updated.service : s));
        setSuccess('Service updated successfully.');
      } else {
        const created = await createService(formData);
        setServices(prev => [created.service, ...prev]);
        setSuccess('Service created successfully.');
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setImages([]);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service permanently?')) return;
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
          <p>Add, edit, and delete service listings on the platform.</p>
        </header>

        <section className="admin-content">
          {/* Top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>All Services ({services.length})</h3>
            {!showForm && (
              <button className="button" onClick={openAdd}>+ Add Service</button>
            )}
          </div>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          {/* Add / Edit Form */}
          {showForm && (
            <div className="table-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0 }}>{editingId ? '✏️ Edit Service' : '➕ Add New Service'}</h3>
                <button className="button button-secondary" onClick={handleCancel}>✕ Cancel</button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <label style={{ display: 'grid', gap: '0.4rem' }}>
                    Service Title *
                    <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. AC Repair" />
                  </label>
                  <label style={{ display: 'grid', gap: '0.4rem' }}>
                    Category *
                    <select required value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>
                </div>
                <label style={{ display: 'grid', gap: '0.4rem' }}>
                  Description *
                  <textarea required rows="3" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the service..." />
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <label style={{ display: 'grid', gap: '0.4rem' }}>
                    Price (₹) *
                    <input required type="number" min="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="e.g. 800" />
                  </label>
                  <label style={{ display: 'grid', gap: '0.4rem' }}>
                    City
                    <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="e.g. Delhi" />
                  </label>
                  <label style={{ display: 'grid', gap: '0.4rem' }}>
                    State
                    <input value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} placeholder="e.g. Delhi" />
                  </label>
                </div>
                <label style={{ display: 'grid', gap: '0.4rem' }}>
                  Address
                  <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Full address" />
                </label>
                <label style={{ display: 'grid', gap: '0.4rem' }}>
                  Images (up to 6) {editingId && <span style={{ fontSize: '0.8rem', color: '#888' }}>— leave empty to keep existing</span>}
                  <input type="file" accept="image/*" multiple onChange={e => setImages(Array.from(e.target.files).slice(0, 6))} />
                </label>
                <button type="submit" className="button" disabled={submitting} style={{ justifySelf: 'start', minWidth: '160px' }}>
                  {submitting ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? '✓ Update Service' : '✓ Create Service')}
                </button>
              </form>
            </div>
          )}

          {/* Services Table */}
          {loading ? (
            <p>Loading services...</p>
          ) : (
            <div className="table-card">
              <div className="table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Service Title</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Rating</th>
                      <th>Reviews</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.length ? services.map((service, i) => (
                      <tr key={service._id}>
                        <td style={{ color: '#888', fontSize: '0.85rem' }}>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{service.title}</td>
                        <td>
                          <span className="status-badge status-accepted" style={{ fontSize: '0.78rem' }}>
                            {service.category}
                          </span>
                        </td>
                        <td>{[service.city, service.state].filter(Boolean).join(', ') || '—'}</td>
                        <td style={{ fontWeight: 600 }}>₹{service.price}</td>
                        <td>{service.ratings ? service.ratings.toFixed(1) + ' ★' : '—'}</td>
                        <td>{service.reviews?.length || 0}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              className="button button-secondary"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                              onClick={() => openEdit(service)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="button button-secondary"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#ef4444', borderColor: '#ef4444' }}
                              onClick={() => handleDelete(service._id)}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', color: '#888', padding: '3rem' }}>
                          No services yet. Click "+ Add Service" to create one.
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

export default AdminServices;
