import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Check, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import type { Part, Category } from '../../types'
import catalogData from '../../data/parts.json'
import { BackHeader } from '../shared/BackHeader'
import { OfflineBanner } from '../shared/OfflineBanner'
import { useWishlistStore } from '../../store/wishlistStore'
import { useSettingsStore } from '../../store/settingsStore'
import { t } from '../../utils/i18n'

const parts = catalogData.parts as Part[]
const categories = catalogData.categories as Category[]

const FALLBACK = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="64" fill="%23bdbdbd"%3E🔧%3C/text%3E%3C/svg%3E'

export function PartDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const lang = useSettingsStore(s => s.language)
  const { isInWishlist, addItem, removeItem } = useWishlistStore()

  const part = parts.find(p => p.id === id)
  const [imgIndex, setImgIndex] = useState(0)
  const [imgSrc, setImgSrc] = useState(part?.images[0]?.url ?? FALLBACK)
  const [reasonOpen, setReasonOpen] = useState(false)
  const [qty, setQty] = useState(part?.defaultQty ?? 1)

  if (!part) {
    return (
      <div className="flex flex-col min-h-screen bg-bg">
        <BackHeader title="Not found" />
        <div className="flex-1 flex items-center justify-center text-text-secondary">Part not found</div>
      </div>
    )
  }

  const category = categories.find(c => c.id === part.category)
  const inList = isInWishlist(part.id)

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <BackHeader title={lang === 'de' ? part.nameDe : part.nameFr} />
      <OfflineBanner />
      <main className="flex-1 pb-24 max-w-2xl w-full mx-auto">
        {/* Image gallery */}
        <div className="relative bg-gray-100 aspect-video overflow-hidden">
          <Zoom>
            <img
              src={imgSrc}
              alt={part.images[imgIndex]?.alt ?? `${part.nameDe} / ${part.nameFr}`}
              className="w-full h-full object-cover"
              onError={() => setImgSrc(FALLBACK)}
            />
          </Zoom>
          {part.images[imgIndex]?.credit && (
            <span className="absolute bottom-1 right-2 text-[10px] text-white/70">{part.images[imgIndex].credit}</span>
          )}
        </div>

        {/* Dot indicators */}
        {part.images.length > 1 && (
          <div className="flex justify-center gap-1.5 py-2">
            {part.images.map((_, i) => (
              <button
                key={i}
                onClick={() => { setImgIndex(i); setImgSrc(part.images[i].url) }}
                className={`w-2 h-2 rounded-full transition-colors ${i === imgIndex ? 'bg-primary' : 'bg-gray-300'}`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Names & meta */}
        <div className="px-4 pt-3 pb-2">
          <h1 className="text-lg font-bold text-text-primary leading-snug">{part.nameDe}</h1>
          <p className="text-sm text-text-secondary leading-snug">{part.nameFr}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {category && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: category.color }}
              >
                {lang === 'de' ? category.nameDe : category.nameFr}
              </span>
            )}
            <span className="text-sm text-text-secondary">{t('quantity', lang)}: <strong>{part.defaultQty}×</strong></span>
            {part.critical && (
              <span className="flex items-center gap-1 text-xs text-accent font-medium">
                <AlertTriangle size={12} />
                {t('critical_badge', lang)}
              </span>
            )}
          </div>
        </div>

        {/* Why needed section */}
        <div className="mx-4 rounded-lg bg-surface shadow-sm overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-text-primary"
            onClick={() => setReasonOpen(o => !o)}
            aria-expanded={reasonOpen}
          >
            <span>{t('why_needed', lang)}</span>
            {reasonOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {reasonOpen && (
            <div className="px-4 pb-4 text-sm text-text-secondary flex flex-col gap-2 border-t border-gray-100">
              <p className="pt-2"><strong>DE:</strong> {part.reasonDe}</p>
              <p><strong>FR:</strong> {part.reasonFr}</p>
            </div>
          )}
        </div>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-40 px-4 pb-2 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          {!inList && (
            <div className="flex items-center gap-1 bg-white rounded-full shadow px-2 py-1">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Decrease quantity"
              >
                <span className="text-base leading-none font-bold text-text-primary">−</span>
              </button>
              <input
                type="number"
                value={qty}
                min={1}
                max={999}
                onChange={e => {
                  const v = parseInt(e.target.value, 10)
                  if (!isNaN(v) && v >= 1 && v <= 999) setQty(v)
                }}
                className="w-12 text-center text-sm font-semibold bg-transparent focus:outline-none focus:ring-2 focus:ring-primary rounded"
                aria-label={t('quantity', lang)}
              />
              <button
                onClick={() => setQty(q => Math.min(999, q + 1))}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Increase quantity"
              >
                <span className="text-base leading-none font-bold text-text-primary">+</span>
              </button>
            </div>
          )}
          <button
            onClick={() => inList ? removeItem(part.id) : addItem(part.id, qty)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm transition-colors shadow-lg
              ${inList ? 'bg-success text-white hover:bg-green-800' : 'bg-primary text-white hover:bg-primary-dark'}`}
            aria-pressed={inList}
          >
            {inList ? <Check size={18} /> : <Plus size={18} />}
            {inList ? t('in_wishlist', lang) : t('add_to_wishlist', lang)}
          </button>
        </div>
      </div>
    </div>
  )
}
