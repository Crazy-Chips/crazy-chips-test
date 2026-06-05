import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Points per £1 spent
const POINTS_PER_POUND = 10

/**
 * POST /api/pos/award-points
 *
 * Called by the POS system when a customer provides their phone/email at checkout.
 * Protected by a shared POS_API_KEY secret.
 *
 * Body: {
 *   identifier: string   // phone number OR email
 *   orderTotal: number   // £ amount e.g. 12.50
 *   posOrderId: string   // POS transaction reference
 *   posStaffId?: string  // optional staff ID for audit
 * }
 *
 * Returns: { success, customer: { name, totalPoints, pointsEarned } }
 */
export async function POST(req: NextRequest) {
  // Verify POS API key
  const apiKey = req.headers.get('x-pos-api-key')
  if (!apiKey || apiKey !== process.env.POS_API_KEY) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    const { identifier, orderTotal, posOrderId, posStaffId } = await req.json()

    if (!identifier || !orderTotal || !posOrderId) {
      return NextResponse.json({ error: 'Missing required fields: identifier, orderTotal, posOrderId' }, { status: 400 })
    }

    if (orderTotal <= 0) {
      return NextResponse.json({ error: 'Invalid order total' }, { status: 400 })
    }

    // Find customer by phone OR email
    const isPhone = /^[\d\s\+\-\(\)]{7,15}$/.test(identifier.trim())
    const customer = await prisma.customer.findFirst({
      where: isPhone
        ? { phone: identifier.replace(/\s/g, '') }
        : { email: identifier.toLowerCase().trim() },
    })

    if (!customer) {
      return NextResponse.json({
        success: false,
        error: 'No account found with that phone number or email. Customer can sign up at crazychips.co.uk',
        notFound: true,
      }, { status: 404 })
    }

    // Check for duplicate POS order (idempotency)
    const existing = await prisma.rewardTransaction.findFirst({
      where: { posOrderId },
    })
    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'Points already awarded for this POS order',
        alreadyAwarded: true,
      }, { status: 409 })
    }

    // Calculate points (10 pts per £1, rounded down)
    const pointsEarned = Math.floor(orderTotal * POINTS_PER_POUND)

    // Award points in a transaction
    const [updatedCustomer] = await prisma.$transaction([
      prisma.customer.update({
        where: { id: customer.id },
        data: {
          totalPoints: { increment: pointsEarned },
          isNewCustomer: false,
        },
      }),
      prisma.rewardTransaction.create({
        data: {
          customerId: customer.id,
          points: pointsEarned,
          type: 'EARN_POS',
          description: `In-store order — £${orderTotal.toFixed(2)}${posStaffId ? ` (Staff: ${posStaffId})` : ''}`,
          posOrderId,
          orderTotal,
        },
      }),
    ])

    console.log(`[POS] Awarded ${pointsEarned} pts to ${customer.name ?? customer.email} | POS order: ${posOrderId}`)

    return NextResponse.json({
      success: true,
      customer: {
        name: customer.name ?? 'Customer',
        email: customer.email,
        phone: customer.phone,
        pointsEarned,
        totalPoints: updatedCustomer.totalPoints,
        nextReward: getNextRewardInfo(updatedCustomer.totalPoints),
      },
    })
  } catch (error) {
    console.error('POS award-points error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

function getNextRewardInfo(currentPoints: number) {
  const tiers = [500, 1000, 2000, 5000]
  const next = tiers.find((t) => t > currentPoints)
  if (!next) return { points: null, message: 'VIP Member — maximum rewards unlocked!' }
  return {
    points: next - currentPoints,
    message: `${next - currentPoints} more points to next reward`,
  }
}

// GET — lookup customer details for POS display (before order)
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-pos-api-key')
  if (!apiKey || apiKey !== process.env.POS_API_KEY) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const identifier = req.nextUrl.searchParams.get('identifier')
  if (!identifier) {
    return NextResponse.json({ error: 'identifier query param required' }, { status: 400 })
  }

  try {
    const isPhone = /^[\d\s\+\-\(\)]{7,15}$/.test(identifier.trim())
    const customer = await prisma.customer.findFirst({
      where: isPhone
        ? { phone: identifier.replace(/\s/g, '') }
        : { email: identifier.toLowerCase().trim() },
      include: {
        rewardTxns: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    })

    if (!customer) {
      return NextResponse.json({ found: false, message: 'No account found' }, { status: 404 })
    }

    return NextResponse.json({
      found: true,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        totalPoints: customer.totalPoints,
        memberSince: customer.memberSince,
        nextReward: getNextRewardInfo(customer.totalPoints),
        recentTransactions: customer.rewardTxns,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
