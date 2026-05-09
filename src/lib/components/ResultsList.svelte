<script lang="ts">
	import ResultItem from './ResultItem.svelte';
	import { settingsStore, getToggle } from '$lib/stores/settings';
	import type { SearchResult } from '$lib/search';

	let { results = [] } = $props<{ results?: SearchResult[] }>();

	let compact = $derived(getToggle($settingsStore, 'compact-results', false));
</script>

<ol class={compact ? 'space-y-0' : 'space-y-2'}>
	{#each results as result, i}
		<li class="animate-slide-up" style="animation-delay:{i * 25}ms; animation-fill-mode:both;">
			<ResultItem {result} />
		</li>
	{/each}
</ol>
