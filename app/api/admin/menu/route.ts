import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const isDev = () => process.env.NODE_ENV === 'development'

export async function GET() {
  if (!isDev()) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const items = await prisma.menuItem.findMany({ orderBy: { category: 'asc' } })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  if (!isDev()) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const data = await req.json()
    const item = await prisma.menuItem.create({ data })
    try {
      const { redis } = await import('@/lib/redis')
      await redis.del('menu:all')
      await redis.del('menu:featured')
    } catch {}
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}
