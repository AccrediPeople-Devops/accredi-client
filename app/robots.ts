import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/user-dashboard/', '/api/'],
    },
    sitemap: 'https://accredipeoplecertifications.com/sitemap.xml',
  }
}
