<script lang="ts">
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import Slide from './lib/SlideComponent.svelte';
	import { removeLastSlide, slidesContainerHeight, slideStack } from './lib/slide.service';
	import { tick } from 'svelte';

	let slidesContainerElement: HTMLDivElement;
	let animationDirection: (1|-1) = 1;

	async function handleBackButtonClick() {
		animationDirection = -1;
		// Use `await` to notify the animation direction immediately before the in/out animations are triggered
		await tick();

		removeLastSlide();

		// Don't return to the regular animation direction until the in/out animations have been triggered
		await tick();
		animationDirection = 1;
	}

	$: if (slidesContainerElement) {
		slidesContainerElement.style.height = `${$slidesContainerHeight}px`;
	}
</script>

<main>
	<div class="content">
		<button
			type="button"
			class="back-button"
			class:invisible={$slideStack.length === 1}
			on:click={handleBackButtonClick}
		>&lt; Atrás</button>
		<div
			class="slides-container"
			bind:this={slidesContainerElement}
		>
			{#each [$slideStack.at(-1)] as slide (slide)}
				<div
					in:fly={{ y: animationDirection * 500, duration: 500 }}
					out:fly={{ y: animationDirection * -500, duration: 500 }}
					animate:flip={{ duration: 500 }}
				>
					<Slide {slide} />
				</div>
			{/each}
		</div>
	</div>
</main>

<style lang="scss">
	main {
		height: 100dvh;
		background-color: cornflowerblue;
		@media (orientation: landscape) {
			background-image: url('assets/fantastic-sunset.jpg');
		}
		@media (orientation: portrait) {
			background-image: url('assets/heaven-and-hell.jpg');
		}
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		display: flex;
    	justify-content: center;
		place-items: center;
		padding: 0 32px;
	}

	.content {
		width: 100%;
    	max-width: 500px;
	}

	.back-button {
		padding: 6px 12px;
		background-color: white;
		font-size: small;
		border: none;
		border-radius: 8px;
		opacity: 0.4;
		margin-bottom: 8px;

		&:hover {
			opacity: 1;
			background-color: white;
		}

		&:active {
			opacity: 0.6;
		}
	}

	.slides-container {
		width: 100%;
		min-height: 300px;
		background-color: white;
		border-radius: 24px;
		position: relative;
		overflow: hidden;
		transition: height 400ms ease;
	}
</style>
