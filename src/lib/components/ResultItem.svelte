<script lang="ts">
	import { formatDisplayUrl } from '$lib/search';
	import { settingsStore, getToggle } from '$lib/stores/settings';

	let {
		result
	} = $props<{
		result: {
			title: string;
			url: string;
			snippet: string;
			siteName?: string;
			age?: string;
			thumbnail?: string;
			sitelinks?: Array<{ title: string; url: string }>;
		};
	}>();

	let openInNewTab = $derived(getToggle($settingsStore, 'open-new-tab'));
	let showFavicons = $derived(getToggle($settingsStore, 'show-favicons'));
	let showSitelinks = $derived(getToggle($settingsStore, 'show-sitelinks'));
	let showAge = $derived(getToggle($settingsStore, 'show-age'));
	let compact = $derived(getToggle($settingsStore, 'compact-results', false));
	let stripTracking = $derived(getToggle($settingsStore, 'strip-tracking', false));
	let noReferrer = $derived(getToggle($settingsStore, 'no-referrer', false));

	let domain = $derived.by(() => {
		try {
			return new URL(result.url).hostname;
		} catch {
			return '';
		}
	});

	let href = $derived.by(() => {
		if (!stripTracking) return result.url;
		try {
			const u = new URL(result.url);
			['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'ref', 'source'].forEach((p) => u.searchParams.delete(p));
			return u.toString();
		} catch {
			return result.url;
		}
	});
</script>

<article class="group rounded-2xl px-1 transition hover:bg-white/5">
	<a
		{href}
		target={openInNewTab ? '_blank' : '_self'}
		rel={noReferrer ? 'noreferrer noopener' : 'noopener'}
		class={compact
			? 'block rounded-2xl px-3 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)]/50'
			: 'block rounded-2xl px-3 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)]/50'}
	>
		<div class={compact ? 'space-y-0.5' : 'space-y-1.5'}>
			<!-- Site breadcrumb row -->
			<div class="flex items-center gap-2">
				{#if showFavicons && domain}
					<img
						src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
						alt=""
						width="16"
						height="16"
						class="h-4 w-4 shrink-0 rounded-sm"
						onerror={(e) => {
							(e.currentTarget as HTMLImageElement).style.display = 'none';
						}}
					/>
				{/if}
				<div class="flex min-w-0 items-baseline gap-1 text-sm">
					{#if result.siteName}
						<span class="font-medium text-[var(--app-text)]">{result.siteName}</span>
						<span class="text-[var(--app-muted)]">›</span>
					{/if}
					<span class="truncate text-xs text-[var(--app-muted)]">{formatDisplayUrl(result.url)}</span>
				</div>
				{#if showAge && result.age}
					<span class="ml-auto shrink-0 text-xs text-[var(--app-muted)]">{result.age}</span>
				{/if}
			</div>

			<!-- Title -->
			<h2 class={compact
				? 'text-sm font-medium leading-snug text-[var(--app-accent)] group-hover:underline'
				: 'text-[17px] font-medium leading-snug text-[var(--app-accent)] group-hover:underline'}>
				{result.title}
			</h2>

			<!-- Snippet — hidden in compact mode -->
			{#if result.snippet && !compact}
				<p class="text-sm leading-6 text-zinc-300">{result.snippet}</p>
			{/if}
		</div>
	</a>

	<!-- Sitelinks -->
	{#if showSitelinks && result.sitelinks && result.sitelinks.length >= 2}
		<div class="mt-1 grid grid-cols-2 gap-x-6 gap-y-1 px-3 pb-3">
			{#each result.sitelinks.slice(0, 6) as sitelink}
				<a
					href={sitelink.url}
					target={openInNewTab ? '_blank' : '_self'}
					rel="noreferrer noopener"
					class="truncate text-sm text-[var(--app-accent)] hover:underline"
				>
					{sitelink.title}
				</a>
			{/each}
		</div>
	{/if}
</article>
