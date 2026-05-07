// src/components/WhyChooseUs.tsx
import { Shield, Clock, Star, Droplets, Award, Headphones } from "lucide-react";

export default function WhyChooseUs() {
  const reasons = [
    { icon: <Shield className="w-8 h-8"/>, title: "ضمان رضا 100%", desc: "استعادة المبلغ إذا لم تكن راضياً" },
    { icon: <Clock className="w-8 h-8"/>, title: "مواعيد دقيقة", desc: "نصلك في الوقت المتفق أو الخدمة مجانية" },
    { icon: <Star className="w-8 h-8"/>, title: "فريق محترف", desc: "مدربون ومعتمدون من وزارة العمل" },
    { icon: <Droplets className="w-8 h-8"/>, title: "مواد آمنة", desc: "صديقة للبيئة والأطفال والحيوانات" },
    { icon: <Award className="w-8 h-8"/>, title: "أجهزة متطورة", desc: "أحدث تقنيات التنظيف بالبخار الجاف" },
    { icon: <Headphones className="w-8 h-8"/>, title: "دعم 24/7", desc: "فريق خدمة عملاء جاهز للرد على استفساراتك" },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-sky-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">✨ لماذا يختارنا عملاؤنا في الشرقية؟</h2>
        <p className="section-sub">لأننا نضع جودة الخدمة ورضا العميل في مقدمة أولوياتنا</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <div key={i} className="glass p-6 text-center group hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-sky-600 group-hover:scale-110 transition">
                {r.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{r.title}</h3>
              <p className="text-slate-600 text-sm">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}