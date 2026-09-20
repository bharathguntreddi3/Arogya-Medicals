import { useSiteSettings, useContact } from '../settings/SiteSettingsContext'
import { groupDays } from '../lib/hours'

const SCHEMA_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Shop details Google reads for local search (hours, phone, address), built from the
// admin settings so they always match what the page shows.
export default function StructuredData() {
  const { hours } = useSiteSettings().settings
  const contact = useContact()

  const openingHoursSpecification = groupDays(hours.days)
    .filter((g) => !g.closed)
    .flatMap((g) =>
      g.slots.map((slot) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: g.days.map((d) => SCHEMA_DAYS[d]),
        opens: slot.open,
        closes: slot.close,
      })),
    )

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Pharmacy',
    name: 'Arogya Medicals',
    description:
      'Neighborhood medical store in Sundar Nagar, Visakhapatnam. Genuine medicines and prescription assistance.',
    image: '/og-image.jpg',
    logo: '/favicon.png',
    telephone: `+91-${contact.phone}`,
    priceRange: '₹',
    currenciesAccepted: 'INR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.en.join(' '),
      addressLocality: 'Visakhapatnam',
      addressRegion: 'Andhra Pradesh',
      addressCountry: 'IN',
    },
    hasMap: contact.maps,
    openingHoursSpecification,
    sameAs: Object.values(contact.social).filter(Boolean),
  }

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here once "<" is escaped
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
