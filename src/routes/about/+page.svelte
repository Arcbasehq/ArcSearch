<script lang="ts">
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { settingsStore, getToggle } from '$lib/stores/settings';

	let query = $state('');
	let safesearch = $derived(getToggle($settingsStore, 'safe-search'));
</script>

<svelte:head>
	<title>About - ArcSearch</title>
	<meta
		name="description"
		content="ArcSearch is a private search engine that never logs your queries, builds profiles, or sells ads. Learn how it works and why privacy comes first."
	/>
	<link rel="canonical" href="https://search.arcbase.one/about" />

	<!-- Open Graph -->
	<meta property="og:title" content="About - ArcSearch" />
	<meta
		property="og:description"
		content="ArcSearch is a private search engine that never logs your queries, builds profiles, or sells ads."
	/>
	<meta property="og:url" content="https://search.arcbase.one/about" />
	<meta property="og:image" content="https://search.arcbase.one/og-image.png" />

	<!-- Twitter -->
	<meta name="twitter:title" content="About - ArcSearch" />
	<meta
		name="twitter:description"
		content="ArcSearch is a private search engine that never logs your queries, builds profiles, or sells ads."
	/>

	<!-- JSON-LD: Organization -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'ArcSearch',
		url: 'https://search.arcbase.one',
		logo: 'https://search.arcbase.one/favicon.png',
		description: 'A private search engine with no tracking, no profiles, and no ads.',
		sameAs: []
	})}</script>`}
</svelte:head>

<!-- Sticky header -->
<header
	class="sticky top-0 z-20 border-b border-white/5 bg-[var(--app-background)]/95 backdrop-blur"
>
	<div class="mx-auto w-full max-w-[1100px] pr-14 pl-4 sm:px-6">
		<div class="flex items-center gap-3 py-3 sm:gap-5">
			<a
				href="/"
				class="hidden shrink-0 text-lg font-semibold tracking-tight text-[var(--app-text)] sm:block"
				>ArcSearch</a
			>
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
	</div>
</header>

<main class="bg-[var(--app-background)] text-[var(--app-text)]">
	<!-- Hero -->
	<section class="mx-auto w-full max-w-[1100px] px-6 py-16 text-center sm:py-24">
		<img
			src="/logo.png"
			alt="ArcSearch"
			class="mx-auto mb-6 h-16 w-16 rounded-2xl sm:mb-8 sm:h-20 sm:w-20"
		/>
		<h1 class="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
			Search the web.<br />
			<span class="text-[var(--app-accent)]">Leave no trace.</span>
		</h1>
		<p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-[var(--app-muted)]">
			ArcSearch is a private search engine that gives you real results without logging your queries,
			building a profile on you, or selling your attention.
		</p>
		<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
			<a
				href="/"
				class="inline-flex items-center gap-2 rounded-2xl bg-[var(--app-accent)] px-6 py-3 text-sm font-semibold text-[#111111] transition hover:opacity-90"
			>
				<i class="fa-solid fa-magnifying-glass text-xs"></i>
				Start searching
			</a>
			<a
				href="/settings"
				class="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-3 text-sm font-semibold text-[var(--app-text)] transition hover:bg-white/5"
			>
				<i class="fa-solid fa-sliders text-xs"></i>
				Customize settings
			</a>
			<a
				href="https://github.com/Arcbasehq/ArcSearch"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-3 text-sm font-semibold text-[var(--app-text)] transition hover:bg-white/5"
			>
				<i class="fa-brands fa-github text-xs"></i>
				View on GitHub
			</a>
		</div>
	</section>

	<div class="border-t border-white/5"></div>

	<!-- Privacy pillars -->
	<section class="mx-auto w-full max-w-[1100px] px-6 py-12 sm:py-20">
		<h2 class="mb-12 text-center text-2xl font-bold tracking-tight">
			Privacy isn't a feature. It's the foundation.
		</h2>
		<div class="grid gap-6 sm:grid-cols-3">
			{#each [{ icon: 'fa-eye-slash', title: 'No tracking', color: 'text-emerald-400', bg: 'bg-emerald-500/15', desc: 'We never log your searches, store your IP, or tie queries to any account. Every search starts completely fresh.' }, { icon: 'fa-database', title: 'No profiles', color: 'text-blue-400', bg: 'bg-blue-500/15', desc: "We never build an advertising profile from your searches. Your data isn't packaged or sold to anyone, ever." }, { icon: 'fa-lock', title: 'Local by default', color: 'text-violet-400', bg: 'bg-violet-500/15', desc: 'Your settings, history, and theme are stored entirely in your browser. Nothing is synced to any server.' }] as pillar}
				<div class="rounded-2xl border border-white/8 bg-white/[0.02] p-7">
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl {pillar.bg} {pillar.color}"
					>
						<i class="fa-solid {pillar.icon} text-xl"></i>
					</div>
					<h3 class="mb-2 text-lg font-semibold">{pillar.title}</h3>
					<p class="text-sm leading-7 text-[var(--app-muted)]">{pillar.desc}</p>
				</div>
			{/each}
		</div>
	</section>

	<div class="border-t border-white/5"></div>

	<!-- How it works -->
	<section class="mx-auto w-full max-w-[1100px] px-6 py-12 sm:py-20">
		<div class="grid gap-16 lg:grid-cols-2 lg:gap-24">
			<div>
				<p class="mb-3 text-xs font-semibold tracking-widest text-[var(--app-accent)] uppercase">
					How it works
				</p>
				<h2 class="mb-6 text-3xl font-bold tracking-tight">
					Real results without the surveillance.
				</h2>
				<p class="mb-4 text-sm leading-7 text-[var(--app-muted)]">
					ArcSearch uses an independent search index that doesn't rely on Big Tech - so you get
					genuine, unfiltered results instead of a curated feed designed to keep you clicking.
				</p>
				<p class="text-sm leading-7 text-[var(--app-muted)]">
					Your query travels from your browser to our server, which forwards it on your behalf. The
					search index never sees who you are - your IP address, cookies, and browser fingerprint
					stay hidden.
				</p>
			</div>
			<div class="space-y-3">
				{#each [{ icon: 'fa-keyboard', label: 'You type a query', color: 'text-[var(--app-accent)]', bg: 'bg-[var(--app-accent)]/10' }, { icon: 'fa-server', label: 'ArcSearch proxies it anonymously', color: 'text-blue-400', bg: 'bg-blue-500/10' }, { icon: 'fa-globe', label: 'Real results come back to you', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }, { icon: 'fa-display', label: 'You see results - nothing is stored', color: 'text-violet-400', bg: 'bg-violet-500/10' }] as step, i}
					<div
						class="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4"
					>
						<div
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl {step.bg} {step.color}"
						>
							<i class="fa-solid {step.icon} text-sm"></i>
						</div>
						<span class="text-sm font-medium">{step.label}</span>
						<span class="ml-auto text-xs font-bold text-[var(--app-muted)] tabular-nums"
							>{i + 1}</span
						>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<div class="border-t border-white/5"></div>

	<!-- Features grid -->
	<section class="mx-auto w-full max-w-[1100px] px-6 py-12 sm:py-20">
		<p
			class="mb-3 text-center text-xs font-semibold tracking-widest text-[var(--app-accent)] uppercase"
		>
			Features
		</p>
		<h2 class="mb-12 text-center text-2xl font-bold tracking-tight">
			Everything you'd expect. Nothing you don't.
		</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each [{ icon: 'fa-newspaper', title: 'News', desc: 'Top stories from across the web, without the filter bubble.' }, { icon: 'fa-play', title: 'Videos', desc: 'Find and preview videos from any source.' }, { icon: 'fa-image', title: 'Images', desc: 'Visual search with a clean, responsive grid.' }, { icon: 'fa-bolt', title: 'Instant answers', desc: 'Knowledge panels for quick facts about people, places, and things.' }, { icon: 'fa-clock-rotate-left', title: 'Search history', desc: 'Optional local-only history for fast autocomplete. Clear it any time.' }, { icon: 'fa-palette', title: 'Themes', desc: 'Light, dark, slate, and sand - switch any time from settings.' }] as f}
				<div class="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
					<div
						class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[var(--app-accent)]"
					>
						<i class="fa-solid {f.icon} text-sm"></i>
					</div>
					<div>
						<p class="mb-1 text-sm font-semibold">{f.title}</p>
						<p class="text-xs leading-5 text-[var(--app-muted)]">{f.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<div class="border-t border-white/5"></div>

	<!-- CTA -->
	<section class="mx-auto w-full max-w-[1100px] px-6 py-16 text-center sm:py-24">
		<h2 class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Ready to search privately?</h2>
		<p class="mb-8 text-[var(--app-muted)]">No sign-up. No tracking. Just search.</p>
		<a
			href="/"
			class="inline-flex items-center gap-2 rounded-2xl bg-[var(--app-accent)] px-8 py-3.5 text-sm font-semibold text-[#111111] transition hover:opacity-90"
		>
			<i class="fa-solid fa-magnifying-glass text-xs"></i>
			Try ArcSearch
		</a>
	</section>
</main>

<footer class="border-t border-white/5 bg-[var(--app-background)]">
	<div class="mx-auto w-full max-w-[1100px] px-6 py-12">
		<div class="flex flex-col gap-8 sm:flex-row sm:justify-between">
			<!-- Brand -->
			<div class="max-w-xs space-y-3">
				<p class="text-base font-bold tracking-tight text-[var(--app-text)]">ArcSearch</p>
				<p class="text-sm leading-6 text-[var(--app-muted)]">
					A private search engine that puts you in control. No tracking, no profiles, no ads.
				</p>
			</div>

			<!-- Links -->
			<div class="flex gap-16">
				<div class="space-y-3">
					<p class="text-xs font-semibold tracking-widest text-[var(--app-muted)] uppercase">
						Search
					</p>
					<ul class="space-y-2 text-sm">
						<li>
							<a href="/" class="text-[var(--app-muted)] transition hover:text-[var(--app-text)]"
								>Home</a
							>
						</li>
						<li>
							<a
								href="/search?q=news"
								class="text-[var(--app-muted)] transition hover:text-[var(--app-text)]">News</a
							>
						</li>
						<li>
							<a
								href="/search?q=videos&t=videos"
								class="text-[var(--app-muted)] transition hover:text-[var(--app-text)]">Videos</a
							>
						</li>
						<li>
							<a
								href="/search?q=images&t=images"
								class="text-[var(--app-muted)] transition hover:text-[var(--app-text)]">Images</a
							>
						</li>
					</ul>
				</div>
				<div class="space-y-3">
					<p class="text-xs font-semibold tracking-widest text-[var(--app-muted)] uppercase">
						Product
					</p>
					<ul class="space-y-2 text-sm">
						<li>
							<a
								href="/about"
								class="text-[var(--app-muted)] transition hover:text-[var(--app-text)]">About</a
							>
						</li>
						<li>
							<a
								href="/settings"
								class="text-[var(--app-muted)] transition hover:text-[var(--app-text)]">Settings</a
							>
						</li>
						<li>
							<a
								href="/settings#appearance"
								class="text-[var(--app-muted)] transition hover:text-[var(--app-text)]">Themes</a
							>
						</li>
						<li>
							<a
								href="https://github.com/Arcbasehq/ArcSearch"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1.5 text-[var(--app-muted)] transition hover:text-[var(--app-text)]"
							>
								<i class="fa-brands fa-github text-xs"></i>
								GitHub
							</a>
						</li>
					</ul>
				</div>
				<div class="space-y-3">
					<p class="text-xs font-semibold tracking-widest text-[var(--app-muted)] uppercase">
						Company
					</p>
					<ul class="space-y-2 text-sm">
						<li>
							<a
								href="https://arcbase.one"
								class="text-[var(--app-muted)] transition hover:text-[var(--app-text)]"
								target="_blank">Arcbase</a
							>
						</li>
						<li>
							<a
								href="https://ai.arcbase.one"
								class="text-[var(--app-muted)] transition hover:text-[var(--app-text)]"
								target="_blank">OtterAI</a
							>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<div
			class="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row sm:items-center"
		>
			<div class="flex items-center gap-3">
				<p class="text-xs text-[var(--app-muted)]">
					© {new Date().getFullYear()} ArcSearch. Built for privacy.
				</p>
				<span class="text-[var(--app-muted)]">·</span>
				<span
					class="rounded-full border border-white/8 bg-white/[0.03] px-2 py-0.5 text-xs text-[var(--app-muted)]"
					>v0.0.1</span
				>
			</div>
			<div
				class="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5"
			>
				<div class="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
				<span class="text-xs text-[var(--app-muted)]">No cookies. No logs. No tracking.</span>
			</div>
		</div>
	</div>
</footer>
