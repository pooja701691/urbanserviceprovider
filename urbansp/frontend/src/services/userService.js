import api from '../api/axios';

export async function getUserProfile() {
  const response = await api.get('/users/profile');
  return response.data;
}

export async function updateUserProfile(formData) {
  const response = await api.put('/users/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
