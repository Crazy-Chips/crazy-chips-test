'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from '@/lib/customer-auth-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MemberQR from '@/components/shared/MemberQR'
import { Package, LogOut, User, Star, ChevronRight, Gift, QrCode, Smartphone } from 'lucide-react'

interface RewardTxn {
  id: string
  points: number
  type: string
  description: string
  createdAt: string
}

interface CustomerData {
  id: string
  name?: string
  email?: string
  phone?: string
  totalPoints: number
  memberSince: string
  rewardTxns: RewardTxn[]
}

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  type: string
  createdAt: string
  items: Array<{ quantity: number; menuItem: { name: string } }>
}

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-yellow-100 text-yellow-700',
  READY: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-[#FFF8EE] text-[#8a7a6a]',
  CANCELLED: 'bg-red-100 text-red-600',
}

// Points tiers
const TIERS = [
  { name: 'New Member', min: 0, max: 499, color: '#8a7a6a', emoji: '🌱' },
  { name: 'Regular', min: 500, max: 999, color: '#D92B2B', emoji: '⭐' },
  { name: 'Loyal', min: 1000, max: 1999, color: '#E6A817', emoji: '🔥' },
  { name: 'VIP', min: 2000, max: Infinity, color: '#FFD600', emoji: '👑' },
]

