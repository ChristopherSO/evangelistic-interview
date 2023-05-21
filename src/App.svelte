<script lang="ts">
	import Slide from './lib/SlideComponent.svelte';
	import { slideStack, slidesWrapperTranslatePixels, removeLastSlide, windowHeight } from './lib/slide.service';

	let windowElement: HTMLDivElement;

	$: if (windowElement) {
		windowElement.style.height = `${$windowHeight}px`;
	}
</script>

<main>
	<div class="content">
		<button
			class="back-button"
			class:invisible={$slideStack.length === 1}
			on:click={removeLastSlide}
		>&lt; Atrás</button>
		<div
			class="window"
			bind:this={windowElement}
		><!-- *** TODO: Este nombre de clase podría mejorarse, ya que en JavaScript la palabra window se refiere al objeto window o contexto global ***************************************-->
			<div class="slides-wrapper" style="transform: translateY({$slidesWrapperTranslatePixels}px)">
				{#each $slideStack as slide}
					<Slide {slide} />
				{/each}
			</div>
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

	.window {
		width: 100%;
		min-height: 300px;
		background-color: white;
		border-radius: 24px;
		position: relative;
		overflow: hidden;
		transition: height 400ms ease;
	}

	.slides-wrapper {
		position: absolute;
		width: 100%;
		display: flex;
    	flex-direction: column;
		gap: 200px;
		transition: transform 400ms ease;
	}
</style>
