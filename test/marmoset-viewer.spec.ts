/**
 * @jest-environment jsdom
 */

import { mount } from '@vue/test-utils'
import MarmosetViewer from '@/marmoset-viewer.vue'
import flushPromises from 'flush-promises'
import { loadMarmoset } from '@/marmoset'

jest.mock('@/marmoset')

const testFileName = 'test.mview'

const testDomRootId = 'test-dom-root'

function withPx(value: number) {
  return `${value}px`
}

const unloadMock = jest.fn()
const resizeMock = jest.fn()
const loadSceneMock = jest.fn()

class WebViewerMock {
  unload = unloadMock
  resize = resizeMock
  loadScene = loadSceneMock
  domRoot: HTMLDivElement
  constructor(width: number, height: number, src: string) {
    const testDomRoot = document.createElement('div')
    testDomRoot.id = testDomRootId
    testDomRoot.innerHTML = src
    testDomRoot.style.width = withPx(width)
    testDomRoot.style.height = withPx(height)
    this.domRoot = testDomRoot
  }
  set onLoad(onLoad: () => void) {
    onLoad()
  }
}

let observeMock = jest.fn()
let unobserveMock = jest.fn()

function mockResizeObserver() {
  observeMock = jest.fn()
  unobserveMock = jest.fn()
  const resizeObserverMock = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: observeMock,
    unobserve: unobserveMock,
  }))
  window.ResizeObserver = window.ResizeObserver || resizeObserverMock
}

