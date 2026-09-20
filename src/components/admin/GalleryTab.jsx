import { useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ImagePlus, RotateCcw, Trash2 } from 'lucide-react'
import { useSiteSettings } from '../../settings/SiteSettingsContext'
import { DEFAULT_GALLERY_PHOTOS, photoKey, resolvePhotos } from '../../lib/builtinGallery'
import { SaveBar } from './AdminUi'
import { inputClass, secondaryButtonClass } from './adminStyles'
import { removeImages, uploadImage } from './uploadImage'
import { useSaveSetting } from './useSaveSetting'
import { useConfirm } from './ConfirmContext'

const MAX_PHOTOS = 12
const iconButton =
  'rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30'

export default function GalleryTab() {
  const { gallery } = useSiteSettings().settings
  const [photos, setPhotos] = useState(() => structuredClone(gallery.photos))
  // files of photos deleted in this editing session; removed from storage once saved
  const [removed, setRemoved] = useState([])
  const [uploading, setUploading] = useState('')
  const { status, save, fail, reset } = useSaveSetting('gallery')
  const inputRef = useRef(null)
  const confirm = useConfirm()

  const edit = (fn) => {
    const next = structuredClone(photos)
    fn(next)
    setPhotos(next)
    reset()
  }

  const move = (i, step) =>
    edit((p) => {
      const [photo] = p.splice(i, 1)
      p.splice(i + step, 0, photo)
    })

  const persist = async (next, text, confirmOptions) => {
    // store only what identifies each photo (built-in photos by name, uploads by file)
    const clean = next.map(({ thumb: _thumb, ...p }) => {
      const base = p.builtin ? { builtin: p.builtin, ...(p.focus ? { focus: p.focus } : {}) } : p
      return { ...base, caption: { en: p.caption?.en?.trim() ?? '', te: p.caption?.te?.trim() ?? '' } }
    })
    const saved = await save({ photos: clean }, text, confirmOptions)
    if (saved) {
      removeImages(removed)
      setRemoved([])
      setPhotos(clean)
    }
    return saved
  }

  // New uploads are saved straight away (together with any unsaved edits).
  const addPhotos = async (fileList) => {
    const files = [...(fileList ?? [])].slice(0, MAX_PHOTOS - photos.length)
    if (!files.length) return
    const added = []
    try {
      for (const [i, file] of files.entries()) {
        setUploading(`Uploading ${i + 1} of ${files.length}…`)
        const { size: _size, ...photo } = await uploadImage(file, 'gallery', [1600, 1600])
        added.push({ ...photo, caption: { en: '', te: '' } })
      }
      const saved = await persist(
        [...photos, ...added],
        `Added ${added.length} photo${added.length > 1 ? 's' : ''} — live on the website.`,
        {
          title: `Add ${added.length} photo${added.length > 1 ? 's' : ''} to the gallery?`,
          message: 'They will appear on the website straight away.',
          confirmText: 'Add',
        },
      )
      // cancelled: the files were already uploaded, so remove them again
      if (!saved) removeImages(added.map((p) => p.path))
    } catch (err) {
      removeImages(added.map((p) => p.path))
      fail(err.message)
    } finally {
      setUploading('')
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const restoreOriginals = async () => {
    const ok = await confirm({
      title: 'Restore the original 7 photos?',
      message: 'Uploaded photos will be removed when you save.',
      confirmText: 'Restore',
      tone: 'danger',
    })
    if (!ok) return
    setRemoved((r) => [...r, ...photos.map((p) => p.path)])
    setPhotos(structuredClone(DEFAULT_GALLERY_PHOTOS))
    reset()
  }

  const submit = (e) => {
    e.preventDefault()
    persist(photos, photos.length ? 'Saved — live on the website.' : 'Saved — the gallery section is hidden.')
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Photos of your store in the “Our Store” section of the home page. The first photo is shown larger.
        Up to {MAX_PHOTOS} photos; uploads are resized automatically. Removing every photo hides the section.
      </p>

      <div>
        <input
          ref={inputRef}
          id="gallery-upload"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={Boolean(uploading) || photos.length >= MAX_PHOTOS}
          onChange={(e) => addPhotos(e.target.files)}
        />
        <label
          htmlFor="gallery-upload"
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border px-4 py-6 text-center text-sm transition-colors hover:border-primary ${
            uploading || photos.length >= MAX_PHOTOS ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          <ImagePlus className="h-6 w-6 text-primary" />
          <span className="font-semibold">
            {uploading || (photos.length >= MAX_PHOTOS ? 'Gallery is full' : 'Add photos')}
          </span>
          <span className="text-xs text-muted-foreground">
            {photos.length} of {MAX_PHOTOS} used · you can select several at once
          </span>
        </label>
      </div>

      <div className="space-y-3">
        {resolvePhotos(photos).map((photo, i) => (
          <div key={photoKey(photo)} className="flex gap-3 rounded-2xl border border-border p-3">
            <img
              src={photo.thumb ?? photo.url}
              alt=""
              className="h-20 w-24 flex-none rounded-lg object-cover sm:h-24 sm:w-32"
            />
            <div className="min-w-0 flex-1 space-y-2">
              <input
                aria-label={`Photo ${i + 1} caption in English`}
                placeholder="Caption in English (optional)"
                maxLength={80}
                value={photo.caption?.en ?? ''}
                onChange={(e) => edit((p) => (p[i].caption = { ...p[i].caption, en: e.target.value }))}
                className={`${inputClass} py-2`}
              />
              <input
                aria-label={`Photo ${i + 1} caption in Telugu`}
                placeholder="Caption in Telugu (optional)"
                maxLength={80}
                value={photo.caption?.te ?? ''}
                onChange={(e) => edit((p) => (p[i].caption = { ...p[i].caption, te: e.target.value }))}
                className={`${inputClass} py-2`}
              />
            </div>
            <div className="flex flex-col">
              <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className={iconButton}>
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Move down"
                disabled={i === photos.length - 1}
                onClick={() => move(i, 1)}
                className={iconButton}
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={`Delete photo ${i + 1}`}
                onClick={() => {
                  setRemoved((r) => [...r, photo.path])
                  edit((p) => p.splice(i, 1))
                }}
                className={`${iconButton} hover:text-destructive`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={restoreOriginals} className={secondaryButtonClass}>
        <RotateCcw className="h-4 w-4" /> Restore the original 7 photos
      </button>

      {photos.length > 0 || removed.length > 0 ? (
        <SaveBar status={status} label="Save captions & order" />
      ) : (
        status.text && <SaveBar status={status} />
      )}
    </form>
  )
}
