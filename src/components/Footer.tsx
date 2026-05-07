export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">بور كلين للايف</h3>
        <p className="mb-6 max-w-2xl mx-auto">
          خدمات تنظيف بالبخار ومكافحة حشرات معتمدة في المنطقة الشرقية. 
          جودة مضمونة، أسعار تنافسية، وفريق محترف.
        </p>
        <div className="flex justify-center gap-6 mb-6">
          <a href="https://wa.me/9660578343636" className="hover:text-emerald-400 transition">واتساب</a>
          <a href="tel:+9660578343636" className="hover:text-emerald-400 transition">اتصل بنا</a>
          <a href="/admin" className="hover:text-emerald-400 transition">لوحة الإدارة</a>
        </div>
        <div className="border-t border-slate-800 pt-6 text-sm">
          © {new Date().getFullYear()} بور كلين للايف - جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}