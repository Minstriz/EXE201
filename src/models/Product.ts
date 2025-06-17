import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string; // This will become mainImage
  category: string;
  createdAt: Date;
  slug: string;
  mainImage: string; // URL of the main image
  images: string[]; // Array of image URLs for gallery
  colors: { value: string; label: string }[]; // Array of available colors
  sizes: string[]; // Array of available sizes
  inStock: boolean; // Is the product in stock?
  averageRating: number; // Average rating (e.g., 9.7)
  numOfReviews: number; // Total number of reviews
  reviews?: { userId: mongoose.Types.ObjectId; rating: number; comment: string; createdAt: Date }[];
}

// Schema for sub-document Review
const ReviewSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  slug: { type: String, required: true, unique: true },
  mainImage: { type: String, required: true },
  images: [{ type: String }],
  colors: [{
    value: { type: String, required: true },
    label: { type: String, required: true },
  }],
  sizes: [{ type: String }],
  inStock: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0 },
  numOfReviews: { type: Number, default: 0 },
  reviews: [ReviewSchema],
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema); 