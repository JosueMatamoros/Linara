import { supabase } from './supabase'

function extractStoragePath(imageUrl) {
  if (!imageUrl) return null
  const marker = '/public/products/'
  const idx = imageUrl.indexOf(marker)
  return idx !== -1 ? imageUrl.substring(idx + marker.length) : null
}

export async function compressToWebP(file, quality = 0.8, size = 800) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width  = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      // Recorte centrado tipo object-cover: escalar para cubrir el cuadrado
      const scale = Math.max(size / img.naturalWidth, size / img.naturalHeight)
      const sw = img.naturalWidth  * scale
      const sh = img.naturalHeight * scale
      ctx.drawImage(img, (size - sw) / 2, (size - sh) / 2, sw, sh)
      canvas.toBlob(
        (blob) => { URL.revokeObjectURL(url); resolve(blob) },
        'image/webp', quality
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Error al procesar imagen')) }
    img.src = url
  })
}

// ── Lectura ──────────────────────────────────────────
export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

// ── Actualizaciones — sin .single() para evitar errores ──
export async function updatePrice(id, price) {
  const { error } = await supabase.from('products').update({ price }).eq('id', id)
  if (error) throw error
}

export async function updateSubcategory(id, subcategory) {
  const { error } = await supabase.from('products').update({ subcategory }).eq('id', id)
  if (error) throw error
}

export async function updateSizes(id, sizes) {
  const { error } = await supabase.from('products').update({ sizes }).eq('id', id)
  if (error) throw error
}

export async function toggleStock(id, inStock) {
  const { error } = await supabase.from('products').update({ in_stock: inStock }).eq('id', id)
  if (error) throw error
}

// ── Eliminar (tabla + Storage) ────────────────────────
export async function deleteProduct(id, imageUrl) {
  const storagePath = extractStoragePath(imageUrl)
  if (storagePath) {
    const { error: se } = await supabase.storage.from('products').remove([storagePath])
    if (se) console.warn('Storage delete:', se.message)
  }
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

// ── Crear producto ────────────────────────────────────
export async function createProduct({ category, subcategory, price, sizes, imageFile }) {
  let imageUrl = null

  if (imageFile) {
    const blob = await compressToWebP(imageFile)
    const fileName = imageFile.name.replace(/\.[^.]+$/, '') + '.webp'
    const storagePath = `${category}/${fileName}`

    const { error: ue } = await supabase.storage
      .from('products').upload(storagePath, blob, { contentType: 'image/webp', upsert: true })
    if (ue) throw ue

    const { data } = supabase.storage.from('products').getPublicUrl(storagePath)
    imageUrl = data.publicUrl
  }

  const { data, error } = await supabase
    .from('products')
    .insert({ category, subcategory, price: parseFloat(price), sizes, image_url: imageUrl, in_stock: true })
    .select().maybeSingle()
  if (error) throw error
  return data
}
