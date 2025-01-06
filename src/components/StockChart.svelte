<script>
	import { scaleBand, scaleOrdinal, scaleTime } from 'd3-scale';
	import {
		Chart,
		Svg,
		Axis,
		Points,
		Area,
		Highlight,
		Tooltip,
		LinearGradient,
		LineChart,
		Spline
	} from 'layerchart';

	let { data } = $props();

	// Modified aggregation to use 5-minute intervals
	const aggregateData = $derived(() => {
		if (!data?.length) return [];

		const now = Date.now();
		const thirtyMinutesAgo = now - 30 * 60 * 1000;

		const intervals = new Map();

		data.forEach((row) => {
			// Create 5-min interval key
			const date = new Date(row.Date + ' ' + row.Time);

			const minutes = date.getMinutes();
			const interval = minutes - (minutes % 5);
			const key = `${date.getHours()}:${interval.toString().padStart(2, '0')}`;

			if (!intervals.has(key)) {
				intervals.set(key, {
					Time: date,
					Date: row.Date,
					BuyPrice: [row.BuyPrice],
					SellPrice: [row.SellPrice],
					LTP: [row.LTP],
					LTQ: [row.LTQ],
					OpenInterest: [row.OpenInterest]
				});
			} else {
				// Append values to existing arrays
				const existing = intervals.get(key);
				existing.BuyPrice.push(row.BuyPrice);
				existing.SellPrice.push(row.SellPrice);
				existing.LTP.push(row.LTP);
				existing.LTQ.push(row.LTQ);
				existing.OpenInterest.push(row.OpenInterest);
			}
		});

		// Calculate averages for each interval
		return Array.from(intervals.values()).map((interval) => ({
			...interval,
			BuyPrice: interval.BuyPrice.reduce((a, b) => a + b, 0) / interval.BuyPrice.length,
			SellPrice: interval.SellPrice.reduce((a, b) => a + b, 0) / interval.SellPrice.length,
			LTP: interval.LTP.reduce((a, b) => a + b, 0) / interval.LTP.length,
			LTQ: interval.LTQ.reduce((a, b) => a + b, 0) / interval.LTQ.length,
			OpenInterest: interval.OpenInterest.reduce((a, b) => a + b, 0) / interval.OpenInterest.length
		}));
	});

	// Format time for tooltip
	function formatTime(time) {
		//@ts-ignore
		return `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
	}
</script>

<div class="h-[300px] p-4 border rounded">
	<Chart
		data={aggregateData()}
		x="Time"
		xScale={scaleTime()}
		y={['BuyPrice', 'SellPrice']}
		yNice
		padding={{ left: 16, bottom: 24 }}
		let:yScale
		let:height
		let:padding
	>
		{@const thresholdOffset = (yScale(50) / (height + padding.bottom)) * 100 + '%'}
		<Svg>
			<Axis placement="left" grid rule />
			<Axis placement="bottom" format={(d) => formatTime(d)} rule />

			<Spline class="stroke-3 stroke-primary fill-none" />
		</Svg>
	</Chart>
</div>
