import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession, signOut } from 'next-auth/react';
// Ensure next/router is imported if navigation is needed, e.g. on 401
// import Router from 'next/router'; 

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api', // Default to /api if env var is not set
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: To add the JWT token to requests
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession(); // Fetches client-side session
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // Handle request error here
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: To handle global errors like 401 or network issues
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  async (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    console.error('API Error:', error.response?.status, error.message);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Unauthorized: Token might be invalid or expired
        // Option 1: Sign out the user and redirect to login
        console.warn('Unauthorized access (401). Signing out.');
        await signOut({ redirect: true, callbackUrl: '/login' }); 
        // Option 2: Refresh token logic would go here if implemented

        // Prevent further processing of this error by returning a specific message or a resolved promise
        return Promise.reject(new Error('Session expired. Please login again.'));
      }

      // Handle other common errors (e.g., 403 Forbidden, 404 Not Found, 500 Server Error)
      // You can customize error handling based on status codes
      const apiError = error.response.data as { message?: string; error?: string };
      const errorMessage = apiError?.message || apiError?.error || error.message || 'An unexpected error occurred.';
      return Promise.reject(new Error(errorMessage));
    }
    if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error('Network error or no response:', error.request);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    // Something happened in setting up the request that triggered an Error
    return Promise.reject(error);
  }
);

export default apiClient;
