import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import LanguageToggle from "./LanguageToggle";

function Footer() {
  return (
    <footer className="bg-[#023048] text-white">
      <div className="max-w-screen-xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo */}
        <div>
          <Image
            src="/images/logo.png"
            alt="À Sài Gòn Logo"
            width={150}
            height={50}
          />
        </div>

        {/* Menu */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase">Trang</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:underline font-semibold">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline font-semibold">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline font-semibold">
                Khám phá
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline font-semibold">
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline font-semibold">
                Giỏ hàng
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase">Liên hệ</h3>
          <ul className="text-sm space-y-1">
            <li className="text-gray-300">
              Điện thoại:{" "}
              <span className="font-semibold text-white">(+84) 1234567890</span>
            </li>
            <li className="text-gray-300">
              Email:{" "}
              <span className="font-semibold text-white">
                asaigon123@gmail.com
              </span>
            </li>
            <li className="text-gray-300">
              Location:{" "}
              <span className="font-semibold text-white">
                Ho Chi Minh City - Viet Nam
              </span>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase">
            Theo dõi À Sài Gòn
          </h3>
          <div className="flex space-x-4 text-2xl">
            <Link href="#" className="hover:text-[#FB8501]">
              <FaFacebookF />
            </Link>
            <Link href="#" className="hover:text-[#FB8501]">
              <FaInstagram />
            </Link>
            <Link href="#" className="hover:text-[#FB8501]">
              <FaTiktok />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="max-w-screen-xl mx-auto p-4 flex justify-between items-center">
        <div className="px-3 py-10 rounded flex items-center space-x-2 text-sm">
    <LanguageToggle />
</div>

        <span className="text-sm text-gray-300">
          © 2024 À Sài Gòn. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
