import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/services/search';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const suggestions = await searchService.autocomplete(query);
    return NextResponse.json(suggestions);
  } catch (error) {
    return NextResponse.json([]);
  }
}
