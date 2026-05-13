import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('…')
    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (page < totalPages - 2) pages.push('…')
    pages.push(totalPages)
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center gap-1 mt-12 mb-4"
      aria-label="Paginación"
    >
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-warm-gray hover:border-charcoal hover:text-charcoal transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft size={14} strokeWidth={1.5} />
      </button>

      {pages.map((p, i) =>
        typeof p === 'string'
          ? (
            <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center text-warm-gray-light text-sm select-none">
              …
            </span>
          )
          : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={[
                'w-9 h-9 flex items-center justify-center rounded-full text-xs font-medium transition-all duration-200 cursor-pointer',
                p === page
                  ? 'bg-charcoal text-surface shadow-sm'
                  : 'text-warm-gray hover:text-charcoal border border-transparent hover:border-border',
              ].join(' ')}
            >
              {p}
            </button>
          )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-warm-gray hover:border-charcoal hover:text-charcoal transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronRight size={14} strokeWidth={1.5} />
      </button>
    </motion.nav>
  )
}
