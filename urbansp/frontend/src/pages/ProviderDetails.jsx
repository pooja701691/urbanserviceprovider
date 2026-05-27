import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BookingForm from '../components/BookingForm';
import AuthModal from '../components/AuthModal';
import ReviewCard from '../components/ReviewCard';
import { fetchServiceById, submitReview } from '../services/serviceService';
import { createBooking } from '../services/bookingService';

function ProviderDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const loadService = async () => {
    try {
      setLoading(true);
      const data = await fetchServiceById(id);
      setService(data.service || null);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to load service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadService();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBooking = async (formData) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    try {
      await createBooking({
        serviceId: formData.serviceId || service?._id,
        date: formData.date,
        time: formData.time,
        address: formData.address,
        totalAmount: service?.price || 0,
      });
      setMessage('Your booking request has been submitted successfully.');
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to create booking.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setReviewLoading(true);
    setReviewError('');
    try {
      await submitReview(id, reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      await loadService(); // refresh to show new review
    } catch (err) {
      setReviewError(err?.response?.data?.message || err.message || 'Unable to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return <section className="page-container"><p>Loading service details...</p></section>;
  }

  if (!service || error) {
    return (
      <section className="page-container">
        <div className="empty-state">
          <h2>{error ? 'Error loading service' : 'Service not found'}</h2>
          <p>{error || 'Try navigating back to the service list.'}</p>
          <button className="button" onClick={() => navigate('/services')}>Back to services</button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-container provider-details-page">
      <div className="provider-hero">
        <div>
          <span className="eyebrow">{service.category}</span>
          <h2>{service.title}</h2>
          <p>{service.description}</p>
          <div className="provider-stats">
            <span>{service.ratings?.toFixed(1) || '4.5'} ★ rating</span>
            <span>{service.reviews?.length || 0} reviews</span>
            <span>₹{service.price}</span>
          </div>
          <div className="chip-list">
            {[service.city, service.state, service.address].filter(Boolean).map(item => (
              <span key={item} className="chip">{item}</span>
            ))}
          </div>
        </div>
        <div className="provider-hero-card">
          <p>Book with confidence. Verified specialists, transparent pricing, and secure service updates.</p>
        </div>
      </div>

      <div className="provider-grid">
        <div>
          <h3>Customer reviews ({service.reviews?.length || 0})</h3>
          <div className="review-grid">
            {service.reviews?.length ? service.reviews.map((review, index) => (
              <ReviewCard
                key={index}
                review={{
                  author: review.user?.name || 'Guest',
                  rating: review.rating,
                  comment: review.comment,
                  date: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent',
                }}
              />
            )) : (
              <div className="empty-state" style={{ padding: '1.5rem 0' }}>
                <p>No reviews yet. Be the first to book and review this service.</p>
              </div>
            )}
          </div>

          {/* Add review form */}
          {user && (
            <div className="table-card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Leave a review</h4>
              <form onSubmit={handleReviewSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
                <label style={{ display: 'grid', gap: '0.4rem' }}>
                  Rating
                  <select value={reviewForm.rating} onChange={e => setReviewForm(p => ({ ...p, rating: Number(e.target.value) }))}>
                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} ★</option>)}
                  </select>
                </label>
                <label style={{ display: 'grid', gap: '0.4rem' }}>
                  Comment
                  <textarea
                    required
                    rows="3"
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                    placeholder="Share your experience..."
                  />
                </label>
                {reviewError && <p className="form-error">{reviewError}</p>}
                <button type="submit" className="button" disabled={reviewLoading}>
                  {reviewLoading ? 'Submitting...' : 'Submit review'}
                </button>
              </form>
            </div>
          )}
        </div>

        <BookingForm selectedService={service} onSubmit={handleBooking} />
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="form-error">{error}</p>}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={() => setMessage('')} />
    </section>
  );
}

export default ProviderDetails;
