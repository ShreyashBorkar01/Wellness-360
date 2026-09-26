import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import { createTransportFromEnv } from "../utils/mailer.js";

const router = Router();
const limiter = rateLimit({ windowMs: 60_000, limit: 20 });
router.use(limiter);

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const RESET_TOKEN_TTL_MIN = Number(process.env.RESET_TOKEN_TTL_MIN || 30);
const APP_BASE_URL = process.env.APP_BASE_URL || "http://localhost:5000";

// Utility: sign JWT
function signToken(user) {
  return jwt.sign(
    { sub: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ======================= SIGNUP =======================
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // Hash password and save as passwordHash
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      passwordHash: hashed
    });
    await newUser.save();

    res.json({
      msg: "User created",
      user: { id: newUser._id, email: newUser.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ======================= LOGIN =======================
router.post("/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const q = usernameOrEmail.includes("@")
      ? { email: usernameOrEmail.toLowerCase() }
      : { username: usernameOrEmail.toLowerCase() };

    const user = await User.findOne(q);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    res.json({
      ok: true,
      token: signToken(user),
      user: { username: user.username, email: user.email }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// ======================= FORGOT PASSWORD =======================
router.post("/forgot-password", async (req, res) => {
  try {
    const { usernameOrEmail } = req.body;
    if (!usernameOrEmail) return res.status(400).json({ error: "Missing field" });

    const q = usernameOrEmail.includes("@")
      ? { email: usernameOrEmail.toLowerCase() }
      : { username: usernameOrEmail.toLowerCase() };

    const user = await User.findOne(q);
    if (!user) return res.json({ ok: true }); // avoid leaking info

    const token = crypto.randomBytes(24).toString("hex");
    const exp = new Date(Date.now() + RESET_TOKEN_TTL_MIN * 60_000);
    user.resetToken = token;
    user.resetTokenExp = exp;
    await user.save();

    const link = `${APP_BASE_URL}/reset.html?token=${token}`;
    const transport = createTransportFromEnv();

    if (transport) {
      await transport.sendMail({
        to: user.email,
        from: process.env.SMTP_FROM || "no-reply@example.com",
        subject: "Reset your FitnessAuth password",
        html: `<p>Click to reset password (expires in ${RESET_TOKEN_TTL_MIN} min):</p><p><a href="${link}">${link}</a></p>`
      });
    } else {
      console.log("[DEV] Reset link:", link);
    }

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// ======================= RESET PASSWORD =======================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gte: new Date() }
    });
    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// ======================= FORGOT USERNAME =======================
router.post("/forgot-username", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Missing field" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.json({ ok: true }); // avoid leaking info

    const transport = createTransportFromEnv();
    if (transport) {
      await transport.sendMail({
        to: user.email,
        from: process.env.SMTP_FROM || "no-reply@example.com",
        subject: "Your FitnessAuth username",
        html: `<p>Your username is <b>${user.username}</b>.</p>`
      });
    } else {
      console.log("[DEV] Username for", user.email, "is", user.username);
    }

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
