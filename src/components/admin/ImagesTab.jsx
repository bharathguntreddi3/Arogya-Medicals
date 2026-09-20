import { useRef, useState } from 'react'
import { ImageUp, RotateCcw } from 'lucide-react'
import { useSiteSettings } from '../../settings/SiteSettingsContext'
import defaultHero from '../../assets/hero.webp'
import defaultPoster from '../../assets/poster.webp'
import { StatusMessage } from './AdminUi'
import { secondaryButtonClass } from './adminStyles'
import { removeImages, uploadImage } from './uploadImage'
import { useSaveSetting } from './useSaveSetting'

const SLOTS = {
  hero: {
    title: 'Hero image',
    description: 'The big photo at the top of the home page. Landscape (wide) photos work best.',
    fallback: defaultHero,
    max: [1800, 1200],
    previewClass: 'aspect-[16/9]',
  },
  poster: {
    title: 'Offer poster',
    description: 'The poster in the “Featured Offer” section. Portrait (tall) images work best.',
    fallback: defaultPoster,
    max: [1100, 1650],
    previewClass: 'aspect-[2/3] max-w-[180px]',
  },
}

function ImageSlot({ kind }) {
  const slot = SLOTS[kind]
  const { images } = useSiteSettings().settings
  const current = images[kind]
  const { status, save, fail } = useSaveSetting('images')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)

  const upload = async (file) => {
    if (!file) return
    setBusy(true)
    try {
      const { size, ...image } = await uploadImage(file, kind, slot.max)
      const saved = await save(
        { ...images, [kind]: image },
        `Uploaded (${Math.round(size / 1024)} KB) — live on the website.`,
        {
          title: `Use this photo as the ${slot.title.toLowerCase()}?`,
          message: 'It will appear on the website straight away.',
          confirmText: 'Use photo',
        },
      )
      removeImages([saved ? current?.path : image.path])
    } catch (err) {
      fail(err.message)
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const resetToOriginal = async () => {
    setBusy(true)
    const ok = await save({ ...images, [kind]: null }, 'Back to the original image.', {
      title: 'Go back to the original image?',
      message: 'Your uploaded image will be removed.',
      confirmText: 'Use original',
      tone: 'danger',
    })
    if (ok) removeImages([current?.path])
    setBusy(false)
  }

  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="text-sm font-semibold">{slot.title}</div>
      <p className="text-xs text-muted-foreground">{slot.description}</p>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className={`w-full overflow-hidden rounded-xl border border-border bg-muted sm:w-56 ${slot.previewClass}`}>
          <img src={current?.url ?? slot.fallback} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="flex-1 space-y-2">
          <span className="block text-xs text-muted-foreground">
            {current ? `Custom image · ${current.width}×${current.height}` : 'Original image'}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            id={`upload-${kind}`}
            onChange={(e) => upload(e.target.files?.[0])}
            disabled={busy}
          />
          <label
            htmlFor={`upload-${kind}`}
            className={`${secondaryButtonClass} cursor-pointer ${busy ? 'pointer-events-none opacity-60' : ''}`}
          >
            <ImageUp className="h-4 w-4" /> {busy ? 'Working…' : 'Upload new image'}
          </label>
          {current && (
            <button type="button" onClick={resetToOriginal} disabled={busy} className={`${secondaryButtonClass} ml-2`}>
              <RotateCcw className="h-4 w-4" /> Use original
            </button>
          )}
          <StatusMessage status={status} />
        </div>
      </div>
    </div>
  )
}

export default function ImagesTab() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Photos are resized and compressed automatically before uploading, so the site stays fast.
      </p>
      <ImageSlot kind="hero" />
      <ImageSlot kind="poster" />
    </div>
  )
}
