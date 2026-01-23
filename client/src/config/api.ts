/**
 * API Configuration
 * 
 * This file centralizes all backend API URL configuration.
 * The API URL must be set via the VITE_API_URL environment variable.
 */

const getApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    throw new Error(
      "VITE_API_URL environment variable is not set. " +
      "Please set it in your .env file. See env.example for reference."
    );
  }
  
  return apiUrl;
};

export const API_URL = getApiUrl();
