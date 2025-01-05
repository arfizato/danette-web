import Database from "better-sqlite3";

const db = new Database("conveyor.db");

// Create the table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS conveyor_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    barcode TEXT NOT NULL,
    expiration_date TEXT NOT NULL,
    name TEXT NOT NULL,
    validity BOOLEAN NOT NULL,
    image_url TEXT
  )
`);

export interface ConveyorItem {
	id: number;
	barcode: string;
	expiration_date: string;
	name: string;
	validity: boolean;
	image_url?: string;
}

export function getConveyorItems(): ConveyorItem[] {
	const stmt = db.prepare(
		"SELECT * FROM conveyor_items ORDER BY id DESC LIMIT 100"
	);
	return stmt.all() as ConveyorItem[];
}

export function getBarcodeStats(): { barcode: string; count: number }[] {
	const stmt = db.prepare(`
    SELECT barcode, COUNT(*) as count 
    FROM conveyor_items 
    WHERE validity = 1
    GROUP BY barcode 
    ORDER BY count DESC
  `);
	return stmt.all() as { barcode: string; count: number }[];
}
