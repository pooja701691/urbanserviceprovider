import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProviderCard from '../components/ProviderCard';
import SearchBar from '../components/SearchBar';
import { fetchServices } from '../services/serviceService';

const categories = ['Cleaning', 'Repair', 'Beauty', 'Moving', 'Plumber', 'Electrician'];
const testimonials = [
  { author: 'Neha K.', rating: 5, comment: 'Amazing service and easy booking experience.' },
  { author: 'Rohan S.', rating: 4.8, comment: 'The provider arrived on time and delivered excellent work.' },
  { author: 'Priya M.', rating: 4.9, comment: 'Great app for comparing local service professionals.' },
];

function Home() {
  const [search, setSearch] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await fetchServices({ limit: 8 });
        setServices(data.services || []);
        setError('');
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Unable to load services.');
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const filteredProviders = useMemo(
    () => services
      .map(service => ({
        id: service._id,
        name: service.title,
        initials: service.title.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase(),
        category: service.category,
        description: service.description,
        rating: service.ratings || 4.5,
        reviews: service.reviews?.length || 0,
      }))
      .filter(provider =>
        provider.name.toLowerCase().includes(search.toLowerCase()) ||
        provider.category.toLowerCase().includes(search.toLowerCase())
      ),
    [search, services]
  );

  return (
    <div className="page-container">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">Urban Service Provider Platform</span>
          <h2>Trusted experts for every home and business need.</h2>
          <p>Compare local providers, read reviews, and book appointments instantly.</p>
          <div className="hero-actions">
            <button className="button" onClick={() => navigate('/booking')}>Book a Service</button>
            <button className="button button-secondary" onClick={() => navigate('/register')}>Start Free</button>
          </div>
        </div>
        <div className="hero-card">
          <h3>Featured care</h3>
          <p>Home cleaning, electricians, beauty at home, movers, and more — all booked in minutes.</p>
        </div>
      </section>

      <section className="section" id="services">
        <div className="section-heading">
          <h3>Explore categories</h3>
          <p>Choose service categories tailored for modern city living.</p>
        </div>
        <div className="category-grid">
          {categories.map(category => (
            <div key={category} className="category-card">{category}</div>
          ))}
        </div>
      </section>

      <section className="section" id="providers">
        <div className="section-heading">
          <h3>Top service partners</h3>
          <SearchBar placeholder="Search by service or provider" onSearch={setSearch} />
        </div>
        {loading ? (
          <p>Loading services...</p>
        ) : error ? (
          <p className="form-error">{error}</p>
        ) : (
          <div className="provider-grid">
            {filteredProviders.length ? filteredProviders.map(provider => (
              <ProviderCard key={provider.id} provider={provider} />
            )) : (
              <div className="empty-state">
                <h2>No matching services found</h2>
                <p>Try searching for another service or category.</p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="section testimonials" id="testimonials">
        <div className="section-heading">
          <h3>What customers say</h3>
          <p>Real reviews from users who trusted our platform for home services.</p>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((testimonial, index) => (
            <article key={index} className="testimonial-card">
              <p>“{testimonial.comment}”</p>
              <div>
                <strong>{testimonial.author}</strong>
                <span>{testimonial.rating} ★</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
