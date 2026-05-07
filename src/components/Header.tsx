import Link from "next/link";
import { Droplets } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-primary-600">
          <Droplets className="w-7 h-7" /> بور كلين للايف
        </Link>
        <nav className="hidden md:flex gap-8 font-semibold text-slate-700">
          <Link href="/" className="hover:text-primary-600 transition">الرئيسية</Link>
          <Link href="/services" className="hover:text-primary-600 transition">الخدمات</Link>
          <Link href="/articles" className="hover:text-primary-600 transition">المقالات</Link>
          <Link href="/admin" className="hover:text-primary-600 transition">الإدارة</Link>
        </nav>
        <a href="https://wa.me/9660578343636" className="btn-primary text-sm px-5 py-2.5 hidden sm:inline-flex">
          احجز الآن 📱
        </a>
      </div>
    </header>
  );
}