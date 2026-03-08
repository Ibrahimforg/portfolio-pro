'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { useSiteConfig } from '@/hooks/useSiteConfig'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { siteConfig } = useSiteConfig()

  return (
    <footer className="bg-surface border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
              <span className="text-xl font-bold text-gradient">{siteConfig.name}</span>
            </Link>
            <p className="text-text-secondary mb-4 max-w-md">
              {siteConfig.description}
            </p>
            <div className="flex items-center space-x-4">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href={`tel:${siteConfig.phone}`}
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-text-secondary hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-text-secondary hover:text-primary transition-colors">
                  Projets
                </Link>
              </li>
              <li>
                <Link href="/skills" className="text-text-secondary hover:text-primary transition-colors">
                  Compétences
                </Link>
              </li>
              <li>
                <Link href="/multimedia" className="text-text-secondary hover:text-primary transition-colors">
                  Multimédia
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-text-secondary hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-text-secondary">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-primary transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center space-x-2 text-text-secondary">
                <Phone className="w-4 h-4" />
                <a href={`https://wa.me/${siteConfig.phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center space-x-2 text-text-secondary">
                <MapPin className="w-4 h-4" />
                <span>Ouagadougou, Burkina Faso</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-text-secondary text-sm">
              © {currentYear} {siteConfig.name}. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-text-secondary hover:text-primary text-sm transition-colors">
                Mentions légales
              </Link>
              <Link href="/sitemap.xml" className="text-text-secondary hover:text-primary text-sm transition-colors">
                Plan du site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
