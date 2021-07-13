declare interface Marmoset {
  embed(src: string, options: Marmoset.WebViewerOptions): Marmoset.WebViewer
  fetchThumbnail(src: string, onLoad: (image: any) => void, onError?: () => void, image?: any): void

  hostURL?: string
  hostImage?: string

  transparentBackground?: boolean
  noUserInterface?: boolean
}

declare namespace Marmoset {
  class WebViewer {
    constructor(width: number, height: number, src: string)

    domRoot: HTMLDivElement
    loadScene(): void
    onLoad?: () => void
    resize(width: number, height: number): void
    unload(): void
  }

  interface WebViewerOptions {
    width?: number
    height?: number
    autoStart?: boolean
    fullFrame?: boolean
    pagePreset?: boolean
    thumbnailURL?: string
  }
}

declare interface Window {
  marmoset: Marmoset & typeof Marmoset
}
