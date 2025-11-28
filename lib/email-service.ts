import nodemailer from 'nodemailer';

// Email service for sending notifications
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Alternative: Using environment variables for custom SMTP
const getTransporter = () => {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
};

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send registration confirmation email
 */
export async function sendRegistrationConfirmation(
  email: string,
  name: string,
  registrationCode: string,
  eventName: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Registration Confirmed! 🎉</h1>
        <p style="margin: 10px 0 0 0;">Welcome to ${eventName}</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px;">
        <p>Hi <strong>${name}</strong>,</p>
        
        <p>Thank you for registering for <strong>${eventName}</strong>. Your registration has been confirmed!</p>
        
        <div style="background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0;"><strong>Registration Code:</strong></p>
          <p style="font-size: 24px; font-weight: bold; color: #667eea; margin: 10px 0; letter-spacing: 2px;">${registrationCode}</p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Keep this code safe - you'll need it for check-in!</p>
        </div>
        
        <p><strong>Next Steps:</strong></p>
        <ul style="color: #333;">
          <li>Check your committee allocation in the dashboard</li>
          <li>Download the background guide</li>
          <li>Complete your payment (if applicable)</li>
          <li>Prepare for the event!</li>
        </ul>
        
        <p>If you have any questions, please reply to this email or contact us at support@arsenic-summit.com</p>
        
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          Best regards,<br/>
          Arsenic Summit Team
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Registration Confirmed - ${eventName}`,
    html,
  });
}

/**
 * Send committee allocation update
 */
export async function sendAllocationUpdate(
  email: string,
  name: string,
  committee: string,
  portfolio: string,
  eventName: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Committee Allocation! 🎯</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px;">
        <p>Hi <strong>${name}</strong>,</p>
        
        <p>Great news! Your committee has been allocated for <strong>${eventName}</strong>.</p>
        
        <div style="background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0 0 15px 0;"><strong>Your Allocation:</strong></p>
          <p style="margin: 10px 0;"><strong>Committee:</strong> <span style="font-size: 18px; color: #667eea;">${committee}</span></p>
          <p style="margin: 10px 0;"><strong>Portfolio:</strong> <span style="font-size: 18px; color: #667eea;">${portfolio}</span></p>
        </div>
        
        <p><strong>What's Next?</strong></p>
        <ul style="color: #333;">
          <li>Read the background guide thoroughly</li>
          <li>Research your portfolio</li>
          <li>Prepare your opening statements</li>
          <li>Join the pre-event forum to network</li>
        </ul>
        
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          Questions? Contact our committee coordinator!<br/>
          Arsenic Summit Team
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Your Committee Allocation - ${eventName}`,
    html,
  });
}

/**
 * Send event reminder
 */
export async function sendEventReminder(
  email: string,
  name: string,
  eventName: string,
  eventDate: Date,
  committee: string,
  eventUrl: string
) {
  const daysUntil = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Event Starts in ${daysUntil} Days! ⏰</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px;">
        <p>Hi <strong>${name}</strong>,</p>
        
        <p><strong>${eventName}</strong> is coming up soon! Here's your final checklist:</p>
        
        <div style="background: white; border-left: 4px solid #f5576c; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 10px 0;"><strong>📅 Event Date:</strong> ${eventDate.toLocaleDateString()}</p>
          <p style="margin: 10px 0;"><strong>🎯 Committee:</strong> ${committee}</p>
          <p style="margin: 10px 0;"><strong>⏱️ Days Left:</strong> ${daysUntil} days</p>
        </div>
        
        <p><strong>Pre-Event Checklist:</strong></p>
        <ul style="color: #333;">
          <li>☐ Finalize your portfolio research</li>
          <li>☐ Prepare your position paper</li>
          <li>☐ Review parliamentary procedure</li>
          <li>☐ Practice your speeches</li>
          <li>☐ Arrange transport to venue</li>
          <li>☐ Bring valid ID and registration code</li>
        </ul>
        
        <a href="${eventUrl}" style="display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 20px;">View Event Details</a>
        
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          See you at the summit!<br/>
          Arsenic Summit Team
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Reminder: ${eventName} in ${daysUntil} Days!`,
    html,
  });
}

/**
 * Send payment receipt
 */
export async function sendPaymentReceipt(
  email: string,
  name: string,
  transactionId: string,
  amount: number,
  eventName: string,
  invoiceUrl?: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Payment Received! ✓</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px;">
        <p>Hi <strong>${name}</strong>,</p>
        
        <p>Thank you for your payment! Your registration for <strong>${eventName}</strong> is now complete.</p>
        
        <div style="background: white; border-left: 4px solid #56ab2f; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0 0 15px 0;"><strong>Payment Details:</strong></p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0;"><strong>Transaction ID:</strong></td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold;">${transactionId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0;"><strong>Amount Paid:</strong></td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold;">₹${amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0;"><strong>Status:</strong></td>
              <td style="padding: 10px 0; text-align: right;"><span style="background: #56ab2f; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">CONFIRMED</span></td>
            </tr>
          </table>
        </div>
        
        <p>${invoiceUrl ? `<a href="${invoiceUrl}" style="display: inline-block; background: #56ab2f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px;">Download Invoice</a>` : ''}</p>
        
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          Your registration is confirmed. Check your dashboard for more details!<br/>
          Arsenic Summit Team
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Payment Receipt - ${eventName}`,
    html,
  });
}

/**
 * Send OTP for email verification
 */
export async function sendOTP(email: string, otp: string, expiryMinutes: number = 10) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Email Verification</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px;">
        <p>Your verification code is:</p>
        
        <div style="background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 4px;">
          <p style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea; margin: 0;">${otp}</p>
        </div>
        
        <p style="color: #666;">This code will expire in <strong>${expiryMinutes} minutes</strong>.</p>
        
        <p style="color: #999; font-size: 12px;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Email Verification Code',
    html,
  });
}

/**
 * Generic email sender
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = getTransporter();
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@arsenic-summit.com',
      ...options,
    });
    
    console.log(`Email sent to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send bulk emails (with rate limiting)
 */
export async function sendBulkEmails(
  recipients: { email: string; name: string }[],
  subject: string,
  htmlTemplate: (name: string) => string
): Promise<{ successful: number; failed: number }> {
  let successful = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const sent = await sendEmail({
      to: recipient.email,
      subject,
      html: htmlTemplate(recipient.name),
    });

    if (sent) {
      successful++;
    } else {
      failed++;
    }

    // Rate limiting: wait 100ms between emails
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return { successful, failed };
}
