import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({ origin: "*" })); // allow all origins for dev
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());

// Config
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fitnessauth";
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ✅ Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail", // or smtp
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// MongoDB User Model
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
});

// Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

// Routes
app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);

// ✅ Forgot Password
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
  const resetLink = `http://localhost:3000/reset.html?token=${token}`;

  try {
    await transporter.sendMail({
      from: `"Fitness App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset",
      html: `<p>Click the link to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });
    res.json({ message: "✅ Reset link sent to your email." });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ message: "❌ Failed to send email." });
  }
});

// ✅ Reset Password
app.post("/api/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.json({ message: "✅ Password reset successful." });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(400).json({ message: "❌ Invalid or expired token." });
  }
});

// ✅ Chatbot route
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!GROQ_API_KEY) {
    return res.json({ reply: "⚠️ Server error: Missing API key." });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful fitness assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.json({ reply: "Error: " + data.error.message });
    }

    const botReply = data.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "⚠️ Sorry, I couldn't process your request." });
  }
});

// API for 7-Day Diet Planner (keep with other API routes, above all static/catch-all routes)
const mealSchema = new mongoose.Schema({
  mealType: String,
  name: String,
  qty: String,
  kcal: Number,
  dietType: String, // "veg" or "nonveg"
});
const Meal = mongoose.models.Meal || mongoose.model("Meal", mealSchema);
app.get("/api/get-meals", async (req, res) => {
  try {
    const meals = await Meal.find({});
    if (!meals.length) {
      return res.json({ success: false, message: "No meals found in database" });
    }
    // Format data as frontend expects
    const formatted = {
      breakfast: { veg: [], nonveg: [] },
      lunch: { veg: [], nonveg: [] },
      snack: { veg: [], nonveg: [] },
      dinner: { veg: [], nonveg: [] },
      fruits: [],
      juices: [],
    };
    for (const meal of meals) {
      if (["breakfast", "lunch", "snack", "dinner"].includes(meal.mealType)) {
        formatted[meal.mealType][meal.dietType].push({
          name: meal.name,
          qty: meal.qty,
          kcal: meal.kcal,
        });
      } else if (meal.mealType === "fruit") {
        formatted.fruits.push(meal.name);
      } else if (meal.mealType === "juice") {
        formatted.juices.push(meal.name);
      }
    }
    res.json({ success: true, meals: formatted });
  } catch (err) {
    console.error("❌ Error fetching meals:", err);
    res.status(500).json({ success: false, message: "Server error fetching meals" });
  }
});

// Serve frontend static files
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));
// Default page
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});
// This must always be last! SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

// MongoDB Connection + Server Start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Mongo error:", err);
    process.exit(1);
  });



