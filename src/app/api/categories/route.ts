import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'projects' // 'projects', 'skills'

    let query
    if (type === 'skills') {
      query = supabase
        .from('skill_categories')
        .select('*')
        .order('order_index', { ascending: true })
    } else {
      query = supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true })
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data || [], { status: 200 })
  } catch (error) {
    console.error('API Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
