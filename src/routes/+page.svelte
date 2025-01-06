<script lang="ts">
	import { onMount } from 'svelte';
	import { stockStore } from '$lib/stores/StockStore.svelte';
	import VirtualList from 'svelte-tiny-virtual-list';
	import StockChart from '../components/StockChart.svelte';

	onMount(() => {
		stockStore.loadData();
	});
</script>

{#if stockStore.isLoading}
	<div class="flex justify-center items-center h-32">
		<div class="loading loading-spinner loading-lg"></div>
	</div>
{:else if stockStore.error}
	<div class="alert alert-error">
		{stockStore.error}
	</div>
{:else}
	<StockChart data={stockStore.data} />
	<div class="stats shadow">
		<div class="stat">
			<div class="stat-title">Latest Price</div>
			<div class="stat-value">{stockStore.latestPrice}</div>
		</div>

		<div class="stat">
			<div class="stat-title">Average Price</div>
			<div class="stat-value">{stockStore.averagePrice.toFixed(2)}</div>
		</div>

		<div class="stat">
			<div class="stat-title">Total Records</div>
			<div class="stat-value">{stockStore.data.length}</div>
		</div>
	</div>

	<div class="overflow-x-auto w-full">
		<!-- Header -->
		<div class="grid grid-cols-5 gap-4 font-bold p-4 bg-base-200">
			<div>Time</div>
			<div>LTP</div>
			<div>Buy Price</div>
			<div>Sell Price</div>
			<div>Volume</div>
		</div>

		<!-- Virtual List -->
		<VirtualList width="100%" height={600} itemCount={stockStore.data.length} itemSize={50}>
			<div
				slot="item"
				let:index
				let:style
				{style}
				class="grid grid-cols-5 gap-4 p-4 broder border-gray-700 hover:bg-base-200"
			>
				<div>{stockStore.data[index].Time}</div>
				<div>{stockStore.data[index].LTP}</div>
				<div>{stockStore.data[index].BuyPrice}</div>
				<div>{stockStore.data[index].SellPrice}</div>
				<div>{stockStore.data[index].LTQ}</div>
			</div>
		</VirtualList>
	</div>
{/if}
