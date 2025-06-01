import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const productsFilePath = path.join(process.cwd(), "src/data/products.json");

// Helper function to read products
const readProducts = () => {
  try {
    const data = fs.readFileSync(productsFilePath, "utf8");
    return JSON.parse(data).products;
  } catch (error) {
    return [];
  }
};

// Helper function to write products
const writeProducts = (products: any[]) => {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify({ products }, null, 2));
  } catch (error) {
    console.error("Error writing products:", error);
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let products = readProducts();

    if (category) {
      products = products.filter(
        (product: any) => product.category === category
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (product: any) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, image, category } = body;

    if (!name || !description || !price || !image || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const products = readProducts();
    const newProduct = {
      id: products.length + 1,
      name,
      description,
      price,
      image,
      category,
      createdAt: new Date().toISOString(),
    };

    products.push(newProduct);
    writeProducts(products);

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 