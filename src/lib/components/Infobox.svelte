<script lang="ts">
	import type { Infobox } from '$lib/search';

	let { infobox } = $props<{ infobox: Infobox }>();

	let attrs = $derived((infobox.attributes ?? []).slice(0, 8));
</script>

<aside class="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-panel)]/40">
	{#if infobox.imageUrl}
		<img
			src={infobox.imageUrl}
			alt={infobox.title}
			class="h-44 w-full object-cover"
			onerror={(e) => {
				(e.currentTarget as HTMLImageElement).style.display = 'none';
			}}
		/>
	{/if}

	<div class="space-y-4 p-5">
		<div>
			<h2 class="text-xl font-semibold text-[var(--app-text)]">{infobox.title}</h2>
		</div>

		{#if infobox.description}
			<p class="text-sm leading-6 text-[var(--app-muted)]">{infobox.description}</p>
		{/if}

		{#if infobox.url}
			<a
				href={infobox.url}
				target="_blank"
				rel="noreferrer noopener"
				class="inline-flex items-center gap-1.5 text-xs text-[var(--app-accent)] transition hover:underline"
			>
				Continue reading
				<i class="fa-solid fa-arrow-right text-[10px]"></i>
			</a>
		{/if}

		{#if attrs.length > 0}
			<div class="border-t border-[var(--app-border)] pt-4">
				<dl class="space-y-2">
					{#each attrs as [key, value]}
						<div class="grid grid-cols-[auto_1fr] gap-x-4 text-sm">
							<dt class="shrink-0 text-[var(--app-muted)]">{key}</dt>
							<dd class="text-[var(--app-text)]">{value}</dd>
						</div>
					{/each}
				</dl>
			</div>
		{/if}

		{#if infobox.profiles && infobox.profiles.length > 0}
			<div class="border-t border-[var(--app-border)] pt-4">
				<p class="mb-2 text-xs font-medium text-[var(--app-muted)] uppercase tracking-wider">Quick links</p>
				<div class="flex flex-wrap gap-x-4 gap-y-1">
					{#each infobox.profiles as profile}
						<a
							href={profile.url}
							target="_blank"
							rel="noreferrer noopener"
							class="text-sm text-[var(--app-accent)] transition hover:underline"
						>
							{profile.network}
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</aside>
