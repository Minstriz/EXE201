import fs from 'fs';
import path from 'path';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import mongoose from 'mongoose';

const usersFilePath = path.join(__dirname, 'data', 'users.json');
const ordersFilePath = path.join(__dirname, 'data', 'orders.json');

async function migrateData() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected.');

    // --- Migrate Users ---
    console.log('Reading users from users.json...');
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8')).users;
    console.log(`Found ${usersData.length} users in users.json.`);

    const usersToInsert = usersData.map((user: any) => {
      // Map JSON structure to Mongoose schema structure
      // Mongoose will generate _id automatically
      const { id, ...rest } = user; // Exclude old JSON ID
      return {
        ...rest,
        // You might want to add the old ID for reference, e.g., oldJsonId: id
      };
    });

    console.log('Inserting users into MongoDB...');
    // Using insertMany and ignoring duplicates if any (e.g., by username/email unique index)
    const userInsertResult = await User.insertMany(usersToInsert, { ordered: false });
    console.log(`Successfully inserted ${userInsertResult.length} users into MongoDB.`);

    // --- Migrate Orders ---
    console.log('Reading orders from orders.json...');
    const ordersData = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8')).orders;
    console.log(`Found ${ordersData.length} orders in orders.json.`);

    const ordersToInsert = ordersData.map((order: any) => {
      // Map JSON structure to Mongoose schema structure
      const { id, ...rest } = order; // Exclude old JSON ID
       const items = order.items.map((item: any) => {
            const { id, ...itemRest } = item; // Exclude old JSON item ID if present
            return {
                ...itemRest,
                 id: item.id // Keep the product ID as defined in your OrderItem schema
            };
       });
      return {
        ...rest,
        items,
        // You might want to add the old ID for reference, e.g., oldJsonId: id
        // Note: userId is already a string in your JSON, matching the Mongoose schema
      };
    });

    console.log('Inserting orders into MongoDB...');
     // Using insertMany and ignoring duplicates if any
    const orderInsertResult = await Order.insertMany(ordersToInsert, { ordered: false });
    console.log(`Successfully inserted ${orderInsertResult.length} orders into MongoDB.`);

    console.log('Data migration complete.');

  } catch (error: any) {
    console.error('Error during data migration:', error);
    if (error.writeErrors) {
        console.error('Write Errors (possibly duplicates):', error.writeErrors);
    }
  } finally {
    // Disconnect from MongoDB
    // Check if mongoose connection exists before closing
    if (mongoose.connection.readyState === 1) {
       await mongoose.disconnect();
       console.log('MongoDB disconnected.');
    }
    process.exit(0); // Exit the script
  }
}

// Run the migration function
migrateData(); 