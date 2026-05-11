import { useState } from 'react'
import { FileText, Mail, MessageCircle, AlertTriangle } from 'lucide-react'
import type { Part, Category, Language } from '../../types'
import catalogData from '../../data/parts.json'
import { useWishlistStore } from '../../store/wishlistStore'
import { useSettingsStore } from '../../store/settingsStore'
import { t } from '../../utils/i18n'
import { generatePDF } from '../../utils/pdfGenerator'
import { buildPlainTextList, shareViaWhatsApp, shareViaEmail } from '../../utils/shareHelpers'
import { Header } from '../shared/Header'
import { OfflineBanner } from '../shared/OfflineBanner'

const parts = catalogData.parts as Part[]
const categories = catalogData.categories as Category[]

export function ExportScreen() {
  const lang = useSettingsStore(s => s.language)
  const settings = useSettingsStore(s => s)
  const items = useWishlistStore(s => s.items)
  const empty = items.length === 0
  const [pdfLang, setPdfLang] = useState<Language>(lang)

  const handlePDF = () => {
    generatePDF(items, parts, categories, settings, lang, pdfLang)
  }

  const handleEmail = () => {
    const body = buildPlainTextList(items, parts, categories, lang)
    shareViaEmail(t('email_subject', lang), body)
  }

  const handleWhatsApp = () => {
    const text = buildPlainTextList(items, parts, categories, lang)
    shareViaWhatsApp(text)
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Header />
      <OfflineBanner />
      <main className="flex-1 pb-20 max-w-2xl w-full mx-auto px-4 pt-4">
        <h2 className="font-bold text-text-primary text-base mb-4">{t('export_title', lang)}</h2>

        {empty && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-700">
            <AlertTriangle size={16} className="flex-shrink-0" />
            <span>{t('export_empty_warning', lang)}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {/* PDF card with language selector */}
          <div className={`bg-surface rounded-xl shadow-sm p-4 flex flex-col gap-3 ${empty ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 pt-0.5">
                <FileText size={28} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary text-sm">{t('export_pdf', lang)}</p>
                <p className="text-xs text-text-secondary mt-0.5">{t('export_pdf_desc', lang)}</p>
              </div>
              <button
                onClick={handlePDF}
                disabled={empty}
                className="flex-shrink-0 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-primary-dark disabled:cursor-not-allowed transition-colors"
                aria-disabled={empty}
              >
                {t('export_pdf_btn', lang)}
              </button>
            </div>
            {/* Language toggle */}
            <div className="flex items-center gap-3 pl-11">
              <span className="text-xs text-text-secondary font-medium">{t('export_pdf_lang', lang)}:</span>
              <div className="flex rounded-full border border-gray-200 overflow-hidden text-xs font-semibold">
                <button
                  onClick={() => setPdfLang('de')}
                  className={`px-4 py-1.5 transition-colors ${pdfLang === 'de' ? 'bg-primary text-white' : 'bg-white text-text-secondary hover:bg-gray-50'}`}
                  aria-pressed={pdfLang === 'de'}
                >
                  DE
                </button>
                <button
                  onClick={() => setPdfLang('fr')}
                  className={`px-4 py-1.5 transition-colors ${pdfLang === 'fr' ? 'bg-primary text-white' : 'bg-white text-text-secondary hover:bg-gray-50'}`}
                  aria-pressed={pdfLang === 'fr'}
                >
                  FR
                </button>
              </div>
            </div>
          </div>
          <ExportCard
            icon={<Mail size={28} className="text-primary" />}
            title={t('export_email', lang)}
            desc={t('export_email_desc', lang)}
            btnLabel={t('export_email_btn', lang)}
            disabled={empty}
            onClick={handleEmail}
          />
          <ExportCard
            icon={<MessageCircle size={28} className="text-green-600" />}
            title={t('export_whatsapp', lang)}
            desc={t('export_whatsapp_desc', lang)}
            btnLabel={t('export_whatsapp_btn', lang)}
            disabled={empty}
            onClick={handleWhatsApp}
          />
        </div>
      </main>
    </div>
  )
}

interface ExportCardProps {
  icon: React.ReactNode
  title: string
  desc: string
  btnLabel: string
  disabled: boolean
  onClick: () => void
}

function ExportCard({ icon, title, desc, btnLabel, disabled, onClick }: ExportCardProps) {
  return (
    <div className={`bg-surface rounded-xl shadow-sm p-4 flex items-start gap-4 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex-shrink-0 pt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text-primary text-sm">{title}</p>
        <p className="text-xs text-text-secondary mt-0.5">{desc}</p>
      </div>
      <button
        onClick={onClick}
        disabled={disabled}
        className="flex-shrink-0 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-primary-dark disabled:cursor-not-allowed transition-colors"
        aria-disabled={disabled}
      >
        {btnLabel}
      </button>
    </div>
  )
}
