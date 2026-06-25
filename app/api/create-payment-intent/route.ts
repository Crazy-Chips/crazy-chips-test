import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import type { CartItem, OrderType, CheckoutFormData } from '@/types'

// POST /api/create-payment-intent
// Input: { items, promoCode, type, customerDetails }
// Output: { clientSecret }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, promoCode, type, customerDetails } = body as {
      items: CartItem[]
      promoCode?: string
      type: OrderType
      customerDetails: CheckoutFormData
    }

    if (!items?.length || !type || !customerDetails) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate and fetch item prices server-side (never trust client totals)
    const menuItemIds = items.map((i) => i.menuItemId)
    const dbItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, available: true },
    })

    if (dbItems.length !== items.length) {
      return NextResponse.json({ error: 'Some items are unavailable' }, { status: 400 })
    }

    // Calculate subtotal server-side
    let subtotal = 0
    for (const cartItem of items) {
      const dbItem = dbItems.find((d: any) => d.id === cartItem.menuItemId)
      if (!dbItem) return NextResponse.json({ error: 'Item not found' }, { status: 400 })

      const extrasTotal = (cartItem.extras || []).reduce((s: number, e: { price: number }) => s + e.price, 0)
      subtotal += (dbItem.price + extrasTotal) * cartItem.quantity
    }

    // Apply promo discount
    let discountPercent = 0
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: promoCode.toUpperCase() },
      })
      if (
        promo &&
        promo.active &&
        (!promo.expiresAt || new Date(promo.expiresAt) > new Date()) &&
        (promo.usageLimit === null || promo.usageCount < promo.usageLimit)
      ) {
        discountPercent = promo.discountPercent
      }
    }

    const discount = (subtotal * discountPercent) / 100
    const total = subtotal - discount

    // Convert to pence for Stripe
    const amountInPence = Math.round(total * 100)

    if (amountInPence < 50) {
      return NextResponse.json({ error: 'Order total too low' }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency: 'gbp',
      metadata: {
        customerName: customerDetails.customerName,
        customerEmail: customerDetails.customerEmail,
        type,
        promoCode: promoCode || '',
        itemCount: items.length.toString(),
      },
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('POST /api/create-payment-intent error:', error)
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
  }
}
