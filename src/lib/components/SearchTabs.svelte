<script lang="ts">
	import type { SearchTab } from '$lib/search';

	let {
		current,
		query,
		freshness
	} = $props<{ current: SearchTab; query: string; freshness?: string }>();

	const tabs: Array<{ id: SearchTab; label: string; icon: string }> = [
		{ id: 'web', label: 'All', icon: 'fa-magnifying-glass' },
		{ id: 'images', label: 'Images', icon: 'fa-image' },
		{ id: 'videos', label: 'Videos', icon: 'fa-play' },
		{ id: 'news', label: 'News', icon: 'fa-newspaper' }
	];

	function tabHref(tabId: SearchTab): string {
		const params = new URLSearchParams({ q: query });
		if (tabId !== 'web') params.set('t', tabId);
		if (freshness) params.set('f', freshness);
		return `/search?${params}`;
	}
</script>

<nav class="flex items-center gap-0.5" aria-label="Search type">
	{#each tabs as tab (tab.id)}
		<a
			href={tabHref(tab.id)}
			class={current === tab.id
				? 'flex items-center gap-2 border-b-2 border-[var(--app-accent)] px-3 pb-2.5 pt-1 text-sm font-medium text-[var(--app-accent)]'
				: 'flex items-center gap-2 border-b-2 border-transparent px-3 pb-2.5 pt-1 text-sm font-medium text-[var(--app-muted)] transition hover:border-[var(--app-border)] hover:text-[var(--app-text)]'}
		>
			<i class={`fa-solid ${tab.icon} text-xs`}></i>
			{tab.label}
		</a>
	{/each}
</nav>
