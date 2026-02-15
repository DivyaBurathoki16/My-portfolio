const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    console.warn("⚠️  MONGODB_URI is not set in .env file.");
    console.warn("   The server will work, but:");
    console.warn("   - Contact form submissions will not be saved to database");
    console.warn("   - Settings, theme, and hero data will use defaults");
    console.warn("   - Projects will use fallback data from data/projects.js");
    console.warn("");
    return;
  }

  // Check if password placeholder is still in the connection string
  if (uri.includes("<db_password>")) {
    console.warn("⚠️  Please replace <db_password> in .env file with your actual MongoDB password");
    console.warn("⚠️  If your password contains special characters, URL-encode them (e.g., @ becomes %40)");
    return;
  }

  try {
    await mongoose.connect(uri, {
      autoIndex: true
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("💡 Common issues:");
    console.error("   - Incorrect password (check .env file)");
    console.error("   - Password with special characters needs URL encoding");
    console.error("   - Wrong username or database name");
    console.error("   - IP address not whitelisted in MongoDB Atlas");
    console.warn("⚠️  Server will continue without database. Contact form submissions will not be saved.");
  }
};

/**
 * Ensure MongoDB is connected. On serverless (e.g. Vercel), the connection
 * may not be ready when the first request runs. This waits briefly for an
 * existing connection or triggers connectDB and waits.
 */
const ensureConnected = async () => {
  if (mongoose.connection.readyState === 1) return true;
  if (process.env.MONGODB_URI?.trim()) {
    try {
      await connectDB();
      return mongoose.connection.readyState === 1;
    } catch {
      return false;
    }
  }
  return false;
};

module.exports = { connectDB, ensureConnected };

