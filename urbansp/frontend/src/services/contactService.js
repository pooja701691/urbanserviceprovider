import api from '../api/axios';

export async function submitContactForm(data) {
  const response = await api.post('/contact', data);
  return response.data;
}
