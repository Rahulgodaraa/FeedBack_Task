import { Schema, model } from "mongoose";

// User Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // User roles: 'user' for regular users, 'admin' for administrators
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = model('User', userSchema);

export default User;
