'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Github, Linkedin, Mail, ArrowRight } from 'lucide-react'
import { useSiteConfig } from '@/hooks/useSiteConfig'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { siteConfig } = useSiteConfig()

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Projets', href: '/projects' },
    { name: 'Compétences', href: '/skills' },
    { name: 'Multimédia', href: '/multimedia' },
    { name: 'À propos', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
              <span className="text-white font-bold text-lg">IF</span>
            </div>
            <span className="text-xl font-bold text-text-primary transition-colors duration-300 group-hover:text-primary">{siteConfig.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-all duration-300 relative group font-medium ${
                  isActive(item.href) 
                    ? 'text-primary' 
                    : 'text-text-secondary hover:text-primary'
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                  isActive(item.href) 
                    ? 'w-full bg-primary' 
                    : 'w-0 bg-primary group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="hidden md:flex items-center space-x-4">
            {[
              { href: siteConfig.social.github, icon: Github },
              { href: siteConfig.social.linkedin, icon: Linkedin },
              { href: `mailto:${siteConfig.email}`, icon: Mail }
            ].map(({ href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-primary transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-primary/10 border border-transparent hover:border-primary/20"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-text-secondary hover:text-text-primary transition-all duration-300 hover:scale-110"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation - Sidebar */}
        <div className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Overlay */}
          <div 
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
              isMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div 
            className={`relative w-72 sm:w-80 h-screen bg-surface border-r border-gray-800 shadow-xl transition-all duration-300 ease-in-out transform ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header du sidebar */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-text-primary">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-text-secondary hover:text-text-primary p-1 rounded-md hover:bg-surface-elevated transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Navigation items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 group ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/10 border border-primary/20'
                        : 'text-text-secondary hover:text-primary hover:bg-surface-elevated'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex-1 font-medium">{item.name}</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
              
              {/* Social links */}
              <div className="p-4 border-t border-gray-700">
                <h3 className="text-sm font-medium text-text-primary mb-3">Réseaux Sociaux</h3>
                <div className="flex space-x-3 justify-center">
                  {[
                    { href: siteConfig.social.github, icon: Github },
                    { href: siteConfig.social.linkedin, icon: Linkedin },
                    { href: `mailto:${siteConfig.email}`, icon: Mail }
                  ].map(({ href, icon: Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary hover:text-primary p-2 rounded-md hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-300 hover:scale-110"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
