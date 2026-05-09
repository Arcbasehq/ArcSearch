<script lang="ts">
	import type { VideoResult } from '$lib/search';
	import { settingsStore } from '$lib/stores/settings';

	let { result } = $props<{ result: VideoResult }>();

	let openInNewTab = $derived(
		$settingsStore.find((s) => s.id === 'open-new-tab')?.checked ?? true
	);
</script>

<article
	class="group overflow-hidden rounded-2xl border border-white/10 bg-[var(--app-panel)]/30 transition hover:border-white/20"
>
	<a
		href={result.url}
		target={openInNewTab ? '_blank' : '_self'}
		rel="noreferrer noopener"
		class="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)]/50"
	>
		<div class="relative aspect-video bg-black/30">
			{#if result.thumbnail}
				<img
					src={result.thumbnail}
					alt={result.title}
					class="h-full w-full object-cover"
					onerror={(e) => {
						(e.currentTarget as HTMLImageElement).style.display = 'none';
					}}
				/>
			{/if}
			{#if result.duration}
				<span
					class="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white"
				>
					{result.duration}
				</span>
			{/if}
			<div
				class="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100"
			>
				<div
					class="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm"
				>
					<i class="fa-solid fa-play text-sm"></i>
				</div>
			</div>
		</div>
		<div class="space-y-1 p-3">
			<h2 class="text-sm font-medium leading-snug text-[var(--app-text)] line-clamp-2 group-hover:text-[var(--app-accent)]">
				{result.title}
			</h2>
			<div class="flex items-center gap-1.5 text-xs text-[var(--app-muted)]">
				{#if result.publisher}
					<span>{result.publisher}</span>
				{/if}
				{#if result.views}
					<span>·</span><span>{result.views}</span>
				{/if}
				{#if result.age}
					<span>·</span><span>{result.age}</span>
				{/if}
			</div>
		</div>
	</a>
</article>
