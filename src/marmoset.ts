export const marmosetViewerDefaultOptions = {
  width: 800,
  height: 600,
  autoStart: false,
}

export const marmosetScriptId = 'marmoset-script'
const marmosetScriptUrl = 'https://viewer.marmoset.co/main/marmoset.js'

let loadingInProgress = false
let loadingCompleted = false

export function loadMarmoset(): Promise<void> {
  return new Promise((resolve) => {
    if (loadingCompleted) {
      resolve()
      return
    }
    if (loadingInProgress) {
      document.getElementById(marmosetScriptId)?.addEventListener('load', () => resolve())
      return
    }
    loadingInProgress = true
    const marmosetScript = document.createElement('script')
    marmosetScript.setAttribute('src', marmosetScriptUrl)
    marmosetScript.id = marmosetScriptId
    marmosetScript.addEventListener('load', () => {
      loadingInProgress = false
      loadingCompleted = true
      resolve()
    })
    document.head.appendChild(marmosetScript)
  })
}
