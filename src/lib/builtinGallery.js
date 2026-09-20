// The store photos that ship with the site (src/assets/gallery-images). Gallery settings
// refer to them as { builtin: 'frame1' } so the saved settings never depend on file hashes.
import frame1 from '../assets/gallery-images/frame1.webp'
import frame1Thumb from '../assets/gallery-images/frame1-thumb.webp'
import frame2 from '../assets/gallery-images/frame2.webp'
import frame2Thumb from '../assets/gallery-images/frame2-thumb.webp'
import frame3 from '../assets/gallery-images/frame3.webp'
import frame3Thumb from '../assets/gallery-images/frame3-thumb.webp'
import frame4 from '../assets/gallery-images/frame4.webp'
import frame4Thumb from '../assets/gallery-images/frame4-thumb.webp'
import frame5 from '../assets/gallery-images/frame5.webp'
import frame5Thumb from '../assets/gallery-images/frame5-thumb.webp'
import frame6 from '../assets/gallery-images/frame6.webp'
import frame6Thumb from '../assets/gallery-images/frame6-thumb.webp'
import frame7 from '../assets/gallery-images/frame7.webp'
import frame7Thumb from '../assets/gallery-images/frame7-thumb.webp'

const BUILTIN_FILES = {
  frame1: { url: frame1, thumb: frame1Thumb, width: 899, height: 1200 },
  frame2: { url: frame2, thumb: frame2Thumb, width: 1080, height: 808 },
  frame3: { url: frame3, thumb: frame3Thumb, width: 1006, height: 808 },
  frame4: { url: frame4, thumb: frame4Thumb, width: 1079, height: 606 },
  frame5: { url: frame5, thumb: frame5Thumb, width: 1079, height: 610 },
  frame6: { url: frame6, thumb: frame6Thumb, width: 1079, height: 830 },
  frame7: { url: frame7, thumb: frame7Thumb, width: 1079, height: 811 },
}

// Default gallery: order, captions, and where to centre the crop in the grid tiles.
export const DEFAULT_GALLERY_PHOTOS = [
  {
    builtin: 'frame1',
    focus: '50% 22%', // tall photo: keep the shop sign in view
    caption: { en: 'Find us by our sign in Sundar Nagar', te: 'సుందర్ నగర్‌లో మా షాప్ బోర్డు' },
  },
  {
    builtin: 'frame2',
    caption: { en: 'Friendly help at the counter', te: 'కౌంటర్ వద్ద స్నేహపూర్వక సహాయం' },
  },
  {
    builtin: 'frame5',
    caption: { en: 'A wide range of medicines', te: 'విస్తృత శ్రేణి మందులు' },
  },
  {
    builtin: 'frame6',
    caption: { en: 'Baby care, nutrition & wellness', te: 'బేబీ కేర్, పోషకాహారం & వెల్‌నెస్' },
  },
  {
    builtin: 'frame3',
    caption: { en: 'Personal care & hygiene products', te: 'పర్సనల్ కేర్ & హైజీన్ ఉత్పత్తులు' },
  },
  {
    builtin: 'frame4',
    caption: { en: 'Well-stocked shelves', te: 'నిండుగా ఉన్న అరలు' },
  },
  {
    builtin: 'frame7',
    caption: { en: 'Everyday health essentials', te: 'రోజువారీ ఆరోగ్య అవసరాలు' },
  },
]

// Built-in photos get their file details filled in; uploaded photos pass through.
// Photos whose built-in file no longer exists are dropped.
export function resolvePhotos(photos) {
  return photos
    .map((p) => (p.builtin ? (BUILTIN_FILES[p.builtin] ? { ...BUILTIN_FILES[p.builtin], ...p } : null) : p))
    .filter(Boolean)
}

export const photoKey = (p) => p.path ?? p.builtin ?? p.url
