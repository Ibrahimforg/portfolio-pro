import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Portfolio Pro - Développeur Web Full Stack',
    template: '%s | Portfolio Pro'
  },
  description: 'Portfolio professionnel de développeur web full stack avec expertise en React, Next.js, TypeScript et Node.js. Projets innovants et solutions sur mesure.',
  keywords: [
    'développeur web',
    'portfolio',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'full stack',
    'freelance',
    'projets web',
    'développement sur mesure'
  ],
  authors: [{ name: 'Portfolio Pro' }],
  creator: 'Portfolio Pro',
  publisher: 'Portfolio Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://portfolio-pro.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/fr',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://portfolio-pro.vercel.app',
    title: 'Portfolio Pro - Développeur Web Full Stack',
    description: 'Portfolio professionnel avec projets innovants et compétences techniques avancées',
    siteName: 'Portfolio Pro',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Portfolio Pro - Développeur Web Full Stack',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio Pro - Développeur Web Full Stack',
    description: 'Portfolio professionnel avec projets innovants et compétences techniques avancées',
    images: ['/og-image.jpg'],
    creator: '@portfolio_pro',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}
