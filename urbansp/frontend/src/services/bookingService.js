import api from '../api/axios';

export async function createBooking(payload) {
  const response = await api.post('/bookings/create', payload);
  return response.data;
}

export async function getBookings() {
  const response = await api.get('/bookings');
  return response.data;
}

export async function updateBookingStatus(id, status) {
  const response = await api.put(`/bookings/status/${id}`, { status });
  return response.data;
}

export async function cancelBooking(id) {
  const response = await api.put(`/bookings/cancel/${id}`);
  return response.data;
}
