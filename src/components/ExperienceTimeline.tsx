'use client'

import { useState } from 'react'
import { Calendar, MapPin, Briefcase, Award, ChevronRight } from 'lucide-react'

interface ExperienceItem {
  title: string
  company: string
  location: string
  period: string
  description: string
  accomplishments: string[]
  technologies: string[]
  type: 'work' | 'education'
}

const experiences: ExperienceItem[] = [
  {
    type: 'work',
    title: 'Ingénieur Réseaux & Développeur Junior',
    company: 'Entreprise Tech',
    location: 'Paris, France',
    period: '2023 - Présent',
    description: 'Gestion des infrastructures réseau et développement d\'applications web full-stack.',
    accomplishments: [
      'Déploiement et maintenance de solutions réseau Cisco',
      'Développement d\'applications Node.js et React',
      'Optimisation des performances système'
    ],
    technologies: ['Cisco', 'Node.js', 'React', 'TypeScript', 'Docker']
  },
  {
    type: 'education',
    title: 'Master en Ingénierie des Réseaux',
    company: 'Université de Technologie',
    location: 'Lyon, France',
    period: '2021 - 2023',
    description: 'Spécialisation en réseaux et télécommunications avec focus sur la sécurité.',
    accomplishments: [
      'Mention Très Bien',
      'Projet de recherche sur la cybersécurité',
      'Stage en entreprise technologique'
    ],
    technologies: ['Réseaux', 'Sécurité', 'Cloud', 'Python']
  }
]

export default function ExperienceTimeline() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const getBorderColor = (type: 'work' | 'education') => {
    switch (type) {
      case 'work':
        return 'border-blue-500'
      case 'education':
        return 'border-purple-500'
      default:
        return 'border-gray-500'
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Mon Parcours
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Mon expérience professionnelle et académique
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary/20"></div>

          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <div
                key={index}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="bg-background p-6 rounded-lg shadow-lg border border-primary/20 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      {experience.type === 'work' ? (
                        <Briefcase className="w-4 h-4 text-primary" />
                      ) : (
                        <Award className="w-4 h-4 text-primary" />
                      )}
                      <span className="text-sm font-medium text-primary">
                        {experience.type === 'work' ? 'Expérience' : 'Formation'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-text-primary mb-1">
                      {experience.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-2 text-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{experience.period}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3 text-text-secondary">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{experience.location}</span>
                    </div>

                    <p className="text-text-secondary mb-4">
                      {experience.description}
                    </p>

                    {experience.accomplishments.length > 0 && (
                      <ul className="text-sm text-text-secondary space-y-1 mb-4">
                        {experience.accomplishments.map((acc, accIndex) => (
                          <li key={accIndex} className="flex items-start gap-2">
                            <ChevronRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                            <span>{acc}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {experience.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {experience.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
