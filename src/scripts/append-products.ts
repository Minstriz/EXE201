import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import '../lib/mongodb';
import Product from '../models/Product';

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');

async function appendProducts() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI');

    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected.');

    const newProducts = JSON.parse(fs.readFileSync(productsFilePath, 'utf8')).products;

    for (const product of newProducts) {
      const existing = await Product.findOne({ slug: product.slug });
      if (existing) {
        console.log(`❌ Bỏ qua: ${product.slug} đã tồn tại.`);
        continue;
      }

      await Product.create({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`✅ Đã thêm: ${product.slug}`);
    }

    console.log('🟢 Thêm sản phẩm hoàn tất.');
  } catch (err) {
    console.error('❌ Lỗi:', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
    process.exit(0);
  }
}

appendProducts();
