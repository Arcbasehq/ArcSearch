<script lang="ts">
	import './layout.css';
	import { afterNavigate } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { themeStore, themes, themeKeys } from '$lib/stores/theme';
	import { settingsStore, getToggle } from '$lib/stores/settings';
	import { reducedMotion } from '$lib/stores/motion';
	import { historyStore } from '$lib/stores/history';
	import { onMount } from 'svelte';

	let menuOpen = $state(false);

	const searchLinks = [
		{ label: 'Homepage', href: '/' },
		{ label: 'About', href: '/about' },
		{ label: 'Settings', href: '/settings' }
	];

	let { children } = $props();

	afterNavigate(() => {
		menuOpen = false;
	});

	let keyboardShortcut = $derived(getToggle($settingsStore, 'keyboard-shortcut'));
	let reduceMotion = $derived(getToggle($settingsStore, 'reduce-motion', false));

	$effect(() => {
		if (reduceMotion) {
			document.documentElement.setAttribute('data-reduce-motion', '');
		} else {
			document.documentElement.removeAttribute('data-reduce-motion');
		}
	});

	function handleKeydown(event: KeyboardEvent) {
		if (
			keyboardShortcut &&
			event.key === '/' &&
			!(event.target instanceof HTMLInputElement) &&
			!(event.target instanceof HTMLTextAreaElement) &&
			!(event.target as HTMLElement)?.isContentEditable
		) {
			event.preventDefault();
			document.querySelector<HTMLInputElement>('input[name="q"]')?.focus();
		}
	}

	onMount(() => {
		themeStore.load();
		settingsStore.load();
		historyStore.load();
	});
</script>

<svelte:head>
	<meta name="description" content="Search the web privately with ArcSearch. No tracking, no profiles, no ads. Fast, clean results from an independent search index." />
	<meta property="og:site_name" content="ArcSearch" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@arcsearch" />
	<link rel="icon" href="/logo.png" />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<button
	type="button"
	class="fixed top-4 right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full text-zinc-100 transition hover:bg-[var(--app-hover)] focus-visible:ring-2 focus-visible:ring-slate-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-background)] focus-visible:outline-none"
	aria-label="Open menu"
	aria-expanded={menuOpen}
	onclick={() => (menuOpen = !menuOpen)}
>
	<i class="fa-solid fa-bars text-[18px]"></i>
</button>

{#if menuOpen}
	<button
		type="button"
		class="fixed inset-0 z-30 bg-black/40"
		aria-label="Close menu"
		onclick={() => (menuOpen = false)}
		transition:fade={{ duration: $reducedMotion ? 0 : 200 }}
	></button>

	<aside
		class="fixed top-0 right-0 z-40 flex h-full w-full flex-col overflow-y-auto border-l border-[var(--app-border)] bg-[#262626] px-5 py-6 text-zinc-50 shadow-2xl shadow-black/30 sm:w-[20rem]"
		transition:fly={{ x: 400, duration: $reducedMotion ? 0 : 280, easing: cubicOut }}
	>
		<div class="flex items-center justify-between">
			<p class="text-sm font-medium tracking-[0.2em] text-zinc-400 uppercase">Menu</p>
			<button
				type="button"
				class="rounded-full p-2 text-zinc-400 transition hover:bg-[var(--app-hover)] hover:text-zinc-100"
				aria-label="Close menu"
				onclick={() => (menuOpen = false)}
			>
				<i class="fa-solid fa-xmark"></i>
			</button>
		</div>

		<!-- Nav links -->
		<section class="mt-8 space-y-2">
			<div class="text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase">Navigate</div>
			<nav class="space-y-0.5">
				{#each [
					{ label: 'Homepage', href: '/', icon: 'fa-house' },
					{ label: 'About', href: '/about', icon: 'fa-circle-info' },
					{ label: 'Settings', href: '/settings', icon: 'fa-sliders' }
				] as link (link.href)}
					<a
						class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-[var(--app-hover)] hover:text-white"
						href={link.href}
					>
						<i class="fa-solid {link.icon} w-4 text-center text-xs text-zinc-500"></i>
						{link.label}
					</a>
				{/each}
			</nav>
		</section>

		<!-- Quick toggles -->
		<section class="mt-8 space-y-2">
			<div class="text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase">Quick settings</div>
			<div class="space-y-0.5">
				{#each [
					{ id: 'block-ads', label: 'Ad blocker' },
					{ id: 'block-trackers', label: 'Tracker protection' },
					{ id: 'safe-search', label: 'Safe search' },
					{ id: 'open-new-tab', label: 'Open in new tab' }
				] as s}
					{@const checked = getToggle($settingsStore, s.id)}
					<button
						type="button"
						onclick={() => settingsStore.toggle(s.id)}
						class="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition hover:bg-[var(--app-hover)]"
					>
						<span class={checked ? 'text-zinc-100' : 'text-zinc-500'}>{s.label}</span>
						<div class={checked
							? 'flex h-5 w-5 items-center justify-center rounded-full bg-[var(--app-accent)] text-[#111]'
							: 'h-5 w-5 rounded-full border border-[var(--app-border)]'}>
							{#if checked}<i class="fa-solid fa-check text-[9px]"></i>{/if}
						</div>
					</button>
				{/each}
			</div>
		</section>

		<!-- Theme picker -->
		<section class="mt-8 space-y-2">
			<div class="text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase">Theme</div>
			<div class="grid grid-cols-4 gap-2">
				{#each themeKeys as key}
					{@const theme = themes[key]}
					<button
						type="button"
						onclick={() => themeStore.setTheme(key)}
						class="group flex flex-col items-center gap-1.5"
					>
						<div
							class="relative h-10 w-full overflow-hidden rounded-lg border-2 transition"
							style="background:{theme.background}; border-color:{$themeStore === key ? theme.accent : 'rgba(255,255,255,0.1)'}"
						>
							<div class="mx-1.5 mt-1.5 h-1 rounded-full" style="background:{theme.accent}"></div>
							<div class="mx-1.5 mt-1 h-0.5 rounded-full opacity-30" style="background:{theme.text}"></div>
							{#if $themeStore === key}
								<div class="absolute inset-0 flex items-center justify-center">
									<i class="fa-solid fa-check text-[9px]" style="color:{theme.accent}"></i>
								</div>
							{/if}
						</div>
						<span class="text-[10px]" style={$themeStore === key ? `color:${theme.accent}` : 'color:#71717a'}>{theme.name}</span>
					</button>
				{/each}
			</div>
		</section>

		<!-- History -->
		{#if $historyStore.length > 0}
			<section class="mt-8 space-y-2">
				<div class="flex items-center justify-between">
					<div class="text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase">Recent</div>
					<button
						type="button"
						onclick={() => historyStore.clear()}
						class="text-xs text-zinc-600 transition hover:text-zinc-400"
					>
						Clear
					</button>
				</div>
				<div class="space-y-0.5">
					{#each $historyStore.slice(0, 5) as item}
						<a
							href="/search?q={encodeURIComponent(item)}"
							class="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-[var(--app-hover)] hover:text-zinc-100"
						>
							<i class="fa-solid fa-clock-rotate-left text-[10px] text-zinc-600"></i>
							<span class="truncate">{item}</span>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<div class="mt-auto pt-8 text-xs text-zinc-600">
			Press <kbd class="rounded border border-[var(--app-border)] px-1 py-0.5 font-mono">/</kbd> to focus search
		</div>
	</aside>
{/if}

{@render children()}
