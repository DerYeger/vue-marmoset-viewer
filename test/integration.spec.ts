/**
 * @jest-environment jsdom
 */
import MarmosetViewer from '@/entry'
import Vue from 'vue'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'

const TestComponent = {
  template: '<marmoset-viewer src="test.mview" />',
}

describe('MarmosetViewer', () => {
  beforeAll(() => {
    Vue.use(MarmosetViewer)
  })
  it('can be installed', async () => {
    const wrapper = mount(TestComponent)
    await flushPromises()
    expect(wrapper.find('.marmoset-viewer-host')).toBeDefined()
  })
})
