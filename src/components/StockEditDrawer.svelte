<script lang="ts">
    export let isOpen: boolean;
    export let stock: any;
    export let onSubmit: (stock: any) => void;
    export let onClose: () => void;

    function handleSubmit() {
        onSubmit(stock);
    }
</script>

<div class="drawer drawer-end fixed inset-0 z-50">
    <input type="checkbox" class="drawer-toggle" bind:checked={isOpen} />
    <div class="drawer-side">
        <label for="edit-drawer" class="drawer-overlay"></label>
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
                        bind:value={stock.LTP}
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
                        bind:value={stock.BuyPrice}
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
                        bind:value={stock.SellPrice}
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
                        bind:value={stock.LTQ}
                    />
                </div>
                <div class="mt-4 space-x-2">
                    <button type="submit" class="btn btn-primary">Save</button>
                    <button type="button" class="btn" on:click={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>