"use client";

import Hero from "@/components/Hero";
import Review from "@/components/Review";
import Search from "@/components/Search";
import React from "react";
import { useAuth } from "@/app/context/AuthContext";

function HomePage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full">
      <Hero />
      <Search />
      <Review />
    </div>
  );
}

export default HomePage;
