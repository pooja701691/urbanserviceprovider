import api from '../api/axios';

export async function loginUser(credentials) {
  const response = await api.post('/users/login', credentials);
  return response.data;
}

export async function registerUser(data) {
  const response = await api.post('/users/register', data);
  return response.data;
}
