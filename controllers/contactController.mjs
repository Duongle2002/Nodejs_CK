import Message from '../models/message.mjs';

export const contactPage = (req, res) => {
  res.render('contact', { user: req.session.user });
};

export const submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = new Message({
      name,
      email,
      subject,
      message
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message submitted successfully!' });
  } catch (error) {
    console.error("Error submitting message:", error);
    res.status(500).send("Error submitting message");
  }
};
