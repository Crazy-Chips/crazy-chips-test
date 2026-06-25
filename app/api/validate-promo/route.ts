import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/validate-promo — validates a promo code
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: 'Invalid request' }, { status: 400 })
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!promo) {
      return NextResponse.json({ valid: false, error: 'Promo code not found' })
    }

    if (!promo.active) {
      return NextResponse.json({ valid: false, error: 'Promo code is no longer active' })
    }

    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, error: 'Promo code has expired' })
    }

    if (promo.usageLimit !== null && promo.usageCount >= promo.usageLimit) {
      return NextResponse.json({ valid: false, error: 'Promo code usage limit reached' })
    }

    return NextResponse.json({
      valid: true,
      code: promo.code,
      discountPercent: promo.discountPercent,
    })
  } catch (error) {
    console.error('POST /api/validate-promo error:', error)
    return NextResponse.json({ valid: false, error: 'Server error' }, { status: 500 })
  }
}
