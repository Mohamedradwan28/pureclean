// src/components/TrustBadges.tsx
export default function TrustBadges() {
  const badges = [
    "✅ معتمد من وزارة الصحة",
    "🛡️ مواد مرخصة وآمنة",
    "👥 +5000 عميل سعيد",
    "⭐ تقييم 4.9/5",
    "🚗 تغطية كاملة للشرقية",
  ];

  return (
    <div className="bg-slate-900 text-white py-3 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...badges, ...badges].map((badge, i) => (
          <span key={i} className="mx-8 text-sm font-medium">{badge}</span>
        ))}
      </div>
    </div>
  );
}