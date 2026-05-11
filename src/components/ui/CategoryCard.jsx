import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

const MotionLink = motion.create(Link)

export default function CategoryCard({ title, description, image, to, index = 0 }) {
  return (
    <MotionLink
      to={to}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-60px' }}
      className="group relative block overflow-hidden rounded-2xl cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-border rounded-2xl">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          width={600}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-charcoal/10 to-transparent" />
      </div>

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-surface">
        <p className="text-[9px] tracking-[0.25em] uppercase text-surface/60 mb-1.5 font-medium">
          LA COLECCIÓN
        </p>
        <h3 className="font-serif text-[1.6rem] font-light leading-tight mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-[11px] text-surface/65 mb-4 font-light leading-relaxed">
            {description}
          </p>
        )}
        <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.18em] uppercase text-surface/75 group-hover:text-surface transition-colors duration-200">
          VER COLECCIÓN
          <ArrowRight
            size={11}
            strokeWidth={1.5}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </span>
      </div>
    </MotionLink>
  )
}
