import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const cairo = Cairo({ 
  subsets: ["arabic"], 
  variable: "--font-cairo"
});

export const metadata: Metadata = {
  title: { 
    default: "بور كلين للايف | تنظيف بالبخار في الشرقية", 
    template: "%s | بور كلين للايف" 
  },
  description: "خدمات تنظيف احترافية بالبخار في الدمام، الخبر، القطيف، الظهران: شقق، فلل، كنب، سجاد، خزانات، مداخن، مكافحة حشرات.",
  keywords: ["تنظيف بالبخار", "المنطقة الشرقية", "مكافحة حشرات", "تنظيف خزانات", "بور كلين"],
  metadataBase: new URL("https://pureclean.life"),
  openGraph: {
    title: "بور كلين للايف | تنظيف احترافي في الشرقية",
    description: "احجز خدمة تنظيف الآن مع ضمان الجودة",
    type: "website",
    locale: "ar_SA",
    siteName: "بور كلين للايف",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "بور كلين للايف",
  "description": "تنظيف احترافي بالبخار ومكافحة حشرات في المنطقة الشرقية",
  "areaServed": [
    { "@type": "City", "name": "الدمام" },
    { "@type": "City", "name": "الخبر" },
    { "@type": "City", "name": "القطيف" },
    { "@type": "City", "name": "الظهران" },
    { "@type": "AdministrativeArea", "name": "المنطقة الشرقية" }
  ],
  "address": { 
    "@type": "PostalAddress", 
    "addressCountry": "SA", 
    "addressRegion": "المنطقة الشرقية" 
  },
  "geo": { 
    "@type": "GeoCoordinates", 
    "latitude": "26.4207", 
    "longitude": "50.0888" 
  },
  "telephone": "+9660578343636",
  "openingHours": "Mo-Su 08:00-22:00",
  "priceRange": "$$",
  "sameAs": [
    "https://wa.me/9660578343636",
    "https://instagram.com/pureclean.life"
  ]
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} 
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}