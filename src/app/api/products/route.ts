import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let products;

    if (category) {
      products = await Product.find({ category });
    } else if (search) {
        const searchLower = search.toLowerCase();
        products = await Product.find({
            $or: [
                { name: { $regex: searchLower, $options: 'i' } },
                { description: { $regex: searchLower, $options: 'i' } },
            ],
        });
    } else {
      products = await Product.find({});
    }

    return NextResponse.json(products);
  } catch (error: unknown) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, description, price, image, category } = body;

    if (!name || !description || !price || !image || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category,
    });

    await newProduct.save();

    return NextResponse.json(newProduct);
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 