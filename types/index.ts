export interface WebResult {
  title: string;
  link: string;
  snippet: string;
  irMetrics?: {
    tfIdf: number;
    bm25: number;
    bm25Norm: number;
    queryCoverage: number;
    cosineSim: number;
    matchedTerms: string[];
    termFreqs: Record<string, number>;
  };
}

export interface ImageResult {
  title: string;
  link: string; // source site url
  src: string;  // image raw source url
}

export interface NewsResult {
  title: string;
  link: string;
  snippet: string;
  date: string;
  source: string;
}

export interface VideoResult {
  title: string;
  link: string;
  snippet: string;
  duration: string;
  author: string;
  thumbnail: string;
}

export interface SearchSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  region: string;
  safeSearch: boolean;
  resultsPerPage: number;
  compactMode: boolean;
  animations: boolean;
  accentColor: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose';
}

export interface Collection {
  name: string;
  items: WebResult[];
}
