/**
 * @jest-environment jsdom
 */

import { mount } from '@vue/test-utils'
import MarmosetViewer from '@/marmoset-viewer.vue'
import * as marmoset from '@/marmoset'
import flushPromises from 'flush-promises'

jest.mock('@/marmoset')

const testFileName = 'test.mview'

const testDomRootId = 'test-dom-root'

function withPx(value: number) {
  return `${value}px`
}

const unloadMock = jest.fn()
const resizeMock = jest.fn()

class WebViewerMock {
  unload = unloadMock
  resize = resizeMock
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
    marmoset.loadMarmoset.mockResolvedValue(
      new Promise((resolve) => {
        Object.assign(global.window, {
          marmoset: {
            WebViewer: WebViewerMock,
          },
        })
        resolve()
      })
    )
  })
  beforeEach(() => mockResizeObserver())
  it('loads the MarmosetViewer', async () => {
    const options = {
      width: 42,
      height: 31,
    }
    const wrapper = mount(MarmosetViewer, {
      propsData: {
        src: testFileName,
        options,
      },
    })
    await flushPromises()
    expect(wrapper.emitted().load?.length).toBe(1)
    const host = wrapper.find('.marmoset-viewer-host')
    expect(host.element).toBeDefined()
    const viewer = wrapper.find(`#${testDomRootId}`)
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
    const host = wrapper.find('.marmoset-viewer-host__responsive')
    expect(host.element).toBeDefined()
    const viewer = wrapper.find(`#${testDomRootId}`)
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
})
