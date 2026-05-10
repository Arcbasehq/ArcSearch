<script lang="ts">
	import type { ImageResult } from '$lib/search';
	import { settingsStore } from '$lib/stores/settings';

	let { images } = $props<{ images: ImageResult[] }>();

	let openInNewTab = $derived(
		$settingsStore.find((s) => s.id === 'open-new-tab')?.checked ?? true
	);
</script>

<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
	{#each images as image (image.imageUrl)}
		<a
			href={image.url}
			target={openInNewTab ? '_blank' : '_self'}
			rel="noreferrer noopener"
			class="group overflow-hidden rounded-xl border border-[var(--app-border)] transition hover:border-[var(--app-border)]"
			title={image.title}
		>
			<div class="aspect-square bg-[var(--app-surface)]">
				<img
					src={image.thumbnail}
					alt={image.title}
					loading="lazy"
					class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
					onerror={(e) => {
						(e.currentTarget as HTMLImageElement).style.display = 'none';
					}}
				/>
			</div>
			<div class="px-2 py-1.5">
				<p class="truncate text-xs text-[var(--app-muted)]">{image.source ?? image.title}</p>
			</div>
		</a>
	{/each}
</div>
