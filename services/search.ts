import { WebResult, ImageResult, NewsResult, VideoResult } from '@/types';

const SEARXNG_URL = process.env.NEXT_PUBLIC_SEARXNG_URL || 'http://localhost:8080';

// Fallback Mock Data Generator for Offline / Blocked Scenarios
const generateMockWebResults = (query: string, page: number): WebResult[] => {
  const topics = [
    { title: 'Introduction to Information Retrieval', desc: 'A comprehensive guide on search engines, indexing, ranking, vector space models, and inverted indexes for university students.' },
    { title: 'Next.js 15 App Router Architecture', desc: 'Learn the core principles of Next.js 15, including Server Components, Client Components, Edge runtime, and performance optimizations.' },
    { title: 'SearXNG: Self-Hosted Metasearch Engine', desc: 'A privacy-respecting metasearch engine proxy that aggregates results from dozens of search engines without tracking user behavior.' },
    { title: 'Framer Motion & React 19 Animations', desc: 'Create fluid, physics-based animations in React 19 using Motion. Best practices, spring configs, and exit animations.' },
    { title: 'Tailwind CSS v4 CSS-First Styling Guide', desc: 'Tailwind CSS v4 introduces CSS-first configuration, automatic template parsing, and native CSS variable theme extension.' }
  ];

  return Array.from({ length: 10 }).map((_, i) => {
    const idx = (i + (page - 1) * 10) % topics.length;
    const topic = topics[idx];
    const slug = query.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      title: `${topic.title} - Result ${i + 1 + (page - 1) * 10}`,
      link: `https://example.com/topic/${slug}-${i}`,
      snippet: `This is a simulated result for "${query}". ${topic.desc} Explore detailed indexing techniques, algorithms, and performance comparisons.`
    };
  });
};

const generateMockImageResults = (query: string): ImageResult[] => {
  const imageIds = [
    'photo-1507525428034-b723cf961d3e', // Beach
    'photo-1470071459604-3b5ec3a7fe05', // Mountain
    'photo-1447752875215-b2761acb3c5d', // Forest
    'photo-1472214222541-d510753a4907', // Valley
    'photo-1469474968028-56623f02e42e', // Hills
    'photo-1501854140801-50d01698950b', // Meadow
    'photo-1441974231531-c6227db76b6e', // Trees
    'photo-1532274402911-5a369e4c4bb5'  // Sunset
  ];

  return imageIds.map((id, i) => ({
    title: `Beautiful Landscape Image ${i + 1} relating to ${query}`,
    link: `https://unsplash.com/photos/${id}`,
    src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`
  }));
};

const generateMockNewsResults = (query: string): NewsResult[] => {
  const outlets = ['TechCrunch', 'The Verge', 'Wired', 'MIT Tech Review', 'Ars Technica'];
  return Array.from({ length: 8 }).map((_, i) => ({
    title: `Breaking News: How "${query}" is Shaping the Future of Technology`,
    link: `https://example-news.com/tech/${i}`,
    snippet: `Industry experts discuss the profound impact of ${query} on modern software engineering paradigms and algorithmic search architecture.`,
    date: `${i + 1} day${i > 0 ? 's' : ''} ago`,
    source: outlets[i % outlets.length]
  }));
};

const generateMockVideoResults = (query: string): VideoResult[] => {
  const channels = ['Computerphile', 'Fireship', 'Traversy Media', 'Web Dev Simplified'];
  const videoIds = ['Ke90Tje7VS0', 'R9I85Vg1tBc', 'V-_O7nl0Ii0', 'y17RuW6LDp4'];
  return Array.from({ length: 6 }).map((_, i) => ({
    title: `Understanding ${query} in 5 Minutes`,
    link: `https://www.youtube.com/watch?v=${videoIds[i % videoIds.length]}`,
    snippet: `A short, high-level crash course mapping the core components of ${query}. Perfect for students and developers.`,
    duration: `${3 + i}:${15 + i * 7}`,
    author: channels[i % channels.length],
    thumbnail: `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=320&h=180&q=80`
  }));
};

// --------------------------------------------------------------------------
// SearXNG Search Integration
// --------------------------------------------------------------------------

