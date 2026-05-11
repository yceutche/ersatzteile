import type { PageSize } from '../../types'
import { useSettingsStore } from '../../store/settingsStore'
import { t } from '../../utils/i18n'

const OPTIONS: PageSize[] = [10, 20, 50, 'all']

interface Props {
  value: PageSize
  onChange: (v: PageSize) => void
}

export function PageSizeSelector({ value, onChange }: Props) {
  const lang = useSettingsStore(s => s.language)

  return (
    <div className="flex items-center gap-2 px-4 text-xs text-text-secondary">
      <span>{t('show', lang)}:</span>
      <div className="flex gap-1">
        {OPTIONS.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-2.5 py-1 rounded-full font-semibold transition-colors
              ${value === opt ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'}`}
            aria-pressed={value === opt}
          >
            {opt === 'all' ? t('all', lang) : opt}
          </button>
        ))}
      </div>
    </div>
  )
}
