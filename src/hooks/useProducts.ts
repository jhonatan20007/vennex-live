import { useState, useEffect } from 'react'
import { getProducts, getProductsByCategory } from '../api/fakestore'
import type { Product } from '../types/product'

export function useProducts(category: string | null) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const fetchProducts = category
      ? () => getProductsByCategory(category)
      : () => getProducts()

    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error desconocido'))
      .finally(() => setLoading(false))
  }, [category])

  return { products, loading, error }
}
