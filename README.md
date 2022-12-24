# svelted-heroicons

[![NPM](https://nodei.co/npm/svelted-heroicons.png)](https://npmjs.org/package/svelted-heroicons)

My attempt for better dev experience when using Heroicons in Svelte.

## Installation

```bash
npm install --save-dev svelted-heroicons
```

## Usage

### 1. 1-1

This means, one component for one equivalent icon.

```svelte
<!-- src/lib/Icon.svelte -->
<script lang="ts">
  import MiniWifi from 'svelted-heroicons/dist/mini/Wifi.svelte';
  import SolidWifi from 'svelted-heroicons/dist/solid/Wifi.svelte';
  import OutlineWifi from 'svelted-heroicons/dist/outline/Wifi.svelte';
</script>

<SolidWifi style="width: 12px; height: 12px; color: red; background: blue;" />
<MiniWifi class="w-12 h-12 text-red-500 bg-blue-500" />
```

### 2. Dynamic 1-all (Recommended)

For those who don't like to have so many imports (including me), this is your way to go.

1. Create a wrapper component that acts as a main entry to access the icons.

```svelte
<!-- src/lib/Icon.svelte -->
<script lang="ts">
	import type { IconType, IconName } from 'svelted-heroicons';
	export let type: IconType = 'solid';
	export let name: IconName;
</script>

{#await import(`../../node_modules/svelted-heroicons/dist/${type}/${name}.svelte`) then module} <!-- must be relative path due to dynamic-import-vars#limitations -->
	<svelte:component this={module.default} class={$$restProps.class} />
{/await}
```

2. Import `Icon.svelte` and start to use.

```svelte
<script lang="ts">
	import Icon from '$lib/Icon.svelte';
</script>

<Icon name="AcademicCap" class="w-12 h-12 text-red-500" />
<Icon type="outline" name="AcademicCap" class="w-12 h-12 text-red-500" />
<Icon type="mini" name="AcademicCap" class="w-12 h-12 text-red-500" />
```
