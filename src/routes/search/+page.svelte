<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import ResultsList from '$lib/components/ResultsList.svelte';
	import SearchTabs from '$lib/components/SearchTabs.svelte';
	import Infobox from '$lib/components/Infobox.svelte';
	import NewsResultItem from '$lib/components/NewsResultItem.svelte';
	import VideoResultItem from '$lib/components/VideoResultItem.svelte';
	import ImageGrid from '$lib/components/ImageGrid.svelte';
	import CustomSelect from '$lib/components/CustomSelect.svelte';
	import { settingsStore, getToggle } from '$lib/stores/settings';
	import { historyStore } from '$lib/stores/history';

	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	let query = $state('');
	let allResults = $state(data.results);
	let loadingMore = $state(false);
	let hasMore = $state(data.results.length >= 10);

	$effect(() => {
		query = data.query;
		allResults = data.results;
		hasMore = data.tab === 'web' && data.results.length >= 10;
	});

	let safesearch = $derived(getToggle($settingsStore, 'safe-search'));

	const freshnessLabels: Record<string, string> = {
		pd: 'Past day',
		pw: 'Past week',
		pm: 'Past month',
		py: 'Past year'
	};

	function buildUrl(overrides: Record<string, string | undefined>): string {
		const params = new URLSearchParams({ q: data.query });
		if (data.tab !== 'web') params.set('t', data.tab);
		if (data.freshness) params.set('f', data.freshness);
		if (safesearch) params.set('safe', '1');
		for (const [k, v] of Object.entries(overrides)) {
			if (v === undefined || v === '') params.delete(k);
			else params.set(k, v);
		}
		return `/search?${params}`;
	}

	function handleFreshnessChange(event: Event) {
		const val = (event.currentTarget as HTMLSelectElement).value;
		void goto(buildUrl({ f: val || undefined }));
	}

	onMount(() => {
		const input = document.querySelector<HTMLInputElement>('input[name="q"]');
		input?.focus();
		input?.setSelectionRange(query.length, query.length);
		if (data.query && getToggle($settingsStore, 'save-history')) historyStore.add(data.query);
	});

	async function loadMore() {
		if (loadingMore || !hasMore) return;
		loadingMore = true;
		try {
			const params = new URLSearchParams({ q: query, offset: String(allResults.length) });
			if (safesearch) params.set('safe', '1');
			if (data.freshness) params.set('f', data.freshness);
			const res = await fetch(`/api/search?${params}`, {
				cache: 'no-store',
				credentials: 'omit',
				headers: { accept: 'application/json' }
			});
			const payload = (await res.json().catch(() => null)) as {
				results?: Array<{
					title: string;
					url: string;
					snippet: string;
					siteName?: string;
					age?: string;
					thumbnail?: string;
					sitelinks?: Array<{ title: string; url: string }>;
				}>;
			} | null;
			const newResults = Array.isArray(payload?.results) ? payload.results : [];
			allResults = [...allResults, ...newResults];
			hasMore = newResults.length >= 10;
		} catch {
			hasMore = false;
		} finally {
			loadingMore = false;
		}
	}
</script>

<svelte:head>
	<title>{query ? `${query} - ArcSearch` : 'ArcSearch'}</title>
	<meta name="robots" content="noindex, noarchive, nofollow" />
</svelte:head>

