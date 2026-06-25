export type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'
export type OrderType = 'DELIVERY' | 'COLLECTION'

export interface Extra {
  id: string
  name: string
  price: number
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string | null
  available: boolean
  featured: boolean
  extras?: Extra[] | null
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  extras: Extra[]
  specialInstructions?: string
  imageUrl?: string
}

export interface OrderItem {
  id: string
  menuItemId: string
  menuItem: MenuItem
  quantity: number
  extras?: Extra[] | null
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  subtotal: number
  discount: number
  total: number
  status: OrderStatus
  type: OrderType
  address?: string | null
  postcode?: string | null
  notes?: string | null
  stripePaymentId?: string | null
  promoCodeUsed?: string | null
  createdAt: string
  updatedAt: string
}

export interface PromoCode {
  id: string
  code: string
  discountPercent: number
  active: boolean
  usageLimit?: number | null
  usageCount: number
  expiresAt?: string | null
  createdAt: string
}

export interface CheckoutFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  type: OrderType
  address?: string
  postcode?: string
  notes?: string
}

export interface CreateOrderPayload {
  items: CartItem[]
  promoCode?: string | null
  type: OrderType
  customerDetails: CheckoutFormData
  stripePaymentId: string
}
