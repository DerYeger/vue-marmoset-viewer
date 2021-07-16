import Vue, { VNode } from 'vue'
import Dev from './serve.vue'

Vue.config.productionTip = false

new Vue({
  render: (h): VNode => h(Dev),
  created() {
    document.title = 'vue-marmoset-viewer'
    document.documentElement.setAttribute('lang', 'en')
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', 'A responsive and configurable Marmoset Viewer component for Vue.')
  },
}).$mount('#app')
