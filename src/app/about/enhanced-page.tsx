'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { supabase } from '@/lib/supabase'
import { 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Award,
  Briefcase,
  Target,
  Users,
  Code,
  Network,
  Shield,
  Video,
  Globe,
  Zap,
  TrendingUp,
  CheckCircle,
  Star,
  Mail,
  Phone
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import Link from 'next/link'
import { DownloadIcon } from '@/components/ui/PWAManager'

interface Experience {
  id: number
  title: string
  company: string
  location: string
  period: string
  description: string
  accomplishments: string[]
  technologies: string[]
  featured?: boolean
}

interface Education {
  id: number
  degree: string
  school: string
  period: string
  description: string
  specialization?: string
}

interface Skill {
  id: number
  name: string
  level: string
  years_experience: number
  category: string
  icon: string
}

export default function AboutPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      // Mock data basé sur le profil d'Ibrahim FORGO
      const mockExperiences: Experience[] = [
        {
          id: 1,
          title: "Ingénieur de Travaux en Réseaux et Systèmes de Télécommunications",
          company: "Entreprise de Télécommunications",
          location: "Paris, France",
          period: "2023 - Présent",
          description: "Conception et déploiement d'infrastructures réseaux complexes pour les entreprises.",
          accomplishments: [
            "Architecture de réseaux WAN/LAN pour 50+ entreprises",
            "Mise en place de solutions de cybersécurité avancées",
            "Optimisation des performances réseaux (+60% de bande passante)",
            "Gestion d'équipe technique de 8 personnes",
            "Réduction des coûts opérationnels de 35%"
          ],
          technologies: ["Cisco", "Palo Alto", "VMware", "Linux", "Windows Server", "AWS", "Azure"],
          featured: true
        },
        {
          id: 2,
          title: "Technicien Administration Réseaux",
          company: "FSS Services",
          location: "Lyon, France",
          period: "2021 - 2023",
          description: "Administration et maintenance des infrastructures réseaux et systèmes.",
          accomplishments: [
            "Gestion de 200+ équipements réseaux",
            "Déploiement de solutions VoIP pour 1000+ utilisateurs",
            "Mise en place de politiques de sécurité",
            "Formation technique des équipes internes"
          ],
          technologies: ["Cisco IOS", "Mikrotik", "Active Directory", "Office 365", "Firewall"]
        },
        {
          id: 3,
          title: "Technicien Sécurité Informatique",
          company: "CyberSec Solutions",
          location: "Marseille, France",
          period: "2020 - 2021",
          description: "Audit de sécurité et implémentation de solutions de protection.",
          accomplishments: [
            "Audit de sécurité pour 30+ entreprises",
            "Implémentation de SIEM et monitoring",
            "Gestion des incidents de sécurité",
            "Sensibilisation des équipes aux risques"
          ],
          technologies: ["SIEM", "IDS/IPS", "Cryptographie", "Audit", "Compliance"]
        }
      ]

      const mockEducation: Education[] = [
        {
          id: 1,
          degree: "Ingénieur de Travaux en Réseaux et Systèmes de Télécommunications",
          school: "École d'Ingénieurs en Télécommunications",
          period: "2020 - 2023",
          description: "Formation spécialisée en réseaux, télécommunications et cybersécurité.",
          specialization: "Réseaux & Sécurité"
        },
        {
          id: 2,
          degree: "Licence Professionnelle en Réseaux et Télécommunications",
          school: "Université de Technologie",
          period: "2017 - 2020",
          description: "Fondamentaux en réseaux, protocoles et systèmes de communication.",
          specialization: "Infrastructure"
        },
        {
          id: 3,
          degree: "Certifications Techniques",
          school: "Cisco & CompTIA",
          period: "2019 - 2023",
          description: "Certifications professionnelles en réseaux et sécurité.",
          specialization: "CCNA, Security+, Network+"
        }
      ]

      setExperiences(mockExperiences)
      setEducation(mockEducation)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching about data:', error)
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: Target },
    { id: 'experience', label: 'Expérience', icon: Briefcase },
    { id: 'education', label: 'Formation', icon: GraduationCap },
    { id: 'skills', label: 'Compétences', icon: Code }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ThemeSwitcher />
      <Header />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
                À Propos
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary mb-8">
                Découvrez mon parcours et mon expertise en réseaux, télécommunications et développement
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">5+</div>
                  <div className="text-sm text-text-secondary">Années d'expérience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm text-text-secondary">Projets réalisés</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">15+</div>
                  <div className="text-sm text-text-secondary">Certifications</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-text-secondary">Satisfaction client</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary inline-flex items-center justify-center">
                  <Mail className="mr-2 w-5 h-5" />
                  Me contacter
                </Link>
                <a 
                  href="/cv.pdf" 
                  className="btn-secondary inline-flex items-center justify-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DownloadIcon className="mr-2 w-5 h-5" />
                  Télécharger CV
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'bg-surface-elevated text-text-secondary hover:bg-surface-elevated/80'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-12">
                {/* Professional Summary */}
                <div className="card">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Target className="w-6 h-6 text-primary" />
                    Résumé Professionnel
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed text-text-secondary">
                      Ingénieur de Travaux en Réseaux et Systèmes de Télécommunications avec 5+ années d'expérience dans la conception, 
                      déploiement et maintenance d'infrastructures réseaux complexes. Expert en cybersécurité, administration 
                      systèmes et développement full-stack, je combine expertise technique et vision stratégique pour deliver 
                      des solutions robustes et évolutives.
                    </p>
                  </div>
                </div>

                {/* Core Expertise */}
                <div className="card">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Star className="w-6 h-6 text-primary" />
                    Domaines d'Expertise
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center group hover:scale-105 transition-transform">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Network className="w-8 h-8 text-blue-500" />
                      </div>
                      <h3 className="font-semibold mb-2">Réseaux</h3>
                      <p className="text-sm text-text-secondary">WAN/LAN, Cisco, Routage, Switching</p>
                    </div>
                    <div className="text-center group hover:scale-105 transition-transform">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500/10 to-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="font-semibold mb-2">Sécurité</h3>
                      <p className="text-sm text-text-secondary">Cybersécurité, Firewall, SIEM</p>
                    </div>
                    <div className="text-center group hover:scale-105 transition-transform">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500/10 to-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Code className="w-8 h-8 text-purple-500" />
                      </div>
                      <h3 className="font-semibold mb-2">Développement</h3>
                      <p className="text-sm text-text-secondary">Full-Stack, Web/Mobile, Cloud</p>
                    </div>
                    <div className="text-center group hover:scale-105 transition-transform">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-500/10 to-pink-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Video className="w-8 h-8 text-pink-500" />
                      </div>
                      <h3 className="font-semibold mb-2">Multimédia</h3>
                      <p className="text-sm text-text-secondary">Production, Post-Production</p>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="card">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6 text-primary" />
                    Réalisations Clés
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Architecture réseaux pour 50+ entreprises</h4>
                        <p className="text-text-secondary text-sm">Conception et déploiement d'infrastructures complètes avec optimisation des performances</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Réduction des coûts de 35%</h4>
                        <p className="text-text-secondary text-sm">Optimisation des infrastructures et virtualisation des serveurs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Gestion d'équipe technique</h4>
                        <p className="text-text-secondary text-sm">Leadership et mentorat d'équipes jusqu'à 8 personnes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className={`card ${exp.featured ? 'border-primary/20' : ''}`}>
                    {exp.featured && (
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm text-yellow-500 font-medium">Expérience principale</span>
                      </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                        <div className="flex items-center gap-4 text-text-secondary mb-2">
                          <span className="font-medium">{exp.company}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-text-secondary">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.period}</span>
                      </div>
                    </div>
                    
                    <p className="text-text-secondary mb-4">{exp.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Réalisations principales :</h4>
                      <ul className="space-y-1">
                        {exp.accomplishments.map((acc, accIndex) => (
                          <li key={accIndex} className="flex items-start gap-2 text-text-secondary">
                            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{acc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Technologies :</h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-8">
                {education.map((edu) => (
                  <div key={edu.id} className="card">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{edu.degree}</h3>
                        <div className="flex items-center gap-4 text-text-secondary">
                          <span className="font-medium">{edu.school}</span>
                          {edu.specialization && (
                            <>
                              <span>•</span>
                              <span>{edu.specialization}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-text-secondary">
                        <Calendar className="w-4 h-4" />
                        <span>{edu.period}</span>
                      </div>
                    </div>
                    
                    <p className="text-text-secondary">{edu.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Réseaux */}
                  <div className="card">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Network className="w-5 h-5 text-blue-500" />
                      Réseaux & Infrastructure
                    </h3>
                    <div className="space-y-3">
                      {['Cisco IOS', 'Mikrotik RouterOS', 'BGP/OSPF', 'VLAN', 'VPN', 'Load Balancing'].map((skill) => (
                        <div key={skill} className="flex items-center justify-between">
                          <span className="text-sm">{skill}</span>
                          <div className="w-20 bg-surface-elevated rounded-full h-2">
                            <div className="h-2 rounded-full bg-blue-500 w-4/5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sécurité */}
                  <div className="card">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      Cybersécurité
                    </h3>
                    <div className="space-y-3">
                      {['Palo Alto', 'Firewall', 'SIEM', 'IDS/IPS', 'Cryptographie', 'Audit'].map((skill) => (
                        <div key={skill} className="flex items-center justify-between">
                          <span className="text-sm">{skill}</span>
                          <div className="w-20 bg-surface-elevated rounded-full h-2">
                            <div className="h-2 rounded-full bg-green-500 w-4/5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Développement */}
                  <div className="card">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-500" />
                      Développement
                    </h3>
                    <div className="space-y-3">
                      {['React', 'Next.js', 'Node.js', 'TypeScript', 'Python', 'Docker'].map((skill) => (
                        <div key={skill} className="flex items-center justify-between">
                          <span className="text-sm">{skill}</span>
                          <div className="w-20 bg-surface-elevated rounded-full h-2">
                            <div className="h-2 rounded-full bg-purple-500 w-3/5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cloud */}
                  <div className="card">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-400" />
                      Cloud & DevOps
                    </h3>
                    <div className="space-y-3">
                      {['AWS', 'Azure', 'Kubernetes', 'Terraform', 'CI/CD', 'Monitoring'].map((skill) => (
                        <div key={skill} className="flex items-center justify-between">
                          <span className="text-sm">{skill}</span>
                          <div className="w-20 bg-surface-elevated rounded-full h-2">
                            <div className="h-2 rounded-full bg-blue-400 w-3/5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Systèmes */}
                  <div className="card">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Systèmes
                    </h3>
                    <div className="space-y-3">
                      {['Linux', 'Windows Server', 'Active Directory', 'VMware', 'Office 365', 'Backup'].map((skill) => (
                        <div key={skill} className="flex items-center justify-between">
                          <span className="text-sm">{skill}</span>
                          <div className="w-20 bg-surface-elevated rounded-full h-2">
                            <div className="h-2 rounded-full bg-yellow-500 w-4/5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Multimédia */}
                  <div className="card">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Video className="w-5 h-5 text-pink-500" />
                      Multimédia
                    </h3>
                    <div className="space-y-3">
                      {['Premiere Pro', 'After Effects', 'Photoshop', 'DaVinci Resolve', 'OBS Studio'].map((skill) => (
                        <div key={skill} className="flex items-center justify-between">
                          <span className="text-sm">{skill}</span>
                          <div className="w-20 bg-surface-elevated rounded-full h-2">
                            <div className="h-2 rounded-full bg-pink-500 w-3/5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
