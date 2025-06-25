import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    console.log('Starting product update...');
    console.log('Product ID:', params.id);

    const body = await request.json();
    console.log('Update data:', body);

    const { inventory, inStock } = body;

    // Validate input
    if (typeof inventory !== 'number' || inventory < 0) {
      return NextResponse.json(
        { message: "Số lượng không hợp lệ" },
        { status: 400 }
      );
    }

    // Find and update product
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { 
        $set: { 
          inventory: inventory,
          inStock: inStock,
          updatedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    console.log('Product updated successfully:', {
      id: updatedProduct._id,
      name: updatedProduct.name,
      inventory: updatedProduct.inventory,
      inStock: updatedProduct.inStock
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: "Lỗi khi cập nhật sản phẩm" },
      { status: 500 }
    );
  }
} 