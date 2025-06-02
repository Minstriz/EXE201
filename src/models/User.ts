import mongoose, { Schema, models, model } from 'mongoose';

// Define the structure of a User document
export interface IUser extends Document {
  // Mongoose automatically adds _id as ObjectId
  username: string;
  email: string;
  password?: string; // Password might be hashed, or not stored for some users
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  createdAt: Date;
}

// Define the user schema
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Lưu ý: Nên hash mật khẩu trong thực tế
  fullName: { type: String },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  province: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Kiểm tra nếu model đã tồn tại trước khi định nghĩa
// Correctly type the User model to avoid any type
const User: mongoose.Model<IUser> = models.User || model<IUser>('User', UserSchema);

export default User; 