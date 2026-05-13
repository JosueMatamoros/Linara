const PH = '/images/placeholder.jpg'
const ROPA_SIZES  = ['XS', 'S', 'M', 'L', 'XL']
const SHOE_SIZES  = ['36', '37', '38', '39', '40', '41']
const ACC_SIZES   = ['Único']
const CAP_SIZES   = ['S/M', 'L/XL']

export const PRODUCTS = [
  // ── Hombre ──────────────────────────────────────────
  { id: 'h1', category: 'hombre', subcategory: 'Camisetas', price: 25,  sizes: ROPA_SIZES, image: PH },
  { id: 'h2', category: 'hombre', subcategory: 'Camisetas', price: 25,  sizes: ROPA_SIZES, image: PH },
  { id: 'h3', category: 'hombre', subcategory: 'Camisas',   price: 45,  sizes: ROPA_SIZES, image: PH },
  { id: 'h4', category: 'hombre', subcategory: 'Pantalones',price: 55,  sizes: ROPA_SIZES, image: PH },
  { id: 'h5', category: 'hombre', subcategory: 'Pantalones',price: 65,  sizes: ROPA_SIZES, image: PH },
  { id: 'h6', category: 'hombre', subcategory: 'Sudaderas', price: 55,  sizes: ROPA_SIZES, image: PH },
  { id: 'h7', category: 'hombre', subcategory: 'Polos',     price: 35,  sizes: ROPA_SIZES, image: PH },
  { id: 'h8', category: 'hombre', subcategory: 'Chaquetas', price: 85,  sizes: ROPA_SIZES, image: PH },

  // ── Mujer ───────────────────────────────────────────
  { id: 'm1', category: 'mujer', subcategory: 'Vestidos',   price: 75,  sizes: ROPA_SIZES, image: PH },
  { id: 'm2', category: 'mujer', subcategory: 'Blusas',     price: 55,  sizes: ROPA_SIZES, image: PH },
  { id: 'm3', category: 'mujer', subcategory: 'Pantalones', price: 60,  sizes: ROPA_SIZES, image: PH },
  { id: 'm4', category: 'mujer', subcategory: 'Faldas',     price: 50,  sizes: ROPA_SIZES, image: PH },
  { id: 'm5', category: 'mujer', subcategory: 'Chaquetas',  price: 95,  sizes: ROPA_SIZES, image: PH },
  { id: 'm6', category: 'mujer', subcategory: 'Abrigos',    price: 145, sizes: ROPA_SIZES, image: PH },
  { id: 'm7', category: 'mujer', subcategory: 'Vestidos',   price: 80,  sizes: ROPA_SIZES, image: PH },
  { id: 'm8', category: 'mujer', subcategory: 'Blusas',     price: 45,  sizes: ROPA_SIZES, image: PH },

  // ── Accesorios ──────────────────────────────────────
  { id: 'a1', category: 'accesorios', subcategory: 'Bolsos',     price: 120, sizes: ACC_SIZES, image: PH },
  { id: 'a2', category: 'accesorios', subcategory: 'Bolsos',     price: 85,  sizes: ACC_SIZES, image: PH },
  { id: 'a3', category: 'accesorios', subcategory: 'Cinturones', price: 40,  sizes: ACC_SIZES, image: PH },
  { id: 'a4', category: 'accesorios', subcategory: 'Bufandas',   price: 65,  sizes: ACC_SIZES, image: PH },
  { id: 'a5', category: 'accesorios', subcategory: 'Sombreros',  price: 55,  sizes: CAP_SIZES, image: PH },
  { id: 'a6', category: 'accesorios', subcategory: 'Joyería',    price: 35,  sizes: ACC_SIZES, image: PH },

  // ── Zapatos ─────────────────────────────────────────
  { id: 'z1', category: 'zapatos', subcategory: 'Zapatillas', price: 75,  sizes: SHOE_SIZES, image: PH },
  { id: 'z2', category: 'zapatos', subcategory: 'Botines',    price: 95,  sizes: SHOE_SIZES, image: PH },
  { id: 'z3', category: 'zapatos', subcategory: 'Sandalias',  price: 55,  sizes: SHOE_SIZES, image: PH },
  { id: 'z4', category: 'zapatos', subcategory: 'Mocasines',  price: 85,  sizes: SHOE_SIZES, image: PH },
  { id: 'z5', category: 'zapatos', subcategory: 'Botas',      price: 115, sizes: SHOE_SIZES, image: PH },
  { id: 'z6', category: 'zapatos', subcategory: 'Zapatillas', price: 60,  sizes: SHOE_SIZES, image: PH },
]
