const nodemailer = require('nodemailer');

// Create transporter only when credentials are available
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
      process.env.EMAIL_USER === 'your_gmail@gmail.com') {
    return null; // No valid credentials
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendOTPEmail = async (to, otp) => {
  const transporter = createTransporter();

  // Dev fallback — print OTP to console if no email config
  if (!transporter) {
    console.log('\n========================================');
    console.log(`📧 OTP for ${to}: ${otp}`);
    console.log('  (Configure EMAIL_USER & EMAIL_PASS in');
    console.log('   .env to send real emails via Gmail)');
    console.log('========================================\n');
    return; // Don't throw — registration succeeds
  }

  await transporter.sendMail({
    from: `"Urban Service Provider" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP for USP Registration',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:16px;">
        <h2 style="color:#3b82f6;margin:0 0 8px;">Email Verification</h2>
        <p style="color:#374151;margin:0 0 24px;">Use the OTP below to verify your account. It expires in <strong>5 minutes</strong>.</p>
        <div style="font-size:36px;font-weight:900;letter-spacing:12px;text-align:center;padding:20px;background:#f0f9ff;border-radius:12px;color:#1e40af;">${otp}</div>
        <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};

const sendContactNotification = async ({ name, email, phone, subject, message }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`\n📬 Contact form from ${name} <${email}>: ${subject}`);
    return;
  }

  await transporter.sendMail({
    from: `"USP Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `[USP Contact] ${subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:16px;">
        <h2 style="color:#3b82f6;margin:0 0 20px;">New Contact Message</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#6b7280;width:100px;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;font-weight:600;">${email}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Phone</td><td style="padding:8px 0;font-weight:600;">${phone || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Subject</td><td style="padding:8px 0;font-weight:600;">${subject}</td></tr>
        </table>
        <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:10px;color:#374151;">${message}</div>
      </div>
    `,
  });
};

module.exports = { sendOTPEmail, sendContactNotification };
