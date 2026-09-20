import { DEFAULT_GALLERY_PHOTOS } from './builtinGallery'

// What the site shows before anything is changed in the admin panel.
// Admin-saved values (Supabase `site_settings` table) override these, one section at a time.

const WEEKDAY = [
  { open: '08:00', close: '13:30' },
  { open: '17:00', close: '22:00' },
]

export const DEFAULT_SETTINGS = {
  notice: { enabled: false, tone: 'holiday', en: '', te: '', until: null },

  hours: {
    // index 0 = Sunday … 6 = Saturday; times are 24-hour HH:MM, India time
    days: [
      { closed: false, slots: [{ open: '08:00', close: '13:00' }] },
      { closed: false, slots: WEEKDAY },
      { closed: false, slots: WEEKDAY },
      { closed: false, slots: WEEKDAY },
      { closed: false, slots: WEEKDAY },
      { closed: false, slots: WEEKDAY },
      { closed: false, slots: WEEKDAY },
    ],
    // emergency switch: shows "Temporarily closed" regardless of the timings
    closedNow: false,
  },

  contact: {
    phone: '9885191077',
    whatsapp: '9885191077',
    address: {
      en: ['#4-1, Shop No. 2, Opposite Muthoot Fincorp,', 'Sundar Nagar, Old Diary Farm, Visakhapatnam – 530040'],
      te: ['#4-1, షాప్ నం. 2, ముత్తూట్ ఫిన్‌కార్ప్ ఎదురుగా,', 'సుందర్ నగర్, ఓల్డ్ డైరీ ఫామ్, విశాఖపట్నం – 530040'],
    },
    area: { en: 'Sundar Nagar, Vizag', te: 'సుందర్ నగర్, వైజాగ్' },
    mapsQuery: 'Arogya Medicals, Sundar Nagar, Old Diary Farm, Visakhapatnam 530040',
    reviewLink: '',
    social: { facebook: '', instagram: '', youtube: '' },
  },

  payments: { methods: ['upi', 'cash', 'card'] },

  offer: {
    // null = the site says "Best Discounts"; a number = the site says "<number>% OFF"
    discount: null,
    // optional limited-time offer: { discount, from, until } (YYYY-MM-DD, India time)
    scheduled: null,
  },

  // orange scrolling strip: the discount message (optional) + the admin's own messages
  ribbon: {
    showOffer: true,
    items: [{ en: 'Free Prescription Assistance', te: 'ఉచిత ప్రిస్క్రిప్షన్ సహాయం' }],
  },

  // store photos: built-in { builtin, caption, focus? } or uploaded { url, width, height, path, caption }
  gallery: { photos: DEFAULT_GALLERY_PHOTOS },

  // null = use the original images bundled with the site
  images: { hero: null, poster: null },
}

export const SETTING_IDS = Object.keys(DEFAULT_SETTINGS)

// Admin-saved sections replace the defaults section by section.
export function mergeSettings(remote = {}) {
  const merged = {}
  for (const id of SETTING_IDS) {
    merged[id] = { ...DEFAULT_SETTINGS[id], ...(remote[id] ?? {}) }
  }
  return merged
}
