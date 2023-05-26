<script lang="ts">
	import {
		Button,
		Dropdown,
		DropdownItem,
		DropdownMenu,
		DropdownToggle
	} from 'sveltestrap';
	import type { SlideClass } from './slide';
	import { addSlideByKey } from './slide.service';

	export let slide: SlideClass;
</script>

<div
	class="slide-component"
	bind:clientHeight={slide.componentHeight}
>
	<div class="content">
		<div>
			{@html slide.question}
		</div>
	</div>
	<div class="footer">
		{#if slide.buttons.length > 3}
			<Dropdown>
				<DropdownToggle caret>Yo soy...</DropdownToggle>
				<DropdownMenu>
					{#each slide.buttons as button}
						<DropdownItem on:click={() => {
							if (button.acceptsSin) {
								slide.handleClick();
							}
							addSlideByKey(button.slideToGo);
						}}>{button.text}</DropdownItem>
					{/each}
				</DropdownMenu>
			</Dropdown>
		{:else}
			{#each slide.buttons as button}
				<Button on:click={() => {
					if (button.acceptsSin) {
						slide.handleClick();
					}
					addSlideByKey(button.slideToGo);
				}}>{button.text}</Button>
			{/each}
		{/if}
	</div>
</div>

<style lang="scss">
	.slide-component {
		width: 100%;
		min-height: 300px;
		padding: 1rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
	}

	.content {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.footer {
		display: flex;
    	justify-content: space-evenly;
		gap: 1rem;
	}
</style>
