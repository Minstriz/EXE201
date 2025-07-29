import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="flex flex-col items-center p-4">
          <Image
            src={product.mainImage}
            alt={product.name}
            width={180}
            height={180}
            className="object-contain rounded-lg mb-2"
          />
          <div className="w-full text-center">
            <h3 className="font-semibold text-base text-[#023048] truncate mb-1">
              {product.name}
            </h3>
            <div className="text-sm text-gray-500 mb-1">{product.category}</div>
            <div className="text-lg font-bold text-[#FB8501]">
              {product.price.toLocaleString()} VND
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard; 