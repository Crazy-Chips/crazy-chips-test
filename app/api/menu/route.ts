import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/menu — returns all available menu items, cached
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured') === 'true'

    // Try to import redis cache (non-blocking if unavailable)
    let cached: unknown = null
    try {
      const { redis } = await import('@/lib/redis')
      const key = featured ? 'menu:featured' : 'menu:all'
      cached = await redis.get(key)
    } catch {}

    if (cached) {
      return NextResponse.json(cached)
    }

    const where = featured
      ? { available: true, featured: true }
      : { available: true }

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: { category: 'asc' },
    })

    // Cache result
    try {
      const { redis } = await import('@/lib/redis')
      const key = featured ? 'menu:featured' : 'menu:all'
      await redis.setex(key, 300, JSON.stringify(items))
    } catch {}

    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/menu error:', error)
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 })
  }
}
