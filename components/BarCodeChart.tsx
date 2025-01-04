"use client";

import { useEffect, useState, useMemo } from "react";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";

interface BarcodeStats {
	barcode: string;
	count: number;
}

// Generate distinct colors for different bars
const generateColors = (count: number) => {
	const colors = [];
	for (let i = 0; i < count; i++) {
		const hue = (i * 137.508) % 360; // Use golden angle approximation for better distribution
		colors.push(`hsl(${hue}, 70%, 50%)`);
	}
	return colors;
};

export function BarcodeChart({ data }: { data: BarcodeStats[] }) {
	const chartData = useMemo(() => {
		const colors = generateColors(data.length);
		return {
			labels: data.map((stat) => stat.barcode),
			datasets: [
				{
					label: "Barcode Count",
					data: data.map((stat) => stat.count),
					backgroundColor: colors,
				},
			],
		};
	}, [data]);

	return (
		<Card title='Barcode Distribution'>
			<Chart
				type='bar'
				data={chartData}
				options={{
					scales: {
						y: {
							beginAtZero: true,
						},
					},
					maintainAspectRatio: false,
					plugins: {
						legend: {
							display: false,
						},
					},
				}}
				height='400px'
			/>
		</Card>
	);
}
