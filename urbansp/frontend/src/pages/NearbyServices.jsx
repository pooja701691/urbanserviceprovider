import { useEffect, useState, useCallback } from 'react';
import { getNearbyServices } from '../services/serviceService';
import ProviderCard from '../components/ProviderCard';

function NearbyServices() {
  const [location, setLocation] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [radius, setRadius] = useState(10000);

  const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  const loadNearby = useCallback(async (coords, searchRadius) => {
    setLoading(true);
    setError('');
    try {
      const response = await getNearbyServices({
        lat: coords.lat,
        lng: coords.lng,
        radius: searchRadius,
        limit: 20,
      });
      setServices(response.services || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to load nearby services.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(coords);
        loadNearby(coords, radius);
      },
      () => {
        setError('Unable to detect your location. Please allow location access and refresh.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRadiusChange = (e) => {
    const newRadius = Number(e.target.value);
    setRadius(newRadius);
    if (location) loadNearby(location, newRadius);
  };

  const providerList = services.map(service => ({
    id: service._id,
    name: service.title,
    initials: service.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    category: service.category,
    description: service.description,
    rating: service.ratings || 4.6,
    reviews: service.reviews?.length || 0,
  }));

  const mapSrc =
    location && mapsKey
      ? `https://www.google.com/maps/embed/v1/view?key=${mapsKey}&center=${location.lat},${location.lng}&zoom=13&maptype=roadmap`
      : null;

  return (
    <section className="page-container">
      <div className="section-heading">
        <span className="eyebrow">Nearby services</span>
        <h2>Find service professionals close to you.</h2>
        <p>Services are ranked by proximity using your browser location and MongoDB geospatial search.</p>
      </div>

      {/* Radius filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Search radius:
          <select value={radius} onChange={handleRadiusChange}>
            <option value={2000}>2 km</option>
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={25000}>25 km</option>
            <option value={50000}>50 km</option>
          </select>
        </label>
        {location && (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #888)' }}>
            📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </span>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}
      {!error && loading && <p>Detecting your location and loading nearby services…</p>}

      {/* Map */}
      {mapSrc ? (
        <div
          className="hero-card"
          style={{ padding: 0, overflow: 'hidden', minHeight: '320px', marginBottom: '1.5rem' }}
        >
          <iframe
            title="Nearby service map"
            src={mapSrc}
            width="100%"
            height="320"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : location && !mapsKey ? (
        <div
          className="hero-card"
          style={{ marginBottom: '1.5rem', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <p style={{ color: 'var(--text-muted, #888)', fontSize: '0.9rem' }}>
            📍 Location detected — add <code>VITE_GOOGLE_MAPS_KEY</code> to your <code>.env</code> file to show the map.
          </p>
        </div>
      ) : null}

      {/* Results */}
      <div className="provider-grid">
        {providerList.length > 0
          ? providerList.map(service => <ProviderCard key={service.id} provider={service} />)
          : !loading && !error && (
              <div className="empty-state">
                <h2>No nearby services found</h2>
                <p>Try increasing the search radius above.</p>
              </div>
            )}
      </div>
    </section>
  );
}

export default NearbyServices;
