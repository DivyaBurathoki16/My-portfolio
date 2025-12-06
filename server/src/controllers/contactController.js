const Message = require("../models/Message");
const { sendContactNotification } = require("../utils/emailService");

const contact = async (req, res, next) => {
  try {
    const { name, email, company, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const doc = new Message({ name, email, company, message });

    if (!process.env.MONGODB_URI) {
      console.warn("Contact message received but not stored (missing MONGODB_URI).");
      // Still try to send email notification even if DB is not configured
      await sendContactNotification({ name, email, company, message });
      return res.status(202).json({ message: "Message received. Configure MongoDB to persist submissions." });
    }

    await doc.save();
    
    // Send email notification (non-blocking)
    sendContactNotification({ name, email, company, message }).catch(err => {
      console.error("Email notification failed:", err.message);
    });

    res.status(201).json({ message: "Thanks for reaching out! I'll get back to you soon." });
  } catch (error) {
    next(error);
  }
};

module.exports = { contact };

