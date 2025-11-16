import mongoose, { Schema, Document } from 'mongoose';
import { CreateUserData, LoginCredentials } from './UserTypes';

// MongoDB User Document interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // Hashed password (bcrypt)
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const UserSchema = new Schema<IUser>(
  {
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Export User model
export const User = mongoose.model<IUser>('User', UserSchema);
