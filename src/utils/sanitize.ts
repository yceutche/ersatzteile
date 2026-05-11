import DOMPurify from 'dompurify'

/**
 * Sanitise a user-provided string before inserting into HTML or documents.
 * Strips all HTML tags and potentially malicious content.
 */
export function sanitize(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}

/**
 * Truncate a string to a max length (for notes etc.)
 */
export function truncate(input: string, maxLen = 500): string {
  return input.slice(0, maxLen)
}
