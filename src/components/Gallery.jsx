import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useSiteSettings } from '../settings/SiteSettingsContext'
import { photoKey, resolvePhotos } from '../lib/builtinGallery'
import { track } from '../lib/track'

function Lightbox({ photos, index, onChange, onClose, lang, t }) {
  const photo = photos[index]
  const caption = (lang === 'te' && photo.caption?.te) || photo.caption?.en
  const go = (step) => onChange((index + step + photos.length) % photos.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onChange((i) => (i - 1 + photos.length) % photos.length)
      if (e.key === 'ArrowRight') onChange((i) => (i + 1) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [photos.length, onChange, onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={caption || t.gallery.title}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <figure className="flex max-h-full max-w-5xl flex-col items-center gap-3">
        <img
          src={photo.url}
          alt={caption || ''}
          width={photo.width}
          height={photo.height}
          className="max-h-[80vh] w-auto rounded-xl object-contain"
        />
        {caption && <figcaption className="text-center text-sm text-white/90">{caption}</figcaption>}
        <span className="text-xs text-white/60">
          {index + 1} / {photos.length}
        </span>
      </figure>

      <button
        type="button"
        onClick={onClose}
        aria-label={t.gallery.close}
        className="absolute top-4 right-4 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={t.gallery.previous}
            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 sm:left-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={t.gallery.next}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 sm:right-4"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  )
}

// Store photos (built-in ones plus any uploaded in the admin panel). Hidden if the admin removes them all.
export default function Gallery() {
  const { lang, t } = useLanguage()
  const photos = resolvePhotos(useSiteSettings().settings.gallery.photos)
  const [open, setOpen] = useState(null)

  if (!photos.length) return null

  return (
    <section id="gallery" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
      <div data-reveal className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Images className="h-3.5 w-3.5" /> {t.gallery.badge}
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{t.gallery.title}</h2>
        <p className="mt-3 text-muted-foreground">{t.gallery.subtitle}</p>
      </div>

      {/* first photo is featured at double height: 7 photos fill 2×4 (phones) or 4×2 (desktop) */}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {photos.map((photo, i) => {
          const caption = (lang === 'te' && photo.caption?.te) || photo.caption?.en
          return (
            <button
              key={photoKey(photo)}
              type="button"
              data-reveal
              style={{ '--reveal-delay': `${(i % 4) * 70}ms` }}
              onClick={() => {
                setOpen(i)
                track('gallery')
              }}
              aria-label={caption || t.gallery.open(i + 1)}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-muted shadow-[var(--shadow-soft)] ${
                i === 0 ? 'row-span-2' : 'aspect-[4/3]'
              }`}
            >
              <img
                src={photo.thumb ?? photo.url}
                alt={caption || ''}
                loading="lazy"
                width={photo.width}
                height={photo.height}
                style={photo.focus ? { objectPosition: photo.focus } : undefined}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {caption && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-6 pb-2 text-left text-xs font-medium text-white sm:text-sm">
                  {caption}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {open !== null && (
        <Lightbox
          photos={photos}
          index={open}
          onChange={setOpen}
          onClose={() => setOpen(null)}
          lang={lang}
          t={t}
        />
      )}
    </section>
  )
}
