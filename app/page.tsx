"use client";

import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import Image from "next/image";

interface ConveyorItem {
	id: number;
	barcode: string;
	expiration_date: string;
	name: string;
	validity: boolean;
	image_url?: string;
}

interface BarcodeStats {
	barcode: string;
	count: number;
}

const x = [
	{
		id: 123132,
		barcode: "7896546",
		expiration_date: "22 dec",
		name: "vanille",
		validity: true,
		image_url: "string",
	},
];

export default function Home() {
	const [items, setItems] = useState<ConveyorItem[]>();
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				label: "Barcode Count",
				data: [],
				backgroundColor: "#4CAF50",
			},
		],
	});

	const fetchData = async () => {
		try {
			const response = await fetch("/api/data");
			const data = await response.json();

			setItems(data.items);

			setChartData({
				labels: data.stats.map((stat: BarcodeStats) => stat.barcode),
				datasets: [
					{
						label: "Barcode Count",
						data: data.stats.map((stat: BarcodeStats) => stat.count),
						backgroundColor: "#4CAF50",
					},
				],
			});
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData();
		const interval = setInterval(fetchData, 1000);
		return () => clearInterval(interval);
	}, []);

	const validityTemplate = (rowData: ConveyorItem) => {
		return (
			<span
				className={`px-2 py-1 rounded ${
					rowData.validity
						? "bg-green-100 text-green-800"
						: "bg-red-100 text-red-800"
				}`}>
				{rowData.validity ? "Valid" : "Invalid"}
			</span>
		);
	};

	const imageTemplate = (rowData: ConveyorItem) => {
		if (!rowData.image_url) return null;
		return (
			<div className='relative w-16 h-16'>
				<Image
					src={rowData.image_url}
					alt={rowData.name}
					fill
					className='object-cover rounded'
					sizes='64px'
				/>
			</div>
		);
	};

	return (
		<div className='max-w-7xl mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-6'>Conveyor Line Monitor</h1>

			<div className='grid grid-cols-1 slg:grid-cols-2 gap-6 mb-6'>
				<Card title='Recent Items'>
					<DataTable value={items} scrollable scrollHeight='400px' stripedRows>
						<Column body={imageTemplate} style={{ width: "80px" }} />
						<Column field='id' header='Index' sortable />
						<Column field='barcode' header='Barcode' sortable />
						<Column field='expiration_date' header='Expiration Date' sortable />
						<Column field='name' header='Name' sortable />
						<Column
							field='validity'
							header='Validity'
							body={validityTemplate}
							sortable
						/>
					</DataTable>
				</Card>
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
			</div>
		</div>
	);
}
