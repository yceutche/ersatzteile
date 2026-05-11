import type { Part, Category, WishlistItem, Language } from '../types'
import { sanitize } from './sanitize'
import { t } from './i18n'

export function buildPlainTextList(
  items: WishlistItem[],
  parts: Part[],
  categories: Category[],
  lang: Language
): string {
  const dateStr = new Date().toISOString().slice(0, 10)
  const catMap = Object.fromEntries(categories.map(c => [c.id, lang === 'de' ? c.nameDe : c.nameFr]))

  const lines = [
    `${t('whatsapp_header', lang)} — ${dateStr}`,
    '──────────────────────────',
    ...items.map(item => {
      const part = parts.find(p => p.id === item.partId)
      if (!part) return ''
      const cat = catMap[part.category] ?? part.category
      return `• ${item.qty}x  ${sanitize(part.nameDe)} / ${sanitize(part.nameFr)}  [${sanitize(cat)}]`
    }).filter(Boolean),
    '──────────────────────────',
    `Total: ${items.length} ${lang === 'de' ? 'Artikel' : 'articles'}`,
  ]

  return lines.join('\n')
}

export function shareViaWhatsApp(text: string): void {
  const encoded = encodeURIComponent(text)
  window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener,noreferrer')
}

export function shareViaEmail(
  subject: string,
  body: string
): void {
  const safeSubject = encodeURIComponent(sanitize(subject))
  const safeBody = encodeURIComponent(sanitize(body))
  window.location.href = `mailto:?subject=${safeSubject}&body=${safeBody}`
}
