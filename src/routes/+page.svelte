<script lang="ts">
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { settingsStore, getToggle } from '$lib/stores/settings';
	import { reducedMotion } from '$lib/stores/motion';
	import { fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let query = $state('');
	let safesearch = $derived(getToggle($settingsStore, 'safe-search'));
	let customizeOpen = $state(false);

	const quickSettings = [
		{ id: 'safe-search', label: 'Safe search' },
		{ id: 'filter-ads', label: 'Filter ads' },
		{ id: 'open-new-tab', label: 'Open in new tab' },
		{ id: 'show-favicons', label: 'Show favicons' },
		{ id: 'show-age', label: 'Show result date' },
		{ id: 'compact-results', label: 'Compact results' }
	];
</script>

<svelte:head>
	<title>ArcSearch - Private Search Engine</title>
	<meta
		name="description"
		content="Search the web privately with ArcSearch. No tracking, no profiles, no ads. Fast, clean results from an independent search index."
	/>
	<link rel="canonical" href="https://search.arcbase.one" />

	<!-- Open Graph -->
	<meta property="og:title" content="ArcSearch - Private Search Engine" />
	<meta
		property="og:description"
		content="Search the web privately. No tracking, no profiles, no ads."
	/>
	<meta property="og:url" content="https://search.arcbase.one" />
	<meta property="og:image" content="https://search.arcbase.one/og-image.png" />

	<!-- Twitter -->
	<meta name="twitter:title" content="ArcSearch - Private Search Engine" />
	<meta
		name="twitter:description"
		content="Search the web privately. No tracking, no profiles, no ads."
	/>

	<!-- JSON-LD: WebSite + SearchAction -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'ArcSearch',
		url: 'https://search.arcbase.one',
		description: 'A private search engine with no tracking, no profiles, and no ads.',
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: 'https://search.arcbase.one/search?q={search_term_string}'
			},
			'query-input': 'required name=search_term_string'
		}
	})}</script>`}
</svelte:head>

<main class="min-h-screen bg-[var(--app-background)] text-[var(--app-text)]">
	<div class="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-12">
		<div class="w-full space-y-8 text-center">
			<div class="space-y-3">
				<img
					src="/logo.png"
					alt="ArcSearch logo"
					class="mx-auto h-24 w-24 rounded-full sm:h-32 sm:w-32 lg:h-37 lg:w-37"
				/>
				<a href="/about" class="inline-block">
					<h1 class="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">ArcSearch</h1>
				</a>
			</div>

			<div class="mx-auto w-full max-w-2xl pr-14 sm:pr-0">
				<SearchBar
					bind:query
					placeholder="Search the web privately..."
					showButton={true}
					action="/search"
					{safesearch}
				/>
			</div>
		</div>
	</div>
</main>

<!-- Customize button -->
<div class="fixed right-6 bottom-6 z-50">
	{#if customizeOpen}
		<button
			type="button"
			class="fixed inset-0 z-40"
			tabindex="-1"
			aria-label="Close"
			onclick={() => (customizeOpen = false)}
		></button>

		<div
			class="absolute right-0 bottom-14 z-50 w-[min(16rem,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[#1c1c1c] shadow-2xl shadow-black/50"
			transition:fly={{ y: 8, duration: $reducedMotion ? 0 : 180, easing: cubicOut }}
		>
			<div class="border-b border-[var(--app-border)] px-4 py-3">
				<p class="text-xs font-semibold tracking-widest text-[var(--app-muted)] uppercase">
					Quick settings
				</p>
			</div>
			<div class="divide-y divide-[var(--app-border)] px-1 py-1">
				{#each quickSettings as s}
					{@const checked = getToggle($settingsStore, s.id)}
					<button
						type="button"
						onclick={() => settingsStore.toggle(s.id)}
						class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-[var(--app-hover)]"
					>
						<span class={checked ? 'text-[var(--app-text)]' : 'text-[var(--app-muted)]'}
							>{s.label}</span
						>
						<div
							class={checked
								? 'flex h-5 w-5 items-center justify-center rounded-full bg-[var(--app-accent)] text-[#111]'
								: 'h-5 w-5 rounded-full border border-[var(--app-border)]'}
						>
							{#if checked}
								<i class="fa-solid fa-check text-[9px]"></i>
							{/if}
						</div>
					</button>
				{/each}
			</div>
			<div class="border-t border-[var(--app-border)] px-4 py-3">
				<a
					href="/settings"
					class="text-xs text-[var(--app-accent)] hover:underline"
					onclick={() => (customizeOpen = false)}
				>
					All settings <i class="fa-solid fa-arrow-right"></i>
				</a>
			</div>
		</div>
	{/if}

	<button
		type="button"
		onclick={() => (customizeOpen = !customizeOpen)}
		class="flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[#1c1c1c] px-4 py-2.5 text-sm font-medium text-[var(--app-text)] shadow-lg shadow-black/30 transition hover:bg-[var(--app-hover)]"
	>
		<i class="fa-solid fa-sliders text-xs"></i>
		Customize
	</button>
</div>
