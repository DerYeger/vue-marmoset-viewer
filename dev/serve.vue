<script lang="ts">
import Vue from 'vue';
import MarmosetViewer from '@/marmoset-viewer.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    MarmosetViewer
  }
});
</script>

<template>
  <div id="app">
    <marmoset-viewer src="test.mview" responsive />
  </div>
</template>
