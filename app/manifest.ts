import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AccrediPeople Certifications',
    short_name: 'AccrediPeople',
    description: 'Professional certification training provider offering PMP, Agile, and other industry-recognized certifications.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#4F46E5',
    icons: [
      {
        src: '/Logo/full_coverphoto_black_white.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/Logo/full_coverphoto_black_white.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
