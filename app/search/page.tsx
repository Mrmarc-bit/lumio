'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Compass, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import ResultCard from '@/components/ResultCard';
import ImageCard from '@/components/ImageCard';
import NewsCard from '@/components/NewsCard';
import VideoCard from '@/components/VideoCard';
import InfoboxCard from '@/components/InfoboxCard';
import AISummaryCard from '@/components/AISummaryCard';
import { useSearchStore } from '@/store/searchStore';
import { WebResult, ImageResult, NewsResult, VideoResult } from '@/types';
import { computeIRMetrics } from '@/lib/irMetrics';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get('q') || '';
  const tbm = searchParams.get('tbm') || 'web'; // web, isch, nws, vid
  const [page, setPage] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [infoboxes, setInfoboxes] = useState<any[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState('');
  const [searchTime, setSearchTime] = useState(0);

  const settings = useSearchStore(state => state.settings);

  // Sync page state when search query or tbm changes
  useEffect(() => {
    setPage(1);
    setResults([]);
    setInfoboxes([]);
  }, [query, tbm]);

  // Fetch search results
  useEffect(() => {
    if (!query) {
      router.push('/');
      return;
    }

    async function fetchResults() {
      setLoading(true);
      setError('');
      const startTime = performance.now();

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&page=${page}&tbm=${tbm}&safeSearch=${settings.safeSearch}&lang=${settings.language}&country=${settings.region}`
        );
        
        if (!res.ok) throw new Error('Failed to fetch results');
        
        const data = await res.json();
        const rawResults: WebResult[] = data.results || [];

        // Compute IR metrics client-side for all web results
        if (tbm === 'web' && rawResults.length > 0) {
          const metrics = computeIRMetrics(query, rawResults);
          // Attach metrics for display only — preserve SearXNG's ranking order
          const enriched = rawResults.map((r, i) => ({ ...r, irMetrics: metrics[i] }));
          setResults(enriched);
        } else {
          setResults(rawResults);
        }
        setInfoboxes(data.infoboxes || []);
        setIsMock(data.isMock || false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An error occurred during search retrieval.');
      } finally {
        const endTime = performance.now();
        setSearchTime((endTime - startTime) / 1000);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    fetchResults();
  }, [query, page, tbm, settings.safeSearch, settings.language, settings.region, router]);

  // Handle pagination
  const handlePrevPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const handleNextPage = () => {
    setPage(p => p + 1);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1 flex flex-col h-[calc(100vh-32px)] my-4 mr-4 bg-[#ffffff] premium-container border border-[#ececec] dark:border-[#27272a]/70 shadow-[0_8px_30px_rgb(0,0,0,0.01)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.25)] rounded-3xl overflow-y-auto transition-all duration-300">
      
      {/* Navigation Topbar */}
      <Navbar tbm={tbm} query={query} />

      {/* Main Results Area */}
      <main className={`flex-1 max-w-7xl w-full mx-auto py-6 flex flex-col gap-6 px-4 ${infoboxes.length > 0 ? 'lg:px-8' : 'md:px-36'}`}>
        
        {/* Mock Warning Banner */}
        {isMock && !loading && !error && (
          <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 text-yellow-800 dark:text-yellow-400 rounded-2xl text-xs md:text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <strong>Mock Mode Active</strong>: The local/remote SearXNG instance was unreachable. Displaying fallback simulated IR search outputs.
            </div>
          </div>
        )}

        {/* Stats Row */}
        {!loading && !error && results.length > 0 && (
          <div className="text-xs text-gray-500 dark:text-zinc-500">
            About {results.length * 12} results for &quot;<span className="font-medium text-gray-700 dark:text-zinc-300">{query}</span>&quot; ({searchTime.toFixed(2)} seconds)
          </div>
        )}

        {/* Loading Spinner / Skeletons */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4 py-8"
            >
              {tbm === 'isch' ? (
                // Image Skeletons Masonry
                <div className="columns-2 md:columns-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-full h-40 shimmer-loading rounded-2xl mb-4" />
                  ))}
                </div>
              ) : (
                // Web/News/Video list skeletons
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-5 border border-[#ececec] dark:border-[#27272a] rounded-2xl flex flex-col gap-3">
                    <div className="w-1/3 h-4 shimmer-loading rounded-md" />
                    <div className="w-2/3 h-5 shimmer-loading rounded-md" />
                    <div className="w-full h-12 shimmer-loading rounded-md" />
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {!loading && error && (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-lg font-bold">Search Retrieval Failed</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-md">{error}</p>
            <button 
              onClick={() => router.refresh()} 
              className="h-10 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> Try Again
            </button>
          </div>
        )}

        {/* Empty / No Results State */}
        {!loading && !error && results.length === 0 && (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-2">
            <Compass className="h-12 w-12 text-gray-400 dark:text-zinc-600 animate-pulse" />
            <h2 className="text-lg font-bold mt-2">No Results Found</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Try checking your spelling, using more general search terms, or adjusting Safe Search filter levels in settings.
            </p>
          </div>
        )}

        {/* Dynamic Results Grid/List */}
        {!loading && !error && results.length > 0 && (
          <div>
            {tbm === 'isch' && (
              // Pinterest Masonry for Image Results
              <div className="columns-2 md:columns-4 gap-4">
                {results.map((img: ImageResult, idx) => (
                  <ImageCard key={idx} image={img} />
                ))}
              </div>
            )}

            {tbm === 'nws' && (
              // News Cards List
              <div className="flex flex-col gap-5">
                {results.map((item: NewsResult, idx) => (
                  <NewsCard key={idx} news={item} index={idx} />
                ))}
              </div>
            )}

            {tbm === 'vid' && (
              // Video Cards List
              <div className="flex flex-col gap-4">
                {results.map((item: VideoResult, idx) => (
                  <VideoCard key={idx} video={item} index={idx} />
                ))}
              </div>
            )}

            {tbm === 'web' && (
              // Standard Web results and side Knowledge Panel List
              <div className={infoboxes.length > 0 ? "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" : "flex flex-col gap-4"}>
                <div className={infoboxes.length > 0 ? "lg:col-span-8 flex flex-col gap-4" : "flex flex-col gap-4"}>
                  {/* AI Summary Card */}
                  <AISummaryCard query={query} results={results} />
                  {results.map((item: WebResult, idx) => (
                    <ResultCard key={idx} result={item} index={idx} />
                  ))}
                </div>
                {infoboxes.length > 0 && (
                  <div className="lg:col-span-4 flex flex-col gap-4">
                    {infoboxes.map((box: any, idx: number) => (
                      <InfoboxCard key={idx} infobox={box} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-4 mt-12 py-6 border-t border-[#ececec] dark:border-[#27272a]">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="h-10 w-10 flex items-center justify-center border border-[#ececec] dark:border-[#27272a] rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                Page {page}
              </span>
              <button
                onClick={handleNextPage}
                className="h-10 w-10 flex items-center justify-center border border-[#ececec] dark:border-[#27272a] rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

          </div>
        )}

      </main>

      <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#ffffff] dark:bg-[#09090b]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
