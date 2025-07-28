import Link from "next/link";
import banhMiCaPhe from "@/data/reviews/banh-mi-ca-phe";

export default function BlogReviewPage({ params }: { params: { slug: string } }) {
  const blog = banhMiCaPhe;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

      {/* Main Content */}
      <div className="lg:col-span-2">
        <h1 className="text-3xl md:text-4xl font-bold text-[#FB8501] mb-4 text-center leading-snug">
          {blog.title}
        </h1>

        <div className="text-sm text-[#219EBC] text-center mb-6">
          {blog.date} | <span className="font-medium">{blog.author}</span>
        </div>

        <div className="rounded-xl overflow-hidden shadow mb-8 max-h-[480px]">
          <img src={blog.img} alt={blog.title || "Blog image"} className="w-full object-cover" />
        </div>

        <div className="prose prose-lg max-w-none text-justify text-[#219EBC]">
          {blog.quote && (
            <blockquote className="italic text-[#023047] border-l-4 pl-4 mb-6">
              {`“${blog.quote}”`}
            </blockquote>
          )}
          <p>{blog.content}</p>
        </div>

        {/* Suggested Reading */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 text-[#219EBC]">Gợi ý đọc tiếp</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <Link href="/blog/cho-ben-thanh" className="text-[#219EBC] hover:underline">
                Chợ Bến Thành – Hơi thở giữa lòng thành phố
              </Link>
            </li>
            <li>
              <Link href="/blog/bitexco-skydeck" className="text-[#219EBC] hover:underline">
                Bitexco Skydeck – Góc nhìn toàn cảnh Sài Gòn
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-8">
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3 text-[#219EBC]">Tác giả</h3>
          <div className="flex items-center space-x-3">
            <img
              src="/avatars/minhsapoche.png"
              alt="minhsapoche"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium text-[#219EBC]">{blog.author}</p>
              <p className="text-sm text-[#219EBC]">Blogger Sài Gòn</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3 text-[#219EBC]">Bài viết khác</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/blog/dinh-doc-lap" className="text-[#219EBC] hover:underline">
                Dinh Độc Lập – Biểu tượng lịch sử Sài Gòn
              </Link>
            </li>
            <li>
              <Link href="/blog/nha-tho-tan-dinh" className="text-[#219EBC] hover:underline">
                Nhà thờ Tân Định – Màu hồng giữa lòng phố
              </Link>
            </li>
          </ul>
        </div>

        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3 text-[#219EBC]">Địa điểm liên quan</h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="https://goo.gl/maps/M6kF1A3VbBpHeVLKA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#219EBC] hover:underline"
              >
                Nhà thờ Đức Bà
              </Link>
            </li>
            <li>
              <Link
                href="https://goo.gl/maps/yzRZr6h92L5kWJZj6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#219EBC] hover:underline"
              >
                Cà phê bệt Công xã Paris
              </Link>
            </li>
          </ul>
        </div>

        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3 text-[#219EBC]">Mẹo trải nghiệm</h3>
          <ul className="list-disc list-inside text-[#219EBC] text-sm space-y-1">
            <li>Thử bánh mì ở xe đẩy góc đường Nguyễn Du – Pasteur.</li>
            <li>Ngồi cà phê bệt sáng Chủ nhật – không khí cực chill.</li>
            <li>Mang theo tiền mặt lẻ, quán lề đường không có quẹt thẻ.</li>
          </ul>
        </div>

        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3 text-[#219EBC]">Chia sẻ bài viết</h3>
          <div className="flex gap-4 text-[#219EBC] text-sm">
            <a href="#">Facebook</a>
            <a href="#">X</a>
            <a href="#">Instagram</a>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3 text-[#219EBC]">Từ khóa</h3>
          <div className="flex flex-wrap gap-2">
            {(blog.tags || ["Sài Gòn", "Dinh Độc Lập", "di tích", "du lịch"])?.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-[#219EBC] text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
