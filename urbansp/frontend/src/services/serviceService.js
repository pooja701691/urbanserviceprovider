import api from '../api/axios';

export async function fetchServices(params = {}) {
  const response = await api.get('/services', { params });
  return response.data;
}

export async function fetchServiceById(id) {
  const response = await api.get(`/services/${id}`);
  return response.data;
}

export async function getNearbyServices(params = {}) {
  const response = await api.get('/services/nearby', { params });
  return response.data;
}

export async function createService(data) {
  // data can be FormData (with images) or a plain object
  const isFormData = data instanceof FormData;
  const response = await api.post('/services/create', data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
}

export async function updateService(id, data) {
  const isFormData = data instanceof FormData;
  const response = await api.put(`/services/update/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
}

export async function deleteService(id) {
  const response = await api.delete(`/services/delete/${id}`);
  return response.data;
}

export async function submitReview(serviceId, reviewData) {
  const response = await api.post(`/services/${serviceId}/reviews`, reviewData);
  return response.data;
}