export const searchService = {
  /**
   * Web search
   */
  async search(
    query: string,
    page: number = 1,
    safeSearch: boolean = true,
    lang: string = 'lang_id',
    country: string = 'ID'
  ): Promise<{ results: WebResult[]; infoboxes?: any[]; isMock: boolean }> {
    // SearXNG language format: 'id-ID', 'en-US', etc.
    const langCode = lang.replace('lang_', '');
    const languageCode = `${langCode}-${country}`;
    const url = `${SEARXNG_URL}/search?q=${encodeURIComponent(query)}&pageno=${page}&safesearch=${safeSearch ? '1' : '0'}&language=${languageCode}&locale=${languageCode}&categories=general&format=json`;

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000); // 10s — allows multi-engine aggregation

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' }
      });
      clearTimeout(id);

      if (!response.ok) throw new Error('SearXNG status error');

      const data = await response.json();
      
      const results: WebResult[] = (data.results || []).slice(0, 10).map((item: any) => ({
        title: item.title || 'No Title',
        link: item.url || '#',
        snippet: item.content || ''
      }));

      if (results.length === 0 && data.unresponsive_engines && data.unresponsive_engines.length > 0) {
        console.warn('SearXNG returned 0 web results and had unresponsive engines. Falling back to mock data.');
        return { results: generateMockWebResults(query, page).slice(0, 10), infoboxes: [], isMock: true };
      }

      return { results, infoboxes: data.infoboxes || [], isMock: false };
    } catch (error) {
      console.warn('SearXNG web search failed, falling back to mock data:', error);
      return { results: generateMockWebResults(query, page), infoboxes: [], isMock: true };
    }
  },

  /**
   * Image Search
   */
  async imageSearch(query: string, page: number = 1, lang: string = 'lang_id', country: string = 'ID'): Promise<{ results: ImageResult[]; isMock: boolean }> {
    const langCode = lang.replace('lang_', '');
    const languageCode = `${langCode}-${country}`;
    const url = `${SEARXNG_URL}/search?q=${encodeURIComponent(query)}&pageno=${page}&categories=images&language=${languageCode}&locale=${languageCode}&format=json`;

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' }
      });
      clearTimeout(id);

      if (!response.ok) throw new Error('SearXNG image status error');

      const data = await response.json();
      const results: ImageResult[] = (data.results || []).slice(0, 10).map((item: any) => ({
        title: item.title || 'Image Result',
        link: item.url || '#',
        src: item.img_src || item.thumbnail || ''
      }));

      if (results.length === 0 && data.unresponsive_engines && data.unresponsive_engines.length > 0) {
        console.warn('SearXNG returned 0 image results and had unresponsive engines. Falling back to mock data.');
        return { results: generateMockImageResults(query).slice(0, 10), isMock: true };
      }

      return { results, isMock: false };
    } catch (error) {
      console.warn('SearXNG image search failed, falling back to mock data:', error);
      return { results: generateMockImageResults(query), isMock: true };
    }
  },

  /**
   * News Search
   */
  async newsSearch(query: string, page: number = 1, lang: string = 'lang_id', country: string = 'ID'): Promise<{ results: NewsResult[]; isMock: boolean }> {
    const langCode = lang.replace('lang_', '');
    const languageCode = `${langCode}-${country}`;
    const url = `${SEARXNG_URL}/search?q=${encodeURIComponent(query)}&pageno=${page}&categories=news&language=${languageCode}&locale=${languageCode}&format=json`;

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' }
      });
      clearTimeout(id);

      if (!response.ok) throw new Error('SearXNG news status error');

      const data = await response.json();
      const results: NewsResult[] = (data.results || []).slice(0, 10).map((item: any) => ({
        title: item.title || 'News Result',
        link: item.url || '#',
        snippet: item.content || '',
        date: item.publishedDate || 'Recently',
        source: item.source || item.engines?.[0] || 'Publisher'
      }));

      if (results.length === 0 && data.unresponsive_engines && data.unresponsive_engines.length > 0) {
        console.warn('SearXNG returned 0 news results and had unresponsive engines. Falling back to mock data.');
        return { results: generateMockNewsResults(query).slice(0, 10), isMock: true };
      }

      return { results, isMock: false };
    } catch (error) {
      console.warn('SearXNG news search failed, falling back to mock data:', error);
      return { results: generateMockNewsResults(query), isMock: true };
    }
  },

  /**
   * Video Search
   */
  async videoSearch(query: string, page: number = 1, lang: string = 'lang_id', country: string = 'ID'): Promise<{ results: VideoResult[]; isMock: boolean }> {
    const langCode = lang.replace('lang_', '');
    const languageCode = `${langCode}-${country}`;
    const url = `${SEARXNG_URL}/search?q=${encodeURIComponent(query)}&pageno=${page}&categories=videos&language=${languageCode}&locale=${languageCode}&format=json`;

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' }
      });
      clearTimeout(id);

      if (!response.ok) throw new Error('SearXNG video status error');

      const data = await response.json();
      const results: VideoResult[] = (data.results || []).map((item: any) => ({
        title: item.title || 'Video Result',
        link: item.url || '#',
        snippet: item.content || '',
        duration: item.length || item.duration || '0:00',
        author: item.author || item.source || 'Uploader',
        thumbnail: item.thumbnail || item.img_src || `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=320&h=180&q=80`
      }));

      if (results.length === 0 && data.unresponsive_engines && data.unresponsive_engines.length > 0) {
        console.warn('SearXNG returned 0 video results and had unresponsive engines. Falling back to mock data.');
        return { results: generateMockVideoResults(query), isMock: true };
      }

      return { results, isMock: false };
    } catch (error) {
      console.warn('SearXNG video search failed, falling back to mock data:', error);
      return { results: generateMockVideoResults(query), isMock: true };
    }
  },

  /**
   * Autocomplete query suggestions (uses Google Suggest API directly for maximum reliability)
   */
  async autocomplete(query: string): Promise<string[]> {
    const url = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`;

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 2000); // 2s timeout
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);

      if (!response.ok) throw new Error('Google suggest status error');

      const data = await response.json();
      // Google suggest queries response structure: [query, [suggestion1, suggestion2, ...]]
      return data[1] || [];
    } catch (error) {
      console.warn('Autocomplete fetch failed:', error);
      // Mock basic suggestions
      const mockSuggestions = ['nextjs 15 app router', 'searxng setup guide', 'tailwindcss v4 build', 'react 19 state management', 'information retrieval systems', 'framer motion examples'];
      return mockSuggestions.filter(s => s.startsWith(query.toLowerCase()));
    }
  }
};
