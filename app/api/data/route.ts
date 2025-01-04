import { getConveyorItems, getBarcodeStats } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const items = getConveyorItems();
    const stats = getBarcodeStats();
    
    return NextResponse.json({
      items,
      stats
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}