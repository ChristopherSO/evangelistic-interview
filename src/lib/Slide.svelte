<script lang="ts">
	import {
		Button,
		Dropdown,
		DropdownItem,
		DropdownMenu,
		DropdownToggle
	} from 'sveltestrap';
	import type { IButton } from './interfaces';
	import { addSlideByKey } from './storeService';

	export let question:string;
	export let buttons: IButton[];
	export let isVisible: boolean = false;
</script>

<div
	class="slide"
	class:visible={isVisible}
>
	<div class="content">
		<div>
			{@html question}
		</div>
	</div>
	<div class="footer">
		{#if buttons.length > 3}
			<Dropdown>
				<DropdownToggle caret>Soy...</DropdownToggle>
				<DropdownMenu>					
					{#each buttons as button}
						<DropdownItem on:click={() => {
							button.action?.();
							addSlideByKey(button.slideToGo);
						}}>{button.text}</DropdownItem>
					{/each}
				</DropdownMenu>
			</Dropdown>
		{:else}
			{#each buttons as button}
				<Button on:click={() => {
					button.action?.();
					addSlideByKey(button.slideToGo);
				}}>{button.text}</Button>
			{/each}
		{/if}
	</div>
</div>

<style lang="scss">
	.slide {
		width: 100%;
		min-height: 300px;
		padding: 1rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
    	opacity: 0;
		transition: opacity 300ms ease 0s;

		&.visible {
			opacity: 1;
		}
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
