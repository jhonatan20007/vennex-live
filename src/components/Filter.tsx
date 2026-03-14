import { useState, useEffect } from 'react'
import { getCategories } from '../api/fakestore'

interface FilterProps {
  value: string | null
  onChange: (category: string | null) => void
}

export function Filter({ value, onChange }: FilterProps) {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  return (
    <div>
      <label htmlFor="category-filter" className="sr-only">
        Filtrar por categoría
      </label>
      <select
        id="category-filter"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full sm:w-56 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-heading)] text-sm cursor-pointer transition-colors hover:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-opacity-40 focus:border-[var(--accent)]"
        aria-label="Filtrar por categoría"
      >
        <option value="">Todas las categorías</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  )
}
