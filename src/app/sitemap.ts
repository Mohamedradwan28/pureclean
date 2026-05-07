import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await prisma.article.findMany({ select: { slug: true, createdAt: true } });
  const services = await prisma.service.findMany({ select: { slug: true } });
  const base = "https://pureclean.life";
  
  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/services`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/articles`, lastModified: new Date(), priority: 0.9 },
    ...articles.map(a => ({ 
      url: `${base}/articles/${a.slug}`, 
      lastModified: new Date(a.createdAt), 
      priority: 0.8 
    })),
    ...services.map(s => ({ 
      url: `${base}/services/${s.slug}`, 
      lastModified: new Date(), 
      priority: 0.8 
    }))
  ];
}