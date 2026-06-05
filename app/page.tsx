import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Bestsellers from '@/components/home/Bestsellers'
import HowItWorks from '@/components/home/HowItWorks'
import DealsSection from '@/components/home/DealsSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Bestsellers />
        <HowItWorks />
        <DealsSection />

        {/* About */}
        <section id="about" className="bg-[#F5EDD8] py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="bg-[#3D2200] rounded-[28px] overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div className="relative h-64 lg:h-auto">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
                    alt="About Crazy Chips"
                    className="w-full h-full object-cover opacity-60"
                  />
                </div>
                {/* Copy */}
                <div className="p-8 sm:p-12 flex flex-col justify-center">
                  <p className="text-[#FFD600] text-xs font-[800] uppercase tracking-[0.15em] mb-2">
                    Our Story
                  </p>
                  <h2 className="text-4xl text-white mb-5 leading-tight" style={{ fontFamily: 'var(--font-lilita)' }}>
                    Born in Derby.<br />
                    Built for<br />
                    <span className="text-[#FFD600]">Flavour.</span>
                  </h2>
                  <p className="text-white/60 text-sm font-[500] leading-relaxed mb-4">
                    Crazy Chips started with one mission — serve Derby the most satisfying chips in town.
                    Fresh-cut potatoes, clean oil, seasoned to perfection every single time.
                  </p>
                  <p className="text-white/40 text-sm font-[500] leading-relaxed mb-8">
                    Every burger hand-made. Every side crafted with care. No shortcuts, ever.
                  </p>
                  <a
                    href="/menu"
                    className="inline-flex items-center gap-2 bg-[#FFD600] hover:bg-[#E6C000] text-[#3D2200] font-[800] px-7 py-3.5 rounded-[13px] text-sm transition-all self-start"
                  >
                    See Our Menu 🍟
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
