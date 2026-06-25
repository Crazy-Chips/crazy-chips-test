import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Bestsellers from '@/components/home/Bestsellers'
import HowItWorks from '@/components/home/HowItWorks'
import DealsSection from '@/components/home/DealsSection'
import DeliverySection from '@/components/home/DeliverySection'
import OurStory from '@/components/home/OurStory'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Bestsellers />
        <DeliverySection />
        <HowItWorks />
        <DealsSection />
        <OurStory />
      </main>
      <Footer />
    </>
  )
}
