'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Volume2, VolumeX, ChevronDown, ChevronUp, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WebResult {
  title: string;
  link: string;
  snippet: string;
}

interface AISummaryCardProps {
  query: string;
  results: WebResult[];
}

// Generate a local summary by synthesizing top result snippets
function buildSummary(query: string, results: WebResult[]): { text: string; sources: WebResult[] } {
  const topResults = results.slice(0, 5).filter(r => r.snippet && r.snippet.trim().length > 40);
  if (topResults.length === 0) return { text: '', sources: [] };

  // Collect unique sentences from snippets
  const allSentences: string[] = [];
  topResults.forEach(r => {
    const sentences = r.snippet
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 30 && s.length < 300);
    allSentences.push(...sentences.slice(0, 3));
  });

  // Deduplicate by similarity (basic)
  const unique: string[] = [];
  allSentences.forEach(s => {
    const isDup = unique.some(u => {
      const overlap = s.slice(0, 40);
      return u.includes(overlap);
    });
    if (!isDup) unique.push(s);
  });

  // Take top 4 sentences
  const summary = unique.slice(0, 4).join(' ').trim();
  return { text: summary || topResults[0].snippet, sources: topResults.slice(0, 3) };
}

export default function AISummaryCard({ query, results }: AISummaryCardProps) {
  const [summary, setSummary] = useState('');
  const [sources, setSources] = useState<WebResult[]>([]);
  const [displayed, setDisplayed] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBuilding, setIsBuilding] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Build summary when results change
  useEffect(() => {
    if (results.length < 2) {
      setIsBuilding(false);
      return;
    }
    setIsBuilding(true);
    setDisplayed('');
    setSummary('');
    setSources([]);
    setExpanded(false);
    stopSpeaking();

    // Small delay to feel "AI processing"
    const t = setTimeout(() => {
      const { text, sources: s } = buildSummary(query, results);
      setSummary(text);
      setSources(s);
      setIsBuilding(false);
    }, 800);

    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, results]);

  // Typewriter animation
  useEffect(() => {
    if (!summary || isBuilding) return;
    setDisplayed('');
    let i = 0;
    const step = () => {
      if (i < summary.length) {
        setDisplayed(summary.slice(0, i + 1));
        i++;
        timerRef.current = setTimeout(step, 8);
      }
    };
    timerRef.current = setTimeout(step, 50);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [summary, isBuilding]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const handleSpeak = useCallback(() => {
    if (!summary) return;
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    const utter = new SpeechSynthesisUtterance(summary);
    utter.lang = 'id-ID';
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
    setIsSpeaking(true);
  }, [summary, isSpeaking, stopSpeaking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stopSpeaking]);

  // Don't render if nothing to show
  if (!isBuilding && !summary) return null;

  const previewLength = 300;
  const isLong = summary.length > previewLength;
  const visibleText = expanded ? displayed : displayed.slice(0, previewLength);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl border border-blue-200/60 dark:border-blue-500/20 bg-gradient-to-br from-blue-50/80 via-white/60 to-indigo-50/40 dark:from-blue-950/30 dark:via-zinc-900/60 dark:to-indigo-950/20 backdrop-blur-sm shadow-sm overflow-hidden"
    >
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-70" />

      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-blue-700 dark:text-blue-400 tracking-wide">Ringkasan AI</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20 uppercase tracking-wider">
              Beta
            </span>
          </div>

          {/* Speak button */}
          <button
            onClick={handleSpeak}
            disabled={isBuilding || !summary}
            title={isSpeaking ? "Hentikan pembacaan" : "Bacakan ringkasan"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isSpeaking
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                : 'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/10 border border-blue-200/50 dark:border-blue-500/20'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-3.5 w-3.5" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5" />
                <span>Bacakan</span>
              </>
            )}
          </button>
        </div>

        {/* Summary body */}
        {isBuilding ? (
          <div className="flex items-center gap-3 py-3">
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 rounded-full bg-blue-200/50 dark:bg-blue-500/10 animate-pulse w-full" />
              <div className="h-3.5 rounded-full bg-blue-200/50 dark:bg-blue-500/10 animate-pulse w-4/5" />
              <div className="h-3.5 rounded-full bg-blue-200/50 dark:bg-blue-500/10 animate-pulse w-3/5" />
            </div>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-800 dark:text-zinc-200 leading-relaxed">
              <span>{visibleText}</span>
              {/* Blinking cursor while typing */}
              {displayed.length < summary.length && (
                <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse align-middle" />
              )}
              {isLong && !expanded && displayed.length >= previewLength && (
                <span className="text-gray-400 dark:text-zinc-500">...</span>
              )}
            </div>

            {/* Expand / Collapse */}
            {isLong && displayed.length >= previewLength && (
              <button
                onClick={() => setExpanded(e => !e)}
                className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                {expanded ? (
                  <><ChevronUp className="h-3.5 w-3.5" /> Tampilkan lebih sedikit</>
                ) : (
                  <><ChevronDown className="h-3.5 w-3.5" /> Tampilkan selengkapnya</>
                )}
              </button>
            )}
          </>
        )}

        {/* Source chips */}
        {sources.length > 0 && !isBuilding && (
          <div className="mt-4 pt-4 border-t border-blue-200/40 dark:border-blue-500/10">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-zinc-500 mb-2.5">Sumber</p>
            <div className="flex flex-wrap gap-2">
              {sources.map((s, i) => {
                let host = '';
                try { host = new URL(s.link).hostname.replace('www.', ''); } catch { host = s.link; }
                return (
                  <a
                    key={i}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/70 dark:bg-zinc-800/60 border border-blue-100 dark:border-zinc-700/60 text-gray-600 dark:text-zinc-300 hover:border-blue-300 dark:hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
                  >
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${host}&sz=16`}
                      alt=""
                      className="h-3.5 w-3.5 rounded-sm"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <span className="truncate max-w-[120px]">{host}</span>
                    <ExternalLink className="h-2.5 w-2.5 flex-shrink-0 opacity-50" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
