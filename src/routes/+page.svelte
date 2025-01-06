<script lang="ts">
	import { onMount } from 'svelte';
	import { stockStore } from '$lib/stores/StockStore.svelte';
	import VirtualList from 'svelte-tiny-virtual-list';
	import StockChart from '../components/StockChart.svelte';

	let selectedStock: any = null;
	let isDrawerOpen = false;

	function openDrawer(stockData: any) {
		selectedStock = { ...stockData };
		isDrawerOpen = true;
	}

	function handleSubmit() {
		if (selectedStock) {
			// Create a new stock object with decimal precision
			const updatedStock = {
				...selectedStock,
				LTP: Number(parseFloat(selectedStock.LTP).toFixed(2)),
				BuyPrice: Number(parseFloat(selectedStock.BuyPrice).toFixed(2)),
				SellPrice: Number(parseFloat(selectedStock.SellPrice).toFixed(2)),
				LTQ: Math.round(Number(selectedStock.LTQ)) // LTQ should be whole numbers
			};

			// Update the stock data in the store
			stockStore.updateStock(updatedStock);
		}
		isDrawerOpen = false;
	}

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
		<div class="grid grid-cols-6 gap-4 font-bold p-4 bg-base-200">
			<div>Time</div>
			<div>LTP</div>
			<div>Buy Price</div>
			<div>Sell Price</div>
			<div>Volume</div>
			<div>Edit</div>
		</div>

		<!-- Virtual List -->
		<VirtualList width="100%" height={600} itemCount={stockStore.data.length} itemSize={50}>
			<div
				slot="item"
				let:index
				let:style
				{style}
				class="grid grid-cols-6 gap-4 p-4 border border-gray-200 hover:bg-base-200"
			>
				<div>{stockStore.data[index].Time}</div>
				<div>{stockStore.data[index].LTP}</div>
				<div>{stockStore.data[index].BuyPrice}</div>
				<div>{stockStore.data[index].SellPrice}</div>
				<div>{stockStore.data[index].LTQ}</div>
				<div>
					<button
						class="btn btn-circle btn-xs"
						on:click={() => openDrawer(stockStore.data[index])}
					>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                        <span class="sr-only">Edit</span>
					</button>
				</div>
			</div>
		</VirtualList>
	</div>

	<!-- Drawer -->
	{#if isDrawerOpen}
		<div class="drawer drawer-end fixed inset-0 z-50">
			<input type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen} />
			<div class="drawer-side">
				<label for="edit-drawer" class="drawer-overlay">
                </label>
				<div class="p-4 w-96 bg-base-200 h-full">
					<h3 class="text-lg font-bold mb-4">Edit Stock Data</h3>
					<form on:submit|preventDefault={handleSubmit} class="space-y-4">
						<div class="form-control">
							<label class="label" for="ltp">
								<span class="label-text">LTP</span>
							</label>
							<input
								id="ltp"
								type="number"
								step="0.01"
								min="0"
								class="input input-bordered"
								bind:value={selectedStock.LTP}
							/>
						</div>
						<div class="form-control">
							<label class="label" for="buyPrice">
								<span class="label-text">Buy Price</span>
							</label>
							<input
								id="buyPrice"
								type="number"
								step="0.01"
								min="0"
								class="input input-bordered"
								bind:value={selectedStock.BuyPrice}
							/>
						</div>
						<div class="form-control">
							<label class="label" for="sellPrice">
								<span class="label-text">Sell Price</span>
							</label>
							<input
								id="sellPrice"
								type="number"
								step="0.01"
								min="0"
								class="input input-bordered"
								bind:value={selectedStock.SellPrice}
							/>
						</div>
						<div class="form-control">
							<label class="label" for="volume">
								<span class="label-text">Volume</span>
							</label>
							<input
								id="volume"
								type="number"
								step="1"
								min="0"
								class="input input-bordered"
								bind:value={selectedStock.LTQ}
							/>
						</div>
						<div class="mt-4 space-x-2">
							<button type="submit" class="btn btn-primary">Save</button>
							<button type="button" class="btn" on:click={() => (isDrawerOpen = false)}>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	{/if}
{/if}
