import { useEffect, useState } from 'react';

function BookingForm({ onSubmit, providerName, services = [], selectedService }) {
  const [data, setData] = useState({ serviceName: '', serviceId: '', date: '', time: '', address: '' });

  useEffect(() => {
    if (selectedService) {
      setData(prev => ({ ...prev, serviceName: selectedService.title || selectedService.name, serviceId: selectedService._id || selectedService.id }));
    }
  }, [selectedService]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceSelection = (event) => {
    const selectedId = event.target.value;
    const service = services.find(item => item._id === selectedId || item.id === selectedId);
    setData(prev => ({
      ...prev,
      serviceName: service?.title || service?.name || '',
      serviceId: selectedId,
    }));
  };

  return (
    <form className="booking-form" onSubmit={event => { event.preventDefault(); onSubmit(data); }}>
      <h2>Book {providerName || 'a service'}</h2>

      <label>
        Service
        {services.length ? (
          <select name="serviceId" value={data.serviceId} onChange={handleServiceSelection} required>
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service._id || service.id} value={service._id || service.id}>
                {service.title || service.name}
              </option>
            ))}
          </select>
        ) : (
          <input name="serviceName" value={data.serviceName} onChange={handleChange} placeholder="e.g. home cleaning" required />
        )}
      </label>

      <label>
        Preferred date
        <input name="date" type="date" value={data.date} onChange={handleChange} required />
      </label>

      <label>
        Preferred time
        <input name="time" type="time" value={data.time} onChange={handleChange} required />
      </label>

      <label>
        Service address
        <input name="address" value={data.address} onChange={handleChange} placeholder="Your address" required />
      </label>

      <button className="button button-block" type="submit">Confirm booking</button>
    </form>
  );
}

export default BookingForm;
