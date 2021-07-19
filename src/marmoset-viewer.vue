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
      viewer: undefined as Marmoset.WebViewer | undefined,
    }
  },
  computed: {
    viewerHost(): HTMLDivElement {
      return this.$refs.marmosetViewerHost as HTMLDivElement
    },
    resizeObserver(): ResizeObserver {
      return new ResizeObserver(this.onResize)
    },
  },
  mounted() {
    loadMarmoset().then(() => this.loadViewer())
  },
  beforeDestroy() {
    this.unloadViewer()
  },
  methods: {
    loadViewer() {
      this.viewer = new window.marmoset.WebViewer(this.width, this.height, this.src)
      this.viewerHost.appendChild(this.viewer.domRoot)
      this.viewer.onLoad = () => this.$emit('load')
      if (this.responsive) {
        this.resizeObserver.observe(this.viewerHost)
      }
      if (this.autoStart) {
        this.viewer.loadScene()
      }
    },
    unloadViewer() {
      if (this.viewer === undefined) {
        return
      }
      this.resizeObserver.unobserve(this.viewerHost)
      this.viewerHost.removeChild(this.viewer.domRoot)
      this.viewer.unload()
      this.$emit('unload')
    },
    reloadViewer() {
      this.unloadViewer()
      this.loadViewer()
    },
    onResize() {
      try {
        this.viewer?.resize(this.viewerHost.clientWidth, this.viewerHost.clientHeight)
      } catch {
        // marmoset.js throws a typeError on resize
      }
      this.$emit('resize')
    },
  },
  watch: {
    src() {
      this.reloadViewer()
    },
    width() {
      if (this.responsive) {
        return
      }
      this.reloadViewer()
    },
    height() {
      if (this.responsive) {
        return
      }
      this.reloadViewer()
    },
    responsive() {
      this.reloadViewer()
    },
    autoStart() {
      this.reloadViewer()
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
  height: calc(100% - 1px);
}
</style>
