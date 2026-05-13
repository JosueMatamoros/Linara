export default function FilterPills({ filters, active, onChange }) {
  return (
    <div className="relative">
      {/* Scrollable track */}
      <div
        className="flex items-center gap-2.5 overflow-x-auto pb-1 pr-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onChange(filter)}
            className={[
              'flex-shrink-0 px-5 py-3 text-sm font-medium rounded-full',
              'transition-all duration-200 cursor-pointer whitespace-nowrap',
              active === filter
                ? 'bg-charcoal text-surface shadow-sm'
                : 'bg-pill text-charcoal-soft hover:bg-pill-hover',
            ].join(' ')}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Right fade — indica más contenido */}
      <div
        className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, transparent, var(--color-cream) 80%)',
        }}
      />
    </div>
  )
}
