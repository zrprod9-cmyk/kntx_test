import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'https://kontext.gosystem.io/api';
const DEBUG = import.meta.env.VITE_DEBUG === 'true';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  if (DEBUG) {
    console.log('[API Request]', config.method?.toUpperCase(), config.baseURL + config.url, config.data || '');
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log('[API Response]', response.status, response.config.baseURL + response.config.url, response.data);
    }
    return response;
  },
  (error) => {
    if (DEBUG) {
      console.error('[API Error]', error.config?.method?.toUpperCase(), (error.config?.baseURL || '') + (error.config?.url || ''), error.message);
      if (error.response) console.error('Response data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export const checkApiStatus = async () => {
  try {
    const res = await api.get('/status');
    if (DEBUG) console.log('[API Status]', res.data);
    return res.data;
  } catch (err) {
    if (DEBUG) console.error('[API Status Error]', err);
    throw err;
  }
};

export default api;
