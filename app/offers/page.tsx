import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const deals = [
  {
    code: 'CRAZY10',
    discount: '10% OFF',
    title: 'Loyal Customer Deal',
    desc: 'Get 10% off any order over £8. No minimum items — just great food at a better price.',
    tag: 'Always Active',
    highlight: false,
    terms: 'Valid on all orders over £8. Cannot be combined with other offers.',
  },
  {
    code: 'NEWCUSTOMER',
    discount: '15% OFF',
    title: 'First Order Offer',
    desc: 'New to Crazy Chips? Welcome! Enjoy 15% off your very first order on us.',
    tag: 'New Customers',
    highlight: true,
    terms: 'Valid on your first order only. One use per account.',
  },
]

export default function OffersPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FFF8EE]">
        {/* Hero */}
        <div className="bg-[#D92B2B] py-14 px-4 text-center relative overflow-hidden">
          <div className="absolute top-[-60px] right-[-60px] w-[260px] h-[260px] bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute bottom-[-40px] left-[-40px] w-[180px] h-[180px] bg-white/10 rounded-full pointer-events-none" />
          <div className="relative">
            <p className="text-[#FFD600] text-xs font-[900] uppercase tracking-[0.2em] mb-2">🏷️ Exclusive Savings</p>
            <h1 className="text-4xl sm:text-5xl text-white mb-3" style={{ fontFamily: 'var(--font-lilita)' }}>
              Current Offers
            </h1>
            <p className="text-white/70 font-[600] text-sm max-w-md mx-auto">
              Use a promo code at checkout to claim your discount. Fresh deals added regularly.
            </p>
          </div>
        </div>

        {/* Deals */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-5">
          {deals.map((deal) => (
            <div
              key={deal.code}
              className={`rounded-[22px] p-7 border-l-[5px] ${
                deal.highlight
                  ? 'bg-[#D92B2B] border-[#B01E1E] text-white'
                  : 'bg-white border-[#D92B2B] shadow-[0_4px_24px_rgba(61,34,0,0.10)]'
              }`}
            >
              <div className="flex items-start justify-between mb-3 gap-4">
                <div>
                  <span
                    className={`text-4xl font-[400] leading-none block mb-1 ${deal.highlight ? 'text-[#FFD600]' : 'text-[#D92B2B]'}`}
                    style={{ fontFamily: 'var(--font-lilita)' }}
                  >
                    {deal.discount}
                  </span>
                  <span className={`text-base font-[700] ${deal.highlight ? 'text-white' : 'text-[#3D2200]'}`}>
                    {deal.title}
                  </span>
                </div>
                <span className="shrink-0 text-[11px] font-[900] px-3 py-1 rounded-full bg-[#FFD600] text-[#3D2200]">
                  {deal.tag}
                </span>
              </div>

              <p className={`text-sm font-[600] mb-5 leading-relaxed ${deal.highlight ? 'text-white/80' : 'text-[#8a7a6a]'}`}>
                {deal.desc}
              </p>

              <div className={`flex flex-col gap-1 rounded-[12px] px-4 py-3 mb-4 ${deal.highlight ? 'bg-white/15' : 'bg-[#FFF8EE]'}`}>
                <span
                  className={`font-[400] text-2xl tracking-[0.15em] ${deal.highlight ? 'text-white' : 'text-[#3D2200]'}`}
                  style={{ fontFamily: 'var(--font-lilita)' }}
                >
                  {deal.code}
                </span>
                <span className={`text-xs font-[700] ${deal.highlight ? 'text-white/60' : 'text-[#8a7a6a]'}`}>
                  Enter at checkout
                </span>
              </div>

              <p className={`text-xs font-[600] ${deal.highlight ? 'text-white/50' : 'text-[#c4b49a]'}`}>
                * {deal.terms}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center pb-16">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-[#D92B2B] hover:bg-[#B01E1E] text-white font-[800] px-8 py-4 rounded-[14px] text-base transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(217,43,43,.35)]"
          >
            Order & Save Now 🍟
          </Link>
          <p className="text-[#8a7a6a] text-xs font-[600] mt-3">More deals coming soon — check back regularly!</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
