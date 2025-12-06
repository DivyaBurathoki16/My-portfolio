// Simple admin authentication middleware
// In production, use JWT tokens or a more secure method

const adminAuth = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    return res.status(500).json({ error: "Admin password not configured" });
  }

  const providedPassword = req.headers["x-admin-password"] || req.body.password;

  if (!providedPassword || providedPassword !== adminPassword) {
    return res.status(401).json({ error: "Unauthorized. Invalid admin password." });
  }

  next();
};

module.exports = adminAuth;

