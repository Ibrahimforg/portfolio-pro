'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Mail, Phone, MapPin, Send, Github, Linkedin } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { supabase } from '@/lib/supabase'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          read: false
        })

      if (error) throw error
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-6 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Contactez-moi
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Je suis toujours intéressé par de nouveaux projets et opportunités de collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-6">Informations de Contact</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">Email</p>
                      <a 
                        href={`mailto:${siteConfig.email}`}
                        className="text-primary hover:text-primary-hover transition-colors"
                      >
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">WhatsApp</p>
                      <a 
                        href="https://wa.me/22657378818"
                        className="text-primary hover:text-primary-hover transition-colors"
                      >
                        Discuter sur WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">Localisation</p>
                      <p className="text-text-secondary">Ouagadougou, Burkina Faso</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Réseaux Sociaux</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/settings/profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-surface border border-gray-700 rounded-lg flex items-center justify-center hover:border-primary transition-colors"
                  >
                    <Github className="w-6 h-6 text-text-secondary" />
                  </a>
                  <a
                    href="https://www.linkedin.com/feed/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-surface border border-gray-700 rounded-lg flex items-center justify-center hover:border-primary transition-colors"
                  >
                    <Linkedin className="w-6 h-6 text-text-secondary" />
                  </a>
                </div>
              </div>

              {/* Availability */}
              <div className="card">
                <h3 className="text-xl font-semibold text-text-primary mb-2">Disponibilité</h3>
                <p className="text-text-secondary">
                  Actuellement disponible pour des projets freelances et des opportunités 
                  à temps plein. N&apos;hésitez pas à me contacter pour discuter de vos besoins.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-6">Envoyer un Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Jean Dupont"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="jean.dupont@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="Projet de développement web"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="input-field w-full resize-none"
                    placeholder="Décrivez votre projet ou votre demande..."
                  />
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg">
                    <p className="text-green-400">
                      ✅ Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg">
                    <p className="text-red-400">
                      ❌ Erreur lors de l&apos;envoi. Veuillez réessayer plus tard.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Envoi en cours...'
                  ) : (
                    <>
                      Envoyer le message
                      <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
