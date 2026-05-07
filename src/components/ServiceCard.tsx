// src/components/ServiceCard.tsx
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ServiceCard({ service, delay = 0 }: { service: any; delay?: number }) {
  if (!service || !service.slug) return null;

  return (
    <div className="glass p-6 animate-fade-up group" style={{ animationDelay: `${delay}s` }}>
      <div className="h-48 bg-gradient-to-br from-sky-100 to-emerald-100 rounded-xl mb-4 overflow-hidden relative">
        {service.imageUrl ? (
          <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🧼</div>
        )}
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-sky-600 transition">{service.title}</h3>
      <p className="text-slate-600 line-clamp-3 mb-4">{service.description}</p>
      <Link href={`/services/${service.slug}`} className="text-sky-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
        التفاصيل <ArrowLeft className="w-4 h-4" />
      </Link>
    </div>
  );
}