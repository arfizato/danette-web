"use server";

import Database from "better-sqlite3";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const data = await request.json();
		const db = new Database("conveyor.db");

		const stmt = db.prepare(`
      INSERT INTO conveyor_items (
        barcode,
        expiration_date,
        name,
        validity,
        image_url
      ) VALUES (?, ?, ?, ?, ?)
    `);

		const result = stmt.run(
			data.code,
			data.date,
			data.code === "61945340" ? "vanille" : "chocolat",
			data.isValid ? 1 : 0,
			data.code === "61945340" ? "danette-vanille.jpg" : "danette-choco.jpg"
		);

		return NextResponse.json({
			success: true,
			result,
		});
	} catch (error) {
		console.error("Error adding row:", error);
		return NextResponse.json({ error: "Failed to add row" }, { status: 500 });
	}
}
