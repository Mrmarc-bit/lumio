/**
 * IR Metrics Engine
 * Implements core Information Retrieval scoring algorithms:
 *  - Term Frequency (TF)
 *  - Inverse Document Frequency (IDF)
 *  - TF-IDF
 *  - Okapi BM25
 *  - Query Coverage
 *  - Cosine Similarity (bag-of-words)
 */

export interface IRMetrics {
  tfIdf: number;         // TF-IDF score (0–1 normalized)
  bm25: number;          // Okapi BM25 score (raw)
  bm25Norm: number;      // BM25 normalized (0–1)
  queryCoverage: number; // Fraction of query terms matched (0–1)
  cosineSim: number;     // Cosine similarity (0–1)
  matchedTerms: string[];// Which query terms were matched
  termFreqs: Record<string, number>; // TF per term in document
}

// ---------- Tokenization ----------
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u00C0-\u024F\u1E00-\u1EFF\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

// ---------- TF ----------
function computeTF(tokens: string[], term: string): number {
  if (tokens.length === 0) return 0;
  const count = tokens.filter(t => t === term).length;
  return count / tokens.length;
}

// ---------- IDF (over small pseudo-corpus of snippets) ----------
function computeIDF(term: string, corpus: string[][]): number {
  const N = corpus.length;
  const df = corpus.filter(doc => doc.includes(term)).length;
  return Math.log((N - df + 0.5) / (df + 0.5) + 1);
}

// ---------- TF-IDF ----------
function tfIdfScore(queryTerms: string[], docTokens: string[], corpus: string[][]): number {
  if (queryTerms.length === 0) return 0;
  let score = 0;
  for (const term of queryTerms) {
    const tf = computeTF(docTokens, term);
    const idf = computeIDF(term, corpus);
    score += tf * idf;
  }
  return score;
}

// ---------- Okapi BM25 ----------
const BM25_K1 = 1.5;
const BM25_B = 0.75;

function bm25Score(queryTerms: string[], docTokens: string[], avgDocLen: number, corpus: string[][]): number {
  const N = corpus.length;
  const dl = docTokens.length;
  let score = 0;
  for (const term of queryTerms) {
    const tf = docTokens.filter(t => t === term).length;
    const df = corpus.filter(doc => doc.includes(term)).length;
    const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
    const numerator = tf * (BM25_K1 + 1);
    const denominator = tf + BM25_K1 * (1 - BM25_B + BM25_B * (dl / avgDocLen));
    score += idf * (numerator / denominator);
  }
  return score;
}

// ---------- Cosine Similarity ----------
function cosineSimilarity(queryTerms: string[], docTokens: string[]): number {
  const vocab = [...new Set([...queryTerms, ...docTokens])];
  const queryVec = vocab.map(t => queryTerms.filter(q => q === t).length);
  const docVec = vocab.map(t => docTokens.filter(d => d === t).length);

  const dot = queryVec.reduce((s, q, i) => s + q * docVec[i], 0);
  const magQ = Math.sqrt(queryVec.reduce((s, v) => s + v * v, 0));
  const magD = Math.sqrt(docVec.reduce((s, v) => s + v * v, 0));
  if (magQ === 0 || magD === 0) return 0;
  return dot / (magQ * magD);
}

// ---------- Main export ----------
export function computeIRMetrics(
  query: string,
  results: Array<{ title: string; snippet: string; link: string }>
): IRMetrics[] {
  const queryTerms = tokenize(query);

  // Build corpus (tokenized docs: title + snippet)
  const corpus: string[][] = results.map(r => tokenize(`${r.title} ${r.snippet}`));
  const avgDocLen = corpus.reduce((s, d) => s + d.length, 0) / Math.max(corpus.length, 1);

  // Compute raw scores
  const rawTfIdf = corpus.map(doc => tfIdfScore(queryTerms, doc, corpus));
  const rawBm25 = corpus.map(doc => bm25Score(queryTerms, doc, avgDocLen, corpus));

  // Normalize to [0, 1]
  const maxTfIdf = Math.max(...rawTfIdf, 0.001);
  const maxBm25 = Math.max(...rawBm25, 0.001);

  return corpus.map((docTokens, i) => {
    const matchedTerms = queryTerms.filter(t => docTokens.includes(t));
    const queryCoverage = queryTerms.length > 0 ? matchedTerms.length / queryTerms.length : 0;
    const termFreqs: Record<string, number> = {};
    for (const t of queryTerms) {
      termFreqs[t] = computeTF(docTokens, t);
    }

    return {
      tfIdf: rawTfIdf[i] / maxTfIdf,
      bm25: rawBm25[i],
      bm25Norm: rawBm25[i] / maxBm25,
      queryCoverage,
      cosineSim: cosineSimilarity(queryTerms, docTokens),
      matchedTerms: [...new Set(matchedTerms)],
      termFreqs,
    };
  });
}
