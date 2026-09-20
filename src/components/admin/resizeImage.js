// Shrinks an uploaded photo to web size and re-encodes it (WebP where the browser
// supports it, JPEG otherwise), so a 5 MB phone photo becomes ~100–300 KB.
export async function resizeImage(file, maxWidth, maxHeight) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height)
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const encode = (type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality))
  let blob = await encode('image/webp', 0.82)
  if (!blob || blob.type !== 'image/webp') blob = await encode('image/jpeg', 0.85)

  return { blob, width, height, ext: blob.type === 'image/webp' ? 'webp' : 'jpg' }
}
