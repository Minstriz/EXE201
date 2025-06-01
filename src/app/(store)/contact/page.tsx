import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

function ContactPage() {
  return (
    <div className="pt-[120px] bg-white">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-center text-[#FB8501] text-2xl font-bold mb-6 uppercase">
          Liên hệ và trợ giúp
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="flex flex-col justify-between h-full">
            {/* Box section */}
            <div className="bg-white border border-[#219EBC] rounded-lg p-6">
              <h2 className="text-[#219EBC] text-lg font-bold mb-4 uppercase">
                Thông tin liên hệ chung
              </h2>
              <p className="mb-2 flex items-center">
                <i className="fas fa-phone-alt mr-2"></i> (+84) 1234567890
              </p>
              <p className="mb-2 flex items-center">
                <i className="fas fa-envelope mr-2"></i> asaigon123@gmail.com
              </p>
              <p className="mb-2 flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i> Ho Chi Minh City
                - Viet Nam
              </p>
              <div className="flex space-x-4 mt-4">
                <Link href="#" className="text-gray-600 hover:text-[#1877f2]">
                  <FaFacebookF size={20} />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-[#E4405F]">
                  <FaInstagram size={20} />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-[#FF0000]">
                  <FaYoutube size={20} />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-black">
                  <FaTiktok size={20} />
                </Link>
              </div>
            </div>

            {/* Body text section, outside the box but part of left column */}
            <div className="mt-4">
              <p className="mb-4">
                Bạn cần hỗ trợ? Hãy liên hệ qua thông tin liên hệ của chúng tôi
                và một thành viên nhóm hỗ trợ khách hàng của À Sài Gòn sẽ trả
                lời bạn sớm nhất có thể!
              </p>
              <p>
                Nếu bạn có câu hỏi về bán hàng liên quan đến bán hàng quảng cáo
                hoặc kinh doanh trưng bày, vui lòng{" "}
                <a
                  href="#"
                  className="text-[#219EBC] underline hover:text-[#1b89a0]"
                >
                  liên hệ với À Sài Gòn tại đây
                </a>
                .
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col justify-between h-full space-y-4">
            <Button className="w-full bg-[#219EBC] text-white py-8 px-6 rounded-lg hover:bg-[#1b89a0] transition text-base text-left">
              Bạn có phải là khách du lịch đang cần trợ giúp?
            </Button>
            <Button className="w-full bg-[#219EBC] text-white py-8 px-6 rounded-lg hover:bg-[#1b89a0] transition text-base text-left">
              Bạn có câu hỏi về đánh giá?
            </Button>
            <Button className="w-full bg-[#219EBC] text-white py-8 px-6 rounded-lg hover:bg-[#1b89a0] transition text-base text-left">
              Bạn cần liên hệ bộ phận hỗ trợ khách hàng?
            </Button>
            <Button className="w-full bg-[#219EBC] text-white py-8 px-6 rounded-lg hover:bg-[#1b89a0] transition text-base text-left">
              Bạn muốn đổi trả/hoàn tiền đơn hàng?
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
