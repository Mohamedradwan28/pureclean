// src/app/api/admin/services/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ GET: جلب جميع الخدمات
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" }
      ],
    });
    return NextResponse.json(services);
  } catch (err) {
    console.error("GET services error:", err);
    return NextResponse.json([]);
  }
}

// ✅ POST: إضافة خدمة جديدة
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      title, description, content, imageUrl, price, duration, category, 
      isPopular, isActive, sortOrder, cities, features, metaTitle, metaDesc, keywords 
    } = body;
    
    if (!title || !description) {
      return NextResponse.json({ message: "❌ العنوان والوصف مطلوبان" }, { status: 400 });
    }
    
    // توليد slug آمن للعربية
    const slug = title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\u0600-\u06FF-]/g, "");
    
    // ✅ التصحيح: استخدام data: { ... } داخل create()
    const service = await prisma.service.create({
      data: {  // ← هذا هو السطر المهم!
        title: title.trim(),
        description: description.trim(),
        content: content?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        slug,
        price: price ? parseFloat(price) : null,
        duration: duration?.trim() || null,
        category: category?.trim() || "تنظيف",
        isPopular: isPopular === true || isPopular === "on",
        isActive: isActive !== false && isActive !== "off",
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
        cities: Array.isArray(cities) ? cities : [],
        features: Array.isArray(features) ? features : [],
        metaTitle: metaTitle?.trim() || null,
        metaDesc: metaDesc?.trim() || null,
        keywords: Array.isArray(keywords) ? keywords : [],
      }
    });
    
    return NextResponse.json({ message: "✅ تم إضافة الخدمة", service }, { status: 201 });
  } catch (err) {
    console.error("POST service error:", err);
    return NextResponse.json({ message: "❌ خطأ: " + (err as Error).message }, { status: 500 });
  }
}

// ✅ PUT: تعديل خدمة موجودة
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ message: "❌ ID مطلوب" }, { status: 400 });
    }
    
    const body = await req.json();
    const { title, slug, ...updates } = body;
    
    // إذا غُيّر العنوان، نحدّث الـ slug تلقائياً
    const finalSlug = slug || (title 
      ? title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\u0600-\u06FF-]/g, "")
      : undefined);
    
    // ✅ التصحيح: استخدام data: { ... } داخل update()
    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {  // ← هذا هو السطر المهم!
        ...(title && { title: title.trim() }),
        ...(finalSlug && { slug: finalSlug }),
        ...(updates.description && { description: updates.description.trim() }),
        ...(updates.content !== undefined && { content: updates.content.trim() || null }),
        ...(updates.imageUrl !== undefined && { imageUrl: updates.imageUrl.trim() || null }),
        ...(updates.price !== undefined && { price: updates.price ? parseFloat(updates.price) : null }),
        ...(updates.duration !== undefined && { duration: updates.duration.trim() || null }),
        ...(updates.category && { category: updates.category.trim() }),
        ...(updates.isPopular !== undefined && { isPopular: updates.isPopular === true || updates.isPopular === "on" }),
        ...(updates.isActive !== undefined && { isActive: updates.isActive !== false && updates.isActive !== "off" }),
        ...(updates.sortOrder !== undefined && { sortOrder: parseInt(updates.sortOrder) || 0 }),
        cities: Array.isArray(updates.cities) ? updates.cities : [],
        features: Array.isArray(updates.features) ? updates.features : [],
        ...(updates.metaTitle !== undefined && { metaTitle: updates.metaTitle?.trim() || null }),
        ...(updates.metaDesc !== undefined && { metaDesc: updates.metaDesc?.trim() || null }),
        keywords: Array.isArray(updates.keywords) ? updates.keywords : [],
      }
    });
    
    return NextResponse.json({ message: "✅ تم تعديل الخدمة", service });
  } catch (err) {
    console.error("PUT service error:", err);
    return NextResponse.json({ message: "❌ خطأ: " + (err as Error).message }, { status: 500 });
  }
}

// ✅ DELETE: حذف خدمة
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ message: "❌ ID مطلوب" }, { status: 400 });
    }
    
    await prisma.service.delete({ 
      where: { id: parseInt(id) } 
    });
    
    return NextResponse.json({ message: "✅ تم حذف الخدمة" });
  } catch (err) {
    console.error("DELETE service error:", err);
    return NextResponse.json({ message: "❌ فشل في الحذف" }, { status: 500 });
  }
}