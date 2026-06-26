import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PhotoSplitProps {
  imageSrc: string
  imageAlt: string
  eyebrow?: string
  title: string
  quote: string
  items: { title: string; description: string }[]
  imagePosition?: 'left' | 'right'
  className?: string
}

export function PhotoSplit({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  quote,
  items,
  imagePosition = 'left',
  className,
}: PhotoSplitProps) {
  const imageBlock = (
    <div className="relative min-h-[320px] overflow-hidden rounded-2xl lg:min-h-[480px]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="photo-overlay absolute inset-0" aria-hidden />
    </div>
  )

  const contentBlock = (
    <div className="flex flex-col justify-center py-4 lg:py-8">
      {eyebrow && (
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sage">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl text-balance">
        {title}
      </h2>
      <blockquote className="mt-6 border-l-2 border-coral pl-4 font-display text-xl italic leading-snug text-foreground">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <ul className="mt-8 space-y-5">
        {items.map((item) => (
          <li key={item.title}>
            <h3 className="font-semibold text-foreground">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div
      className={cn(
        'grid items-center gap-10 lg:grid-cols-2 lg:gap-16',
        className
      )}
    >
      {imagePosition === 'left' ? (
        <>
          {imageBlock}
          {contentBlock}
        </>
      ) : (
        <>
          {contentBlock}
          {imageBlock}
        </>
      )}
    </div>
  )
}
