// src/app/api/admin/articles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ دالة بسيطة للاستجابات
function jsonResponse(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// GET
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: [{ isPublished: "desc" }, { createdAt: "desc" }],
    });
    return jsonResponse(articles);
  } catch (err: any) {
    console.error(err);
    return jsonResponse([]);
  }
}

// POST - ✅ أبسط نسخة تعمل فوراً
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, excerpt, imageUrl, category, tags, city, readTime, metaTitle, metaDesc, isPublished } = body;

    if (!title?.trim() || !content?.trim()) {
      return jsonResponse({ message: "❌ العنوان والمحتوى مطلوبان" }, 400);
    }

    const slug = title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\u0600-\u06FF-]/g, "");

    // ✅ أبسط صيغة: كائن مباشر داخل create
    const article = await (prisma.article as any).create({
      data: {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt?.toString().trim().slice(0, 200) || null,
        imageUrl: imageUrl?.trim() || null,
        slug,
        category: category?.trim() || "مقالات",
        tags: Array.isArray(tags) ? tags : [],
        city: city?.trim() || null,
        readTime: readTime ? parseInt(readTime) : null,
        metaTitle: metaTitle?.trim() || null,
        metaDesc: metaDesc?.trim() || null,
        isPublished: isPublished !== false,
        publishedAt: isPublished !== false ? new Date() : null,
      }
    });

    return jsonResponse({ message: "✅ تم نشر المقال", article }, 201);
  } catch (err: any) {
    console.error(err);
    return jsonResponse({ message: "❌ خطأ: " + (err as Error).message }, 500);
  }
}

// PUT - ✅ أبسط نسخة تعمل فوراً
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return jsonResponse({ message: "❌ ID مطلوب" }, 400);

    const body = await req.json();
    const { title, slug, ...updates } = body;
    const finalSlug = slug || (title ? title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\u0600-\u06FF-]/g, "") : undefined);

    // ✅ أبسط صيغة: كائن مباشر داخل update
    const article = await (prisma.article as any).update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title: title.trim() }),
        ...(finalSlug && { slug: finalSlug }),
        ...(updates.excerpt !== undefined && { excerpt: updates.excerpt?.toString().trim().slice(0, 200) || null }),
        ...(updates.content !== undefined && { content: updates.content.trim() }),
        ...(updates.imageUrl !== undefined && { imageUrl: updates.imageUrl?.trim() || null }),
        ...(updates.category && { category: updates.category.trim() }),
        tags: Array.isArray(updates.tags) ? updates.tags : [],
        ...(updates.city !== undefined && { city: updates.city?.trim() || null }),
        ...(updates.readTime !== undefined && { readTime: parseInt(updates.readTime) || null }),
        ...(updates.metaTitle !== undefined && { metaTitle: updates.metaTitle?.trim() || null }),
        ...(updates.metaDesc !== undefined && { metaDesc: updates.metaDesc?.trim() || null }),
        ...(updates.isPublished !== undefined && { 
          isPublished: updates.isPublished,
          publishedAt: updates.isPublished ? new Date() : null
        }),
      }
    });

    return jsonResponse({ message: "✅ تم تعديل المقال", article });
  } catch (err: any) {
    console.error(err);
    return jsonResponse({ message: "❌ خطأ: " + (err as Error).message }, 500);
  }
}

// DELETE
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return jsonResponse({ message: "❌ ID مطلوب" }, 400);

    await (prisma.article as any).delete({ where: { id: parseInt(id) } });
    return jsonResponse({ message: "✅ تم حذف المقال" });
  } catch (err: any) {
    console.error(err);
    return jsonResponse({ message: "❌ فشل في الحذف" }, 500);
  }
}