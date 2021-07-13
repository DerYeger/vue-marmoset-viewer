import Vue, { PluginFunction, VueConstructor } from 'vue'

declare const MarmosetViewer: VueConstructor<Vue> & { install: PluginFunction<any> }
export default MarmosetViewer
