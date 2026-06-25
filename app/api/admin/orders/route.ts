import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isDevMode() {
  return process.env.NODE_ENV === 'development'
}

// GET /api/admin/orders — order history with filters
export async function GET(req: NextRequest) {
  if (!isDevMode()) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const type = searchParams.get('type')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const where: Record<string, unknown> = {}

  // Handle comma-separated status list e.g. "NEW,PREPARING,READY"
  if (status) {
    const statuses = status.split(',').map((s) => s.trim())
    where.status = statuses.length === 1 ? statuses[0] : { in: statuses }
  }
  if (type) where.type = type
  if (from || to) {
    where.createdAt = {}
    if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from)
    if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to)
  }

  try {
    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
