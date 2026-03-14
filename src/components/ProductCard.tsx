import { useState } from 'react'
import type { Product } from '../types/product'
import { SIZABLE_CATEGORIES, SIZES } from '../types/product'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, size?: string) => void
}

function needsSize(category: string): boolean {
  return SIZABLE_CATEGORIES.includes(category.toLowerCase() as (typeof SIZABLE_CATEGORIES)[number])
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const requiresSize = needsSize(product.category)

  const handleAdd = () => {
    if (requiresSize && !selectedSize) return
    onAddToCart(product, requiresSize ? selectedSize ?? undefined : undefined)
    setSelectedSize(null)
  }

  return (
    <article className="flex flex-col h-full bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden transition-all duration-200 hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/10">
      <div className="relative pt-[100%] bg-[var(--bg)]">
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-contain p-4"
        />
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="text-sm font-medium text-[var(--text-heading)] leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {requiresSize && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-[var(--text)]">Talla</span>
            <div className="flex gap-1.5 flex-wrap">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-1 ${
                    selectedSize === size
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text-heading)] hover:border-[var(--accent)]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2">
          <p className="text-lg font-semibold text-[var(--text-heading)]">
            ${product.price.toFixed(2)}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            disabled={requiresSize && !selectedSize}
            className="shrink-0 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--accent)] text-white transition-colors hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-card)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--accent)]"
          >
            Añadir
          </button>
        </div>
      </div>
    </article>
  )
}
