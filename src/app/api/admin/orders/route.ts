import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ordersFilePath = path.join(process.cwd(), 'data', 'orders.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(ordersFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data.orders);
  } catch (error) {
    console.error('Error reading orders file:', error);
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
} 