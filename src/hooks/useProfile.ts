'use client'

interface ProfileData {
  full_name: string
  title: string
  bio: string
  profile_image_url: string | null
  email?: string
}

export function useProfile() {
  const profileData: ProfileData = {
    full_name: "Ibrahim FORGO",
    title: "Développeur Full Stack Senior",
    bio: "Développeur passionné avec 5+ ans d'expérience dans la création d'applications web modernes. Spécialisé en React, Next.js, TypeScript et Node.js. Expert en architecture scalable, optimisation performance et solutions cloud.",
    profile_image_url: "/images/profile.jpg",
    email: "ibrahim.forgo@example.com"
  }

  return { profileData, loading: false }
}
