<template>
  <div ref="marmosetViewerHost" class="marmoset-viewer-host" :class="{ 'marmoset-viewer-host__responsive': responsive }" />
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { loadMarmoset, marmosetViewerDefaultOptions } from '@/marmoset'
import { Marmoset } from 'marmoset-viewer'

export default defineComponent({
  props: {
    src: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: marmosetViewerDefaultOptions.width,
    },
    height: {
      type: Number,
      default: marmosetViewerDefaultOptions.height,
    },
    responsive: {
      type: Boolean,
      default: false,
    },
    autoStart: {
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
      return new window.marmoset.WebViewer(this.width, this.height, this.src)
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
      if (this.autoStart) {
        this.viewer.loadScene()
      }
    },
    onResize() {
      try {
        this.viewer.resize(this.viewerHost.clientWidth, this.viewerHost.clientHeight)
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
