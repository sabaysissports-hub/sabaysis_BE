const { Resend } = require('resend');
const Message = require('../models/messageModel');

const sendEmail = async (req, res) => {
  const { firstName, email, phone, message, subject } = req.body;
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const newMessage = await Message.create({
      firstName,
      email,
      phone,
      subject,
      message,
    });
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: 'ajarenterprisesmeerut@gmail.com',
      subject: subject || 'New Enquiry from Website',
      html: `
        <h1>New Enquiry</h1>
        <p><strong>Name:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject || 'General Enquiry'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(400).json({ error, dbMessage: newMessage });
    }

    res.json({ data, dbMessage: newMessage });
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
