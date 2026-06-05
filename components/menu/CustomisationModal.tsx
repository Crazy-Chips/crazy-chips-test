'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Minus, Plus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import type { MenuItem, Extra } from '@/types'
import { toast } from 'sonner'

interface Props {
  item: MenuItem
  open: boolean
  onClose: () => void
}

export default function CustomisationModal({ item, open, onClose }: Props) {
  const addItem = useCart((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([])
  const [specialInstructions, setSpecialInstructions] = useState('')

  const extras: Extra[] = Array.isArray(item.extras) ? (item.extras as Extra[]) : []

  const toggleExtra = (extra: Extra) => {
    setSelectedExtras((prev) =>
      prev.find((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    )
  }

  const extrasTotal = selectedExtras.reduce((s, e) => s + e.price, 0)
  const unitTotal = item.price + extrasTotal
  const lineTotal = unitTotal * quantity

  const handleAdd = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      extras: selectedExtras,
      specialInstructions: specialInstructions || undefined,
      imageUrl: item.imageUrl ?? undefined,
    })
    toast.success(`${item.name} added to cart!`)
    onClose()
    setQuantity(1)
    setSelectedExtras([])
    setSpecialInstructions('')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">
        <DialogTitle className="sr-only">Customise {item.name}</DialogTitle>

        {/* Image */}
        {item.imageUrl && (
          <div className="relative h-52 w-full">
            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="p-6">
          <h2 className="text-xl font-black text-[#0A0A0A] mb-1" style={{ fontFamily: 'var(--font-lilita)' }}>
            {item.name}
          </h2>
          <p className="text-gray-500 text-sm mb-5 leading-relaxed">{item.description}</p>

          {/* Extras */}
          {extras.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wider mb-3">
                Add Extras
              </h3>
              <div className="space-y-2">
                {extras.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-[#E3000F]/50 transition-colors has-[:checked]:border-[#E3000F] has-[:checked]:bg-[#E3000F]/5"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!selectedExtras.find((e) => e.id === extra.id)}
                        onChange={() => toggleExtra(extra)}
                        className="accent-[#E3000F]"
                      />
                      <span className="text-sm text-[#0A0A0A]">{extra.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#E3000F]">
                      +£{extra.price.toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Special instructions */}
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-[#0A0A0A] uppercase tracking-wider mb-2">
              Special Instructions
            </h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any allergies or special requests..."
              className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:border-[#E3000F] transition-colors"
              rows={2}
            />
          </div>

          {/* Quantity + Add */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 flex items-center justify-center hover:text-[#E3000F] transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="font-bold text-[#0A0A0A] w-5 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 flex items-center justify-center hover:text-[#E3000F] transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex-1 bg-[#E3000F] hover:bg-red-700 text-white font-bold py-3 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              Add to Cart — £{lineTotal.toFixed(2)}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
