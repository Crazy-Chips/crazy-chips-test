import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// POST /api/customer/register — create a new customer account
export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existing = await prisma.customer.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    if (phone) {
      const existingPhone = await prisma.customer.findUnique({ where: { phone } })
      if (existingPhone) {
        return NextResponse.json({ error: 'An account with this mobile number already exists' }, { status: 409 })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        isNewCustomer: true,
      },
    })

    return NextResponse.json({
      id: customer.id,
      email: customer.email,
      name: customer.name,
    }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
