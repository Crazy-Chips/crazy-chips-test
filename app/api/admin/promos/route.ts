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

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const promos = await prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(promos)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const data = await req.json()
    const promo = await prisma.promoCode.create({
      data: { ...data, code: data.code.toUpperCase() },
    })
    return NextResponse.json(promo, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create promo' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const { id, ...data } = await req.json()
    const promo = await prisma.promoCode.update({ where: { id }, data })
    return NextResponse.json(promo)
  } catch {
    return NextResponse.json({ error: 'Failed to update promo' }, { status: 500 })
  }
}
