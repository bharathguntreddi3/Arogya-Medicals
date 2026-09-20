import NoticeBanner from './components/NoticeBanner'
import OfferRibbon from './components/OfferRibbon'
import Header from './components/Header'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import Services from './components/Services'
import WhyUs from './components/WhyUs'
import WorkingHours from './components/WorkingHours'
import FeaturedOffer from './components/FeaturedOffer'
import Location from './components/Location'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { FloatingWhatsApp, MobileActionBar } from './components/MobileActions'
import BackToTop from './components/BackToTop'
import StructuredData from './components/StructuredData'
import Gallery from './components/Gallery'
import { useClickTracking } from './hooks/useClickTracking'
import { useReveal } from './hooks/useReveal'
import WhatsAppBubble from './components/WhatsAppBubble'
import { useSiteSettings } from './settings/SiteSettingsContext'

// The admin lives on its own page (yoursite/admin, see admin.html) — no admin code here.
export default function App() {
  const { notice } = useSiteSettings().settings
  useClickTracking()
  useReveal()

  return (
    <div className="min-h-screen bg-background pb-[72px] md:pb-0">
      <NoticeBanner notice={notice} />
      <OfferRibbon />
      <Header />
      <Hero />
      <TrustBar />
      <Services />
      <WhyUs />
      <WorkingHours />
      <FeaturedOffer />
      <Gallery />
      <Location />
      <Contact />
      <Footer />
      <BackToTop />
      <FloatingWhatsApp />
      <MobileActionBar />
      <StructuredData />
      <WhatsAppBubble />
    </div>
  )
}
