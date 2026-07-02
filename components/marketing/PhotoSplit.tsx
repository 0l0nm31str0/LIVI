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
  variant?: 'light' | 'deep'
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
  variant = 'light',
  className,
}: PhotoSplitProps) {
  const deep = variant === 'deep'

  const imageBlock = (
    <div
      className={cn(
        'relative min-h-[320px] overflow-hidden rounded-2xl lg:min-h-[480px]',
        deep && 'deep-card'
      )}
    >
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
        <p
          className={cn(
            'mb-3 text-sm font-medium',
            deep ? 'text-current-bright' : 'text-sage'
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'font-display text-3xl font-semibold tracking-tight md:text-4xl text-balance',
          deep ? 'text-on-deep' : 'text-foreground'
        )}
      >
        {title}
      </h2>
      <blockquote className="relative mt-8 pl-9">
        <span
          className={cn(
            'absolute -top-3 left-0 font-display text-6xl leading-none',
            deep ? 'text-ember' : 'text-coral'
          )}
          aria-hidden
        >
          &ldquo;
        </span>
        <p
          className={cn(
            'font-display text-xl font-medium leading-snug',
            deep ? 'text-on-deep' : 'text-foreground'
          )}
        >
          {quote}&rdquo;
        </p>
      </blockquote>
      <ul className="mt-8 space-y-5">
        {items.map((item) => (
          <li key={item.title}>
            <h3 className={cn('font-semibold', deep ? 'text-on-deep' : 'text-foreground')}>
              {item.title}
            </h3>
            <p
              className={cn(
                'mt-1 text-sm leading-relaxed',
                deep ? 'text-on-deep-muted' : 'text-muted-foreground'
              )}
            >
              {item.description}
            </p>
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
