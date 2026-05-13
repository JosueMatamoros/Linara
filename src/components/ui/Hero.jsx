import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

const BRANDS = ['TOMMY', 'ADIDAS', 'REEBOK', 'NAUTICA', 'SKECHERS', 'CROCS']
const TICKER  = [...BRANDS, ...BRANDS]

function BrandTicker() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="lg:hidden w-full overflow-hidden mt-10"
    >
      <div className="animate-ticker flex whitespace-nowrap">
        {TICKER.map((brand, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 text-[8px] tracking-[0.38em] text-warm-gray/35 uppercase px-5 shrink-0"
          >
            {brand}
            <span className="w-[3px] h-[3px] rounded-full bg-accent/30" />
          </span>
        ))}
      </div>
    </motion.div>
  )
}

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
    >
      <span className="text-[8px] tracking-[0.35em] text-warm-gray/40 uppercase">Scroll</span>
      <div className="w-5 h-8 rounded-full border border-warm-gray/30 flex justify-center pt-1.5">
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-0.5 h-1.5 rounded-full bg-warm-gray/50"
        />
      </div>
    </motion.div>
  )
}

const up = (delay = 0) => ({
  initial:     { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true },
  transition:  { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero() {
  return (
    <section
      className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-cream pt-[54px] md:pt-[72px]"
    >
      {/* Fondo sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_40%,#EDE0D033,transparent)] pointer-events-none" />

      {/* Glow pulsante — solo móvil */}
      <motion.div
        animate={{ opacity: [0.06, 0.14, 0.06] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        className="lg:hidden absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-accent blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-6 w-full py-12 lg:py-0">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Izquierda: brand + texto + CTA ── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

            <motion.div {...up(0)} className="mb-6">
              <img
                src="/logo-hero.webp"
                alt="Linara"
                width={731}
                height={568}
                className="w-52 md:w-72 lg:w-80 h-auto select-none"
              />
            </motion.div>

            <motion.p {...up(0.2)} className="text-base md:text-lg text-charcoal-soft font-light leading-relaxed mb-2 max-w-sm">
              Ropa y accesorios{' '}
              <span className="text-charcoal font-medium">100% originales</span>,
              traídos directamente desde Estados Unidos.
            </motion.p>

            <motion.p {...up(0.28)} className="text-sm text-warm-gray font-light mb-8 max-w-xs">
              Marcas que reconocés. Calidad que se nota.
            </motion.p>

            <motion.div {...up(0.38)} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                to="/accesorios"
                className="inline-flex items-center justify-center gap-2 bg-charcoal text-surface text-[10px] tracking-[0.22em] uppercase font-medium px-8 py-4 rounded-full hover:bg-charcoal-soft transition-colors duration-300 cursor-pointer group"
              >
                Explorar Colección
                <ArrowRight size={12} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/mujer"
                className="inline-flex items-center justify-center gap-2 border border-border text-charcoal text-[10px] tracking-[0.22em] uppercase font-medium px-8 py-4 rounded-full hover:border-charcoal transition-colors duration-300 cursor-pointer"
              >
                Ver Mujer
              </Link>
            </motion.div>
          </div>

          {/* ── Derecha: imagen (solo desktop) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block py-10"
          >
            <div className="h-[68vh] rounded-[2.5rem] overflow-hidden">
              <img
                src="/images/hero-flatlay.webp"
                alt="Colección Linara"
                className="w-full h-full object-cover object-top"
                width={1024}
                height={1536}
              />
            </div>
          </motion.div>
        </div>

        {/* Ticker de marcas — solo móvil, fuera del flex items-center */}
        <BrandTicker />

      </div>

      <ScrollIndicator />
    </section>
  )
}
