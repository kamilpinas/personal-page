export interface Tile {
  id: string
  title: string
  to: string
  icon?: React.ComponentType<{ className?: string }>
  staticSrc: string
  videoSrc: string
  wide?: boolean
  accent?: string
}
