const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const projectsRoute = require("./routes/projects");
const contactRoute = require("./routes/contact");
const adminRoute = require("./routes/admin");
const settingsRoute = require("./routes/settings");
const errorHandler = require("./middleware/errorHandler");
const analyticsLogger = require("./middleware/analyticsLogger");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (non-blocking - server will start regardless)
connectDB().catch(err => {
  console.error("Failed to connect to MongoDB:", err.message);
});

// CORS configuration - allow localhost and Vercel deployments
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://my-portfolio-5s74-mflywnabb-divyaburathoki16-gmailcoms-projects.vercel.app",
  // Add your production frontend URL here or use CLIENT_ORIGIN env variable
  ...(process.env.CLIENT_ORIGIN ? [process.env.CLIENT_ORIGIN] : [])
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
      if (!origin) {
        callback(null, true);
        return;
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      
      // Allow any Vercel preview/production URL (for flexibility)
      if (origin.includes('.vercel.app') || origin.includes('.vercel.app/')) {
        callback(null, true);
        return;
      }
      
      callback(new Error("CORS blocked: Origin not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false
  })
);
// Increase payload limit to handle large base64-encoded images (50MB should cover 10MB images when base64 encoded)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Analytics middleware - must be before routes to track all GET requests
app.use(analyticsLogger);

// Root route - helpful info for API verification
app.get("/", (req, res) => {
  res.json({
    message: "Portfolio API Server",
    status: "running",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      projects: "/api/projects",
      contact: "/api/contact",
      settings: "/api/settings",
      theme: "/api/theme",
      hero: "/api/hero",
      admin: "/api/admin",
      trackView: "/api/track-view"
    },
    timestamp: Date.now()
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Test email endpoint
app.post("/api/test-email", async (req, res) => {
  const { sendContactNotification } = require("./utils/emailService");
  
  if (!process.env.BREVO_EMAIL || !process.env.BREVO_SMTP_KEY) {
    return res.status(400).json({ 
      error: "Email not configured",
      message: "Add BREVO_EMAIL and BREVO_SMTP_KEY to server/.env"
    });
  }

  try {
    const testData = {
      name: "Test User",
      email: "test@example.com",
      company: "Test Company",
      message: "This is a test message to verify email notifications are working!"
    };

    const result = await sendContactNotification(testData);
    
    if (result) {
      res.json({ 
        success: true, 
        message: "Test email accepted by SMTP server!",
        sentTo: process.env.EMAIL_TO || process.env.EMAIL,
        note: "Email was accepted by Brevo SMTP. Check Brevo dashboard for delivery status.",
        troubleshooting: [
          "If email not received:",
          "1. Check spam/junk folder",
          "2. Check Brevo dashboard → Email → Statistics",
          "3. Verify sender email is verified in Brevo",
          "4. Free Brevo accounts may have delivery delays"
        ]
      });
    } else {
      res.status(500).json({ error: "Failed to send email" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Email diagnostics endpoint
app.get("/api/email-diagnostics", (req, res) => {
  const diagnostics = {
    configured: !!(process.env.BREVO_EMAIL && process.env.BREVO_SMTP_KEY),
    brevoEmail: process.env.BREVO_EMAIL ? "✅ Set" : "❌ Missing",
    brevoKey: process.env.BREVO_SMTP_KEY ? "✅ Set" : "❌ Missing",
    emailTo: process.env.EMAIL_TO || process.env.EMAIL || "Not configured",
    troubleshooting: [
      "Common reasons emails aren't received:",
      "1. Email in spam/junk folder - Check there first!",
      "2. Sender email not verified - Verify BREVO_EMAIL in Brevo dashboard",
      "3. Free tier limits - Free Brevo accounts have daily sending limits",
      "4. Email provider blocking - Some providers block emails from new senders",
      "5. Check Brevo dashboard → Email → Statistics for delivery status",
      "",
      "How to verify sender email in Brevo:",
      "1. Go to Brevo dashboard → Senders & IP",
      "2. Add and verify your sender email (BREVO_EMAIL)",
      "3. Check email inbox for verification link",
      "",
      "How to check delivery status:",
      "1. Go to Brevo dashboard → Email → Statistics",
      "2. Look for your sent emails and their status",
      "3. Check for bounces, spam reports, or delivery failures"
    ]
  };
  
  res.json(diagnostics);
});

app.use("/api/projects", projectsRoute);
app.use("/api/contact", contactRoute);
app.use("/api/admin", adminRoute);
app.use("/api/settings", settingsRoute);
app.use("/api/theme", require("./routes/theme"));
app.use("/api/hero", require("./routes/hero"));
app.use("/api/track-view", require("./routes/trackView"));

app.use(errorHandler);

// Export for Vercel serverless functions
module.exports = app;

// Start server locally if not in Vercel environment
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Portfolio API running on port ${PORT}`);
  });
}

