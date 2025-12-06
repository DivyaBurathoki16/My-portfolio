// Test script for email notifications
// Run: node src/utils/testEmail.js

require("dotenv").config();
const { sendContactNotification } = require("./emailService");

const testEmail = async () => {
  console.log("🧪 Testing email notification...\n");

  // Check if email is configured
  if (!process.env.BREVO_EMAIL || !process.env.BREVO_SMTP_KEY) {
    console.error("❌ Brevo not configured!");
    console.log("\n📝 Please add to server/.env:");
    console.log("   BREVO_EMAIL=yourbrevoemail@domain.com");
    console.log("   BREVO_SMTP_KEY=xxxxxxxxxxxxxxxxxxxxx");
    console.log("   EMAIL_TO=your-email@gmail.com");
    console.log("\n💡 Get your SMTP key from: Brevo → SMTP → Configuration → Your SMTP key");
    process.exit(1);
  }

  const emailTo = process.env.EMAIL_TO || process.env.EMAIL || "your-email@gmail.com";
  console.log(`📧 Sending test email via Brevo to: ${emailTo}\n`);

  const testData = {
    name: "Test User",
    email: "test@example.com",
    company: "Test Company",
    message: "This is a test message to verify email notifications are working correctly!"
  };

  try {
    const result = await sendContactNotification(testData);
    
    if (result) {
      console.log("✅ Email sent successfully!");
      console.log("📬 Check your inbox (and spam folder) for the test email.");
      console.log(`\n📧 Subject: New Portfolio Message from ${testData.name}`);
    } else {
      console.error("❌ Failed to send email");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\n🔍 Common issues:");
    console.log("   - Wrong BREVO_EMAIL or BREVO_SMTP_KEY");
    console.log("   - SMTP key not generated in Brevo dashboard");
    console.log("   - Network/firewall blocking SMTP");
    console.log("   - Check Brevo dashboard for delivery logs");
  }

  process.exit(0);
};

testEmail();

