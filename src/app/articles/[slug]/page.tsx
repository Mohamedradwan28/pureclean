// src/app/articles/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

// ✅ تعريف صحيح لـ Next.js 15+
type Props = {
  params: Promise<{ slug: string }>;
};

// ✅ ميتا داتا ديناميكية
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // ⚠️ انتظار الـ Promise أولاً
  const decodedSlug = decodeURIComponent(slug); // ⚠️ فك تشفير الرابط العربي

  const article = await prisma.article.findUnique({
    where: { slug: decodedSlug },
  });

  if (!article) {
    return { title: "مقال غير موجود | بور كلين للايف" };
  }

  return {
    title: article.title,
    description: article.metaDesc || article.content?.slice(0, 160) || "",
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params; // ⚠️ انتظار الـ Promise أولاً
  const decodedSlug = decodeURIComponent(slug); // ⚠️ فك تشفير الرابط

  // ✅ استعلام آمن مع معالجة الأخطاء
  const article = await prisma.article.findUnique({
    where: { slug: decodedSlug },
  }).catch(() => null); // منع الـ PANIC الداخلي لـ Prisma

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div className="glass p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4">📄 مقال غير موجود</h1>
          <p className="text-slate-600 mb-6">عذراً، الرابط الذي دخلت إليه غير صالح أو تم حذف المقال.</p>
          <Link href="/articles" className="btn-primary inline-flex items-center gap-2">
            <ArrowRight className="w-4 h-4" /> العودة للمقالات
          </Link>
        </div>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.metaDesc,
    "datePublished": article.createdAt,
    "author": { "@type": "Organization", "name": "بور كلين للايف" },
  };

  return (
    <article className="min-h-screen py-24 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      
      <div className="max-w-4xl mx-auto">
        <Link href="/articles" className="inline-flex items-center gap-2 text-sky-600 font-medium mb-8 hover:gap-3 transition-all">
          <ArrowRight className="w-4 h-4" /> العودة للمقالات
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(article.createdAt).toLocaleDateString("ar-SA")}
            </span>
            {article.readTime && <span>⏱️ {article.readTime} دقيقة قراءة</span>}
          </div>
        </header>

        {article.imageUrl && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
            <img src={article.imageUrl} alt={article.title} className="w-full h-64 md:h-96 object-cover" />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none text-slate-700 leading-relaxed prose-headings:font-bold prose-a:text-sky-600"
          dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br>") }} 
        />

        <div className="mt-12 p-6 bg-gradient-to-r from-sky-50 to-emerald-50 rounded-2xl border border-sky-100 text-center">
          <h3 className="font-bold text-lg mb-3">💡 هل تحتاج مساعدة في هذا المجال؟</h3>
          <p className="text-slate-600 mb-4">فريق بور كلين جاهز لخدمتك بأفضل المعدات والمواد الآمنة</p>
          <a href="https://wa.me/9660578343636" className="btn-primary inline-flex items-center gap-2">
            احجز خدمتك الآن <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </article>
  );
}