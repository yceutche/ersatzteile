import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { t } from '../../utils/i18n'
import { useSettingsStore } from '../../store/settingsStore'

interface Props {
  title: string
}

export function BackHeader({ title }: Props) {
  const navigate = useNavigate()
  const lang = useSettingsStore(s => s.language)

  return (
    <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
      <div className="max-w-2xl mx-auto flex items-center gap-2 px-2 h-14">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
          aria-label={t('back', lang)}
        >
          <ChevronLeft size={22} />
        </button>
        <span className="font-semibold text-base truncate flex-1">{title}</span>
      </div>
    </header>
  )
}
