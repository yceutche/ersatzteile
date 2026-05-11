import { Search, X } from 'lucide-react'
import { useRef } from 'react'
import { t } from '../../utils/i18n'
import { useSettingsStore } from '../../store/settingsStore'

interface Props {
  value: string
  onChange: (v: string) => void
}

export function SearchBar({ value, onChange }: Props) {
  const lang = useSettingsStore(s => s.language)
  const ref = useRef<HTMLInputElement>(null)

  return (
    <div className="relative mx-4">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={t('search_placeholder', lang)}
        className="w-full bg-gray-100 rounded-full pl-9 pr-9 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={t('search_placeholder', lang)}
        maxLength={200}
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button
          onClick={() => { onChange(''); ref.current?.focus() }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
