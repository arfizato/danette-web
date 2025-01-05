"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import Image from "next/image";
import { BarcodeChart } from "@/components/BarCodeChart";

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

export default function Home() {
	const [items, setItems] = useState<ConveyorItem[]>([]);
	const [stats, setStats] = useState<BarcodeStats[]>([]);
	const x = useRef(0);

	const fetchData = useCallback(async () => {
		try {
			const response = await fetch("/api/data");
			const data = await response.json();

			// const statsString = JSON.stringify(data.stats);
			console.log(
				"willUpdate?",
				data.items.length !== x.current,
				data.items.length,
				x.current
			);

			if (data.items.length !== x.current) {
				setItems(data.items);
				x.current = data.items.length;
				setStats(data.stats);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}, []);

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

			<div className='grid grid-cols-1 s2xl:grid-cols-2 gap-6 mb-6'>
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

				<BarcodeChart data={stats} />
			</div>
		</div>
	);
}
