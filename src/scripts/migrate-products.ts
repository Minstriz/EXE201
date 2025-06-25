import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import '../lib/mongodb';
import '../models/Product';

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');

async function migrateProducts() {
  try {
    console.log('Connecting to MongoDB...');
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected.');

    // Đọc dữ liệu sản phẩm từ file JSON
    console.log('Reading products from products.json...');
    const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8')).products;
    console.log(`Found ${productsData.length} products in products.json.`);

    // Chuyển đổi dữ liệu để phù hợp với schema MongoDB
    const productsToInsert = productsData.map((product: any) => {
      const { id, ...rest } = product; // Loại bỏ id cũ
      return {
        ...rest,
        inventory: 100, // Mặc định số lượng tồn kho là 100
        lowStockThreshold: 10, // Ngưỡng cảnh báo hàng sắp hết
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // Xóa tất cả sản phẩm cũ trong database
    console.log('Clearing existing products...');
    await mongoose.model('Product').deleteMany({});

    // Thêm sản phẩm mới vào database
    console.log('Inserting products into MongoDB...');
    const productInsertResult = await mongoose.model('Product').insertMany(productsToInsert, { ordered: false });
    console.log(`Successfully inserted ${productInsertResult.length} products into MongoDB.`);

    console.log('Product migration complete.');
  } catch (error: any) {
    console.error('Error during product migration:', error);
    if (error.writeErrors) {
      console.error('Write Errors (possibly duplicates):', error.writeErrors);
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('MongoDB disconnected.');
    }
    process.exit(0);
  }
}

migrateProducts(); 