<template>
  <div
    ref="marmosetViewerHost"
    class="marmoset-viewer-host"
    :class="{ 'marmoset-viewer-host__responsive': responsive }"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api"
import { loadMarmoset, marmosetDefaultOptions } from "@/marmoset"

export default defineComponent({
  props: {
    src: {
      type: String,
      required: true,
    },
    options: {
      type: Object as PropType<Marmoset.WebViewerOptions>,
      default: () => marmosetDefaultOptions,
    },
    responsive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      resizeObserver: undefined as ResizeObserver | undefined,
    }
  },
  computed: {
    viewerHost(): HTMLDivElement {
      return this.$refs.marmosetViewerHost as HTMLDivElement
    },
    viewer(): Marmoset.WebViewer {
      const { width, height } = this.options
      return new window.marmoset.WebViewer(
        width ?? marmosetDefaultOptions.width,
        height ?? marmosetDefaultOptions.height,
        this.src
      )
    },
  },
  mounted() {
    loadMarmoset().then(() => this.initializeViewer())
  },
  beforeDestroy() {
    this.resizeObserver?.unobserve(this.viewerHost)
    this.viewer.unload()
    this.$emit('unload')
  },
  methods: {
    initializeViewer() {
      this.viewerHost.appendChild(this.viewer.domRoot)
      this.viewer.onLoad = () => this.$emit('load')
      if (this.responsive) {
        this.resizeObserver = new ResizeObserver(() => this.onResize())
        this.resizeObserver.observe(this.viewerHost)
      }
    },
    onResize() {
      try {
        this.viewer.resize(
          this.viewerHost.clientWidth,
          this.viewerHost.clientHeight
        )
      } catch (_) {
        // marmoset.js throws a typeError on resize
      }
      this.$emit('resize')
    },
  },
})
</script>

<style>
.marmoset-viewer-host {
  width: fit-content;
  height: fit-content;
}

.marmoset-viewer-host__responsive {
  width: 100%;
  height: 99%;
}
</style>
