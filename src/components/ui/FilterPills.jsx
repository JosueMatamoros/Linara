export default function FilterPills({ filters, active, onChange }) {
  return (
    <div
      className="flex items-center gap-2.5 overflow-x-auto pb-1"
      style={{ scrollbarWidth: 'none' }}
    >
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={[
            'flex-shrink-0 px-5 py-3 text-sm font-medium rounded-full',
            'transition-all duration-200 cursor-pointer whitespace-nowrap',
            active === filter
              ? 'bg-charcoal text-surface'
              : 'bg-pill text-charcoal-soft hover:bg-pill-hover',
          ].join(' ')}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