function getTier(points: number) {
  return TIERS.find((t) => points >= t.min && points <= t.max) ?? TIERS[0]
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'rewards' | 'orders' | 'qr'>('rewards')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/account')
  }, [status, router])

  useEffect(() => {
    if (!session?.user?.email) return
    const email = session.user.email

    Promise.all([
      fetch(`/api/customer/orders?email=${encodeURIComponent(email)}`).then(r => r.json()),
      fetch(`/api/customer/profile?email=${encodeURIComponent(email)}`).then(r => r.json()),
    ]).then(([ordersData, profileData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData : [])
      setCustomerData(profileData?.customer ?? null)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-[#FFF8EE] py-32">
          <div className="w-8 h-8 border-4 border-[#D92B2B] border-t-transparent rounded-full animate-spin" />
        </main>
      </>
    )
  }

  if (!session) return null

  const user = session.user
  const points = customerData?.totalPoints ?? 0
  const tier = getTier(points)
  const nextTier = TIERS.find(t => t.min > points)
  const progressPct = nextTier
    ? Math.min(100, ((points - tier.min) / (nextTier.min - tier.min)) * 100)
    : 100

  const tabs = [
    { id: 'rewards' as const, label: 'Rewards', icon: Gift },
    { id: 'qr' as const, label: 'My QR', icon: QrCode },
    { id: 'orders' as const, label: 'Orders', icon: Package },
  ]

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#FFF8EE] py-8 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">

          {/* Profile card */}
          <div className="bg-gradient-to-br from-[#D92B2B] to-[#8f1a1f] rounded-[24px] p-6 mb-5 relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] text-[120px] opacity-[0.06] select-none">★</div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                {user.image ? (
                  <Image src={user.image} alt="" width={56} height={56} className="w-full h-full object-cover" />
                ) : (
                  <User size={24} className="text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl text-white font-[400] leading-tight truncate" style={{ fontFamily: 'var(--font-lilita)' }}>
                  {user.name ?? 'Welcome!'}
                </h1>
                <p className="text-white/70 text-xs font-[600] mt-0.5 truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg">{tier.emoji}</span>
                  <span className="bg-white/20 text-white text-[11px] font-[800] px-2.5 py-0.5 rounded-full">
                    {tier.name}
                  </span>
                  <span className="text-[#FFD600] text-[11px] font-[800]">
                    {points.toLocaleString()} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {nextTier && (
              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-white/60 font-[700] mb-1.5">
                  <span>{tier.name}</span>
                  <span>{nextTier.min - points} pts to {nextTier.name}</span>
                </div>
                <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-[#FFD600] rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}
            {!nextTier && (
              <div className="mt-3 text-center">
                <span className="text-[#FFD600] text-xs font-[800]">👑 VIP Member — You've reached the top!</span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px] text-sm font-[700] transition-all ${
                  activeTab === id
                    ? 'bg-[#D92B2B] text-white shadow-[0_4px_14px_rgba(217,43,43,.3)]'
                    : 'bg-white text-[#8a7a6a] border border-[#F5EDD8]'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* ── REWARDS TAB ── */}
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              {/* Points summary */}
              <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(61,34,0,0.08)]">
                <h2 className="text-lg text-[#3D2200] mb-4" style={{ fontFamily: 'var(--font-lilita)' }}>
                  How to Earn Points
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '🌐', label: 'Order Online', pts: '10 pts / £1', desc: 'On this website' },
                    { icon: '🏪', label: 'Order In-Store', pts: '10 pts / £1', desc: 'Give your number at counter' },
                    { icon: '📱', label: 'Show QR Code', pts: 'Auto-tracked', desc: 'Scan your member QR' },
                    { icon: '🎁', label: 'Refer a Friend', pts: '50 bonus pts', desc: 'Coming soon' },
                  ].map((item) => (
                    <div key={item.label} className="bg-[#FFF8EE] rounded-[14px] p-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="mt-2">
                        <p className="font-[800] text-[#3D2200] text-xs">{item.label}</p>
                        <p className="text-[#D92B2B] text-xs font-[800] mt-0.5">{item.pts}</p>
                        <p className="text-[#8a7a6a] text-[10px] font-[600] mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reward tiers */}
              <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(61,34,0,0.08)]">
                <h2 className="text-lg text-[#3D2200] mb-4" style={{ fontFamily: 'var(--font-lilita)' }}>
                  Reward Tiers
                </h2>
                <div className="space-y-3">
                  {TIERS.map((t) => (
                    <div
                      key={t.name}
                      className={`flex items-center gap-3 p-3 rounded-[12px] ${points >= t.min ? 'bg-[#FFF8EE] border border-[#F5EDD8]' : 'opacity-40 bg-gray-50'}`}
                    >
                      <span className="text-2xl">{t.emoji}</span>
                      <div className="flex-1">
                        <p className="font-[800] text-[#3D2200] text-sm">{t.name}</p>
                        <p className="text-[#8a7a6a] text-xs font-[600]">
                          {t.max === Infinity ? `${t.min.toLocaleString()}+ points` : `${t.min.toLocaleString()} – ${t.max.toLocaleString()} points`}
                        </p>
                      </div>
                      {points >= t.min && (
                        <span className="text-[#D92B2B] text-xs font-[900]">✓ Unlocked</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent transactions */}
              {customerData?.rewardTxns && customerData.rewardTxns.length > 0 && (
                <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(61,34,0,0.08)]">
                  <h2 className="text-lg text-[#3D2200] mb-4" style={{ fontFamily: 'var(--font-lilita)' }}>
                    Recent Activity
                  </h2>
                  <div className="space-y-2">
                    {customerData.rewardTxns.slice(0, 8).map((txn) => (
                      <div key={txn.id} className="flex items-center justify-between py-2 border-b border-[#F5EDD8] last:border-0">
                        <div>
                          <p className="text-[#3D2200] text-sm font-[700]">{txn.description}</p>
                          <p className="text-[#8a7a6a] text-xs font-[600]">
                            {new Date(txn.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {' · '}{txn.type === 'EARN_POS' ? '🏪 In-store' : txn.type === 'EARN_ONLINE' ? '🌐 Online' : '🎁 Bonus'}
                          </p>
                        </div>
                        <span className={`font-[900] text-sm ${txn.points > 0 ? 'text-green-600' : 'text-[#D92B2B]'}`}>
                          {txn.points > 0 ? '+' : ''}{txn.points} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── QR CODE TAB ── */}
          {activeTab === 'qr' && customerData && (
            <div className="space-y-4">
              <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(61,34,0,0.08)] text-center">
                <h2 className="text-xl text-[#3D2200] mb-1" style={{ fontFamily: 'var(--font-lilita)' }}>
                  Your Member QR
                </h2>
                <p className="text-[#8a7a6a] text-sm font-[600] mb-6">
                  Show at the counter to earn reward points on every in-store order
                </p>
                <MemberQR
                  customerId={customerData.id}
                  customerName={user.name ?? ''}
                  phone={customerData.phone}
                  email={customerData.email}
                />
                <div className="mt-6 bg-[#FFF8EE] rounded-[14px] p-4 text-left">
                  <p className="text-[#3D2200] font-[800] text-sm mb-2">Or give your details verbally:</p>
                  <div className="space-y-1.5">
                    {customerData.phone && (
                      <div className="flex items-center gap-2">
                        <Smartphone size={14} className="text-[#D92B2B]" />
                        <span className="text-[#3D2200] font-[700] text-sm">{customerData.phone}</span>
                      </div>
                    )}
                    {customerData.email && (
                      <div className="flex items-center gap-2">
                        <span className="text-[#D92B2B] text-sm">@</span>
                        <span className="text-[#3D2200] font-[700] text-sm">{customerData.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(61,34,0,0.08)]">
                <h3 className="font-[800] text-[#3D2200] mb-3">How in-store points work</h3>
                <div className="space-y-3">
                  {[
                    { step: '1', text: 'Order at the counter as normal' },
                    { step: '2', text: 'Show your QR code or give your phone number / email before paying' },
                    { step: '3', text: 'Points are added to your account automatically' },
                    { step: '4', text: 'Earn 10 points for every £1 spent' },
                  ].map(s => (
                    <div key={s.step} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-[#D92B2B] text-white rounded-full flex items-center justify-center text-xs font-[900] shrink-0">{s.step}</span>
                      <p className="text-[#8a7a6a] text-sm font-[600]">{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS TAB ── */}
          {activeTab === 'orders' && (
            <div>
              {orders.length === 0 ? (
                <div className="bg-white rounded-[20px] p-10 text-center shadow-[0_4px_20px_rgba(61,34,0,0.08)]">
                  <div className="text-5xl mb-3">🍟</div>
                  <p className="text-[#3D2200] font-[800] text-base mb-1">No orders yet</p>
                  <p className="text-[#8a7a6a] text-sm font-[600] mb-5">Your order history will appear here</p>
                  <Link href="/menu" className="inline-flex items-center gap-2 bg-[#D92B2B] hover:bg-[#B01E1E] text-white font-[800] px-6 py-3 rounded-[12px] text-sm transition-colors">
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-[18px] p-5 shadow-[0_4px_20px_rgba(61,34,0,0.08)]">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-[900] text-[#3D2200] font-mono">{order.orderNumber}</span>
                          <div className="flex gap-2 mt-1">
                            <span className={`text-[10px] font-[900] px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                            <span className={`text-[10px] font-[700] px-2 py-0.5 rounded-full ${order.type === 'DELIVERY' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{order.type}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xl text-[#D92B2B]" style={{ fontFamily: 'var(--font-lilita)' }}>£{order.total.toFixed(2)}</span>
                          <p className="text-[#8a7a6a] text-xs font-[600] mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-[#8a7a6a] font-[600]">
                        {order.items.map((i) => `${i.quantity}× ${i.menuItem.name}`).join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sign out */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-white border-2 border-[#F5EDD8] hover:border-[#D92B2B] text-[#D92B2B] font-[800] py-3.5 rounded-[13px] text-sm transition-all"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </main>
      <Footer />
    </>
  )
}
