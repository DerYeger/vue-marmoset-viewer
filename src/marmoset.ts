const marmosetScriptId = 'marmoset-script'
const marmosetScriptUrl = 'https://viewer.marmoset.co/main/marmoset.js'

let loadingInProgress = false
let loadingCompleted = false

export const marmosetDefaultOptions: Required<Omit<Marmoset.WebViewerOptions, 'thumbnailURL'>> &
  Pick<Marmoset.WebViewerOptions, 'thumbnailURL'> = {
  width: 800,
  height: 600,
  autoStart: false,
  fullFrame: false,
  pagePreset: false,
  thumbnailURL: undefined,
}

export function loadMarmoset(onComplete: () => void) {
  if (loadingCompleted) {
    onComplete()
    return
  }
  if (loadingInProgress) {
    document.getElementById(marmosetScriptId)?.addEventListener('load', () => onComplete())
    return
  }
  loadingInProgress = true
  const marmosetScript = document.createElement('script')
  marmosetScript.setAttribute('src', marmosetScriptUrl)
  marmosetScript.async = false
  marmosetScript.id = marmosetScriptId
  marmosetScript.addEventListener('load', () => {
    loadingInProgress = false
    loadingCompleted = true
    onComplete()
  })
  document.head.appendChild(marmosetScript)
}
