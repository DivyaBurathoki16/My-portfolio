// Simple admin authentication middleware
// In production, use JWT tokens or a more secure method

const adminAuth = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  
  if (!adminPassword) {
    return res.status(500).json({ 
      error: "Admin password not configured",
      message: "Please set ADMIN_PASSWORD in your server/.env file and restart the server."
    });
  }

  const providedPassword = (req.headers["x-admin-password"] || req.body.password)?.trim();

  if (!providedPassword) {
    return res.status(401).json({ error: "Password is required." });
  }

  if (providedPassword !== adminPassword) {
    return res.status(401).json({ error: "Invalid admin password." });
  }

  next();
};

module.exports = adminAuth;

