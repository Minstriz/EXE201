import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

interface IShirtCustomizeOrder {
  name: string;
  phone: string;
  email: string;
  note: string;
  patternImage: string;
  shirtImage: string;
  createdAt: string;
  status: 'Đã đặt' | 'Đã xác nhận' | 'Đang giao hàng' | 'Bị huỷ' | 'Đã giao hàng';
}

let ShirtCustomizeOrder: mongoose.Model<IShirtCustomizeOrder>;

try {
  ShirtCustomizeOrder = mongoose.model<IShirtCustomizeOrder>('ShirtCustomizeOrder');
} catch {
  const ShirtCustomizeOrderSchema = new mongoose.Schema<IShirtCustomizeOrder>({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    note: { type: String, required: true },
    patternImage: { type: String, required: true },
    shirtImage: { type: String, required: true },
    createdAt: { type: String, required: true },
    status: { type: String, enum: ['Đã đặt', 'Đã xác nhận', 'Đang giao hàng', 'Bị huỷ', 'Đã giao hàng'], default: 'Đã đặt', required: true },
  });
  ShirtCustomizeOrder = mongoose.model<IShirtCustomizeOrder>('ShirtCustomizeOrder', ShirtCustomizeOrderSchema);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    if (!body.status) body.status = 'Đã đặt';
    const order = new ShirtCustomizeOrder(body);
    await order.save();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url!);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const q = searchParams.get('q') || '';
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const status = searchParams.get('status');

    type FilterType = {
      $or?: Array<{ name?: object; email?: object; phone?: object }>;
      createdAt?: { $gte?: string; $lte?: string };
      status?: string;
    };
    const filter: FilterType = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ];
    }
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = from;
      if (to) filter.createdAt.$lte = to;
    }
    if (status) {
      filter.status = status;
    }
    const total = await ShirtCustomizeOrder.countDocuments(filter);
    const orders = await ShirtCustomizeOrder.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return NextResponse.json({ total, orders });
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url!);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    await ShirtCustomizeOrder.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}