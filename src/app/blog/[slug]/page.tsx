// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import blogs from "@/data/blogs/blogList";

export default function BlogPage({ params }: { params: { slug: string } }) {
  const blog = blogs.find((b) => b.slug === params.slug);
  if (!blog) return notFound();

  const otherBlogs = blogs.filter((b) => b.slug !== blog.slug);

  return (
    <>
      {/* Hero Image + Overlay Title */}
      <div className="relative w-full h-[400px] mt-20">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg">
            {blog.title}
          </h1>
        </div>
      </div>

      {/* Main Content + Sidebar */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 px-6 pt-12 pb-16">
        {/* Main Blog Content */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-8">
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-6">
            “{blog.title} là điểm đến không thể bỏ qua khi ghé thăm Sài Gòn.”
          </blockquote>
          <div className="prose max-w-none">{blog.content}</div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block sticky top-28 h-fit">
          <h3 className="text-xl font-semibold mb-4 text-[#023048]">
            Địa điểm khác
          </h3>
          <div className="space-y-6">
            {otherBlogs.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="block group"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-32 object-cover rounded-md mb-2 group-hover:opacity-80 transition"
                />
                <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 line-clamp-2">
                  {item.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
