// Providers are backed by the services API in this app
import api from '../api/axios';

export async function fetchProviders(params = {}) {
  const response = await api.get('/services', { params });
  return response.data;
}

export async function fetchProviderById(id) {
  const response = await api.get(`/services/${id}`);
  return response.data;
}
