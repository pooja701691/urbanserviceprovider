const Contact = require('../models/contact.model');
const { sendContactNotification } = require('../utils/mailer');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'name, email, subject and message are required' });
    }

    const contact = await Contact.create({ name, email, phone, subject, message });

    // Notify admin — don't fail request if email fails
    try {
      await sendContactNotification({ name, email, phone, subject, message });
    } catch (mailErr) {
      console.error('Contact email notification failed:', mailErr.message);
    }

    res.status(201).json({ success: true, message: 'Your message has been sent. We will get back to you soon!', contact });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
