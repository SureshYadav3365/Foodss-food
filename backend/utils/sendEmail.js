import nodemailer from 'nodemailer';

/**
 * Sends an email using Nodemailer. Falls back to logging to console if SMTP env vars are not set.
 * @param {object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body in HTML format
 */
const sendEmail = async (options) => {
  // Create transporter configuration
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });

  const message = {
    from: `${process.env.SMTP_FROM_NAME || 'FoodHub'} <${process.env.SMTP_FROM || 'noreply@foodhub.com'}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // If credentials are not set, perform mock send in console
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('\n=======================================');
    console.log('         MOCK EMAIL (DEVELOPMENT)       ');
    console.log('=======================================');
    console.log(`To      : ${message.to}`);
    console.log(`Subject : ${message.subject}`);
    console.log(`Body    :\n${message.html}`);
    console.log('=======================================\n');
    return { success: true, message: 'Mock email printed to console' };
  }

  // Send actual email
  const info = await transporter.sendMail(message);
  return info;
};

export default sendEmail;
