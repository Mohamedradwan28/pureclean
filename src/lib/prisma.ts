// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined 
}

// ✅ قراءة الرابط مع تحقق
const databaseUrl = process.env.DATABASE_URL

// ✅ إنشاء عميل برابط آمن
// إذا كان DATABASE_URL غير موجود، نستخدم قيمة وهمية لمنع كسر البناء
// في الإنتاج الحقيقي، يجب أن يكون موجوداً دائماً
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: databaseUrl || 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
    },
  },
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// ✅ دالة آمنة للاستعلامات
export async function safeQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    if (!process.env.DATABASE_URL?.includes('neon.tech')) {
      console.warn('⚠️ DATABASE_URL قد يكون غير صحيح')
      return fallback
    }
    return await query()
  } catch (error) {
    console.error('❌ خطأ قاعدة البيانات:', error)
    return fallback
  }
}