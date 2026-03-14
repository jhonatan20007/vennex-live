import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import logo from './assets/Logo Vennex.png'
import { Filter } from './components/Filter'
import { ProductList } from './components/ProductList'
import { CartDrawer } from './components/CartDrawer'
import { useProducts } from './hooks/useProducts'
import type { Product } from './types/product'
import type { CartItem } from './types/product'

function App() {
  const [category, setCategory] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { products, loading, error } = useProducts(category)

  const handleAddToCart = (product: Product, size?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && (item.size ?? null) === (size ?? null)
      )
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && (item.size ?? null) === (size ?? null)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1, size }]
    })
  }

  const handleRemoveFromCart = (id: number, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === id && (item.size ?? null) === (size ?? null))
      )
    )
  }

  const handleUpdateSize = (
    id: number,
    currentSize: string | undefined,
    newSize: string
  ) => {
    setCart((prev) => {
      const currentKey = currentSize ?? null
      const item = prev.find(
        (i) => i.id === id && (i.size ?? null) === currentKey
      )
      if (!item) return prev
      const existingWithNewSize = prev.find(
        (i) => i.id === id && (i.size ?? null) === newSize
      )
      if (existingWithNewSize) {
        return prev
          .filter(
            (i) => !(i.id === id && (i.size ?? null) === currentKey)
          )
          .map((i) =>
            i.id === id && (i.size ?? null) === newSize
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
      }
      return prev.map((i) =>
        i.id === id && (i.size ?? null) === currentKey
          ? { ...i, size: newSize }
          : i
      )
    })
  }

  const handleSetQuantity = (id: number, quantity: number, size?: string) => {
    if (quantity < 1) {
      handleRemoveFromCart(id, size)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && (item.size ?? null) === (size ?? null)
          ? { ...item, quantity }
          : item
      )
    )
  }

  const handleUpdateQuantity = (id: number, delta: number, size?: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && (item.size ?? null) === (size ?? null)
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  return (
    <main className="flex-1 flex flex-col">
      <header className="sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-4 sm:px-6 sm:py-4 md:px-8 mb-4 bg-[var(--bg)]/95 backdrop-blur-sm border-b border-[var(--border)]">
        <div className="flex items-center justify-between gap-4">
          <img
            src={logo}
            alt="Vennex"
            className="h-32 w-auto object-contain"
          />
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-base font-medium bg-[var(--accent-soft)] text-[var(--text-heading)] hover:bg-[var(--accent)] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 cursor-pointer"
            aria-label="Ver carrito"
          >
            <ShoppingCart className="w-5 h-5" aria-hidden />
            {cart.reduce((sum, i) => sum + i.quantity, 0)}
          </button>
        </div>
        <div className="w-full sm:w-auto">
          <Filter value={category} onChange={setCategory} />
        </div>
      </header>

      <section className="flex-1 px-4 py-4 sm:px-6 sm:py-6 md:px-8">
        <ProductList
          products={products}
          loading={loading}
          error={error}
          onAddToCart={handleAddToCart}
        />
      </section>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onSetQuantity={handleSetQuantity}
        onUpdateSize={handleUpdateSize}
      />
    </main>
  )
}

export default App
