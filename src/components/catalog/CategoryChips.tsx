import type { Category } from '../../types'
import { useSettingsStore } from '../../store/settingsStore'
import { t } from '../../utils/i18n'
import catalogData from '../../data/parts.json'

interface Props {
  selected: string
  onChange: (id: string) => void
}

export function CategoryChips({ selected, onChange }: Props) {
  const lang = useSettingsStore(s => s.language)
  const categories = catalogData.categories as Category[]

  const counts = Object.fromEntries(
    categories.map(c => [c.id, catalogData.parts.filter(p => p.category === c.id).length])
  )

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 px-4 scrollbar-none" role="tablist" aria-label="Filter by category">
      <button
        role="tab"
        aria-selected={selected === 'all'}
        onClick={() => onChange('all')}
        className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors
          ${selected === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'}`}
      >
        {t('all_categories', lang)} ({catalogData.parts.length})
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          role="tab"
          aria-selected={selected === cat.id}
          onClick={() => onChange(cat.id)}
          className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors
            ${selected === cat.id ? 'text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'}`}
          style={selected === cat.id ? { backgroundColor: cat.color } : undefined}
        >
          {lang === 'de' ? cat.nameDe : cat.nameFr} ({counts[cat.id] ?? 0})
        </button>
      ))}
    </div>
  )
}
