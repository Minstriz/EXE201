import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name';

const ShirtCustomizeOrderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  note: String,
  patternImage: String,
  shirtImage: String,
  createdAt: String,
  status: { type: String, enum: ['Đã đặt', 'Đã xác nhận', 'Đang giao hàng', 'Bị huỷ', 'Đã giao hàng'], default: 'Đã đặt' },
});

const ShirtCustomizeOrder = mongoose.model('ShirtCustomizeOrder', ShirtCustomizeOrderSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  const result = await ShirtCustomizeOrder.updateMany(
    { $or: [{ status: { $exists: false } }, { status: null }] },
    { $set: { status: 'Đã đặt' } }
  );
  console.log(`Updated ${result.modifiedCount} documents.`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});