import Hero from "@/components/Hero";
import ProductList from "@/components/ProductList";
import Review from "@/components/Review";
import Search from "@/components/Search";
import React from "react";

function HomePage() {
  return (
    <div className="min-h-screen w-full">
      <Hero />
      <Search />
      <ProductList />
      <Review />
    </div>
  );
}

export default HomePage;
