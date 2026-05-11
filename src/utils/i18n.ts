import type { Language } from '../types'
import de from '../i18n/de.json'
import fr from '../i18n/fr.json'

const translations: Record<Language, Record<string, string>> = { de, fr }

export function t(key: string, lang: Language): string {
  return translations[lang][key] ?? translations['de'][key] ?? key
}
