<script lang="ts">
	let {
		value = $bindable(''),
		options = [],
		onchange
	} = $props<{
		value?: string;
		options: Array<{ label: string; value: string }>;
		onchange?: (value: string) => void;
	}>();

	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { reducedMotion } from '$lib/stores/motion';

	let open = $state(false);
	let buttonEl: HTMLButtonElement | null = null;

	let currentLabel = $derived(options.find((o) => o.value === value)?.label ?? options[0]?.label ?? '');

	function select(val: string) {
		value = val;
		open = false;
		onchange?.(val);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative">
	<button
		bind:this={buttonEl}
		type="button"
		onclick={() => (open = !open)}
		class="flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3.5 py-1.5 text-xs font-medium text-[var(--app-text)] transition hover:border-white/20 hover:bg-white/12 focus:outline-none"
	>
		<span>{currentLabel}</span>
		<i class="fa-solid fa-chevron-down text-[10px] text-[var(--app-muted)] transition-transform duration-150" class:rotate-180={open}></i>
	</button>

	{#if open}
		<!-- Backdrop -->
		<button
			type="button"
			class="fixed inset-0 z-30"
			aria-label="Close"
			tabindex="-1"
			onclick={() => (open = false)}
		></button>

		<!-- Dropdown -->
		<div class="absolute right-0 z-40 mt-1.5 min-w-[10rem] overflow-hidden rounded-xl border border-white/10 bg-[#1f1f1f] py-1 shadow-2xl shadow-black/40"
			transition:fly={{ y: -4, duration: $reducedMotion ? 0 : 140, easing: cubicOut }}>
			{#each options as opt}
				<button
					type="button"
					onclick={() => select(opt.value)}
					class={opt.value === value
						? 'flex w-full items-center justify-between gap-6 px-4 py-2 text-left text-sm font-medium text-[var(--app-text)] bg-white/8'
						: 'flex w-full items-center px-4 py-2 text-left text-sm text-[var(--app-muted)] transition hover:bg-white/5 hover:text-[var(--app-text)]'}
				>
					{opt.label}
					{#if opt.value === value}
						<i class="fa-solid fa-check text-[10px] text-[var(--app-accent)]"></i>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
