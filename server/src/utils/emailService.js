const nodemailer = require("nodemailer");

const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.BREVO_EMAIL || !process.env.BREVO_SMTP_KEY) {
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.BREVO_EMAIL,
      pass: process.env.BREVO_SMTP_KEY
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const sendContactNotification = async (contactData) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.warn("Email not configured. Set BREVO_EMAIL and BREVO_SMTP_KEY in .env to receive notifications.");
    return false;
  }

  try {
    const { name, email, company, message } = contactData;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Portfolio Contact" <${process.env.BREVO_EMAIL}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL || "divyaburathoki16@gmail.com", // Send to yourself
      replyTo: email, // Allow replying directly to the sender
      subject: `New Portfolio Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px;">
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log detailed information
    console.log(`✅ Contact notification email accepted by SMTP server`);
    console.log(`   From: ${name} (${email})`);
    console.log(`   To: ${process.env.EMAIL_TO || process.env.EMAIL || "divyaburathoki16@gmail.com"}`);
    console.log(`   Message ID: ${info.messageId || 'N/A'}`);
    console.log(`   Response: ${info.response || 'N/A'}`);
    
    return true;
  } catch (error) {
    console.error("❌ Failed to send email notification:");
    console.error(`   Error: ${error.message}`);
    if (error.response) {
      console.error(`   SMTP Response: ${error.response}`);
    }
    if (error.responseCode) {
      console.error(`   Response Code: ${error.responseCode}`);
    }
    return false;
  }
};

const sendReplyToUser = async (userEmail, subject, content) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.warn("Email not configured. Set BREVO_EMAIL and BREVO_SMTP_KEY in .env to send replies.");
    return false;
  }

  try {
    // Format content as HTML, preserving line breaks
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px;">${content}</p>
        </div>
      </div>
    `;

    // Plain text version for better deliverability
    const textContent = content.replace(/<[^>]*>/g, '').trim();

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Your Portfolio" <${process.env.BREVO_EMAIL}>`,
      to: userEmail,
      subject: subject,
      text: textContent, // Plain text version
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log detailed information
    console.log(`✅ Reply email accepted by SMTP server`);
    console.log(`   To: ${userEmail}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Message ID: ${info.messageId || 'N/A'}`);
    console.log(`   Response: ${info.response || 'N/A'}`);
    
    // Note: This only confirms SMTP accepted the email, not delivery
    console.log(`   ⚠️  Note: Check Brevo dashboard for delivery status`);
    console.log(`   📬 If email not received, check spam folder and Brevo logs`);
    
    return true;
  } catch (error) {
    console.error("❌ Failed to send reply email:");
    console.error(`   Error: ${error.message}`);
    if (error.response) {
      console.error(`   SMTP Response: ${error.response}`);
    }
    if (error.responseCode) {
      console.error(`   Response Code: ${error.responseCode}`);
    }
    if (error.command) {
      console.error(`   Failed Command: ${error.command}`);
    }
    return false;
  }
};

module.exports = { sendContactNotification, sendReplyToUser };

