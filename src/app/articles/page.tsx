import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "مقالات تنظيف | نصائح واحترافية من بور كلين للايف",
  description: "مقالات توعوية حول التنظيف بالبخار، العناية بالسجاد والكنب، تنظيف الخزانات، مكافحة الحشرات، وصيانة المنازل في المنطقة الشرقية.",
};

export default async function ArticlesPage({ 
  searchParams 
}: { 
  searchParams: { q?: string } 
}) {
  const query = searchParams.q || "";
  
  const articles = await prisma.article.findMany({
    where: query ? {
      OR: [
        { title: { contains: query, mode: "insensitive" as const } },
        { content: { contains: query, mode: "insensitive" as const } },
      ]
    } : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            📰 مقالاتنا التوعوية
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            نصائح احترافية وخبرات من فريق بور كلين للحفاظ على منزلك نظيفاً وصحياً
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <form className="relative">
            <input
              type="search"
              name="q"
              placeholder="ابحث عن مقال... (مثال: تنظيف كنب، مكافحة حشرات)"
              defaultValue={query}
              className="w-full p-4 pe-12 border border-slate-200 rounded-2xl 
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                         bg-white/80 backdrop-blur-sm transition"
            />
            <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </form>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} delay={i * 0.1} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-2xl">
            <p className="text-xl text-slate-500 mb-4">
              {query ? `لا توجد نتائج لـ "${query}"` : "لا توجد مقالات حالياً"}
            </p>
            {query && (
              <a href="/articles" className="text-primary-600 font-semibold hover:underline">
                عرض جميع المقالات ←
              </a>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="glass p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="font-bold text-xl mb-3">💡 هل تبحث عن موضوع محدد؟</h3>
            <p className="text-slate-600 mb-6">
              تواصل معنا وسنكتب مقالاً خاصاً يجيب على استفسارك
            </p>
            <a href="https://wa.me/9660578343636" className="btn-primary">
              اسألنا عبر واتساب 💬
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}