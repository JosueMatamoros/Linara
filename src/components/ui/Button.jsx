import { motion } from 'motion/react'

const VARIANTS = {
  primary:   'bg-charcoal text-surface hover:bg-charcoal-soft',
  outline:   'border border-charcoal text-charcoal hover:bg-charcoal hover:text-surface',
  ghost:     'text-charcoal hover:text-accent',
  accent:    'bg-accent text-surface hover:bg-accent-light',
}

const SIZES = {
  sm:  'px-5 py-2 text-[10px]',
  md:  'px-8 py-3 text-[10px]',
  lg:  'px-10 py-4 text-xs',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
      className={[
        'inline-flex items-center justify-center gap-2',
        'tracking-[0.18em] uppercase font-medium',
        'transition-colors duration-200 cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </motion.button>
  )
}
