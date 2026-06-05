import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json({ customer: null })

  try {
    const customer = await prisma.customer.findUnique({
      where: { email },
      include: {
        rewardTxns: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    })
    return NextResponse.json({ customer })
  } catch {
    return NextResponse.json({ customer: null })
  }
}
