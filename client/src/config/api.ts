/**
 * API Configuration
 * 
 * This file centralizes all backend API URL configuration.
 * The API URL must be set via the VITE_API_URL environment variable.
 * 
 * Expected format:
 * - Development: http://localhost:5000/api
 * - Production: https://your-server.vercel.app/api
 */

const getApiUrl = (): string => {
  let apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    // During build time, provide a fallback to prevent build failures
    // The actual URL will be validated at runtime
    if (import.meta.env.MODE === 'production') {
      console.warn('VITE_API_URL is not set. API calls may fail.');
      return '/api'; // Fallback for production builds
    }
    throw new Error(
      "VITE_API_URL environment variable is not set. " +
      "Please set it in your .env file. See env.example for reference."
    );
  }
  
  // Ensure the URL has a protocol
  if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
    // If it's a Vercel URL or similar, add https://
    apiUrl = `https://${apiUrl}`;
  }
  
  // Ensure the URL ends with /api if it doesn't already
  // This handles cases where user provides just the domain
  if (!apiUrl.endsWith('/api') && !apiUrl.endsWith('/api/')) {
    // Remove trailing slash if present, then add /api
    apiUrl = apiUrl.replace(/\/$/, '') + '/api';
  }
  
  return apiUrl;
};

// Lazy evaluation - only get the URL when actually used
export const API_URL = getApiUrl();
