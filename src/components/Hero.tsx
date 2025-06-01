import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Hero() {
  return (
    <section className="w-full">
      <div className="relative">
        <Image
          src="/images/hero.jpg"
          alt="Saigon cityscape with sunset"
          width={1200}
          height={600}
          className="w-full h-100 lg:h-[750px] object-cover filter brightness-90"
        />

        {/* Gradient trên */}
        <div className="absolute top-0 left-0 w-full h-70 bg-gradient-to-b from-white via-transparent to-transparent"></div>
        {/* Gradient dưới */}
        <div className="absolute bottom-0 left-0 w-full h-70 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        <div className="absolute bg-opacity-50 flex flex-col items-center text-center top-1/3 max-w-[900px] text-white left-1/2 -translate-x-1/2 w-full lg:left-1/3 lg:items-start">
          <h1 className="text-4xl lg:text-9xl font-bold text-center lg:text-start ">
            ĐI SÀI GÒN CHƠI HONG ?
          </h1>
          <div className="text-xl py-2 lg:text-4xl lg:py-4 font-medium max-w-[900px]">
            <Link
  href="#"
  className="group bg-[#219EBC] text-white py-2 px-4 rounded-xl flex items-center gap-2 border border-[#219EBC] hover:bg-[#1b89a1] transition"
>
  <p className="text-base">Về À Sài Gòn</p>
  <p className="transform transition-transform duration-300 group-hover:translate-x-1">
    <ArrowRightIcon className="h-5 w-5" />
  </p>
</Link>



          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
