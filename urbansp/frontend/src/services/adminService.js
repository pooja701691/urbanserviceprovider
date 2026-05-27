import api from '../api/axios';

export async function getAdminAnalytics() {
  const response = await api.get('/admin/analytics');
  return response.data;
}
