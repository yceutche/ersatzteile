import { useState, useMemo, useCallback, useRef } from 'react'
import type { Part, Category, PageSize } from '../../types'
import catalogData from '../../data/parts.json'
import { Header } from '../shared/Header'
import { OfflineBanner } from '../shared/OfflineBanner'
import { SearchBar } from './SearchBar'
import { CategoryChips } from './CategoryChips'
import { PageSizeSelector } from './PageSizeSelector'
import { PartCard } from './PartCard'
import { useSettingsStore } from '../../store/settingsStore'
import { t } from '../../utils/i18n'

const parts = catalogData.parts as Part[]
const categories = catalogData.categories as Category[]
const catMap = Object.fromEntries(categories.map(c => [c.id, c]))

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const set = useCallback((v: T) => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setDebounced(v), delay)
  }, [delay])
  // trigger when value changes
  useMemo(() => { set(value) }, [value, set]) // eslint-disable-line react-hooks/exhaustive-deps
  return debounced
}

export function CatalogScreen() {
  const lang = useSettingsStore(s => s.language)
  const defaultPageSize = useSettingsStore(s => s.pageSize)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [pageSize, setPageSize] = useState<PageSize>(defaultPageSize)
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebounce(search)

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase()
    return parts.filter(p => {
      const matchCat = category === 'all' || p.category === category
      const matchQ = !q || p.nameDe.toLowerCase().includes(q) || p.nameFr.toLowerCase().includes(q) || p.tags.some(tg => tg.toLowerCase().includes(q))
      return matchCat && matchQ
    })
  }, [debouncedSearch, category])

  const pageCount = pageSize === 'all' ? 1 : Math.ceil(filtered.length / (pageSize as number))
  const safePage = Math.min(page, Math.max(1, pageCount))
  const paged = pageSize === 'all' ? filtered : filtered.slice((safePage - 1) * (pageSize as number), safePage * (pageSize as number))

  const handleCategoryChange = (id: string) => { setCategory(id); setPage(1) }
  const handleSearch = (v: string) => { setSearch(v); setPage(1) }
  const handlePageSize = (v: PageSize) => { setPageSize(v); setPage(1) }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Header />
      <OfflineBanner />
      <main className="flex-1 pb-20 max-w-2xl w-full mx-auto">
        <div className="py-3 flex flex-col gap-3">
          <SearchBar value={search} onChange={handleSearch} />
          <CategoryChips selected={category} onChange={handleCategoryChange} />
          <PageSizeSelector value={pageSize} onChange={handlePageSize} />
        </div>

        {paged.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-20 text-text-secondary">
            <span className="text-4xl">🔍</span>
            <p className="font-medium">{t('no_results', lang)}</p>
            <p className="text-sm">{t('no_results_hint', lang)}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 px-4">
            {paged.map(part => (
              <PartCard key={part.id} part={part} category={catMap[part.category]} />
            ))}
          </div>
        )}

        {pageSize !== 'all' && pageCount > 1 && (
          <div className="flex items-center justify-center gap-4 py-6 text-sm text-text-secondary">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-4 py-2 rounded-full bg-gray-100 disabled:opacity-40 hover:bg-gray-200 transition-colors"
            >
              {t('prev', lang)}
            </button>
            <span>{t('page', lang)} {safePage} {t('of', lang)} {pageCount}</span>
            <button
              onClick={() => setPage(p => Math.min(pageCount, p + 1))}
              disabled={safePage === pageCount}
              className="px-4 py-2 rounded-full bg-gray-100 disabled:opacity-40 hover:bg-gray-200 transition-colors"
            >
              {t('next', lang)}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
