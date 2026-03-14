export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

export interface CartItem extends Product {
  quantity: number
  size?: string
}

/** Categories that require a size selection before adding to cart */
export const SIZABLE_CATEGORIES = [
  "men's clothing",
  "women's clothing",
  "jewelery",
] as const

export const SIZES = ['S', 'M', 'L', 'XL'] as const
