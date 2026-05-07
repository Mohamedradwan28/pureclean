export default function Hero() {
  const cities = ["الدمام", "الخبر", "القطيف", "الظهران", "المنطقة الشرقية"];
  
  return (
    <section className="pt-32 pb-16 px-4 text-center">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-wrap justify-center gap-2 mb-4 animate-fade-up">
          {cities.map(c => (
            <span key={c} className="px-4 py-1.5 bg-white/70 backdrop-blur text-sm font-medium text-slate-700 rounded-full border border-slate-200 shadow-sm">
              📍 {c}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black leading-tight animate-fade-up delay-100">
          نظافة شاملة بلمسة{" "}
          <span className="text-primary-600">احترافية</span> في الشرقية
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto animate-fade-up delay-200">
          شقق • فلل • كنب • سجاد • خزانات • مداخن • مكافحة حشرات
          <br />فريق مدرب، مواد آمنة، وضمان رضا 100%
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300">
          <a href="https://wa.me/9660578343636" className="btn-primary">
            💬 احجز عبر واتساب
          </a>
          <a href="#services" className="btn-secondary">
            استعرض الخدمات ↓
          </a>
        </div>
        
        <div className="flex justify-center gap-6 text-sm text-slate-500 pt-4 animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <span>✅ خدمة فورية 24/7</span>
          <span>🚗 نصلك خلال 60 دقيقة</span>
          <span>💯 ضمان رضا كامل</span>
        </div>
      </div>
    </section>
  );
}