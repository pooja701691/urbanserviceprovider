import api from '../api/axios';

export async function fetchReviews(serviceId) {
  const response = await api.get(`/services/${serviceId}`);
  return { reviews: response.data?.service?.reviews || [] };
}

export async function submitReview(serviceId, reviewData) {
  const response = await api.post(`/services/${serviceId}/reviews`, reviewData);
  return response.data;
}
