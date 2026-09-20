import { supabase } from '../../lib/supabaseClient'
import { resizeImage } from './resizeImage'

export const IMAGE_BUCKET = 'site-images'
const MAX_UPLOAD_MB = 15

// Resizes a photo in the browser and uploads it to the public `site-images` folder.
// Resolves to { url, width, height, path, size } or throws an Error with a readable message.
export async function uploadImage(file, prefix, [maxWidth, maxHeight]) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file (JPG, PNG or WebP).')
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) throw new Error(`Image is larger than ${MAX_UPLOAD_MB} MB.`)

  let resized
  try {
    resized = await resizeImage(file, maxWidth, maxHeight)
  } catch {
    throw new Error('Could not read that image. Try a JPG or PNG file.')
  }

  const { blob, width, height, ext } = resized
  const path = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, blob, { contentType: blob.type, cacheControl: '31536000' })
  if (error) {
    throw new Error(
      error.statusCode === '403' || /row-level security/i.test(error.message)
        ? 'This account is not allowed to upload images. Add it as an admin (see SUPABASE-SETUP.md).'
        : `Upload failed: ${error.message}`,
    )
  }

  const url = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl
  return { url, width, height, path, size: blob.size }
}

// Best-effort cleanup of files no longer used; failures are harmless.
export function removeImages(paths) {
  const list = paths.filter(Boolean)
  if (list.length) supabase.storage.from(IMAGE_BUCKET).remove(list)
}
