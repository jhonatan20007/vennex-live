import type { Product } from '../types/product'

const BASE_URL = 'https://fakestoreapi.com'

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`)
  if (!res.ok) throw new Error('Error al obtener productos')
  return res.json()
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`)
  if (!res.ok) throw new Error('Error al obtener productos por categoría')
  return res.json()
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/products/categories`)
  if (!res.ok) throw new Error('Error al obtener categorías')
  return res.json()
}
