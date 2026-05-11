import { Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/shared/BottomNav'
import { ScrollToTopButton } from './components/shared/ScrollToTopButton'
import { CatalogScreen } from './components/catalog/CatalogScreen'
import { PartDetailScreen } from './components/detail/PartDetailScreen'
import { WishlistScreen } from './components/wishlist/WishlistScreen'
import { ExportScreen } from './components/export/ExportScreen'
import { SettingsScreen } from './components/settings/SettingsScreen'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CatalogScreen />} />
        <Route path="/part/:id" element={<PartDetailScreen />} />
        <Route path="/wishlist" element={<WishlistScreen />} />
        <Route path="/export" element={<ExportScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
      <BottomNav />
      <ScrollToTopButton />
    </>
  )
}
