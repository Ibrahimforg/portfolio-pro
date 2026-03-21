import dynamic from 'next/dynamic'

// Lazy loading pour les composants lourds - version simplifiée
export const AdminMultimediaUpload = dynamic(
  () => import('@/components/admin/MultimediaUpload'),
  { ssr: false }
)

export const ProjectCard = dynamic(
  () => import('@/components/ProjectCard'),
  { ssr: true }
)

export const AnalyticsDashboard = dynamic(
  () => import('@/components/AnalyticsDashboard'),
  { ssr: false }
)

export const PWAManager = dynamic(
  () => import('@/components/ui/PWAManager'),
  { ssr: false }
)
