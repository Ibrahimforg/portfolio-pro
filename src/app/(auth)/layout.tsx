import '../globals.css'

export const metadata = {
  title: 'Connexion - Admin Panel',
  description: 'Page de connexion du panneau d\'administration',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
