import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Check, AlertTriangle, Minus, Trash2 } from 'lucide-react'
import type { Part, Category } from '../../types'
import { useWishlistStore } from '../../store/wishlistStore'
import { useSettingsStore } from '../../store/settingsStore'
import { t } from '../../utils/i18n'
import { sanitize } from '../../utils/sanitize'

interface Props {
  part: Part
  category: Category | undefined
}

const FALLBACK = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="28" fill="%23bdbdbd"%3E🔧%3C/text%3E%3C/svg%3E'

export function PartCard({ part, category }: Props) {
  const navigate = useNavigate()
  const lang = useSettingsStore(s => s.language)
  const { isInWishlist, addItem, removeItem, updateQty, updateNote, getItem } = useWishlistStore()
  const inList = isInWishlist(part.id)
  const wishlistItem = getItem(part.id)
  const [imgSrc, setImgSrc] = useState(part.images[0]?.url ?? FALLBACK)
  const [pendingQty, setPendingQty] = useState(part.defaultQty)

  return (
    <article
      className={`bg-surface rounded-lg shadow-sm flex flex-col gap-2 p-3 cursor-pointer transition-all
        ${inList ? 'border-l-4 border-success' : 'border-l-4 border-transparent'}`}
      onClick={() => navigate(`/part/${part.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/part/${part.id}`)}
      aria-label={`${part.nameDe} / ${part.nameFr}`}
    >
      <div className="flex gap-3">
      {/* Thumbnail */}
      <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={part.images[0]?.alt ?? `${part.nameDe} / ${part.nameFr}`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgSrc(FALLBACK)}
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-1">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-text-primary text-sm leading-snug truncate">
              {lang === 'de' ? part.nameDe : part.nameFr}
            </p>
            <p className="text-text-secondary text-xs leading-snug truncate">
              {lang === 'de' ? part.nameFr : part.nameDe}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {category && (
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: category.color }}
            >
              {lang === 'de' ? category.nameDe : category.nameFr}
            </span>
          )}
          <span className="text-[10px] text-text-secondary">{part.defaultQty}×</span>
          {/* Reason tooltip trigger */}
          <span
            className="relative group text-[10px] text-accent flex items-center gap-0.5 cursor-help"
            onClick={e => e.stopPropagation()}
            aria-label={lang === 'de' ? part.reasonDe : part.reasonFr}
          >
            <AlertTriangle size={10} />
            {/* Tooltip */}
            <span className="
              pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
              w-56 bg-gray-800 text-white text-[11px] leading-snug rounded-lg px-3 py-2 shadow-lg
              opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-150
              whitespace-normal
            ">
              {lang === 'de' ? part.reasonDe : part.reasonFr}
              {/* Arrow */}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
            </span>
          </span>
        </div>
      </div>

      {/* Qty controls + Add/Remove */}
      <div
        className="flex-shrink-0 self-center flex items-center gap-1"
        onClick={e => e.stopPropagation()}
      >
        {inList ? (
          /* Inline qty editor when already in wishlist */
          <>
            <button
              onClick={() => {
                const cur = wishlistItem?.qty ?? 1
                if (cur <= 1) removeItem(part.id)
                else updateQty(part.id, cur - 1)
              }}
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Decrease quantity"
            >
              {(wishlistItem?.qty ?? 1) <= 1 ? <Trash2 size={12} className="text-danger" /> : <Minus size={12} />}
            </button>
            <input
              type="number"
              value={wishlistItem?.qty ?? 1}
              min={1}
              max={999}
              onChange={e => {
                const v = parseInt(e.target.value, 10)
                if (!isNaN(v) && v >= 1 && v <= 999) updateQty(part.id, v)
              }}
              className="w-10 text-center text-sm font-semibold bg-gray-100 rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={t('quantity', lang)}
            />
            <button
              onClick={() => updateQty(part.id, (wishlistItem?.qty ?? 1) + 1)}
              className="w-7 h-7 rounded-full bg-success text-white flex items-center justify-center hover:opacity-90 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </>
        ) : (
          /* Qty picker + Add button when not yet in wishlist */
          <>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setPendingQty(q => Math.max(1, q - 1))}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={10} />
              </button>
              <input
                type="number"
                value={pendingQty}
                min={1}
                max={999}
                onChange={e => {
                  const v = parseInt(e.target.value, 10)
                  if (!isNaN(v) && v >= 1 && v <= 999) setPendingQty(v)
                }}
                className="w-9 text-center text-xs font-semibold bg-gray-100 rounded py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={t('quantity', lang)}
              />
              <button
                onClick={() => setPendingQty(q => Math.min(999, q + 1))}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={10} />
              </button>
            </div>
            <button
              onClick={() => addItem(part.id, pendingQty)}
              className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
              aria-label={t('add_to_wishlist', lang)}
            >
              <Check size={16} />
            </button>
          </>
        )}
      </div>
      </div>
      {/* Comment input — only when in wishlist */}
      {inList && (
        <div onClick={e => e.stopPropagation()}>
          <input
            type="text"
            value={wishlistItem?.note ?? ''}
            maxLength={200}
            placeholder={t('comment_placeholder', lang)}
            onChange={e => updateNote(part.id, sanitize(e.target.value))}
            className="w-full text-xs text-text-primary bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-text-secondary"
            aria-label={t('comment', lang)}
          />
        </div>
      )}
    </article>
  )
}
