const Message = require("../models/Message");
const { sendReplyToUser } = require("../utils/emailService");

const getMessages = async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.json([]);
    }

    const messages = await Message.find()
      .sort({ createdAt: -1 }) // Newest first
      .select("-__v"); // Exclude version field

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(400).json({ error: "MongoDB not configured" });
    }

    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const replyToMessage = async (req, res, next) => {
  try {
    if (!process.env.BREVO_EMAIL || !process.env.BREVO_SMTP_KEY) {
      return res.status(400).json({ 
        error: "Email not configured. Set BREVO_EMAIL and BREVO_SMTP_KEY in .env",
        troubleshooting: [
          "1. Get your SMTP key from: Brevo → SMTP → Configuration",
          "2. Make sure your sender email is verified in Brevo",
          "3. Check Brevo dashboard for any account restrictions"
        ]
      });
    }

    const { id } = req.params;
    const { subject, message: replyContent } = req.body;

    if (!subject || !replyContent) {
      return res.status(400).json({ error: "Subject and message are required" });
    }

    // Find the original message to get user email
    const originalMessage = await Message.findById(id);
    if (!originalMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Send reply email to user
    const result = await sendReplyToUser(
      originalMessage.email,
      subject,
      replyContent
    );

    if (!result) {
      return res.status(500).json({ 
        error: "Failed to send reply email",
        troubleshooting: [
          "1. Check server logs for detailed error messages",
          "2. Verify BREVO_EMAIL and BREVO_SMTP_KEY are correct",
          "3. Check Brevo dashboard → Email → Statistics for delivery status",
          "4. Ensure sender email is verified in Brevo",
          "5. Check recipient's spam/junk folder",
          "6. Free Brevo accounts may have daily sending limits"
        ]
      });
    }

    res.json({ 
      message: "Reply sent successfully",
      note: "Email was accepted by SMTP server. Check Brevo dashboard for delivery status.",
      recipient: originalMessage.email,
      troubleshooting: [
        "If email not received:",
        "1. Check spam/junk folder",
        "2. Check Brevo dashboard → Email → Statistics",
        "3. Verify recipient email address is correct",
        "4. Free Brevo accounts may have delivery delays"
      ]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessages, deleteMessage, replyToMessage };

