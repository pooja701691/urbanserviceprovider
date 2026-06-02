import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getNearbyServices } from '../services/serviceService';
import ProviderCard from '../components/ProviderCard';

function NearbyServices() {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    pincode:  user?.pincode  || '',
    city:     user?.city     || '',
    landmark: user?.landmark || '',
  });
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [searched, setSearched] = useState(false);

  const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!form.pincode && !form.city) { setError('Please enter Pincode or City.'); return; }
    setError(''); setLoading(true); setSearched(true);
    try {
      const res = await getNearbyServices({
        pincode: form.pincode, city: form.city, landmark: form.landmark, limit: 20,
      });
      setServices(res.services || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to load services.');
    } finally {
      setLoading(false);
    }
  };

  const providerList = services.map(s => ({
    id:          s._id,
    name:        s.title,
    initials:    s.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    category:    s.category,
    description: s.description,
    rating:      s.ratings || 4.6,
    reviews:     s.reviews?.length || 0,
  }));

  const inputStyle = {
    padding: '0.75rem 1rem', borderRadius: '12px',
    border: '1.5px solid var(--border)',
    background: 'var(--surface)', color: 'var(--text)', fontSize: '0.9rem',
    outline: 'none', width: '100%',
  };
  const labelStyle = { display: 'grid', gap: '0.4rem', fontWeight: 700, fontSize: '0.83rem', color: 'var(--text)' };

  return (
    <section className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <span className="eyebrow">Nearby services</span>
        <h2 style={{ margin: '0.5rem 0 0.5rem', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800 }}>
          Find Service Professionals Near You
        </h2>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          Enter your pincode or city to discover nearby service providers.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} style={{
        background: 'var(--surface)', padding: '1.5rem', borderRadius: '20px',
        boxShadow: 'var(--shadow)', marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <label style={labelStyle}>
            📮 Pincode
            <input name="pincode" value={form.pincode} onChange={set}
              placeholder="e.g. 110001" maxLength={6} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            🏙️ City
            <input name="city" value={form.city} onChange={set}
              placeholder="e.g. Delhi" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            🗺️ Landmark (optional)
            <input name="landmark" value={form.landmark} onChange={set}
              placeholder="e.g. Near Metro" style={inputStyle} />
          </label>
        </div>
        <button type="submit" className="button" disabled={loading} style={{ minWidth: '160px' }}>
          {loading ? 'Searching...' : '🔍 Find Services'}
        </button>
      </form>

      {/* Priority hint */}
      <div style={{
        marginBottom: '1.5rem', padding: '0.75rem 1rem',
        background: 'rgba(59,130,246,0.06)', borderRadius: '12px',
        fontSize: '0.85rem', color: 'var(--muted)',
      }}>
        🔎 Search priority: <strong style={{ color: 'var(--text)' }}>Pincode</strong> → <strong style={{ color: 'var(--text)' }}>Landmark</strong> → <strong style={{ color: 'var(--text)' }}>City</strong>
      </div>

      {error && <p className="form-error" style={{ marginBottom: '1rem' }}>{error}</p>}

      {searched && !loading && (
        <p style={{ marginBottom: '1rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
          {providerList.length > 0
            ? `Found ${providerList.length} service${providerList.length !== 1 ? 's' : ''}`
            : 'No services found. Try a different pincode, landmark or city.'}
        </p>
      )}

      <div className="provider-grid">
        {providerList.map(s => <ProviderCard key={s.id} provider={s} />)}
      </div>
    </section>
  );
}

export default NearbyServices;
