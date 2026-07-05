import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/services/search';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1');
  const tbm = searchParams.get('tbm') || 'web'; // web, isch, nws, vid
  const safeSearch = searchParams.get('safeSearch') !== 'false';
  const lang = searchParams.get('lang') || 'lang_en';
  const country = searchParams.get('country') || 'US';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    let result;
    if (tbm === 'isch') {
      result = await searchService.imageSearch(query, page, lang, country);
    } else if (tbm === 'nws') {
      result = await searchService.newsSearch(query, page, lang, country);
    } else if (tbm === 'vid') {
      result = await searchService.videoSearch(query, page, lang, country);
    } else {
      result = await searchService.search(query, page, safeSearch, lang, country);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Search Error' }, { status: 500 });
  }
}
