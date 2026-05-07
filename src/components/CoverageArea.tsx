// src/components/CoverageArea.tsx
export default function CoverageArea() {
  const data = [
    { city: "الدمام", areas: ["الشاطئ", "العزيزية", "المحمودية", "الركاب", "النخيل"] },
    { city: "الخبر", areas: ["العقربية", "الخليج", "الملك فهد", "الثقبة", "التحلية"] },
    { city: "القطيف", areas: ["سيهات", "صفوى", "عنك", "العوامية", "تاروت"] },
    { city: "الظهران", areas: ["الفلاح", "المنار", "الربوة", "واسط", "الدانة"] },
  ];
  
  return (
    <section className="py-16 px-4 bg-white/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">🗺️ نصلك في كل حي بالمنطقة الشرقية</h2>
        <p className="section-sub">فريقنا المتنقل يغطي جميع الأحياء بأعلى معايير الجودة والسرعة</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((d) => (
            <div key={d.city} className="glass p-5">
              <h3 className="font-bold text-lg mb-3 text-sky-700">📍 {d.city}</h3>
              <div className="flex flex-wrap gap-2">
                {d.areas.map(a => (
                  <span key={a} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-slate-600 mb-2">🏠 لا تجد حيك؟ تواصل معنا وخدمتك في الطريق!</p>
          <a href="https://wa.me/9660578343636" className="text-sky-600 font-semibold hover:underline">
            تحقق من تغطية منطقتك الآن →
          </a>
        </div>
      </div>
    </section>
  );
}