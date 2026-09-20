import { useSiteSettings, useContact } from '../settings/SiteSettingsContext'
import { groupDays } from '../lib/hours'
import { SITE_URL, absoluteUrl } from '../lib/site'

const SCHEMA_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const PAYMENT_NAMES = { upi: 'UPI', cash: 'Cash', card: 'Credit Card' }

// Shop details Google reads for local search (hours, phone, address), built from the
// admin settings so they always match what the page shows.
export default function StructuredData() {
  const { hours, payments } = useSiteSettings().settings
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

  const pharmacy = {
    '@type': 'Pharmacy',
    // a stable id lets Google tie the shop to the site and to the Business Profile
    '@id': `${SITE_URL}/#pharmacy`,
    name: 'Arogya Medicals',
    // the Telugu spelling is a real name for the shop, and a real search term
    alternateName: 'ఆరోగ్య మెడికల్స్',
    description:
      'Neighborhood medical store in Sundar Nagar, Visakhapatnam. Genuine medicines and prescription assistance.',
    url: `${SITE_URL}/`,
    image: absoluteUrl('/og-image.jpg'),
    logo: absoluteUrl('/favicon.png'),
    telephone: `+91-${contact.phone}`,
    priceRange: '₹',
    currenciesAccepted: 'INR',
    paymentAccepted: payments.methods.map((m) => PAYMENT_NAMES[m] ?? m).join(', '),
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.en.join(' '),
      addressLocality: 'Visakhapatnam',
      addressRegion: 'Andhra Pradesh',
      postalCode: '530040',
      addressCountry: 'IN',
    },
    areaServed: [
      { '@type': 'Place', name: 'Sundar Nagar, Visakhapatnam' },
      { '@type': 'City', name: 'Visakhapatnam' },
    ],
    hasMap: contact.maps,
    openingHoursSpecification,
    sameAs: Object.values(contact.social).filter(Boolean),
  }

  // The site itself, pointing back at the shop — this is the pair Google uses to answer
  // a search for the business by name.
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: 'Arogya Medicals',
    inLanguage: ['en-IN', 'te-IN'],
    publisher: { '@id': `${SITE_URL}/#pharmacy` },
  }

  const data = { '@context': 'https://schema.org', '@graph': [pharmacy, website] }

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here once "<" is escaped
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
