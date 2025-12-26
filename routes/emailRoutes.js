const express = require('express');
const router = express.Router();
const { sendEmail, getMessages, deleteMessage } = require('../controllers/emailController');

router.post('/send-email', sendEmail);
router.get('/messages', getMessages);
router.delete('/messages/:id', deleteMessage);

module.exports = router;
