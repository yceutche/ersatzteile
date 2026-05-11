export type CategoryId =
  | 'base'
  | 'filters'
  | 'cooling'
  | 'hydraulics'
  | 'front-axle'
  | 'injection'
  | 'clutch-gearbox'
  | 'electrical'
  | 'tyres'
  | 'linkage'
  | 'plough'

export interface PartImage {
  url: string
  alt: string
  credit?: string
  width: number
  height: number
}

export interface Part {
  id: string
  category: CategoryId
  nameDe: string
  nameFr: string
  defaultQty: number
  reasonDe: string
  reasonFr: string
  images: PartImage[]
  tags: string[]
  critical: boolean
}

export interface Category {
  id: CategoryId
  nameDe: string
  nameFr: string
  color: string
  icon: string
  sortOrder: number
}

export interface WishlistItem {
  partId: string
  qty: number
  addedAt: string
  note?: string
}

export interface WishlistStore {
  version: number
  updatedAt: string
  items: WishlistItem[]
}

export interface TractorMeta {
  model: string
  engineNumber: string
  chassisNumber: string
  tyreRear: string
  tyreFront: string
}

export type PageSize = 10 | 20 | 50 | 'all'
export type Language = 'de' | 'fr'

export interface AppSettings {
  version: number
  language: Language
  pageSize: PageSize
  tractor: TractorMeta
}
