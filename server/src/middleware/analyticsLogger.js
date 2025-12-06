const Analytics = require("../models/Analytics");

// Detect device type from user agent
const detectDevice = (userAgent) => {
  if (!userAgent) return "desktop";
  
  const ua = userAgent.toLowerCase();
  
  // Check for mobile devices
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return "mobile";
  }
  
  // Check for tablets
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return "tablet";
  }
  
  return "desktop";
};

// Get IP address from request
const getIpAddress = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    "unknown"
  );
};

const analyticsLogger = async (req, res, next) => {
  // Only track GET requests
  if (req.method !== "GET") {
    return next();
  }

  // Skip API routes (except public routes)
  const path = req.path;
  
  // Don't track admin routes
  if (path.startsWith("/api/admin")) {
    return next();
  }

  // Don't track API routes (only track public pages)
  if (path.startsWith("/api")) {
    return next();
  }

  // Don't track static assets
  if (
    path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i)
  ) {
    return next();
  }

  // Skip if MongoDB not configured
  if (!process.env.MONGODB_URI) {
    return next();
  }

  try {
    // Log analytics asynchronously (don't block the request)
    const device = detectDevice(req.headers["user-agent"]);
    const ipAddress = getIpAddress(req);

    // Save analytics entry (non-blocking)
    Analytics.create({
      route: path || "/",
      device,
      timestamp: new Date(),
      ipAddress
    }).catch((err) => {
      // Silently fail - don't break the app if analytics fails
      console.error("Analytics logging error:", err.message);
    });
  } catch (error) {
    // Silently fail - don't break the app if analytics fails
    console.error("Analytics middleware error:", error.message);
  }

  next();
};

module.exports = analyticsLogger;

