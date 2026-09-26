import express from "express";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

router.post("/forgot-username", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Normalize email to lowercase
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond success (avoid leaking info)
    if (!user) {
      return res.status(200).json({ message: "If this account exists, your username has been sent!" });
    }

    // Verify username exists in DB
    if (!user.username) {
      console.error(`No username found for ${email}`);
      return res.status(500).json({ error: "Username not found in database" });
    }

    // Nodemailer transporter (using Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail", // simpler than host/port
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // Gmail App Password (not normal password!)
      },
    });

    // Email content
    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your Username Request",
      html: `
        <h3>Hello ${user.username},</h3>
        <p>You requested your username. Here it is:</p>
        <p><strong>${user.username}</strong></p>
        <p>If you did not request this email, please ignore it.</p>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Username email sent to ${user.email}. Server response:`, info.response);

    res.status(200).json({ message: "If this account exists, your username has been sent!" });
  } catch (err) {
    console.error("❌ Error sending username email:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
