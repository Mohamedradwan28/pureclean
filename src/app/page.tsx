import { prisma } from "@/lib/prisma";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import ArticleCard from "@/components/ArticleCard";
import CoverageArea from "@/components/CoverageArea";
import { Droplets, Shield, Clock, Star } from "lucide-react";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [services, articles] = await Promise.all([
    prisma.service.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.article.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  const features = [
    { icon: <Shield className="w-8 h-8"/>, title: "ضمان الجودة", desc: "تعويض كامل عند عدم الرضا" },
    { icon: <Clock className="w-8 h-8"/>, title: "مواعيد دقيقة", desc: "بدون تأخير أو انتظار" },
    { icon: <Star className="w-8 h-8"/>, title: "مواد آمنة", desc: "صديقة للبيئة والأطفال" },
    { icon: <Droplets className="w-8 h-8"/>, title: "فريق محترف", desc: "مدربون ومعتمدون" },
  ];

  return (
    <>
      <Hero />
      
      {/* الميزات */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="glass p-6 text-center animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* الخدمات */}
      <section id="services" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">🧼 خدماتنا الاحترافية</h2>
          <p className="section-sub">حلول تنظيف متكاملة بأحدث أجهزة البخار ومواد صديقة للبيئة</p>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} delay={i * 0.1} />
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="/services" className="btn-secondary">عرض جميع الخدمات ←</a>
          </div>
        </div>
      </section>

      <CoverageArea  />

      {/* المقالات */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">📰 دليلك للنظافة المثالية</h2>
          <p className="section-sub">نصائح وخبرات من فريقنا للحفاظ على منزلك صحياً ونظيفاً</p>
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((a, i) => (
              <ArticleCard key={a.id} article={a} delay={i * 0.1} />
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="/articles" className="btn-secondary">عرض جميع المقالات ←</a>
          </div>
        </div>
      </section>

      {/* CTA نهائي */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto glass p-10 text-center rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 opacity-60" />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">🎁 جاهز لنظافة غير مسبوقة؟</h3>
            <p className="text-slate-600 mb-8">
              احجز الآن واحصل على <strong>خصم 15%</strong> للطلب الأول + تعقيم مجاني
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/9660578343636" className="btn-primary">
                📱 اطلب عبر واتساب
              </a>
              <a href="tel:+9660578343636" className="btn-secondary">
                📞 اتصل مباشرة
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}