/**
 * @jest-environment jsdom
 */
import { MarmosetViewer } from '@/index'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'

const TestComponent = {
  template: '<marmoset-viewer src="test.mview" />',
}

describe('MarmosetViewer', () => {
  beforeAll(() => {
    console.warn = function (message) {
      console.error(message)
      throw message
    }
  })
  it('can be installed', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [MarmosetViewer],
      },
    })
    await flushPromises()
    expect(wrapper.find('.marmoset-viewer-host')).toBeDefined()
  })
})
