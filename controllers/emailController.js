const nodemailer = require('nodemailer');
const Message = require('../models/messageModel');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (req, res) => {
  const { firstName, email, phone, message, subject } = req.body;

  try {
    const newMessage = await Message.create({
      firstName,
      email,
      phone,
      subject,
      message,
    });

    // Send email using nodemailer
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Sabaysis Contact'}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_TO || 'ajarenterprisesmeerut@gmail.com',
      subject: `${subject || 'New Website Enquiry'} - ${firstName}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .email-container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              border-bottom: 3px solid #0066cc;
              padding-bottom: 15px;
              margin-bottom: 25px;
            }
            .header h1 {
              color: #0066cc;
              margin: 0;
              font-size: 24px;
            }
            .info-row {
              margin: 15px 0;
              padding: 12px;
              background-color: #f8f9fa;
              border-left: 4px solid #0066cc;
              border-radius: 4px;
            }
            .info-row strong {
              color: #555;
              display: inline-block;
              min-width: 80px;
              font-weight: 600;
            }
            .message-box {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 6px;
              margin-top: 20px;
              border: 1px solid #e0e0e0;
            }
            .message-box h3 {
              margin-top: 0;
              color: #333;
              font-size: 16px;
            }
            .message-content {
              white-space: pre-wrap;
              word-wrap: break-word;
              color: #444;
              line-height: 1.8;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              font-size: 12px;
              color: #777;
              text-align: center;
            }
            .timestamp {
              color: #999;
              font-size: 13px;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🏆 New Enquiry from Sabaysis Website</h1>
            </div>
            
            <div class="info-row">
              <strong>Name:</strong> ${firstName}
            </div>
            
            <div class="info-row">
              <strong>Email:</strong> <a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">${email}</a>
            </div>
            
            <div class="info-row">
              <strong>Phone:</strong> <a href="tel:${phone}" style="color: #0066cc; text-decoration: none;">${phone}</a>
            </div>
            
            <div class="info-row">
              <strong>Subject:</strong> ${subject || 'General Enquiry'}
            </div>
            
            <div class="message-box">
              <h3>📩 Message:</h3>
              <div class="message-content">${message}</div>
            </div>
            
            <div class="timestamp">
              Received on: ${new Date().toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                dateStyle: 'full',
                timeStyle: 'long'
              })}
            </div>
            
            <div class="footer">
              <p>This email was sent from the Sabaysis Sports & Infra website contact form.</p>
              <p>You can reply directly to this email to respond to the enquiry.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('Email sent:', info.messageId);
    res.json({ success: true, messageId: info.messageId, dbMessage: newMessage });
  } catch (error) {
    console.error('Email/DB Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (message) {
            await message.deleteOne();
            res.json({ message: 'Message removed' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { sendEmail, getMessages, deleteMessage };
