import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published') !== 'false'
    const fileType = searchParams.get('fileType')

    let query = supabase
      .from('multimedia')
      .select('*')
      .order('created_at', { ascending: false })

    if (published) {
      query = query.eq('published', true)
    }

    if (fileType && fileType !== 'all') {
      query = query.eq('file_type', fileType)
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
    console.error('API Error fetching multimedia:', error)
    return NextResponse.json(
      { error: 'Failed to fetch multimedia files' },
      { status: 500 }
    )
  }
}
