import { useNavigate } from 'react-router-dom'
import { t } from '../../utils/i18n'
import { useSettingsStore } from '../../store/settingsStore'

interface Props {
  message: string
  ctaKey?: string
  ctaPath?: string
}

export function EmptyState({ message, ctaKey = 'wishlist_empty_cta', ctaPath = '/' }: Props) {
  const navigate = useNavigate()
  const lang = useSettingsStore(s => s.language)

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-text-secondary">
      <span className="text-5xl">🚜</span>
      <p className="text-base font-medium text-center px-8">{message}</p>
      <button
        onClick={() => navigate(ctaPath)}
        className="bg-primary text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-primary-dark transition-colors"
      >
        {t(ctaKey, lang)}
      </button>
    </div>
  )
}
