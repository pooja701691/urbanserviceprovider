import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchServices } from '../services/serviceService';
import SearchBar from '../components/SearchBar';
import ProviderCard from '../components/ProviderCard';

const categories = ['Cleaning', 'Repair', 'Beauty', 'Moving', 'Plumber', 'Electrician'];

function Services() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchServices({ search, category, limit: 24 });
        setServices(data.services || []);
        setError('');
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Unable to load services.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, category]);

  const providerList = useMemo(
    () => services.map(service => ({
      id: service._id,
      name: service.title,
      initials: service.title.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase(),
      category: service.category,
      description: service.description,
      rating: service.ratings || 4.5,
      reviews: service.reviews?.length || 0,
    })),
    [services]
  );

  return (
    <section className="page-container">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Browse services</span>
          <h2>Find the right service provider for your home or business.</h2>
          <p>Filter by category, search by skill, and compare top-rated professionals.</p>
        </div>
      </div>

      <div className="hero-actions" style={{ gap: '1rem', flexWrap: 'wrap' }}>
        <SearchBar placeholder="Search services or providers" onSearch={setSearch} />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      {error && <p className="form-error">{error}</p>}
      {loading ? (
        <p>Loading services...</p>
      ) : (
        <div className="provider-grid" style={{ marginTop: '2rem' }}>
          {providerList.length ? providerList.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          )) : (
            <div className="empty-state">
              <h2>No services found</h2>
              <p>Try another search term or category.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Services;
