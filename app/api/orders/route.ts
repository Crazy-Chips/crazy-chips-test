import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { CreateOrderPayload } from '@/types'

// POST /api/orders — create order after successful payment
export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderPayload = await req.json()
    const { items, promoCode, type, customerDetails, stripePaymentId } = body

    if (!items?.length || !type || !customerDetails || !stripePaymentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Server-side price calculation
    const menuItemIds = items.map((i) => i.menuItemId)
    const dbItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    })

    let subtotal = 0
    const orderItemsData = items.map((cartItem) => {
      const dbItem = dbItems.find((d) => d.id === cartItem.menuItemId)
      if (!dbItem) throw new Error(`Item ${cartItem.menuItemId} not found`)
      const extrasTotal = (cartItem.extras || []).reduce((s, e) => s + e.price, 0)
      const unitPrice = dbItem.price + extrasTotal
      const itemSubtotal = unitPrice * cartItem.quantity
      subtotal += itemSubtotal
      return {
        menuItemId: cartItem.menuItemId,
        quantity: cartItem.quantity,
        extras: cartItem.extras || [],
        unitPrice,
        subtotal: itemSubtotal,
      }
    })

    let discountPercent = 0
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode.toUpperCase() } })
      if (promo?.active) {
        discountPercent = promo.discountPercent
        await prisma.promoCode.update({
          where: { id: promo.id },
          data: { usageCount: { increment: 1 } },
        })
      }
    }

    const discount = (subtotal * discountPercent) / 100
    const total = subtotal - discount

    const orderNumber = `CC-${Date.now().toString(36).toUpperCase()}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerDetails.customerName,
        customerEmail: customerDetails.customerEmail,
        customerPhone: customerDetails.customerPhone,
        subtotal,
        discount,
        total,
        status: 'NEW',
        type,
        address: customerDetails.address,
        postcode: customerDetails.postcode,
        notes: customerDetails.notes,
        stripePaymentId,
        promoCodeUsed: promoCode || null,
        items: {
          create: orderItemsData.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            extras: item.extras as object[],
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          })),
        },
      },
    })

    const orderWithItems = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: { include: { menuItem: true } } },
    })!

    // Trigger Pusher notification
    try {
      const { pusher } = await import('@/lib/pusher')
      await pusher.trigger('private-orders', 'new-order', {
        orderId: orderWithItems!.id,
        orderNumber: orderWithItems!.orderNumber,
        customerName: orderWithItems!.customerName,
        total: orderWithItems!.total,
        type: orderWithItems!.type,
        items: orderWithItems!.items,
        createdAt: orderWithItems!.createdAt,
      })
    } catch {}

    // Send confirmation email (non-blocking)
    sendConfirmationEmail(order).catch(() => {})

    return NextResponse.json({ order: orderWithItems }, { status: 201 })
  } catch (error) {
    console.error('POST /api/orders error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

async function sendConfirmationEmail(order: { orderNumber: string; customerEmail: string; customerName: string; total: number; type: string }) {
  const { resend } = await import('@/lib/resend')
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: order.customerEmail,
    subject: `Your Crazy Chips order ${order.orderNumber} is confirmed! 🍟`,
    html: `
      <h1>Order Confirmed!</h1>
      <p>Hi ${order.customerName},</p>
      <p>Your order <strong>${order.orderNumber}</strong> has been received and is being prepared.</p>
      <p>Total: <strong>£${order.total.toFixed(2)}</strong></p>
      <p>Type: <strong>${order.type}</strong></p>
      <p>Estimated time: 20-30 minutes</p>
      <p>Thank you for ordering from Crazy Chips!</p>
    `,
  })
}
