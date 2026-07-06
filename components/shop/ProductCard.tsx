import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, FlaskConical, ShoppingBag } from 'lucide-react'
import type { Product } from '@/lib/products/catalog'
import { formatPrice } from '@/lib/products/catalog'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const lowestPlan = [...product.plans].sort((a, b) => a.priceCents - b.priceCents)[0]

  return (
    <Link
      href={`/shop/${product.type}/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F6F3EE]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className={
              product.type === 'prescription'
                ? 'bg-[#0B1210]/80 text-white border-0 backdrop-blur-sm'
                : 'bg-white/80 text-foreground border-0 backdrop-blur-sm'
            }
          >
            {product.type === 'prescription' ? (
              <><FlaskConical className="h-3 w-3 mr-1" /> Rx</>
            ) : (
              <><ShoppingBag className="h-3 w-3 mr-1" /> OTC</>
            )}
          </Badge>
        </div>
        {/* Category badge */}
        {product.badge && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-[#E85A2B] text-white border-0 text-xs">
              {product.badge}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-foreground leading-tight">{product.name}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{product.description}</p>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-lg font-bold text-foreground">
              {formatPrice(lowestPlan?.priceCents ?? product.priceFromCents)}
              <span className="text-xs font-normal text-muted-foreground">/mo</span>
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E85A2B] text-white transition-transform duration-200 group-hover:scale-110">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  )
}
