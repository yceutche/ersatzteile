import { useSettingsStore } from '../../store/settingsStore'
import { t } from '../../utils/i18n'

export function Header() {
  const lang = useSettingsStore(s => s.language)
  const setLanguage = useSettingsStore(s => s.setLanguage)

  return (
    <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
        <span className="font-bold text-base tracking-tight">{t('app_title', lang)}</span>
        <div className="flex gap-1">
          {(['de', 'fr'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`text-xs font-semibold px-2 py-1 rounded transition-colors
                ${lang === l ? 'bg-white text-primary' : 'text-white/70 hover:text-white'}`}
              aria-label={l === 'de' ? 'Deutsch' : 'Français'}
              aria-pressed={lang === l}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
