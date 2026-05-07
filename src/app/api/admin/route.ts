import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, title, description, content, metaDesc, imageUrl } = body;
    
    // توليد slug من العنوان
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u0600-\u06FF-]/g, ""); // يدعم العربية
    
    if (type === "service") {
      if (!title || !description) {
        return NextResponse.json({ message: "❌ العنوان والوصف مطلوبان" }, { status: 400 });
      }
      
      await prisma.service.create({ 
        data: { 
          title: title.trim(), 
          description: description.trim(), 
          imageUrl: imageUrl?.trim() || null, 
          slug 
        } 
      });
      
      return NextResponse.json({ message: "✅ تم إضافة الخدمة بنجاح" });
    }

    if (type === "article") {
      if (!title || !content) {
        return NextResponse.json({ message: "❌ العنوان والمحتوى مطلوبان" }, { status: 400 });
      }
      
      await prisma.article.create({ 
        data: { 
          title: title.trim(), 
          content: content.trim(), 
          metaDesc: metaDesc?.trim() || null,
          imageUrl: imageUrl?.trim() || null, 
          slug 
        } 
      });
      
      return NextResponse.json({ message: "✅ تم نشر المقال بنجاح" });
    }

    return NextResponse.json({ message: "❌ نوع غير صالح" }, { status: 400 });
    
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ message: "❌ خطأ في المعالجة" }, { status: 500 });
  }
}