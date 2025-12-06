// Generate or retrieve a unique visitor ID
export const getVisitorId = (): string => {
  const STORAGE_KEY = "portfolio_visitor_id";
  
  // Try to get existing visitor ID from localStorage
  let visitorId = localStorage.getItem(STORAGE_KEY);
  
  // If no visitor ID exists, generate a new one
  if (!visitorId) {
    // Generate a unique ID (UUID-like format)
    visitorId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(STORAGE_KEY, visitorId);
  }
  
  return visitorId;
};

