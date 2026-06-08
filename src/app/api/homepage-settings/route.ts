import { NextResponse } from 'next/server';
import { getHomepageSettings, saveHomepageSettings, type HomepageSettings } from '@/lib/store-products';

export async function GET() {
  try {
    const settings = await getHomepageSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('[homepage-settings] GET failed', error);
    return NextResponse.json({ error: 'Failed to load homepage settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as HomepageSettings;
    const saved = await saveHomepageSettings(payload);
    return NextResponse.json(saved);
  } catch (error) {
    console.error('[homepage-settings] POST failed', error);
    return NextResponse.json({ error: 'Failed to save homepage settings' }, { status: 500 });
  }
}
