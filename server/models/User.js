import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  passwordHash: { type: String },
  name: { type: String },
  googleId: { type: String, index: true },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
