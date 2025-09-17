import axios from 'axios';

// Use environment variables for the base URL, with a fallback for local development.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use an interceptor to dynamically add the JWT token to every request header.
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Get the user info object from localStorage.
    const userInfoString = localStorage.getItem('userInfo');

    if (userInfoString) {
      // 2. Parse the JSON string to get the object.
      const userInfo = JSON.parse(userInfoString);
      
      // 3. If a token exists, add it to the Authorization header.
      if (userInfo.token) {
        config.headers['Authorization'] = `Bearer ${userInfo.token}`;
      }
    }
    
    // 4. Return the modified config to proceed with the request.
    return config;
  },
  (error) => {
    // Handle any errors that occur during the request setup.
    return Promise.reject(error);
  }
);

export default axiosInstance;