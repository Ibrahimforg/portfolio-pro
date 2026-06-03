import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published') !== 'false'

    let query = supabase
      .from('projects')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          color,
          icon
        )
      `)
      .order('order_index', { ascending: true })

    if (published) {
      query = query.eq('published', true)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('API Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
