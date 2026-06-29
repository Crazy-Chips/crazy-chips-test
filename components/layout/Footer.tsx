import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#3D2200] text-white/70 pb-24 md:pb-0">
      {/* CTA */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-2xl text-white mb-1" style={{ fontFamily: 'var(--font-lilita)' }}>
              Ready to order?
            </h3>
            <p className="text-white/50 text-sm font-[600]">Hot food, fast delivery. Derby's favourite chip shop.</p>
          </div>
          <Link
            href="/menu"
            className="shrink-0 bg-[#FFD600] hover:bg-[#E6C000] text-[#3D2200] font-[800] px-7 py-3.5 rounded-[13px] transition-all duration-200 hover:-translate-y-0.5"
          >
            Order Now →
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Image
                src="/logo-transparent.png"
                alt="Crazy Chips"
                width={100}
                height={100}
              />
            </div>
            <p className="text-sm font-[500] leading-relaxed mb-5">
              Derby's boldest chip shop. Fresh food, fast service, massive flavours.
            </p>
            <div className="flex gap-3">
              {['📸', '👍'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-[#D92B2B] rounded-full flex items-center justify-center text-base transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-xs font-[800] uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm font-[600]">
              <li><Link href="/menu" className="hover:text-white transition-colors">Full Menu</Link></li>
              <li><Link href="/#deals" className="hover:text-[#FFD600] transition-colors">Current Deals</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Your Cart</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs font-[800] uppercase tracking-widest mb-4">Find Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-[#FFD600] shrink-0 mt-0.5" />
                <span className="font-[600]">123 Market Place<br />Derby, DE1 1AA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#FFD600] shrink-0" />
                <a href="tel:+441332123456" className="hover:text-white font-[600] transition-colors">01332 123456</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white text-xs font-[800] uppercase tracking-widest mb-4">
              <Clock size={12} className="inline mr-1" />Opening Hours
            </h4>
            <ul className="space-y-2 text-sm font-[600]">
              {[
                { day: 'Mon – Thu', time: '11:00 – 22:00' },
                { day: 'Friday', time: '11:00 – 23:00' },
                { day: 'Saturday', time: '10:00 – 23:00' },
                { day: 'Sunday', time: '12:00 – 21:00' },
              ].map((h) => (
                <li key={h.day} className="flex justify-between gap-4">
                  <span>{h.day}</span>
                  <span className="text-white">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/30 font-[600]">
          <p>&copy; {new Date().getFullYear()} Crazy Chips Derby Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white/60">Privacy Policy</Link>
            <span>Registered in England &amp; Wales</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
