import { WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { t } from '../../utils/i18n'
import { useSettingsStore } from '../../store/settingsStore'

export function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine)
  const lang = useSettingsStore(s => s.language)

  useEffect(() => {
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  if (!offline) return null

  return (
    <div className="bg-yellow-500 text-white text-xs flex items-center gap-1 px-3 py-1" role="status">
      <WifiOff size={12} />
      <span>{t('offline', lang)}</span>
    </div>
  )
}
