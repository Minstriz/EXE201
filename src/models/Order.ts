import mongoose, { Schema, models, model } from 'mongoose';

// Define the structure of an OrderItem sub-document
export interface IOrderItem {
  id: number; // Assuming product ID is a number
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

// Define the structure of an Order document
export interface IOrder extends Document {
  // Mongoose automatically adds _id as ObjectId
  userId: mongoose.Types.ObjectId; // Updated type to ObjectId for Mongoose
  items: IOrderItem[];
  totalAmount: number;
  status: string; // e.g., 'pending', 'delivered', 'cancelled'
  createdAt: Date;
  updatedAt?: Date;
  paymentId?: string;
}

// Define the schema for OrderItem (as a sub-schema)
const OrderItemSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
  quantity: { type: Number, required: true },
});

// Define the order schema
const OrderSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Updated definition for populate
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  paymentId: { type: String },
});

// Kiểm tra nếu model đã tồn tại trước khi định nghĩa
const Order = models.Order || model('Order', OrderSchema);

export default Order; 