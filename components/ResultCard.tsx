'use client';

import React, { useState } from 'react';
import { Copy, Bookmark, BookmarkCheck, ExternalLink, Share2, Check, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WebResult } from '@/types';
import { useSearchStore } from '@/store/searchStore';

interface ResultCardProps {
  result: WebResult;
  index?: number;
  query?: string;
}

// ---- IR Score Bar ----
function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.round(value * 100)}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

// ---- Relevance label ----
function relevanceLabel(bm25Norm: number): { label: string; color: string; bg: string } {
  if (bm25Norm >= 0.85) return { label: 'Sangat Relevan', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' };
  if (bm25Norm >= 0.6)  return { label: 'Relevan', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' };
  if (bm25Norm >= 0.35) return { label: 'Cukup Relevan', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' };
  return { label: 'Kurang Relevan', color: 'text-gray-500 dark:text-zinc-400', bg: 'bg-gray-50 dark:bg-zinc-800/60 border-gray-200 dark:border-zinc-700' };
}

// ---- Highlight query terms in text ----
function HighlightedText({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <span>{text}</span>;
  const pattern = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(pattern);
  return (
    <span>
      {parts.map((part, i) =>
        terms.some(t => t.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i} className="bg-yellow-100 dark:bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 rounded px-0.5 font-semibold not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default function ResultCard({ result, index = 0 }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [showIR, setShowIR] = useState(false);

  const toggleBookmark = useSearchStore(state => state.toggleBookmark);
  const isBookmarked = useSearchStore(state => state.isBookmarked(result.link));

  // Extract domain
  let domain = '';
  let pathSegments: string[] = [];
  try {
    const urlObj = new URL(result.link);
    domain = urlObj.hostname;
    pathSegments = urlObj.pathname.split('/').filter(Boolean);
  } catch (e) {
    domain = result.link;
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    navigator.clipboard.writeText(result.link);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    toggleBookmark(result);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    navigator.clipboard.writeText(`${result.title} - ${result.link}`);
    setShared(true); setTimeout(() => setShared(false), 2000);
  };

  const m = result.irMetrics;
  const rel = m ? relevanceLabel(m.bm25Norm) : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.35), ease: [0.16, 1, 0.3, 1] }}
      className="group premium-card rounded-2xl flex flex-col overflow-hidden"
    >
      {/* Rank indicator stripe */}
      <div className={`h-0.5 w-full ${
        index === 0 ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
        index === 1 ? 'bg-gradient-to-r from-blue-400 to-indigo-400' :
        index === 2 ? 'bg-gradient-to-r from-violet-400 to-purple-400' :
        'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800'
      }`} />

      <div className="p-5 flex flex-col gap-3">

        {/* Top row: breadcrumb + rank badge + toolbar */}
        <div className="flex items-center justify-between gap-4 text-xs h-8">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* Rank badge */}
            <span className={`flex-shrink-0 h-5 w-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
              index === 0 ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' :
              index === 1 ? 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400' :
              index === 2 ? 'bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400' :
              'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500'
            }`}>
              #{index + 1}
            </span>

            {/* Favicon */}
            <div className="w-6 h-6 rounded-full bg-white dark:bg-zinc-950 p-1 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border border-gray-100 dark:border-zinc-800/80">
              {domain && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`}
                  alt="favicon"
                  className="w-4 h-4 object-contain rounded-sm"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 font-medium truncate">
              <span className="text-gray-800 dark:text-zinc-200 font-semibold">{domain}</span>
              {pathSegments.length > 0 && (
                <>
                  <span className="text-gray-300 dark:text-zinc-700">/</span>
                  <span className="text-gray-400 dark:text-zinc-500 truncate">{pathSegments.slice(0, 2).join(' / ')}</span>
                </>
              )}
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-1.5 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button onClick={handleBookmark} title={isBookmarked ? 'Hapus Bookmark' : 'Simpan Bookmark'}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 bg-gray-50 hover:bg-white dark:bg-zinc-900/60 dark:hover:bg-zinc-800/80 border border-gray-200/40 dark:border-zinc-800/50 rounded-xl transition-all shadow-sm flex items-center justify-center">
              {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-blue-500" /> : <Bookmark className="h-4 w-4" />}
            </button>
            <button onClick={handleCopy} title="Salin Link"
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 bg-gray-50 hover:bg-white dark:bg-zinc-900/60 dark:hover:bg-zinc-800/80 border border-gray-200/40 dark:border-zinc-800/50 rounded-xl transition-all shadow-sm flex items-center justify-center">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </button>
            <button onClick={handleShare} title="Bagikan"
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 bg-gray-50 hover:bg-white dark:bg-zinc-900/60 dark:hover:bg-zinc-800/80 border border-gray-200/40 dark:border-zinc-800/50 rounded-xl transition-all shadow-sm flex items-center justify-center">
              {shared ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Relevance badge row */}
        {rel && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${rel.bg} ${rel.color}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
              {rel.label}
            </span>
            {m && m.queryCoverage > 0 && (
              <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono">
                {Math.round(m.queryCoverage * 100)}% kata kunci cocok
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h2 className="text-base md:text-lg font-bold leading-tight font-display tracking-tight">
          <a href={result.link} target="_blank" rel="noopener noreferrer"
            className="relative group/link text-gray-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1.5">
            <span className="relative pb-0.5">
              {m ? <HighlightedText text={result.title} terms={m.matchedTerms} /> : result.title}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 transition-all duration-300 group-hover:w-full" />
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
        </h2>

        {/* Snippet with keyword highlight */}
        <p className="text-xs md:text-sm text-gray-600 dark:text-zinc-300 leading-relaxed max-w-3xl font-sans">
          {m ? <HighlightedText text={result.snippet} terms={m.matchedTerms} /> : result.snippet}
        </p>

        {/* Matched keywords chips */}
        {m && m.matchedTerms.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-zinc-500 mr-1">Kata kunci:</span>
            {m.matchedTerms.map(term => (
              <span key={term} className="px-2 py-0.5 rounded-md bg-yellow-50 dark:bg-yellow-400/10 border border-yellow-200 dark:border-yellow-500/20 text-yellow-800 dark:text-yellow-300 text-[10px] font-semibold font-mono">
                {term}
              </span>
            ))}
          </div>
        )}

        {/* IR Metrics expandable panel */}
        {m && (
          <div className="border-t border-gray-100 dark:border-zinc-800/60 pt-2.5 mt-0.5">
            <button
              onClick={() => setShowIR(e => !e)}
              className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <Info className="h-3 w-3" />
              Metrik IR
              {showIR ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            <AnimatePresence>
              {showIR && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">

                    {/* BM25 */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-gray-600 dark:text-zinc-300 flex items-center gap-1">
                          <span className="font-mono text-violet-600 dark:text-violet-400">BM25</span>
                          <span className="text-gray-400 dark:text-zinc-500 font-normal">(Okapi BM25)</span>
                        </span>
                        <span className="font-mono text-violet-600 dark:text-violet-400">{m.bm25.toFixed(3)}</span>
                      </div>
                      <ScoreBar value={m.bm25Norm} color="bg-gradient-to-r from-violet-400 to-purple-500" />
                      <p className="text-[9px] text-gray-400 dark:text-zinc-500 leading-snug">
                        Robertson-Spärck Jones probabilistic weighting. Mempertimbangkan frekuensi term, panjang dokumen, dan saturasi TF (k₁=1.5, b=0.75).
                      </p>
                    </div>

                    {/* TF-IDF */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-gray-600 dark:text-zinc-300 flex items-center gap-1">
                          <span className="font-mono text-blue-600 dark:text-blue-400">TF-IDF</span>
                          <span className="text-gray-400 dark:text-zinc-500 font-normal">(Term Freq × IDF)</span>
                        </span>
                        <span className="font-mono text-blue-600 dark:text-blue-400">{m.tfIdf.toFixed(3)}</span>
                      </div>
                      <ScoreBar value={m.tfIdf} color="bg-gradient-to-r from-blue-400 to-indigo-500" />
                      <p className="text-[9px] text-gray-400 dark:text-zinc-500 leading-snug">
                        Bobot term berdasarkan frekuensinya di dokumen (TF) dikali keunikannya di seluruh corpus (IDF). Skor tinggi = term langka namun sering muncul.
                      </p>
                    </div>

                    {/* Cosine Similarity */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-gray-600 dark:text-zinc-300 flex items-center gap-1">
                          <span className="font-mono text-teal-600 dark:text-teal-400">cos(θ)</span>
                          <span className="text-gray-400 dark:text-zinc-500 font-normal">(Cosine Similarity)</span>
                        </span>
                        <span className="font-mono text-teal-600 dark:text-teal-400">{m.cosineSim.toFixed(3)}</span>
                      </div>
                      <ScoreBar value={m.cosineSim} color="bg-gradient-to-r from-teal-400 to-cyan-500" />
                      <p className="text-[9px] text-gray-400 dark:text-zinc-500 leading-snug">
                        Sudut antara vektor query dan vektor dokumen (bag-of-words). Nilai 1.0 = identik secara semantik, 0 = tidak ada kesamaan.
                      </p>
                    </div>

                    {/* Query Coverage */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-gray-600 dark:text-zinc-300 flex items-center gap-1">
                          <span className="font-mono text-amber-600 dark:text-amber-400">Coverage</span>
                          <span className="text-gray-400 dark:text-zinc-500 font-normal">(Query Coverage)</span>
                        </span>
                        <span className="font-mono text-amber-600 dark:text-amber-400">{Math.round(m.queryCoverage * 100)}%</span>
                      </div>
                      <ScoreBar value={m.queryCoverage} color="bg-gradient-to-r from-amber-400 to-orange-500" />
                      <p className="text-[9px] text-gray-400 dark:text-zinc-500 leading-snug">
                        Persentase term query yang ditemukan dalam dokumen. {m.matchedTerms.length} dari {Object.keys(m.termFreqs).length} term cocok.
                      </p>
                    </div>

                    {/* Term Frequency table */}
                    {Object.keys(m.termFreqs).length > 0 && (
                      <div className="md:col-span-2 mt-1">
                        <p className="text-[9px] uppercase tracking-widest font-semibold text-gray-400 dark:text-zinc-500 mb-1.5">Frekuensi Term (TF per token)</p>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(m.termFreqs).map(([term, tf]) => (
                            <span key={term} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono border ${
                              m.matchedTerms.includes(term)
                                ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300'
                                : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400'
                            }`}>
                              {term}
                              <span className="opacity-60">=</span>
                              <span>{tf > 0 ? tf.toFixed(4) : '0'}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>
    </motion.article>
  );
}
