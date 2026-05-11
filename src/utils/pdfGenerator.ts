import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Part, Category, WishlistItem, AppSettings, Language } from '../types'
import { sanitize } from './sanitize'
import { t } from './i18n'

export function generatePDF(
  items: WishlistItem[],
  parts: Part[],
  categories: Category[],
  settings: AppSettings,
  lang: Language
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const dateStr = new Date().toISOString().slice(0, 10)
  const { tractor } = settings

  // Header
  doc.setFontSize(16)
  doc.setTextColor(27, 108, 168)
  doc.text(t('pdf_header', lang), 14, 18)

  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  const metaLines = [
    `${t('pdf_model', lang)}: ${sanitize(tractor.model)}`,
    `${t('pdf_date', lang)}: ${dateStr}`,
  ]
  if (tractor.engineNumber) metaLines.push(`${t('pdf_engine', lang)}: ${sanitize(tractor.engineNumber)}`)
  if (tractor.chassisNumber) metaLines.push(`${t('pdf_chassis', lang)}: ${sanitize(tractor.chassisNumber)}`)

  doc.text(metaLines, 14, 26)

  // Table
  const catMap = Object.fromEntries(categories.map(c => [c.id, lang === 'de' ? c.nameDe : c.nameFr]))
  const rows = items.map(item => {
    const part = parts.find(p => p.id === item.partId)
    if (!part) return null
    return [
      String(item.qty),
      sanitize(part.nameDe),
      sanitize(part.nameFr),
      sanitize(catMap[part.category] ?? part.category),
    ]
  }).filter(Boolean) as string[][]

  autoTable(doc, {
    startY: 26 + metaLines.length * 5 + 4,
    head: [[
      t('pdf_col_qty', lang),
      t('pdf_col_de', lang),
      t('pdf_col_fr', lang),
      t('pdf_col_cat', lang),
    ]],
    body: rows,
    headStyles: { fillColor: [27, 108, 168] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: { 0: { halign: 'center', cellWidth: 12 } },
  })

  // Footer
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(sanitize(t('pdf_footer', lang)), 14, Math.min(finalY, 280))

  doc.save(`ersatzteile-MF1014-${dateStr}.pdf`)
}
