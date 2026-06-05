import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const isDev = () => process.env.NODE_ENV === 'development'

async function checkAuth() {
  if (isDev()) return true
  const session = await getServerSession(authOptions)
  return !!session
}

async function invalidateCache() {
  try {
    const { redis } = await import('@/lib/redis')
    await redis.del('menu:all')
    await redis.del('menu:featured')
  } catch {}
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const { id } = await params
    const data = await req.json()
    const item = await prisma.menuItem.update({ where: { id }, data })
    await invalidateCache()
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const { id } = await params
    await prisma.menuItem.delete({ where: { id } })
    await invalidateCache()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
