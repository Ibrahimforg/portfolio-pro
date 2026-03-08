'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, TrendingUp, Users, Award, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ProjectWithCategory } from '@/types'
import { ProjectCard } from '@/components/ProjectCard'
import { cn } from '@/lib/utils'

interface StatsProps {}

function StatsSection({}: StatsProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    {
      value: "5+",
      label: "Ans d'expérience",
      description: "En ingénierie réseaux et développement web",
      icon: TrendingUp,
      color: "text-emerald-600"
    },
    {
      value: "50+",
      label: "Projets livrés",
      description: "Applications web et solutions réseaux",
      icon: Award,
      color: "text-primary"
    },
    {
      value: "30+",
      label: "Clients satisfaits",
      description: "Particuliers et entreprises accompagnés",
      icon: Users,
      color: "text-blue-600"
    },
    {
      value: "99%",
      label: "Satisfaction",
      description: "Taux de satisfaction client",
      icon: CheckCircle,
      color: "text-purple-600"
    }
  ]

  return (
    <section className="py-12 px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Chiffres Clés
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Une expertise validée par des résultats concrets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div 
                key={stat.label}
                className={cn(
                  "text-center p-6 rounded-2xl border transition-all duration-700",
                  "bg-background border-border hover:border-primary/20 hover:shadow-lg",
                  isVisible && "opacity-100 translate-y-0",
                  !isVisible && "opacity-0 translate-y-4"
                )}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <IconComponent className={cn("w-6 h-6", stat.color)} />
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-text-primary">
                    {stat.label}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {stat.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

interface ProcessProps {}

function ProcessSection({}: ProcessProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const process = [
    {
      step: 1,
      title: "Analyse & Stratégie",
      description: "Compréhension profonde de vos besoins, analyse technique et définition d'une stratégie sur mesure.",
      duration: "1-2 semaines"
    },
    {
      step: 2,
      title: "Conception & Design",
      description: "Création de maquettes interactives, wireframes et design system aligné avec votre image de marque.",
      duration: "2-3 semaines"
    },
    {
      step: 3,
      title: "Développement",
      description: "Implémentation agile avec tests continus, revues de code et intégration des meilleures pratiques.",
      duration: "4-8 semaines"
    },
    {
      step: 4,
      title: "Livraison & Support",
      description: "Déploiement en production, formation équipe et support continu pour garantir le succès.",
      duration: "Continu"
    }
  ]

  return (
    <section className="py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Méthodologie de Travail
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Une approche structurée pour garantir l'excellence à chaque étape
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {process.map((item, index) => (
            <div 
              key={item.step}
              className={cn(
                "relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer",
                "bg-background border-border hover:border-primary/30 hover:shadow-lg",
                activeStep === item.step && "border-primary bg-primary/5"
              )}
              onMouseEnter={() => setActiveStep(item.step)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Step Number */}
              <div className="absolute top-4 right-4">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  activeStep === item.step 
                    ? "bg-primary text-white" 
                    : "bg-surface text-text-secondary"
                )}>
                  {item.step}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-primary font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{item.duration}</span>
                </div>
              </div>

              {/* Connection Line */}
              {index < process.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface FeaturedProjectsProps {}

function FeaturedProjectsSection({}: FeaturedProjectsProps) {
  const [projects, setProjects] = useState<ProjectWithCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            categories (
              name,
              color
            )
          `)
          .eq('published', true)
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(3)

        if (error) throw error
        setProjects(data || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProjects()
  }, [])

  return (
    <section className="py-12 px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Projets Vedettes
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Découvrez mes réalisations les plus significatives
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-surface rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {projects.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-text-secondary">
                  Aucun projet vedette pour le moment
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            href="/projects" 
            className="inline-flex items-center px-6 py-3 rounded-lg font-medium border transition-all duration-300 bg-background text-text-primary border-border hover:border-primary/30 hover:bg-primary/5 hover:scale-[1.02]"
          >
            Voir tous les projets
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export { StatsSection, ProcessSection, FeaturedProjectsSection }
