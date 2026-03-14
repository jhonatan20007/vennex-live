import { useState } from 'react'
import type { CartItem } from '../types/product'
import { SIZABLE_CATEGORIES, SIZES } from '../types/product'

function QuantityInput({
  quantity,
  onSetQuantity,
  onIncrement,
  onDecrement,
  disabledDecrement,
}: {
  quantity: number
  onSetQuantity: (q: number) => void
  onIncrement: () => void
  onDecrement: () => void
  disabledDecrement: boolean
}) {
  const [localValue, setLocalValue] = useState<string | null>(null)
  const isEditing = localValue !== null
  const displayValue = isEditing ? localValue : String(quantity)

  const commit = (raw: string) => {
    const val = parseInt(raw, 10)
    if (Number.isNaN(val) || val < 1) {
      onSetQuantity(1)
    } else {
      onSetQuantity(val)
    }
    setLocalValue(null)
  }

  return (
    <div className="flex items-center rounded-lg border border-[var(--border)] overflow-hidden">
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabledDecrement}
        className="w-8 h-8 flex items-center justify-center hover:bg-[var(--accent-soft)] text-[var(--text-heading)] disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={displayValue}
        onFocus={() => setLocalValue(String(quantity))}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, '')
          setLocalValue(v === '' ? '' : v)
        }}
        onBlur={(e) => commit(e.target.value || '1')}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur()
          }
        }}
        className="w-10 h-8 text-center text-sm font-medium text-[var(--text-heading)] bg-white border-0 border-x border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] [appearance:textfield]"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={onIncrement}
        className="w-8 h-8 flex items-center justify-center hover:bg-[var(--accent-soft)] text-[var(--text-heading)]"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onRemove: (id: number, size?: string) => void
  onUpdateQuantity: (id: number, delta: number, size?: string) => void
  onSetQuantity: (id: number, quantity: number, size?: string) => void
  onUpdateSize: (id: number, currentSize: string | undefined, newSize: string) => void
}

function canEditSize(item: CartItem): boolean {
  return SIZABLE_CATEGORIES.includes(
    item.category.toLowerCase() as (typeof SIZABLE_CATEGORIES)[number]
  )
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemove,
  onUpdateQuantity,
  onSetQuantity,
  onUpdateSize,
}: CartDrawerProps) {
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handlePagar = () => {
    // Aquí iría la lógica de pasarela de pago
    alert('¡Gracias! Redirigiendo a pasarela de pago...')
  }

  return (
    <>
      {/* Overlay */}
      <div
        role="presentation"
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[var(--bg-card)] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 id="cart-title" className="text-lg font-medium text-[var(--text-heading)]">
            Carrito ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--bg)] text-[var(--text)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-center text-[var(--text)] py-8">
              Tu carrito está vacío
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.id}-${item.size ?? 'default'}`}
                  className="flex gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-contain rounded-lg bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[var(--text-heading)] line-clamp-2">
                      {item.title}
                    </h3>
                    {canEditSize(item) && (
                      <div className="mt-1.5">
                        <span className="text-xs text-[var(--text)]">Size </span>
                        <div className="flex gap-1 mt-1">
                          {SIZES.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() =>
                                (item.size ?? null) !== size &&
                                onUpdateSize(item.id, item.size, size)
                              }
                              className={`min-w-[28px] h-7 px-1.5 rounded text-xs font-medium border transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--accent)] ${
                                (item.size ?? 'M') === size
                                  ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                                  : 'bg-white border-[var(--border)] text-[var(--text-heading)] hover:border-[var(--accent)]'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-sm font-semibold text-[var(--text-heading)] mt-0.5">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <QuantityInput
                        quantity={item.quantity}
                        onSetQuantity={(q) => onSetQuantity(item.id, q, item.size)}
                        onIncrement={() => onUpdateQuantity(item.id, 1, item.size)}
                        onDecrement={() => onUpdateQuantity(item.id, -1, item.size)}
                        disabledDecrement={item.quantity <= 1}
                      />
                      <button
                        type="button"
                        onClick={() => onRemove(item.id, item.size)}
                        className="text-xs text-[var(--error)] hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer - Total y Pagar */}
        {items.length > 0 && (
          <div className="p-4 border-t border-[var(--border)] space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text)]">Cantidad total</span>
              <span className="font-medium text-[var(--text-heading)]">
                {totalItems} {totalItems === 1 ? 'unidad' : 'unidades'}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span className="text-[var(--text-heading)]">Total a pagar</span>
              <span className="text-[var(--text-heading)]">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              type="button"
              onClick={handlePagar}
              className="w-full py-3 rounded-xl font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            >
              Pagar
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
