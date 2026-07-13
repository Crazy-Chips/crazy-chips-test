import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json({ customer: null })

  try {
    let customer = await prisma.customer.findUnique({
      where: { email },
      include: {
        rewardTxns: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email,
          name: email.split('@')[0],
          isNewCustomer: true,
          totalPoints: 0,
        },
        include: {
          rewardTxns: true,
        },
      })
    }
    return NextResponse.json({ customer })
  } catch (error) {
    console.error('Profile fetch/create error:', error)
    return NextResponse.json({ customer: null })
  }
}
