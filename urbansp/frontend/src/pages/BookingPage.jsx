import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BookingForm from '../components/BookingForm';
import AuthModal from '../components/AuthModal';
import { fetchServices } from '../services/serviceService';
import { createBooking } from '../services/bookingService';

function BookingPage() {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [confirmation, setConfirmation] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices({ limit: 50 });
        setServices(data.services || []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Unable to load services.');
      }
    };
    loadServices();
  }, []);

  const handleSubmit = async (data) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!data.serviceId) {
      setError('Please select a service before booking.');
      return;
    }

    try {
      // Find the selected service to get its price
      const selectedService = services.find(s => s._id === data.serviceId);
      await createBooking({
        serviceId: data.serviceId,
        date: data.date,
        time: data.time,
        address: data.address,
        totalAmount: selectedService?.price || 0,
      });
      setConfirmation(`Your booking for "${data.serviceName || 'selected service'}" on ${data.date} has been received!`);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to submit booking.');
    }
  };

  return (
    <section className="page-container booking-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Fast booking</span>
          <h2>Book trusted service partners in minutes.</h2>
          <p>Easy booking, verified providers, and support throughout the process.</p>
        </div>
      </div>

      <div className="booking-grid">
        <div className="feature-panel">
          <h3>Why choose USP</h3>
          <ul>
            <li>Verified professionals with performance ratings.</li>
            <li>Transparent pricing and advance booking flow.</li>
            <li>Flexible support and service tracking.</li>
          </ul>
        </div>

        <BookingForm services={services} onSubmit={handleSubmit} />
      </div>

      {confirmation && <p className="success-message">{confirmation}</p>}
      {error && <p className="form-error">{error}</p>}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={() => setConfirmation('')} />
    </section>
  );
}

export default BookingPage;
