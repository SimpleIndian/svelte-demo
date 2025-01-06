import Papa from 'papaparse';

export interface StockData {
	Ticker: string;
	Date: string;
	Time: string;
	LTP: number;
	BuyPrice: number;
	BuyQty: number;
	SellPrice: number;
	SellQty: number;
	LTQ: number;
	OpenInterest: number;
}

function createStockStore() {
	let data = $state<StockData[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	// Derived calculations
	const latestPrice = $derived(data.length > 0 ? data[data.length - 1].LTP : 0);

	const averagePrice = $derived(data.reduce((sum, item) => sum + item.LTP, 0) / (data.length || 1));

	async function loadData() {
		try {
			isLoading = true;
			const response = await fetch('/ABCAPITAL-I.NFO.csv');
			const csvText = await response.text();

			const result = Papa.parse<StockData>(csvText, {
				header: true,
				skipEmptyLines: true,
				transform: (value: string, field: string) => {
					if (
						[
							'Ticker',
							'LTP',
							'BuyPrice',
							'SellPrice',
							'BuyQty',
							'SellQty',
							'LTQ',
							'OpenInterest'
						].includes(field)
					) {
						return parseFloat(value);
					}
					return value;
				}
			});

			data = result.data;
			error = null;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load data';
		} finally {
			isLoading = false;
		}
	}

	function updateStock(updatedStock: StockData) {
		const index = data.findIndex(
			(item) => item.Date === updatedStock.Date && item.Time === updatedStock.Time
		);

		if (index !== -1) {
			// Create a new array with the updated stock data
			data = [...data.slice(0, index), updatedStock, ...data.slice(index + 1)];
		}
	}

	return {
		get data() {
			return data;
		},
		get isLoading() {
			return isLoading;
		},
		get error() {
			return error;
		},
		get latestPrice() {
			return latestPrice;
		},
		get averagePrice() {
			return averagePrice;
		},
		loadData,
		updateStock
	};
}

export const stockStore = createStockStore();