<main class="min-h-screen bg-[var(--app-background)] text-[var(--app-text)]">
	<!-- Sticky header -->
	<header
		class="sticky top-0 z-20 border-b border-[var(--app-border)] bg-[var(--app-background)]/95 backdrop-blur"
	>
		<div class="mx-auto w-full max-w-[1200px] pl-4 pr-14 sm:px-6">
			<div class="flex items-center gap-3 py-3 sm:gap-5">
				<a href="/" class="hidden shrink-0 text-lg font-semibold tracking-tight text-[var(--app-text)] sm:block">
					ArcSearch
				</a>
				<div class="max-w-2xl flex-1">
					<SearchBar
						bind:query
						compact={true}
						placeholder="Search the web..."
						action="/search"
						showButton={true}
						{safesearch}
					/>
				</div>
			</div>

			<!-- Tabs row -->
			<div class="flex items-center justify-between">
				<div class="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					<SearchTabs current={data.tab} query={data.query} freshness={data.freshness} />
				</div>

				<!-- Time filter -->
				{#if data.tab !== 'images'}
					<div class="shrink-0 pr-1 pb-1">
						<CustomSelect
							value={data.freshness ?? ''}
							options={[
								{ label: 'Any time', value: '' },
								{ label: 'Past day', value: 'pd' },
								{ label: 'Past week', value: 'pw' },
								{ label: 'Past month', value: 'pm' },
								{ label: 'Past year', value: 'py' }
							]}
							onchange={(val) => void goto(buildUrl({ f: val || undefined }))}
						/>
					</div>
				{/if}
			</div>
		</div>
	</header>

	<!-- Body -->
	<div class="mx-auto w-full max-w-[1200px] px-4 pt-6 pb-16 sm:px-6 sm:pr-6">
		{#if data.error}
			<p class="mb-6 max-w-2xl text-sm text-red-400">{data.error}</p>
		{/if}

		{#if data.freshness && data.query}
			<p class="mb-4 max-w-2xl text-xs text-[var(--app-muted)]">
				Filtered: <span class="text-[var(--app-text)]">{freshnessLabels[data.freshness]}</span>
				·
				<a href={buildUrl({ f: undefined })} class="text-[var(--app-accent)] hover:underline"
					>Clear</a
				>
			</p>
		{/if}

		<!-- Two-column grid: left = results, right = infobox (web tab only) -->
		<div class={data.infobox && data.tab === 'web' ? 'flex gap-8' : ''}>
			<!-- Left / main column -->
			<div class={data.infobox && data.tab === 'web' ? 'max-w-2xl min-w-0 flex-1' : 'max-w-2xl'}>
				{#if data.tab === 'web'}
					{#if allResults.length > 0}
						<ResultsList results={allResults} />

						{#if hasMore}
							<div class="mt-8 flex justify-center">
								<button
									type="button"
									onclick={loadMore}
									disabled={loadingMore}
									class="inline-flex items-center gap-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-panel)] px-6 py-2.5 text-sm font-medium text-[var(--app-text)] transition hover:bg-[var(--app-hover)] disabled:opacity-50"
								>
									{#if loadingMore}
										<i class="fa-solid fa-spinner animate-spin text-xs"></i>
										Loading…
									{:else}
										More results
									{/if}
								</button>
							</div>
						{/if}
					{:else if data.query && !data.error}
						<p class="text-sm text-[var(--app-muted)]">No results found.</p>
					{:else if !data.query}
						<p class="text-sm text-[var(--app-muted)]">Search for something to begin.</p>
					{/if}
				{:else if data.tab === 'news'}
					{#if data.newsResults && data.newsResults.length > 0}
						<ol class="space-y-2">
							{#each data.newsResults as result}
								<li><NewsResultItem {result} /></li>
							{/each}
						</ol>
					{:else if data.query && !data.error}
						<p class="text-sm text-[var(--app-muted)]">No news results found.</p>
					{/if}
				{:else if data.tab === 'videos'}
					{#if data.videoResults && data.videoResults.length > 0}
						<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{#each data.videoResults as result}
								<VideoResultItem {result} />
							{/each}
						</div>
					{:else if data.query && !data.error}
						<p class="text-sm text-[var(--app-muted)]">No video results found.</p>
					{/if}
				{:else if data.tab === 'images'}
					{#if data.imageResults && data.imageResults.length > 0}
						<ImageGrid images={data.imageResults} />
					{:else if data.query && !data.error}
						<p class="text-sm text-[var(--app-muted)]">No image results found.</p>
					{/if}
				{/if}
			</div>

			<!-- Right column: knowledge panel -->
			{#if data.infobox && data.tab === 'web'}
				<div class="hidden w-[380px] shrink-0 lg:block">
					<div class="sticky top-[120px]">
						<Infobox infobox={data.infobox} />
					</div>
				</div>
			{/if}
		</div>
	</div>
</main>
