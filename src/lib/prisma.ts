// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined 
}

// ✅ إنشاء عميل Prisma بإعدادات آمنة لـ Vercel
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  // ✅ منع الاتصال التلقائي أثناء البناء
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// ✅ دالة آمنة للاستعلامات تتعامل مع أخطاء الاتصال
export async function safeQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    // تأكد من وجود الرابط قبل الاتصال
    if (!process.env.DATABASE_URL) {
      console.warn('⚠️ DATABASE_URL غير موجود')
      return fallback
    }
    return await query()
  } catch (error) {
    console.error('❌ خطأ في قاعدة البيانات:', error)
    return fallback
  }
}