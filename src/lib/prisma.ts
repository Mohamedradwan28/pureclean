// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined 
}

// ✅ قراءة الرابط مع تحقق أمني
const databaseUrl = process.env.DATABASE_URL

// ✅ إنشاء عميل Prisma برابط آمن أو قيمة وهمية للبناء
// (في الإنتاج الحقيقي، DATABASE_URL يجب أن يكون موجوداً دائماً)
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      // ✅ استخدام الرابط إذا وجد، أو قيمة وهمية لمنع كسر البناء
      // في الإنتاج، إذا كان undefined سيفشل الاتصال بشكل آمن وسيسجل الخطأ
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
    }
    return await query()
  } catch (error) {
    console.error('❌ خطأ في قاعدة البيانات:', error)
    return fallback
  }
}