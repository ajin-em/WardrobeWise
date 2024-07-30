import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the headers, excluding the register endpoint
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('access');
  if (token && config.url !== '/register/') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Add a response interceptor to handle token refresh
instance.interceptors.response.use(response => {
  return response;
}, error => {
  const originalRequest = error.config;
  if (error.response && error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const refreshToken = localStorage.getItem('refresh');
    return instance.post('/token/refresh/', { refresh: refreshToken })
      .then(res => {
        if (res.status === 200) {
          localStorage.setItem('access', res.data.access);
          instance.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.access;
          originalRequest.headers['Authorization'] = 'Bearer ' + res.data.access;
          return instance(originalRequest);
        }
      });
  }
  return Promise.reject(error);
});

export default instance;
