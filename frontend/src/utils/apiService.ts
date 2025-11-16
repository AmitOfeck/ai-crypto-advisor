import api from './api';

// Auth APIs
export const authAPI = {
  signup: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};

// Onboarding APIs
export const onboardingAPI = {
  savePreferences: async (data: {
    interestedAssets: string[];
    investorType: string;
    contentPreferences: string[];
  }) => {
    const response = await api.post('/onboarding', data);
    return response.data;
  },
  getPreferences: async () => {
    const response = await api.get('/onboarding');
    return response.data;
  },
  getStatus: async () => {
    const response = await api.get('/onboarding/status');
    return response.data;
  },
};

// Dashboard APIs
export const dashboardAPI = {
  getDashboard: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
};

// Feedback APIs
export const feedbackAPI = {
  submitFeedback: async (data: {
    feedbackType: string;
    itemId: string;
    vote: 'thumbs_up' | 'thumbs_down';
  }) => {
    const response = await api.post('/feedback', data);
    return response.data;
  },
  getFeedback: async (feedbackType: string, itemId: string) => {
    const response = await api.get(`/feedback/${feedbackType}/${itemId}`);
    return response.data;
  },
};

