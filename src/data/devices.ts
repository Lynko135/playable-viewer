export interface Device {
  id: string
  name: string
  /** Логическая ширина в портретной ориентации (CSS px). */
  width: number
  /** Логическая высота в портретной ориентации (CSS px). */
  height: number
}

export type Orientation = 'portrait' | 'landscape'

export const devices: Device[] = [
  { id: 'iphone-se', name: 'iPhone SE', width: 375, height: 667 },
  { id: 'iphone-14', name: 'iPhone 14', width: 390, height: 844 },
  { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', width: 430, height: 932 },
  { id: 'pixel-7', name: 'Pixel 7', width: 412, height: 915 },
  { id: 'galaxy-s22', name: 'Galaxy S22', width: 360, height: 780 },
  { id: 'ipad-mini', name: 'iPad mini', width: 768, height: 1024 },
]

export const defaultDevice = devices[1]
