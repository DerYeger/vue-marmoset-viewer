<h1 align="center">vue-marmoset-viewer</h1>

<p align="center">
  <a href="https://github.com/DerYeger/vue-marmoset-viewer/actions/workflows/ci.yml">
    <img alt="CI" src="https://img.shields.io/github/workflow/status/DerYeger/vue-marmoset-viewer/CI?label=ci&logo=github&color=#4DC71F">
  </a>
  <a href="https://www.npmjs.com/package/vue-marmoset-viewer">
    <img alt="NPM" src="https://img.shields.io/npm/v/vue-marmoset-viewer?logo=npm">
  </a>
  <a href="https://lgtm.com/projects/g/DerYeger/vue-marmoset-viewer">
    <img alt="LGTM Grade" src="https://img.shields.io/lgtm/grade/javascript/github/DerYeger/vue-marmoset-viewer?logo=lgtm">
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vue">
    <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/vue-marmoset-viewer/peer/vue">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img alt="MIT" src="https://img.shields.io/npm/l/vue-marmoset-viewer?color=#4DC71F">
  </a>
  <a href="https://bundlephobia.com/package/vue-marmoset-viewer">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/vue-marmoset-viewer">
  </a>
</p>

> A responsive and configurable [Marmoset Viewer](https://marmoset.co/toolbag/viewer/) component for Vue.

## Features

- ✨ **Dynamic**: Dynamically loads the Marmoset Viewer source code as soon as its rendered required.
- 📱 **Responsive**: Fully responsive. Supports touch controls.

## Installation

```bash
# yarn
$ yarn add vue-marmoset-viewer

# npm
$ npm install vue-marmoset-viewer
```

## Usage

```typescript
import Vue from 'vue'
import MarmosetViewer from 'vue-marmoset-viewer'

Vue.use(MarmosetViewer)
```

```vue
<template>
  <marmoset-viewer src="/file.mview" :options="{ width: 800, height: 600 }" />
</template>
```

or

```vue
<template>
  <marmoset-viewer src="/file.mview" responsive />
</template>
```

If `responsive` is set to true, the component will fill the available space of its parent.

> Note: No property of the component is reactive.

### Options

The following options are available (taken from https://marmoset.co/posts/viewer-integration-guide/):

| Type    | Name         | Default   | Description                                                                                                                                                                                              |
|---------|--------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| number  | width        | 800       | Width of viewer frame in points. This setting is ignored in full frame mode.                                                                                                                             |
| number  | height       | 600       | Height of viewer frame in points. This setting is ignored in full frame mode.                                                                                                                            |
| boolean | autoStart    | false     | Starts the viewer loading process immediately upon load (user does not have to press the play button). Leaving this disabled can save bandwidth and page load time.                                      |
| boolean | fullFrame    | false     | When enabled, stretches the viewer rectangle to fill the available frame (the containing window or iframe). This setting is ignored when the “pagePreset” option is enabled.                             |
| boolean | pagePreset   | false     | When enabled, constructs a full standalone web page around the viewer, with a resizable frame. Useful for creating a simple, decent-looking presentation without having to construct a page yourself.    |
| string  | thumbnailURL | undefined | If supplied, this image URL will be used for the load screen instead of the thumbnail extracted from the mview file. For best results, ensure that the given URL will not cause a cross-origin conflict. |


### Nuxt

1. Create the file `plugins/marmosetViewer.ts` with the following content.

```typescript
import Vue from 'vue'
import MarmosetViewer from 'vue-marmoset-viewer'

Vue.use(MarmosetViewer)
```

2. Update the `plugins` array in `nuxt.config.js`.

```typescript
export default {
  plugins: [
    { src: '~/plugins/marmosetViewer.ts' },
  ],
}
```

## Development

```bash
# install dependencies
$ yarn install

# build for production
$ yarn build

# lint project files
$ yarn lint
```

## Disclaimer

Please keep the license of the Marmoset Viewer, which will be loaded dynamically, in mind.
The (current) license is as follows:

```
Copyright (c) Marmoset LLC.
All rights reserved.

Redistribution and use of this software are permitted provided
that the software remains whole and unmodified and this copyright
notice remains attached. Use or inclusion of any portion of this
code in other software programs is prohibited, excepting simple
embedding of this file in web applications. This software, or any
derivatives thereof, may not be resold, rented, leased, or
distributed on any other for-charge basis.

THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
```

## License

[MIT](./LICENSE) - Copyright &copy; Jan Müller
