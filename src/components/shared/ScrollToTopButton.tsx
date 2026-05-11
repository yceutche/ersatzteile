import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 250)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-4 z-50 w-12 h-12 rounded-full
        bg-accent text-white
        shadow-[0_4px_14px_rgba(0,0,0,0.35)]
        flex items-center justify-center
        hover:scale-110 active:scale-95
        transition-transform duration-150 animate-fade-in
        border-2 border-white"
      aria-label="Scroll to top"
    >
      <ArrowUp size={22} strokeWidth={2.5} />
    </button>
  )
}
