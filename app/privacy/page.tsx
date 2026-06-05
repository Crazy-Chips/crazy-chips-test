import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#FAF7F2] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray">
          <h1 className="text-4xl font-black text-[#0A0A0A] mb-8" style={{ fontFamily: 'var(--font-lilita)' }}>
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">1. Who We Are</h2>
            <p className="text-gray-600 leading-relaxed">
              Crazy Chips is a food ordering service based in Derby, United Kingdom. This privacy policy explains how we collect, use, and protect your personal information when you use our website and place orders.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">2. What Data We Collect</h2>
            <ul className="text-gray-600 leading-relaxed space-y-2 list-disc pl-5">
              <li>Name, email address, and phone number (for order processing)</li>
              <li>Delivery address (if you choose delivery)</li>
              <li>Order history and preferences</li>
              <li>Payment information (processed securely by Stripe — we never store raw card data)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">3. How We Use Your Data</h2>
            <ul className="text-gray-600 leading-relaxed space-y-2 list-disc pl-5">
              <li>To process and fulfil your orders</li>
              <li>To send order confirmation emails</li>
              <li>To contact you about your order if needed</li>
              <li>We do NOT use your email for marketing unless you explicitly opt in</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">4. Data Storage</h2>
            <p className="text-gray-600 leading-relaxed">
              Your data is stored securely in the EU/UK region in compliance with UK GDPR. We use industry-standard encryption and security practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">5. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              We use essential cookies to keep your cart active. We may use analytics cookies (with your consent) to improve our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">6. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              Under UK GDPR, you have the right to access, correct, or delete your personal data. To make a request, email us at: <a href="mailto:privacy@crazychips.co.uk" className="text-[#E3000F] hover:underline">privacy@crazychips.co.uk</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">7. Third Parties</h2>
            <ul className="text-gray-600 leading-relaxed space-y-2 list-disc pl-5">
              <li><strong>Stripe</strong> — payment processing (PCI-compliant)</li>
              <li><strong>Resend</strong> — transactional email delivery</li>
              <li><strong>Vercel</strong> — hosting (London region)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">8. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For any privacy concerns, contact us at <a href="mailto:privacy@crazychips.co.uk" className="text-[#E3000F] hover:underline">privacy@crazychips.co.uk</a> or write to us at: Crazy Chips, 123 Market Place, Derby, DE1 1AA.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
