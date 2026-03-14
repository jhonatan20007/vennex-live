import type { Product } from '../types/product'
import { ProductCard } from './ProductCard'

interface ProductListProps {
  products: Product[]
  loading: boolean
  error: string | null
  onAddToCart: (product: Product, size?: string) => void
}

export function ProductList({
  products,
  loading,
  error,
  onAddToCart,
}: ProductListProps) {
  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--text)]">Cargando productos...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <p className="text-[var(--error)] font-medium">Error al cargar</p>
        <p className="text-sm text-[var(--text)] mt-1 text-center">{error}</p>
      </div>
    )

  if (!products.length)
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <p className="text-[var(--text)]">No hay productos en esta categoría</p>
      </div>
    )

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 list-none p-0 m-0">
      {products.map((product) => (
        <li key={product.id} className="min-w-0">
          <ProductCard product={product} onAddToCart={onAddToCart} />
        </li>
      ))}
    </ul>
  )
}
