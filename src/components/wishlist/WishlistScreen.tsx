import { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { Part, Category } from '../../types'
import { useWishlistStore } from '../../store/wishlistStore'
import { useSettingsStore } from '../../store/settingsStore'
import { t } from '../../utils/i18n'
import { Header } from '../shared/Header'
import { OfflineBanner } from '../shared/OfflineBanner'
import { EmptyState } from '../shared/EmptyState'
import catalogData from '../../data/parts.json'

const parts = catalogData.parts as Part[]
const categories = catalogData.categories as Category[]

export function WishlistScreen() {
  const lang = useSettingsStore(s => s.language)
  const { items, removeItem, updateQty, updateNote, clearAll } = useWishlistStore()
  const [confirmClear, setConfirmClear] = useState(false)

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-bg">
        <Header />
        <OfflineBanner />
        <main className="flex-1 pb-20 max-w-2xl w-full mx-auto">
          <EmptyState message={t('wishlist_empty', lang)} />
        </main>
      </div>
    )
  }

  // Group by category
  const grouped = categories
    .map(cat => {
      const catItems = items.filter(item => {
        const part = parts.find(p => p.id === item.partId)
        return part?.category === cat.id
      })
      return { cat, catItems }
    })
    .filter(g => g.catItems.length > 0)

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Header />
      <OfflineBanner />
      <main className="flex-1 pb-20 max-w-2xl w-full mx-auto">
        <div className="px-4 pt-4 flex items-center justify-between">
          <h2 className="font-bold text-text-primary text-base">
            {t('wishlist_title', lang)} ({items.length})
          </h2>
          <button
            onClick={() => setConfirmClear(true)}
            className="text-danger text-sm flex items-center gap-1 hover:opacity-80"
          >
            <Trash2 size={14} />
            {t('clear_all', lang)}
          </button>
        </div>

        {/* Confirm dialog */}
        {confirmClear && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-xl">
              <p className="text-sm text-text-primary mb-4">{t('clear_confirm', lang)}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="flex-1 py-2 rounded-full border border-gray-200 text-sm font-semibold text-text-secondary hover:bg-gray-50"
                >
                  {t('cancel', lang)}
                </button>
                <button
                  onClick={() => { clearAll(); setConfirmClear(false) }}
                  className="flex-1 py-2 rounded-full bg-danger text-white text-sm font-semibold hover:opacity-90"
                >
                  {t('confirm', lang)}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1 px-4 pt-2 pb-4">
          {grouped.map(({ cat, catItems }) => (
            <div key={cat.id}>
              <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary py-2">
                {lang === 'de' ? cat.nameDe : cat.nameFr} ({catItems.length})
              </h3>
              <div className="flex flex-col gap-2">
                {catItems.map(item => {
                  const part = parts.find(p => p.id === item.partId)
                  if (!part) return null
                  return (
                    <div key={item.partId} className="bg-surface rounded-lg shadow-sm flex flex-col gap-2 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {lang === 'de' ? part.nameDe : part.nameFr}
                          </p>
                          <p className="text-xs text-text-secondary truncate">
                            {lang === 'de' ? part.nameFr : part.nameDe}
                          </p>
                        </div>
                        {/* Qty controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQty(item.partId, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-40 hover:bg-gray-200 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <input
                            type="number"
                            value={item.qty}
                            min={1}
                            max={999}
                            onChange={e => {
                              const v = parseInt(e.target.value, 10)
                            if (!isNaN(v) && v >= 1 && v <= 999) updateQty(item.partId, v)
                          }}
                          className="w-12 text-center text-sm font-semibold bg-gray-100 rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                          aria-label="Quantity"
                        />
                        <button
                          onClick={() => updateQty(item.partId, item.qty + 1)}
                          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.partId)}
                        className="text-danger hover:opacity-80 p-1"
                        aria-label={`Remove ${part.nameDe}`}
                      >
                        <Trash2 size={16} />
                      </button>
                      </div>
                      {/* Comment input */}
                      <input
                        type="text"
                        value={item.note ?? ''}
                        maxLength={200}
                        placeholder={t('comment_placeholder', lang)}
                        onChange={e => updateNote(item.partId, e.target.value)}
                        className="w-full text-xs text-text-primary bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-text-secondary"
                        aria-label={t('comment', lang)}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <p className="text-sm text-text-secondary text-center pt-4">
            {t('total_items', lang)}: <strong>{items.reduce((s, i) => s + i.qty, 0)}</strong>
          </p>
        </div>
      </main>
    </div>
  )
}
