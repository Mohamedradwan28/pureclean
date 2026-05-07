// src/components/ArticleCard.tsx
import Link from "next/link";

export default function ArticleCard({ article, delay = 0 }: { article: any; delay?: number }) {
  // حماية من البيانات غير المعرفة
  if (!article || !article.slug) return null;

  return (
    <Link 
      href={`/articles/${article.slug}`} 
      className="glass p-6 block animate-fade-up group" 
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="h-40 bg-slate-100 rounded-xl mb-4 overflow-hidden">
        {article.imageUrl && (
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition" 
          />
        )}
      </div>
      <h3 className="font-bold text-lg mb-2 group-hover:text-sky-600 transition line-clamp-2">
        {article.title}
      </h3>
      <p className="text-slate-500 text-sm line-clamp-2">
        {article.metaDesc || "اقرأ المزيد..."}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>{new Date(article.createdAt).toLocaleDateString("ar-SA")}</span>
        <span>اقرأ المقال ←</span>
      </div>
    </Link>
  );
}