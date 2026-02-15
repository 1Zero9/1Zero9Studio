import { NextResponse } from 'next/server';
import { checkAmadeusHealth } from '@/lib/holiday/amadeus';

export async function GET() {
  try {
    const amadeus = await checkAmadeusHealth();

    return NextResponse.json({
      ok: true,
      checkedAt: new Date().toISOString(),
      amadeus,
      summary: {
        healthy: amadeus.authOk && (amadeus.flightSearchOk || amadeus.hotelSearchOk),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
