import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 3, maxlength: 24, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  resetToken: { type: String, index: true },
  resetTokenExp: { type: Date }
}, { versionKey: false });

export default mongoose.model("User", UserSchema);
