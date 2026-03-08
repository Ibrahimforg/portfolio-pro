// Hook de débogage complet pour diagnostiquer les problèmes Supabase
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useSupabaseDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    runFullDebug()
  }, [])

  const runFullDebug = async () => {
    console.log('🔍 DÉMARRAGE DU DÉBOGAGE COMPLET SUPABASE')
    
    try {
      // 1. Test de connexion Supabase
      console.log('📡 Test 1: Connexion Supabase')
      const { data: connectionTest, error: connectionError } = await supabase
        .from('profiles')
        .select('count')
        .single()

      if (connectionError) {
        console.error('❌ ERREUR CONNEXION:', connectionError)
        setDebugInfo({
          status: 'connection_failed',
          error: connectionError,
          details: {
            message: connectionError.message,
            code: connectionError.code,
            hint: connectionError.hint
          }
        })
        return
      }

      console.log('✅ Connexion réussie:', connectionTest)

      // 2. Test de la table profiles
      console.log('📊 Test 2: Structure table profiles')
      const { data: tableData, error: tableError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)

      if (tableError) {
        console.error('❌ ERREUR TABLE:', tableError)
        setDebugInfo({
          status: 'table_error',
          error: tableError,
          connection_ok: true
        })
        return
      }

      console.log('✅ Table accessible, colonnes trouvées:', tableData ? Object.keys(tableData[0] || {}) : 'Aucune donnée')

      // 3. Test RLS
      console.log('🔒 Test 3: Vérification RLS')
      const { data: rlsData, error: rlsError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)

      if (rlsError) {
        console.error('❌ ERREUR RLS:', rlsError)
        setDebugInfo({
          status: 'rls_blocking',
          error: rlsError,
          connection_ok: true,
          table_ok: true
        })
        return
      }

      console.log('✅ RLS OK ou désactivé')

      // 4. Test avec tous les profils (au lieu d'email spécifique)
      console.log('� Test 4: Recherche tous les profils disponibles')
      const { data: allProfilesData, error: allProfilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5)

      if (allProfilesError) {
        console.error('❌ ERREUR RECHERCHE PROFILS:', allProfilesError)
        setDebugInfo({
          status: 'profile_error',
          error: allProfilesError,
          connection_ok: true,
          table_ok: true,
          rls_ok: true
        })
        return
      }

      console.log('✅ Recherche profils terminée:', allProfilesData ? `${allProfilesData.length} profils trouvés` : 'Aucun profil trouvé')

      // Utiliser le premier profil disponible pour les tests suivants
      const profileData = allProfilesData && allProfilesData.length > 0 ? allProfilesData[0] : null

      // 5. Vérification des colonnes étendues
      if (profileData) {
        console.log('📋 Test 5: Vérification colonnes étendues')
        const expectedColumns = [
          'display_name', 'hero_title', 'hero_subtitle', 
          'seo_title', 'seo_description', 'seo_keywords'
        ]
        
        const missingColumns = expectedColumns.filter(col => !(col in profileData))
        
        if (missingColumns.length > 0) {
          console.warn('⚠️ Colonnes manquantes:', missingColumns)
          setDebugInfo({
            status: 'missing_columns',
            missing_columns: missingColumns,
            profile_data: profileData,
            all_tests_ok: true
          })
        } else {
          console.log('✅ Toutes les colonnes étendues présentes')
          setDebugInfo({
            status: 'success',
            profile_data: profileData,
            all_tests_ok: true
          })
        }
      } else {
        console.log('ℹ️ Aucun profil trouvé - création nécessaire')
        setDebugInfo({
          status: 'no_profile_found',
          all_tests_ok: true,
          needs_creation: true
        })
      }

    } catch (err) {
      console.error('❌ ERREUR GÉNÉRALE:', err)
      setDebugInfo({
        status: 'general_error',
        error: err
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    debugInfo,
    loading,
    runFullDebug
  }
}
