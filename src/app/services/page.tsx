import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import ServiceCard from "@/components/ServiceCard";
import { Droplets, Shield, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "خدمات التنظيف بالبخار | بور كلين للايف - المنطقة الشرقية",
  description: "جميع خدماتنا: تنظيف شقق، فلل، كنب، سجاد، خزانات، مداخن مطاعم، مكافحة حشرات في الدمام، الخبر، القطيف، الظهران.",
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
  });

  const features = [
    { icon: <Droplets className="w-6 h-6"/>, title: "تنظيف بالبخار", desc: "أجهزة متطورة تعقم وتنظف بعمق" },
    { icon: <Shield className="w-6 h-6"/>, title: "مواد آمنة", desc: "صديقة للبيئة والأطفال والحيوانات" },
    { icon: <Clock className="w-6 h-6"/>, title: "خدمة سريعة", desc: "نصلك خلال 60 دقيقة في جميع مناطق الشرقية" },
  ];

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            🧼 خدماتنا الاحترافية
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            حلول تنظيف متكاملة للمنازل والشركات في الدمام، الخبر، القطيف، والظهران
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((f, i) => (
            <div key={i} className="glass p-6 text-center animate-fade-up" style={{ animationDelay: `${i*0.1}s` }}>
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-slate-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} delay={i * 0.1} />
          ))}
        </div>

        {/* CTA */}
        <div className="glass p-10 text-center rounded-3xl max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">🎁 عرض خاص لأول طلب!</h3>
          <p className="text-slate-600 mb-6">
            احجز أي خدمة الآن واحصل على <strong>خصم 15%</strong> + تعقيم مجاني للأسطح
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/9660578343636?text=مرحباً، أريد الاستفادة من عرض الخصم" className="btn-primary">
              📱 احجز عبر واتساب
            </a>
            <a href="tel:+9660578343636" className="btn-secondary">
              📞 اتصل الآن
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}