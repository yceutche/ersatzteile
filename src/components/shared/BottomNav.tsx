import { useNavigate, useLocation } from 'react-router-dom'
import { List, Heart, Share2, Settings } from 'lucide-react'
import { t } from '../../utils/i18n'
import { useSettingsStore } from '../../store/settingsStore'
import { useWishlistStore } from '../../store/wishlistStore'

const navItems = [
  { path: '/', icon: List, key: 'nav_catalog' },
  { path: '/wishlist', icon: Heart, key: 'nav_wishlist' },
  { path: '/export', icon: Share2, key: 'nav_export' },
  { path: '/settings', icon: Settings, key: 'nav_settings' },
] as const

export function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const lang = useSettingsStore(s => s.language)
  const count = useWishlistStore(s => s.items.length)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex max-w-2xl mx-auto" aria-label="Main navigation">
      {navItems.map(({ path, icon: Icon, key }) => {
        const active = pathname === path || (path !== '/' && pathname.startsWith(path))
        const isWishlist = key === 'nav_wishlist'
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors
              ${active ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}
            aria-label={t(key, lang)}
            aria-current={active ? 'page' : undefined}
          >
            <span className="relative">
              <Icon size={22} />
              {isWishlist && count > 0 && (
                <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </span>
            <span>{t(key, lang)}</span>
          </button>
        )
      })}
    </nav>
  )
}
