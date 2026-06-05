import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/customer/orders?email=... — customer's order history
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json([], { status: 200 })

  try {
    const orders = await prisma.order.findMany({
      where: { customerEmail: email },
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
