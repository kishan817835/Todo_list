import transporter from "../utils/mailer.js";



export const sendCustomMail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ 
        success: false, 
        error: "To, subject, and text are required" 
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    res.json({ success: true, message: "Custom mail sent successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
