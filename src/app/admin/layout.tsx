import '../globals.css'
import PremiumAdminLayout from '@/components/admin/premium/AdminLayout'
import { PremiumThemeProvider } from '@/components/admin/premium/PremiumTheme'

export const metadata = {
  title: 'Admin Panel - Portfolio',
  description: 'Panneau d&apos;administration du portfolio',
}

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PremiumThemeProvider>
      <PremiumAdminLayout>
        {children}
      </PremiumAdminLayout>
    </PremiumThemeProvider>
  )
}
