'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Calendar, MapPin, GraduationCap, Award } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Experience, Education } from '@/types'

export default function AboutPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Récupérer les expériences
        const { data: experiencesData, error: experiencesError } = await supabase
          .from('experiences')
          .select('*')
          .order('order_index')

        if (experiencesError) {
          console.error('Erreur expériences:', experiencesError)
          setExperiences([])
        } else {
          setExperiences(experiencesData || [])
        }

        // Données d'éducation statiques (pas de table correspondante)
        setEducation([
          {
            degree: "Ingénieur de Travaux en Réseaux et Systèmes de Télécommunications",
            school: "ITSCGE-BF",
            period: "2022 - 2026",
            description: "Formation d'ingénieur spécialisé en réseaux, télécommunications et développement."
          },
          {
            degree: "Baccalauréat Scientifique",
            school: "Lycée Provincial",
            period: "2019 - 2021",
            description: "Spécialisation en mathématiques et sciences physiques."
          }
        ])
      } catch (error) {
        console.error('Erreur critique lors du chargement:', error)
        setExperiences([])
        setEducation([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
      <Header />
      
      <main className="pt-6 pb-4">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
              À Propos de Moi
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Développeur passionné avec une expertise en développement web full-stack et en ingénierie des réseaux.
            </p>
          </div>
        </section>

        {/* Experience Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-surface">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Expérience Professionnelle
              </h2>
              <p className="text-lg text-text-secondary">
                Mon parcours professionnel et mes réalisations
              </p>
            </div>

            <div className="space-y-8">
              {experiences.map((experience) => (
                <div key={experience.id} className="card group hover:border-primary/20 transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {experience.title}
                        </h3>
                        <div className="flex items-center text-text-secondary text-sm mt-1 md:mt-0">
                          <MapPin className="w-4 h-4 mr-1" />
                          {experience.location}
                        </div>
                      </div>
                      <div className="text-text-secondary font-medium mb-3">
                        {experience.company}
                      </div>
                      <p className="text-text-secondary mb-4">
                        {experience.description}
                      </p>
                      <div className="flex items-center text-sm text-text-secondary">
                        <Calendar className="w-4 h-4 mr-2" />
                        {experience.start_date} - {experience.current ? 'Présent' : experience.end_date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {experiences.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary">
                  Aucune expérience professionnelle à afficher pour le moment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Education Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Formation
              </h2>
              <p className="text-lg text-text-secondary">
                Mon parcours académique et mes certifications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {education.map((edu, index) => (
                <div key={index} className="card group hover:border-primary/20 transition-all duration-300">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">
                        {edu.degree}
                      </h3>
                      <div className="text-text-secondary font-medium mb-3">
                        {edu.school}
                      </div>
                      <p className="text-text-secondary text-sm mb-3">
                        {edu.description}
                      </p>
                      <div className="flex items-center text-sm text-text-secondary">
                        <Calendar className="w-4 h-4 mr-2" />
                        {edu.period}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
