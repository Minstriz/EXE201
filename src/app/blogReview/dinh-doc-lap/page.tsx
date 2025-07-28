import Link from "next/link";
import dinhDocLap from "@/data/reviews/dinh-doc-lap";

export default function BlogReviewPage({ params }: { params: { slug: string } }) {
  const blog = dinhDocLap;

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
              <Link href="/blog/cong-truong-thong-nhat" className="text-[#219EBC] hover:underline">
                Công trường Thống Nhất – Nơi kết nối lịch sử
              </Link>
            </li>
            <li>
              <Link href="/blog/duong-sach" className="text-[#219EBC] hover:underline">
                Đường Sách – Không gian văn hóa giữa lòng Sài Gòn
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
              src="/avatars/diemphucne.png"
              alt="diemphucne"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium text-[#219EBC]">{blog.author}</p>
              <p className="text-sm text-[#219EBC]">Saigon Blogger</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3 text-[#219EBC]">Bài viết khác</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/blog/ho-con-rua" className="text-[#219EBC] hover:underline">
                Hồ Con Rùa – Biểu tượng của thanh xuân
              </Link>
            </li>
            <li>
              <Link href="/blog/buu-dien" className="text-[#219EBC] hover:underline">
                Bưu điện Thành phố – Vẻ đẹp Đông Dương còn mãi
              </Link>
            </li>
          </ul>
        </div>

        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3 text-[#219EBC]">Địa điểm liên quan</h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="https://goo.gl/maps/PhzWuZz2xkL2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#219EBC] hover:underline"
              >
                Công viên 30/4
              </Link>
            </li>
            <li>
              <Link
                href="https://goo.gl/maps/kMa4p1mZ1Xy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#219EBC] hover:underline"
              >
                Nhà thờ Đức Bà
              </Link>
            </li>
          </ul>
        </div>

        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3 text-[#219EBC]">Mẹo trải nghiệm</h3>
          <ul className="list-disc list-inside text-[#219EBC] text-sm space-y-1">
            <li>Đi vào sáng sớm để tránh nắng, chụp hình đẹp hơn.</li>
            <li>Mua vé combo tham quan cả hầm chỉ huy để hiểu thêm về lịch sử.</li>
            <li>Mang theo nước suối và nón rộng vành.</li>
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
