// src/components/ContactFloat.tsx
"use client";
import { MessageCircle, Phone } from "lucide-react";

export default function ContactFloat() {
  const whatsappNumber = "9660578343636";
  const phoneNumber = "9660578343636";

  return (
    <>
      {/* 📞 زر الاتصال المباشر - يسار الشاشة */}
      <a
        href={`tel:+${phoneNumber}`}
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-sky-500 text-white rounded-full shadow-2xl hover:scale-110 hover:bg-sky-600 transition-all duration-300 animate-float"
        aria-label="اتصال مباشر"
        title="اتصل بنا الآن"
      >
        <Phone className="w-6 h-6" />
      </a>

      {/* 💬 زر واتساب - يمين الشاشة */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-emerald-500 text-white rounded-full shadow-2xl hover:scale-110 hover:bg-emerald-600 transition-all duration-300 animate-float"
        aria-label="تواصل عبر واتساب"
        title="راسلنا على واتساب"
        style={{ animationDelay: "0.5s" }}
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </>
  );
}