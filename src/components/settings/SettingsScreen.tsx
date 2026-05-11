import { useState } from 'react'
import type { PageSize } from '../../types'
import { useSettingsStore } from '../../store/settingsStore'
import { useWishlistStore } from '../../store/wishlistStore'
import { t } from '../../utils/i18n'
import { Header } from '../shared/Header'
import { OfflineBanner } from '../shared/OfflineBanner'

const PAGE_SIZES: PageSize[] = [10, 20, 50, 'all']

export function SettingsScreen() {
  const lang = useSettingsStore(s => s.language)
  const pageSize = useSettingsStore(s => s.pageSize)
  const tractor = useSettingsStore(s => s.tractor)
  const setPageSize = useSettingsStore(s => s.setPageSize)
  const setTractorField = useSettingsStore(s => s.setTractorField)
  const clearAll = useWishlistStore(s => s.clearAll)
  const [confirmReset, setConfirmReset] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Header />
      <OfflineBanner />
      <main className="flex-1 pb-20 max-w-2xl w-full mx-auto px-4 pt-4">
        <h2 className="font-bold text-text-primary text-base mb-4">{t('settings_title', lang)}</h2>

        {/* Page size */}
        <Section title={t('settings_page_size', lang)}>
          <div className="flex gap-2 flex-wrap">
            {PAGE_SIZES.map(s => (
              <button
                key={s}
                onClick={() => setPageSize(s)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors
                  ${pageSize === s ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'}`}
                aria-pressed={pageSize === s}
              >
                {s === 'all' ? t('all', lang) : s}
              </button>
            ))}
          </div>
        </Section>

        {/* Tractor data */}
        <Section title={t('settings_tractor', lang)}>
          <div className="flex flex-col gap-3">
            {([
              ['model', 'settings_model'],
              ['engineNumber', 'settings_engine_nr'],
              ['chassisNumber', 'settings_chassis_nr'],
              ['tyreRear', 'settings_tyre_rear'],
              ['tyreFront', 'settings_tyre_front'],
            ] as const).map(([field, labelKey]) => (
              <label key={field} className="flex flex-col gap-1">
                <span className="text-xs font-medium text-text-secondary">{t(labelKey, lang)}</span>
                <input
                  type="text"
                  value={tractor[field]}
                  onChange={e => setTractorField(field, e.target.value)}
                  maxLength={100}
                  className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>
            ))}
          </div>
        </Section>

        {/* Reset wishlist */}
        <Section title={t('settings_reset', lang)}>
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-2 text-danger text-sm font-semibold hover:opacity-80"
          >
            {t('settings_reset_btn', lang)}
          </button>
        </Section>

        {/* About */}
        <Section title={t('settings_about', lang)}>
          <p className="text-sm text-text-secondary">Version 1.0.0 — MF 1014 Ersatzteile</p>
          <button
            onClick={() => setPrivacyOpen(o => !o)}
            className="text-sm text-primary underline mt-1"
          >
            {t('settings_privacy', lang)}
          </button>
          {privacyOpen && (
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              {t('settings_privacy_text', lang)}
            </p>
          )}
        </Section>

        {/* Confirm reset dialog */}
        {confirmReset && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-xl">
              <p className="text-sm text-text-primary mb-4">{t('clear_confirm', lang)}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-2 rounded-full border border-gray-200 text-sm font-semibold text-text-secondary hover:bg-gray-50"
                >
                  {t('cancel', lang)}
                </button>
                <button
                  onClick={() => { clearAll(); setConfirmReset(false) }}
                  className="flex-1 py-2 rounded-full bg-danger text-white text-sm font-semibold hover:opacity-90"
                >
                  {t('confirm', lang)}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-xl shadow-sm p-4 mb-3">
      <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-3">{title}</h3>
      {children}
    </div>
  )
}
