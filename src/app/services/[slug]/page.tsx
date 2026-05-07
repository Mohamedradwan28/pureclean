// src/app/services/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CheckCircle, Phone, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

// ✅ التصحيح: تعريف النوع الصحيح لـ params كـ Promise
type Props = { 
  params: Promise<{ slug: string }> 
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const service = await prisma.service.findUnique({ 
    where: { slug: decodedSlug } 
  });
  
  if (!service) {
    return {
      title: "خدمة غير موجودة | بور كلين للايف",
      description: "عذراً، الخدمة التي تبحث عنها غير موجودة أو تم حذفها."
    };
  }
  
  // ✅ الوصول الآمن للحقول الاختيارية
  const keywords = 'keywords' in service && Array.isArray((service as any).keywords)
    ? (service as any).keywords.join(", ")
    : service.category || "تنظيف";
  
  return {
    title: `${service.title} | بور كلين للايف`,
    description: service.metaDesc || service.description,
    keywords: keywords,
  };
}

// ✅ التصحيح: انتظار params في المكون الرئيسي
export default async function ServicePage({ params }: Props) {
  // ✅ انتظر الـ Promise أولاً
  const { slug } = await params;
  
  // ✅ فك تشفير slug للعربية
  const decodedSlug = decodeURIComponent(slug);
  
  const service = await prisma.service.findUnique({ 
    where: { slug: decodedSlug } 
  });
  
  // ✅ إذا لم توجد الخدمة، اعرض صفحة 404
  if (!service) {
    return (
      <div className="min-h-screen py-24 px-4 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-4">❌ خدمة غير موجودة</h1>
          <p className="text-slate-600 mb-8">عذراً، الخدمة التي تبحث عنها غير موجودة أو تم تغيير رابطها.</p>
          <Link href="/services" className="btn-primary inline-flex items-center gap-2">
            <ArrowRight className="w-4 h-4" /> العودة للخدمات
          </Link>
        </div>
      </div>
    );
  }

  const cities = ["الدمام", "الخبر", "القطيف", "الظهران"];
  const benefits = [
    "تعقيم عميق يقضي على 99.9% من البكتيريا",
    "مواد صديقة للبيئة آمنة للأطفال والحيوانات",
    "فريق مدرب ومعتمد على أعلى المعايير",
    "ضمان رضا كامل أو استعادة المبلغ",
  ];

  // ✅ تحسينات SEO المضمنة
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "بور كلين للايف",
      "areaServed": ["الدمام", "الخبر", "القطيف", "الظهران", "المنطقة الشرقية"]
    },
    "serviceType": service.category,
    "offers": {
      "@type": "Offer",
      "price": service.price,
      "priceCurrency": "SAR"
    }
  };

  return (
    <article className="min-h-screen py-24 px-4">
      {/* ✅ Schema JSON-LD لمحركات البحث */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} 
      />
      
      <div className="max-w-5xl mx-auto">
        {/* رابط العودة */}
        <Link href="/services" className="inline-flex items-center gap-2 text-sky-600 font-medium mb-8 hover:gap-3 transition-all">
          <ArrowRight className="w-4 h-4" /> العودة للخدمات
        </Link>

        {/* الهيدر الرئيسي */}
        <div className="glass p-8 md:p-12 rounded-3xl mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-emerald-50 opacity-60" />
          <div className="relative z-10">
            {/* شارة "الأكثر طلباً" إذا كانت مفعلة */}
            {service.isPopular && (
              <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
                🔥 الأكثر طلباً
              </span>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              {service.title}
            </h1>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              {service.description}
            </p>
            
            {/* شارة الفئة */}
            <span className="inline-block px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm mb-6">
              📁 {service.category}
            </span>
            
            {/* المدن المتاحة */}
            <div className="flex flex-wrap gap-2 mb-6">
              {service.cities?.length > 0 ? service.cities.map((city: string) => (
                <span key={city} className="px-3 py-1 bg-white/70 text-sm font-medium text-slate-700 rounded-full border border-slate-200">
                  📍 {city}
                </span>
              )) : cities.map(city => (
                <span key={city} className="px-3 py-1 bg-white/70 text-sm font-medium text-slate-700 rounded-full border border-slate-200">
                  📍 {city}
                </span>
              ))}
            </div>

            {/* السعر والمدة */}
            {(service.price || service.duration) && (
              <div className="flex flex-wrap gap-4 mb-6 text-sm">
                {service.price && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                    💰 يبدأ من {service.price} ر.س
                  </span>
                )}
                {service.duration && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-sky-50 text-sky-700 rounded-full">
                    ⏱️ {service.duration}
                  </span>
                )}
              </div>
            )}

            {/* أزرار الحجز */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={`https://wa.me/966500000000?text=مرحباً، أطلب خدمة: ${encodeURIComponent(service.title)}`} 
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> احجز عبر واتساب
              </a>
              <a href="tel:+966500000000" className="btn-secondary inline-flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" /> اتصل الآن
              </a>
            </div>
          </div>
        </div>

        {/* الصورة البارزة */}
        {service.imageUrl && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={service.imageUrl} 
              alt={service.title} 
              className="w-full h-80 object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* الميزات */}
        {service.features?.length > 0 && (
          <div className="mb-12">
            <h3 className="font-bold text-xl mb-4">✨ ميزات هذه الخدمة</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {service.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-start gap-3 glass p-4 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* المحتوى التفصيلي */}
        {service.content && (
          <div className="glass p-8 rounded-2xl mb-12">
            <h3 className="font-bold text-xl mb-4">📋 تفاصيل الخدمة</h3>
            <div 
              className="prose prose-lg max-w-none text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: service.content.replace(/\n/g, "<br>") }} 
            />
          </div>
        )}

        {/* خطوات العمل */}
        <div className="glass p-8 rounded-2xl mb-12">
          <h3 className="font-bold text-xl mb-6">🔄 كيف نخدمك؟</h3>
          <div className="space-y-4">
            {[
              { step: "1", title: "احجز خدمتك", desc: "عبر واتساب أو الاتصال المباشر" },
              { step: "2", title: "نحدد الموعد", desc: "نصلك في الوقت المتفق عليه في منطقتك" },
              { step: "3", title: "ننفذ الخدمة", desc: "بأفضل المعدات والمواد الآمنة" },
              { step: "4", title: "ضمان الرضا", desc: "نتأكد من رضاك الكامل قبل المغادرة" },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="w-10 h-10 bg-sky-600 text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{s.title}</h4>
                  <p className="text-slate-600 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA نهائي */}
        <div className="text-center glass p-8 rounded-2xl">
          <h3 className="font-bold text-xl mb-3">🎁 جاهز لتجربة الفرق؟</h3>
          <p className="text-slate-600 mb-6">
            احجز <strong>{service.title}</strong> الآن واحصل على خصم 15% للطلب الأول
          </p>
          <a 
            href={`https://wa.me/966500000000?text=${encodeURIComponent(`أريد حجز: ${service.title} - خصم 15%`)}`} 
            className="btn-primary inline-flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" /> احجز الآن ووفر 15%
          </a>
        </div>
      </div>
    </article>
  );
}