describe('MarmosetViewer', () => {
  beforeAll(() => {
    // @ts-ignore
    loadMarmoset.mockResolvedValue(
      new Promise<void>((resolve) => {
        Object.assign(global.window, {
          marmoset: {
            WebViewer: WebViewerMock,
          },
        })
        resolve()
      })
    )
  })
  beforeEach(() => {
    mockResizeObserver()
    unloadMock.mockReset()
    resizeMock.mockReset()
    loadSceneMock.mockReset()
    observeMock.mockReset()
    unobserveMock.mockReset()
  })
  it('loads the MarmosetViewer', async () => {
    const options = {
      width: 42,
      height: 31,
    }
    const wrapper = mount(MarmosetViewer, {
      propsData: {
        src: testFileName,
        ...options,
      },
    })
    await flushPromises()
    expect(wrapper.emitted().load?.length).toBe(1)
    const host = wrapper.find<HTMLDivElement>('.marmoset-viewer-host')
    expect(host.element).toBeDefined()
    const viewer = wrapper.find<HTMLDivElement>(`#${testDomRootId}`)
    expect(viewer.text()).toEqual(testFileName)
    expect(viewer.element.style.width).toEqual(withPx(options.width))
    expect(viewer.element.style.height).toEqual(withPx(options.height))
  })
  it('unloads the MarmosetViewer', async () => {
    const wrapper = mount(MarmosetViewer, {
      propsData: {
        src: testFileName,
      },
    })
    await flushPromises()
    expect(unloadMock.mock.calls.length).toEqual(0)
    expect(wrapper.emitted().unload).toBeUndefined()
    wrapper.destroy()
    expect(unloadMock.mock.calls.length).toEqual(1)
    expect(wrapper.emitted().unload?.length).toBe(1)
  })
  it('can be responsive', async () => {
    const wrapper = mount(MarmosetViewer, {
      propsData: {
        src: testFileName,
        responsive: true,
      },
    })
    await flushPromises()
    expect(wrapper.emitted().load?.length).toBe(1)
    const host = wrapper.find<HTMLDivElement>('.marmoset-viewer-host__responsive')
    expect(host.element).toBeDefined()
    const viewer = wrapper.find<HTMLDivElement>(`#${testDomRootId}`)
    expect(viewer.text()).toEqual(testFileName)
  })
  it('resizes the MarmosetViewer', async () => {
    const wrapper = mount(MarmosetViewer, {
      propsData: {
        src: testFileName,
        responsive: true,
      },
    })
    await flushPromises()
    expect(resizeMock.mock.calls.length).toEqual(0)
    expect(wrapper.emitted().resize).toBeUndefined()
    // @ts-ignore
    wrapper.vm.onResize()
    expect(resizeMock.mock.calls.length).toEqual(1)
    expect(wrapper.emitted().resize?.length).toBe(1)
  })
  it('unobserves the ResizeObserver', async () => {
    expect(observeMock.mock.calls.length).toEqual(0)
    const wrapper = mount(MarmosetViewer, {
      propsData: {
        src: testFileName,
        responsive: true,
      },
    })
    await flushPromises()
    expect(observeMock.mock.calls.length).toEqual(1)
    expect(unobserveMock.mock.calls.length).toEqual(0)
    expect(wrapper.emitted().unload).toBeUndefined()
    wrapper.destroy()
    expect(unobserveMock.mock.calls.length).toEqual(1)
    expect(wrapper.emitted().unload?.length).toBe(1)
  })
  it('supports autostart', async () => {
    expect(loadSceneMock.mock.calls.length).toEqual(0)
    mount(MarmosetViewer, {
      propsData: {
        src: testFileName,
        autoStart: true,
      },
    })
    await flushPromises()
    expect(loadSceneMock.mock.calls.length).toEqual(1)
  })
  it('reacts to src prop changes', async () => {
    const wrapper = mount(MarmosetViewer, {
      propsData: {
        src: testFileName,
      },
    })
    // @ts-ignore
    const reloadSpy = jest.spyOn(wrapper.vm, 'reloadViewer')
    await flushPromises()
    wrapper.setProps({
      src: 'newSrc',
    })
    await flushPromises()
    expect(reloadSpy).toHaveBeenCalledTimes(1)
  })
  it('reacts to responsive prop changes', async () => {
    const wrapper = mount(MarmosetViewer, {
      propsData: {
        src: testFileName,
      },
    })
    expect(observeMock.mock.calls.length).toEqual(0)
    expect(resizeMock.mock.calls.length).toEqual(0)
    await flushPromises()
    wrapper.setProps({
      src: testFileName,
      responsive: true,
    })
    await flushPromises()
    expect(observeMock.mock.calls.length).toEqual(1)
    expect(unobserveMock.mock.calls.length).toEqual(0)
    wrapper.setProps({
      src: testFileName,
      responsive: false,
    })
    await flushPromises()
    expect(unobserveMock.mock.calls.length).toEqual(1)
    expect(resizeMock.mock.calls.length).toEqual(1)
  })
  it('reacts to autoStart prop changes', async () => {
    const wrapper = mount(MarmosetViewer, {
      propsData: {
        src: testFileName,
      },
    })
    expect(loadSceneMock.mock.calls.length).toEqual(0)
    await flushPromises()
    wrapper.setProps({
      src: testFileName,
      autoStart: true,
    })
    await flushPromises()
    expect(loadSceneMock.mock.calls.length).toEqual(1)
  })
  it('reacts to width prop changes', async () => {
    const wrapper = mount(MarmosetViewer, {
      propsData: {
        src: testFileName,
      },
    })
    expect(resizeMock.mock.calls.length).toEqual(0)
    expect(wrapper.emitted().resize).toBeUndefined()
    await flushPromises()
    wrapper.setProps({
      src: testFileName,
      width: 42,
    })
    await flushPromises()
    expect(resizeMock.mock.calls.length).toEqual(1)
    expect(wrapper.emitted().resize?.length).toBe(1)
  })
  it('reacts to height prop changes', async () => {
    const wrapper = mount(MarmosetViewer, {
      propsData: {
        src: testFileName,
      },
    })
    expect(resizeMock.mock.calls.length).toEqual(0)
    expect(wrapper.emitted().resize).toBeUndefined()
    await flushPromises()
    wrapper.setProps({
      src: testFileName,
      height: 42,
    })
    await flushPromises()
    expect(resizeMock.mock.calls.length).toEqual(1)
    expect(wrapper.emitted().resize?.length).toBe(1)
  })
  it('does not react to size changes when responsive', async () => {
    const wrapper = mount(MarmosetViewer, {
      propsData: {
        src: testFileName,
        responsive: true,
      },
    })
    // @ts-ignore
    const reloadSpy = jest.spyOn(wrapper.vm, 'reloadViewer')
    await flushPromises()
    wrapper.setProps({
      src: testFileName,
      responsive: true,
      height: 42,
    })
    await flushPromises()
    expect(reloadSpy).toHaveBeenCalledTimes(0)
    wrapper.setProps({
      src: testFileName,
      responsive: true,
      width: 42,
    })
    await flushPromises()
    expect(reloadSpy).toHaveBeenCalledTimes(0)
  })
})
