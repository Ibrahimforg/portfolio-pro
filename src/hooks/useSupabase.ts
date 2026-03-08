/**
 * Hook Supabase Centralisé - Évite les duplications
 * Gestion unifiée des requêtes, erreurs et cache
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface UseSupabaseOptions {
  select?: string
  filter?: Record<string, any>
  order?: { column: string; ascending?: boolean }
  limit?: number
  single?: boolean
  realtime?: boolean
}

interface UseSupabaseResult<T> {
  data: T[] | T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  insert: (data: Partial<T>) => Promise<T | null>
  update: (id: number | string, data: Partial<T>) => Promise<T | null>
  delete: (id: number | string) => Promise<boolean>
}

export function useSupabase<T>(
  table: string,
  options: UseSupabaseOptions = {}
): UseSupabaseResult<T> {
  const [data, setData] = useState<T[] | T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase.from(table)

      // Select
      if (options.select) {
        query = query.select(options.select) as any
      }

      // Filter
      if (options.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = (query as any).eq(key, value)
        })
      }

      // Order
      if (options.order) {
        query = (query as any).order(options.order.column, { 
          ascending: options.order.ascending ?? true 
        })
      }

      // Limit
      if (options.limit) {
        query = (query as any).limit(options.limit)
      }

      // Single
      if (options.single) {
        const { data: result, error } = await (query as any).single()
        if (error) throw error
        setData(result as T)
      } else {
        const { data: result, error } = await (query as any)
        if (error) throw error
        setData(result as T[])
      }

      // Realtime subscription
      if (options.realtime) {
        const subscription = supabase
          .channel(`${table}-changes`)
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: table },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                setData((current) => 
                  Array.isArray(current) ? [payload.new as T, ...current] : [payload.new as T]
                )
              } else if (payload.eventType === 'UPDATE') {
                setData((current) => 
                  Array.isArray(current) 
                    ? current.map(item => 
                        (item as any).id === payload.new.id ? payload.new as T : item
                      )
                    : payload.new as T
                )
              } else if (payload.eventType === 'DELETE') {
                setData((current) => 
                  Array.isArray(current) 
                    ? current.filter(item => (item as any).id !== payload.old.id)
                    : null
                )
              }
            }
          )
          .subscribe()

        return () => subscription.unsubscribe()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      console.error(`Erreur ${table}:`, err)
    } finally {
      setLoading(false)
    }
    return undefined
  }, [table, JSON.stringify(options)])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  const insert = useCallback(async (newData: Partial<T>): Promise<T | null> => {
    try {
      const { data, error } = await supabase
        .from(table)
        .insert(newData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error(`Erreur insertion ${table}:`, err)
      return null
    }
  }, [table])

  const update = useCallback(async (id: number | string, updateData: Partial<T>): Promise<T | null> => {
    try {
      const { data, error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.error(`Erreur mise à jour ${table}:`, err)
      return null
    }
  }, [table])

  const deleteItem = useCallback(async (id: number | string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (err) {
      console.error(`Erreur suppression ${table}:`, err)
      return false
    }
  }, [table])

  return {
    data,
    loading,
    error,
    refetch,
    insert,
    update,
    delete: deleteItem
  }
}

// Hook spécialisé pour les relations
export function useSupabaseWithRelations<T, R>(
  table: string,
  relations: string[],
  options: UseSupabaseOptions = {}
): UseSupabaseResult<T> {
  const selectWithRelations = options.select 
    ? options.select 
    : `*, ${relations.join(', ')}`

  return useSupabase<T>(table, {
    ...options,
    select: selectWithRelations
  })
}
