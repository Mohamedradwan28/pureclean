// src/app/admin/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, Edit, Eye, BarChart3, Users, Settings, 
  Image as ImageIcon, LogOut, Menu, X, Save, Upload, Search
} from "lucide-react";

// أنواع البيانات
type Service = {
  id: number;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  slug: string;
  price?: number;
  duration?: string;
  category: string;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  cities: string[];
  features: string[];
  metaTitle?: string;
  metaDesc?: string;
  keywords: string[];
  createdAt: string;
};

type Article = {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  slug: string;
  category: string;
  tags: string[];
  city?: string;
  readTime?: number;
  views: number;
  metaTitle?: string;
  metaDesc?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
};

type Lead = {
  id: number;
  name: string;
  phone: string;
  email?: string;
  city: string;
  serviceName: string;
  message?: string;
  status: "new" | "contacted" | "completed" | "cancelled";
  source?: string;
  notes?: string;
  createdAt: string;
};

type Settings = Record<string, any>;

export default function AdminDashboard() {
  const [pass, setPass] = useState("");
  const [verified, setVerified] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // التبويبات الرئيسية
  const [activeSection, setActiveSection] = useState<
    "dashboard" | "services" | "articles" | "leads" | "settings" | "media" | "users"
  >("dashboard");
  
  // ✅ حالات جديدة لإظهار نماذج الإضافة
  const [isAddingService, setIsAddingService] = useState(false);
  const [isAddingArticle, setIsAddingArticle] = useState(false);
  
  // حالة التعديل/الإضافة
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  // البيانات
  const [services, setServices] = useState<Service[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [stats, setStats] = useState({ services: 0, articles: 0, leads: 0, views: 0 });
  
  const router = useRouter();

  // 🔐 التحقق من الدخول
  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminAuth = localStorage.getItem("pc_admin_auth");
      if (adminAuth === "verified") {
        setVerified(true);
        fetchData();
      }
    }
  }, []);

  // جلب جميع البيانات
  const fetchData = useCallback(async () => {
    try {
      const [servicesRes, articlesRes, leadsRes, settingsRes, statsRes] = await Promise.all([
        fetch("/api/admin/services"),
        fetch("/api/admin/articles"),
        fetch("/api/admin/leads"),
        fetch("/api/admin/settings"),
        fetch("/api/admin/stats"),
      ]);
      
      if (servicesRes.ok) setServices(await servicesRes.json());
      if (articlesRes.ok) setArticles(await articlesRes.json());
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error("فشل جلب البيانات:", err);
      setMsg("⚠️ تعذر تحميل بعض البيانات");
    }
  }, []);

  // تسجيل الدخول
  const handleLogin = () => {
    if (pass === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      localStorage.setItem("pc_admin_auth", "verified");
      setVerified(true);
      fetchData();
      setMsg("");
    } else {
      setMsg("❌ كلمة المرور غير صحيحة");
    }
  };

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("pc_admin_auth");
    setVerified(false);
    router.refresh();
  };

  // معالجة تغيير الحقول في النماذج
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // حفظ خدمة (إضافة أو تعديل)
  const saveService = async () => {
    if (!formData.title || !formData.description) {
      setMsg("❌ العنوان والوصف مطلوبان");
      return;
    }
    
    setLoading(true);
    try {
      const method = editingItem ? "PUT" : "POST";
      const url = editingItem ? `/api/admin/services/${editingItem.id}` : "/api/admin/services";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cities: typeof formData.cities === "string" 
            ? formData.cities.split(",").map((s: string) => s.trim()).filter(Boolean)
            : formData.cities,
          features: typeof formData.features === "string"
            ? formData.features.split(",").map((s: string) => s.trim()).filter(Boolean)
            : formData.features,
          keywords: typeof formData.keywords === "string"
            ? formData.keywords.split(",").map((s: string) => s.trim()).filter(Boolean)
            : formData.keywords,
        }),
      });
      
      const data = await res.json();
      setMsg(data.message || (editingItem ? "✅ تم تعديل الخدمة" : "✅ تم إضافة الخدمة"));
      setEditingItem(null);
      setIsAddingService(false);  // ✅ إخفاء نموذج الإضافة بعد الحفظ
      setFormData({});
      fetchData();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setMsg("❌ فشل في الحفظ");
    } finally {
      setLoading(false);
    }
  };

  // حذف خدمة
  const deleteService = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      const data = await res.json();
      setMsg(data.message || "✅ تم الحذف");
      fetchData();
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setMsg("❌ فشل في الحذف");
    }
  };

  // حفظ مقال (إضافة أو تعديل)
  const saveArticle = async () => {
    if (!formData.title || !formData.content) {
      setMsg("❌ العنوان والمحتوى مطلوبان");
      return;
    }
    
    setLoading(true);
    try {
      const method = editingItem ? "PUT" : "POST";
      const url = editingItem ? `/api/admin/articles/${editingItem.id}` : "/api/admin/articles";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: typeof formData.tags === "string"
            ? formData.tags.split(",").map((s: string) => s.trim()).filter(Boolean)
            : formData.tags,
        }),
      });
      
      const data = await res.json();
      setMsg(data.message || (editingItem ? "✅ تم تعديل المقال" : "✅ تم نشر المقال"));
      setEditingItem(null);
      setIsAddingArticle(false);  // ✅ إخفاء نموذج الإضافة بعد النشر
      setFormData({});
      fetchData();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setMsg("❌ فشل في النشر");
    } finally {
      setLoading(false);
    }
  };

  // حذف مقال
  const deleteArticle = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      const data = await res.json();
      setMsg(data.message || "✅ تم الحذف");
      fetchData();
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setMsg("❌ فشل في الحذف");
    }
  };
  
  // تحديث حالة طلب عميل
  const updateLeadStatus = async (id: number, status: Lead["status"]) => {
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch {
      setMsg("❌ فشل في تحديث الحالة");
    }
  };

  // حفظ إعدادات الموقع
  const saveSettings = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setMsg("✅ تم حفظ الإعدادات");
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setMsg("❌ فشل في حفظ الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 شاشة تسجيل الدخول
  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-sky-50 to-emerald-50">
        <div className="glass p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-sky-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">لوحة تحكم بور كلين</h2>
          <p className="text-slate-500 mb-6">أدخل كلمة المرور للمتابعة</p>
          
          <input 
            value={pass} 
            onChange={e => setPass(e.target.value)} 
            placeholder="كلمة المرور" 
            type="password" 
            className="w-full p-4 border border-slate-200 rounded-xl mb-4 text-center focus:ring-2 focus:ring-sky-500"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full btn-primary">دخول</button>
          {msg && <p className="text-red-500 mt-3 text-sm">{msg}</p>}
        </div>
      </div>
    );
  }

  // 🗂️ عناصر القائمة الجانبية
  const menuItems = [
    { id: "dashboard", label: "📊 لوحة التحكم", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "services", label: "🧼 الخدمات", icon: <Plus className="w-5 h-5" />, count: services.length },
    { id: "articles", label: "📰 المقالات", icon: <Edit className="w-5 h-5" />, count: articles.length },
    { id: "leads", label: "📞 طلبات العملاء", icon: <Users className="w-5 h-5" />, count: leads.filter(l => l.status === "new").length },
    { id: "settings", label: "⚙️ إعدادات الموقع", icon: <Settings className="w-5 h-5" /> },
    { id: "media", label: "🖼️ الوسائط", icon: <ImageIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="flex-1 p-4 md:p-8 pt-24 md:pt-28 overflow-y-auto">
      
      {/* 📱 القائمة الجانبية للجوال */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-3 glass rounded-xl"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* 🗂️ القائمة الجانبية */}
      <aside className={`
        fixed md:static inset-y-0 right-0 w-72 glass border-l border-slate-200 
        transform transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6 text-sky-600" />
            بور كلين للإدارة
          </h1>
          <p className="text-sm text-slate-500 mt-1">عدّل كل شيء من هنا</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id as any); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition ${
                activeSection === item.id 
                  ? "bg-sky-600 text-white shadow-lg" 
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </span>
              {item.count !== undefined && item.count > 0 && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  activeSection === item.id ? "bg-white/20" : "bg-sky-100 text-sky-600"
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 p-3 text-red-600 hover:bg-red-50 rounded-xl transition"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* 📄 المحتوى الرئيسي */}
<main className="flex-1 p-4 md:p-8 pt-24 md:pt-28 overflow-y-auto">        
        {/* رسائل التنبيه */}
        {msg && (
          <div className={`mb-6 p-4 rounded-xl text-center font-medium max-w-2xl mx-auto ${
            msg.includes('✅') ? 'bg-emerald-50 text-emerald-700' : 
            msg.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {msg}
          </div>
        )}

        {/* 📊 قسم: لوحة التحكم (الإحصائيات) */}
        {activeSection === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">📊 نظرة عامة</h2>
            
            {/* بطاقات الإحصائيات */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: "الخدمات النشطة", value: stats.services, icon: "🧼", color: "bg-sky-100" },
                { label: "المقالات المنشورة", value: stats.articles, icon: "📰", color: "bg-emerald-100" },
                { label: "طلبات جديدة", value: leads.filter(l => l.status === "new").length, icon: "📞", color: "bg-amber-100" },
                { label: "مشاهدات الموقع", value: stats.views.toLocaleString(), icon: "👁️", color: "bg-violet-100" },
              ].map((stat, i) => (
                <div key={i} className="glass p-6 text-center">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl`}>
                    {stat.icon}
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-slate-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* أحدث الطلبات */}
            <div className="glass p-6">
              <h3 className="font-bold mb-4">📞 أحدث طلبات العملاء</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-right">الاسم</th>
                      <th className="p-3 text-right">الهاتف</th>
                      <th className="p-3 text-right">الخدمة</th>
                      <th className="p-3 text-right">الحالة</th>
                      <th className="p-3 text-right">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.slice(0, 5).map(lead => (
                      <tr key={lead.id} className="border-b hover:bg-slate-50">
                        <td className="p-3">{lead.name}</td>
                        <td className="p-3">{lead.phone}</td>
                        <td className="p-3">{lead.serviceName}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            lead.status === "new" ? "bg-amber-100 text-amber-700" :
                            lead.status === "contacted" ? "bg-sky-100 text-sky-700" :
                            lead.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            {lead.status === "new" ? "جديد" :
                             lead.status === "contacted" ? "تم التواصل" :
                             lead.status === "completed" ? "مكتمل" : "ملغي"}
                          </span>
                        </td>
                        <td className="p-3">
                          <select 
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                            className="p-2 border rounded-lg text-sm"
                          >
                            <option value="new">جديد</option>
                            <option value="contacted">تم التواصل</option>
                            <option value="completed">مكتمل</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 🧼 قسم: إدارة الخدمات */}
        {activeSection === "services" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">🧼 إدارة الخدمات</h2>
              {/* ✅ زر إضافة خدمة - تم الإصلاح */}
              <button 
                onClick={() => { 
                  setIsAddingService(true);
                  setEditingItem(null); 
                  setFormData({ category: "تنظيف", isActive: true, sortOrder: 0 }); 
                }}
                className="btn-primary flex items-center gap-2 mt-2" 
              >
                <Plus className="w-4 h-4" /> إضافة خدمة
              </button>
            </div>

            {/* ✅ نموذج الإضافة/التعديل - تم إصلاح شرط الظهور */}
            {(editingItem || isAddingService || formData.title !== undefined) && (
              <div className="glass p-6 space-y-4 relative">
                {/* زر إغلاق النموذج */}
                <button 
                  onClick={() => { 
                    setEditingItem(null); 
                    setIsAddingService(false);
                    setFormData({}); 
                  }}
                  className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                  title="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <h3 className="font-bold text-lg">
                  {editingItem ? "✏️ تعديل الخدمة" : "➕ إضافة خدمة جديدة"}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    placeholder="عنوان الخدمة *" 
                    value={formData.title || ""}
                    onChange={e => handleInputChange("title", e.target.value)}
                    className="p-3 border rounded-xl"
                  />
                  <input 
                    placeholder="الفئة (تنظيف، مكافحة...)" 
                    value={formData.category || "تنظيف"}
                    onChange={e => handleInputChange("category", e.target.value)}
                    className="p-3 border rounded-xl"
                  />
                </div>
                
                <textarea 
                  placeholder="وصف مختصر *" 
                  value={formData.description || ""}
                  onChange={e => handleInputChange("description", e.target.value)}
                  className="w-full p-3 border rounded-xl"
                  rows={2}
                />
                
                <textarea 
                  placeholder="محتوى تفصيلي (يدعم <br>)" 
                  value={formData.content || ""}
                  onChange={e => handleInputChange("content", e.target.value)}
                  className="w-full p-3 border rounded-xl"
                  rows={4}
                />
                
                <div className="grid md:grid-cols-3 gap-4">
                  <input 
                    type="number"
                    placeholder="السعر (ريال)" 
                    value={formData.price || ""}
                    onChange={e => handleInputChange("price", e.target.value)}
                    className="p-3 border rounded-xl"
                  />
                  <input 
                    placeholder="المدة (مثال: 2-3 ساعات)" 
                    value={formData.duration || ""}
                    onChange={e => handleInputChange("duration", e.target.value)}
                    className="p-3 border rounded-xl"
                  />
                  <input 
                    placeholder="رابط الصورة" 
                    value={formData.imageUrl || ""}
                    onChange={e => handleInputChange("imageUrl", e.target.value)}
                    className="p-3 border rounded-xl"
                  />
                </div>
                
                <input 
                  placeholder="المدن (مفصولة بفاصلة): الدمام, الخبر, القطيف" 
                  value={Array.isArray(formData.cities) ? formData.cities.join(", ") : formData.cities || ""}
                  onChange={e => handleInputChange("cities", e.target.value)}
                  className="w-full p-3 border rounded-xl"
                />
                
                <input 
                  placeholder="الميزات (مفصولة بفاصلة): ضمان, مواد آمنة" 
                  value={Array.isArray(formData.features) ? formData.features.join(", ") : formData.features || ""}
                  onChange={e => handleInputChange("features", e.target.value)}
                  className="w-full p-3 border rounded-xl"
                />
                
                <details className="border rounded-xl p-4">
                  <summary className="font-semibold cursor-pointer">⚙️ إعدادات SEO</summary>
                  <div className="mt-3 space-y-3">
                    <input 
                      placeholder="عنوان SEO (أقصى 70 حرف)" 
                      value={formData.metaTitle || ""}
                      onChange={e => handleInputChange("metaTitle", e.target.value)}
                      className="w-full p-3 border rounded-lg"
                      maxLength={70}
                    />
                    <input 
                      placeholder="وصف SEO (أقصى 160 حرف)" 
                      value={formData.metaDesc || ""}
                      onChange={e => handleInputChange("metaDesc", e.target.value)}
                      className="w-full p-3 border rounded-lg"
                      maxLength={160}
                    />
                    <input 
                      placeholder="الكلمات المفتاحية (مفصولة بفاصلة)" 
                      value={Array.isArray(formData.keywords) ? formData.keywords.join(", ") : formData.keywords || ""}
                      onChange={e => handleInputChange("keywords", e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </details>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      checked={formData.isPopular || false}
                      onChange={e => handleInputChange("isPopular", e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">✨ علامة "الأكثر طلباً"</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      checked={formData.isActive !== false}
                      onChange={e => handleInputChange("isActive", e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">✅ نشط</span>
                  </label>
                </div>
                
                <div className="flex gap-3">
                  <button onClick={saveService} disabled={loading} className="btn-primary flex-1">
                    {loading ? "جاري الحفظ..." : <><Save className="w-4 h-4 inline" /> حفظ</>}
                  </button>
                  <button 
                    onClick={() => { 
                      setEditingItem(null); 
                      setIsAddingService(false);
                      setFormData({}); 
                    }}
                    className="px-6 py-3 border rounded-xl hover:bg-slate-50"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* قائمة الخدمات */}
            <div className="glass p-6">
              <h3 className="font-bold mb-4">📋 جميع الخدمات</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="p-3 text-right">العنوان</th>
                      <th className="p-3 text-right">الفئة</th>
                      <th className="p-3 text-right">السعر</th>
                      <th className="p-3 text-right">الحالة</th>
                      <th className="p-3 text-right">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map(service => (
                      <tr key={service.id} className="border-b hover:bg-slate-50">
                        <td className="p-3 font-medium">{service.title}</td>
                        <td className="p-3">{service.category}</td>
                        <td className="p-3">{service.price ? `${service.price} ر.س` : "-"}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            service.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                          }`}>
                            {service.isActive ? "نشط" : "مخفي"}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          <button 
                            onClick={() => { 
                              setEditingItem(service); 
                              setFormData(service);
                              setIsAddingService(false);
                            }}
                            className="p-2 text-sky-600 hover:bg-sky-50 rounded"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteService(service.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <a 
                            href={`/services/${service.slug}`}
                            target="_blank"
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="عرض"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 📰 قسم: إدارة المقالات */}
        {activeSection === "articles" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">📰 إدارة المقالات</h2>
              {/* ✅ زر كتابة مقال - تم الإصلاح */}
              <button 
                onClick={() => { 
                  setIsAddingArticle(true);
                  setEditingItem(null); 
                  setFormData({ category: "مقالات", isPublished: true }); 
                }}
                className="btn-primary flex items-center gap-2 mt-2" 
              >
                <Plus className="w-4 h-4" /> كتابة مقال
              </button>
            </div>

            {/* ✅ نموذج المقال - تم إصلاح شرط الظهور */}
            {(editingItem || isAddingArticle || formData.title !== undefined) && (
              <div className="glass p-6 space-y-4 relative">
                {/* زر إغلاق النموذج */}
                <button 
                  onClick={() => { 
                    setEditingItem(null); 
                    setIsAddingArticle(false);
                    setFormData({}); 
                  }}
                  className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                  title="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <h3 className="font-bold text-lg">
                  {editingItem ? "✏️ تعديل المقال" : "📝 كتابة مقال جديد"}
                </h3>
                
                <input 
                  placeholder="عنوان المقال *" 
                  value={formData.title || ""}
                  onChange={e => handleInputChange("title", e.target.value)}
                  className="w-full p-3 border rounded-xl text-lg"
                />
                
                <input 
                  placeholder="ملخص قصير (يظهر في القائمة)" 
                  value={formData.excerpt || ""}
                  onChange={e => handleInputChange("excerpt", e.target.value)}
                  className="w-full p-3 border rounded-xl"
                />
                
                <textarea 
                  placeholder="محتوى المقال (يدعم تنسيق HTML بسيط: <br>, <strong>, <ul>)" 
                  value={formData.content || ""}
                  onChange={e => handleInputChange("content", e.target.value)}
                  className="w-full p-3 border rounded-xl font-mono"
                  rows={12}
                />
                
                <div className="grid md:grid-cols-3 gap-4">
                  <select 
                    value={formData.category || "مقالات"}
                    onChange={e => handleInputChange("category", e.target.value)}
                    className="p-3 border rounded-xl"
                  >
                    <option value="مقالات">مقالات عامة</option>
                    <option value="نصائح">نصائح تنظيف</option>
                    <option value="توعوي">توعوي</option>
                    <option value="عروض">عروض خاصة</option>
                  </select>
                  <input 
                    placeholder="المدينة المستهدفة" 
                    value={formData.city || ""}
                    onChange={e => handleInputChange("city", e.target.value)}
                    className="p-3 border rounded-xl"
                  />
                  <input 
                    type="number"
                    placeholder="وقت القراءة (دقائق)" 
                    value={formData.readTime || ""}
                    onChange={e => handleInputChange("readTime", e.target.value)}
                    className="p-3 border rounded-xl"
                  />
                </div>
                
                <input 
                  placeholder="الكلمات المفتاحية (مفصولة بفاصلة)" 
                  value={Array.isArray(formData.tags) ? formData.tags.join(", ") : formData.tags || ""}
                  onChange={e => handleInputChange("tags", e.target.value)}
                  className="w-full p-3 border rounded-xl"
                />
                
                <input 
                  placeholder="رابط الصورة البارزة" 
                  value={formData.imageUrl || ""}
                  onChange={e => handleInputChange("imageUrl", e.target.value)}
                  className="w-full p-3 border rounded-xl"
                />
                
                <details className="border rounded-xl p-4">
                  <summary className="font-semibold cursor-pointer">⚙️ تحسينات SEO</summary>
                  <div className="mt-3 space-y-3">
                    <input 
                      placeholder="عنوان SEO (يظهر في جوجل)" 
                      value={formData.metaTitle || ""}
                      onChange={e => handleInputChange("metaTitle", e.target.value)}
                      className="w-full p-3 border rounded-lg"
                      maxLength={70}
                    />
                    <input 
                      placeholder="وصف SEO (يظهر تحت العنوان في جوجل)" 
                      value={formData.metaDesc || ""}
                      onChange={e => handleInputChange("metaDesc", e.target.value)}
                      className="w-full p-3 border rounded-lg"
                      maxLength={160}
                    />
                  </div>
                </details>
                
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={formData.isPublished !== false}
                    onChange={e => handleInputChange("isPublished", e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">✅ نشر المقال فوراً</span>
                </label>
                
                <div className="flex gap-3">
                  <button onClick={saveArticle} disabled={loading} className="btn-primary flex-1">
                    {loading ? "جاري النشر..." : <><Save className="w-4 h-4 inline" /> حفظ ونشر</>}
                  </button>
                  <button 
                    onClick={() => { 
                      setEditingItem(null); 
                      setIsAddingArticle(false);
                      setFormData({}); 
                    }}
                    className="px-6 py-3 border rounded-xl hover:bg-slate-50"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* قائمة المقالات */}
            <div className="glass p-6">
              <h3 className="font-bold mb-4">📋 جميع المقالات</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="p-3 text-right">العنوان</th>
                      <th className="p-3 text-right">الفئة</th>
                      <th className="p-3 text-right">المشاهدات</th>
                      <th className="p-3 text-right">النشر</th>
                      <th className="p-3 text-right">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map(article => (
                      <tr key={article.id} className="border-b hover:bg-slate-50">
                        <td className="p-3 font-medium">{article.title}</td>
                        <td className="p-3">{article.category}</td>
                        <td className="p-3">{article.views.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            article.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {article.isPublished ? "منشور" : "مسودة"}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          <button 
                            onClick={() => { 
                              setEditingItem(article); 
                              setFormData(article);
                              setIsAddingArticle(false);
                            }}
                            className="p-2 text-sky-600 hover:bg-sky-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteArticle(article.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <a 
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ⚙️ قسم: إعدادات الموقع */}
        {activeSection === "settings" && (
          <div className="max-w-2xl space-y-6">
            <h2 className="text-2xl font-bold">⚙️ إعدادات الموقع</h2>
            <p className="text-slate-600">عدّل جميع إعدادات موقعك من هنا</p>
            
            <div className="glass p-6 space-y-4">
              <h3 className="font-bold border-b pb-2">🏢 معلومات الموقع</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم الموقع</label>
                  <input 
                    value={settings.site_name || "بور كلين للايف"}
                    onChange={e => setSettings({...settings, site_name: e.target.value})}
                    className="w-full p-3 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الشعار (رابط الصورة)</label>
                  <input 
                    value={settings.logo_url || ""}
                    onChange={e => setSettings({...settings, logo_url: e.target.value})}
                    className="w-full p-3 border rounded-xl"
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">وصف الموقع (لـ SEO)</label>
                <textarea 
                  value={settings.site_description || ""}
                  onChange={e => setSettings({...settings, site_description: e.target.value})}
                  className="w-full p-3 border rounded-xl"
                  rows={2}
                  placeholder="خدمات تنظيف احترافية في المنطقة الشرقية..."
                />
              </div>
            </div>
            
            <div className="glass p-6 space-y-4">
              <h3 className="font-bold border-b pb-2">📞 معلومات التواصل</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                  <input 
                    value={settings.phone || "+9660578343636"}
                    onChange={e => setSettings({...settings, phone: e.target.value})}
                    className="w-full p-3 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">واتساب (مع الرابط)</label>
                  <input 
                    value={settings.whatsapp || "https://wa.me/9660578343636"}
                    onChange={e => setSettings({...settings, whatsapp: e.target.value})}
                    className="w-full p-3 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                  <input 
                    type="email"
                    value={settings.email || "info@pureclean.life"}
                    onChange={e => setSettings({...settings, email: e.target.value})}
                    className="w-full p-3 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ساعات العمل</label>
                  <input 
                    value={settings.working_hours || "يومياً 8 صباحاً - 10 مساءً"}
                    onChange={e => setSettings({...settings, working_hours: e.target.value})}
                    className="w-full p-3 border rounded-xl"
                  />
                </div>
              </div>
            </div>
            
            <div className="glass p-6 space-y-4">
              <h3 className="font-bold border-b pb-2">🔗 روابط التواصل الاجتماعي</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">إنستغرام</label>
                  <input 
                    value={settings.instagram || ""}
                    onChange={e => setSettings({...settings, instagram: e.target.value})}
                    className="w-full p-3 border rounded-xl"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">تويتر / X</label>
                  <input 
                    value={settings.twitter || ""}
                    onChange={e => setSettings({...settings, twitter: e.target.value})}
                    className="w-full p-3 border rounded-xl"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">تيك توك</label>
                  <input 
                    value={settings.tiktok || ""}
                    onChange={e => setSettings({...settings, tiktok: e.target.value})}
                    className="w-full p-3 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">خرائط جوجل</label>
                  <input 
                    value={settings.google_maps || ""}
                    onChange={e => setSettings({...settings, google_maps: e.target.value})}
                    className="w-full p-3 border rounded-xl"
                    placeholder="رابط الموقع على الخرائط"
                  />
                </div>
              </div>
            </div>
            
            <div className="glass p-6 space-y-4">
              <h3 className="font-bold border-b pb-2">🔐 إعدادات الأمان</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">كلمة مرور لوحة التحكم الجديدة</label>
                <input 
                  type="password"
                  placeholder="اتركها فارغة للإبقاء على الحالية"
                  className="w-full p-3 border rounded-xl"
                />
                <p className="text-xs text-slate-500 mt-1">⚠️ غيّر كلمة المرور من ملف `.env.local` للأمان الأقصى</p>
              </div>
            </div>
            
            <button 
              onClick={saveSettings}
              disabled={loading}
              className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
            >
              {loading ? "جاري الحفظ..." : <><Save className="w-4 h-4" /> حفظ جميع الإعدادات</>}
            </button>
          </div>
        )}

        {/* 📞 قسم: طلبات العملاء */}
        {activeSection === "leads" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">📞 إدارة طلبات العملاء</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                  جديد: {leads.filter(l => l.status === "new").length}
                </span>
                <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm">
                  تم التواصل: {leads.filter(l => l.status === "contacted").length}
                </span>
              </div>
            </div>
            
            <div className="glass p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="p-3 text-right">التاريخ</th>
                      <th className="p-3 text-right">العميل</th>
                      <th className="p-3 text-right">التواصل</th>
                      <th className="p-3 text-right">الخدمة المطلوبة</th>
                      <th className="p-3 text-right">المدينة</th>
                      <th className="p-3 text-right">الحالة</th>
                      <th className="p-3 text-right">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id} className="border-b hover:bg-slate-50">
                        <td className="p-3 text-slate-500">
                          {new Date(lead.createdAt).toLocaleDateString("ar-SA")}
                        </td>
                        <td className="p-3">
                          <div className="font-medium">{lead.name}</div>
                          {lead.email && <div className="text-xs text-slate-500">{lead.email}</div>}
                        </td>
                        <td className="p-3">
                          <a href={`tel:${lead.phone}`} className="text-sky-600 hover:underline">
                            {lead.phone}
                          </a>
                        </td>
                        <td className="p-3">{lead.serviceName}</td>
                        <td className="p-3">{lead.city}</td>
                        <td className="p-3">
                          <select 
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                            className="p-2 border rounded-lg text-xs"
                          >
                            <option value="new">🆕 جديد</option>
                            <option value="contacted">📞 تم التواصل</option>
                            <option value="completed">✅ مكتمل</option>
                            <option value="cancelled">❌ ملغي</option>
                          </select>
                        </td>
                        <td className="p-3 flex gap-2">
                          <a 
                            href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=مرحباً ${lead.name}، بخصوص طلبك لخدمة ${lead.serviceName}`}
                            target="_blank"
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="واتساب"
                          >
                            💬
                          </a>
                          <button 
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded"
                            title="ملاحظات"
                            onClick={() => {
                              const note = prompt("أضف ملاحظة داخلية:", lead.notes || "");
                              if (note !== null) {
                                // هنا يمكن إضافة API لتحديث الملاحظة
                              }
                            }}
                          >
                            📝
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 🖼️ قسم: الوسائط (قالب) */}
        {activeSection === "media" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">🖼️ إدارة الوسائط</h2>
            <div className="glass p-8 text-center">
              <ImageIcon className="w-16 h-16 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600 mb-4">ميزة رفع الصور قادمة قريباً!</p>
              <p className="text-sm text-slate-500">
                حالياً يمكنك استخدام روابط صور خارجية من:<br/>
                • <a href="https://imgbb.com" target="_blank" className="text-sky-600">ImgBB</a><br/>
                • <a href="https://cloudinary.com" target="_blank" className="text-sky-600">Cloudinary</a><br/>
                • <a href="https://vercel.com/blob" target="_blank" className="text-sky-600">Vercel Blob</a>
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}