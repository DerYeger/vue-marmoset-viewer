<script lang="ts">
import Vue from "vue"
import MarmosetViewer from "@/marmoset-viewer.vue"

export default Vue.extend({
  name: "ServeDev",
  components: {
    MarmosetViewer
  },
  data() {
    return {
      src: "test.mview",
      width: '800',
      height: '500',
      autoStart: false,
      responsive: false
    }
  }
})
</script>

<template>
  <div id="app">
    <section>
      <label>Src</label>
      <input type="text" v-model="src">
    </section>
    <section>
      <label>Start</label>
      <button @click="autoStart = !autoStart">{{ autoStart ? "Automatic" : "Manual" }}</button>
    </section>
    <section>
      <label>Layout</label>
      <button @click="responsive = !responsive">{{ responsive ? "Responsive" : "Static" }}</button>
    </section>
    <section>
      <label>Width</label>
      <input type="range" min="300" max="1200" v-model="width">
    </section>
    <section>
      <label>Height</label>
      <input type="range" min="300" max="1200" v-model="height">
    </section>
    <marmoset-viewer :src="src" :auto-start="autoStart" :responsive="responsive" :width="+width" :height="+height" />
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 1rem;
}

* + section {
  margin-top: 1rem;
}

label + * {
  margin-left: 0.5rem;
}
</style>
