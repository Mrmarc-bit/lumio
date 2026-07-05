'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Info, Compass, Lock, Shield } from 'lucide-react';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#ffffff] dark:bg-[#09090b] transition-colors duration-300">
      
      {/* Header bar */}
      <header className="sticky top-0 w-full z-40 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-[#ececec] dark:border-[#27272a] h-16 flex items-center">
        <div className="max-w-4xl w-full mx-auto px-6 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-[#fafafa] font-semibold transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <span className="font-bold text-gray-900 dark:text-[#fafafa]">About Lumio</span>
          <div className="w-16" />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl w-full mx-auto px-6 py-12 flex-1 flex flex-col gap-8">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Compass className="h-10 w-10 text-white animate-spin-slow" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#fafafa] mt-2">Lumio Search Engine</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">A premium privacy-first Google search frontend wrapper.</p>
        </div>

        <article className="prose dark:prose-invert text-sm md:text-base leading-relaxed text-gray-700 dark:text-zinc-300 flex flex-col gap-6 pt-4 border-t border-[#ececec] dark:border-[#27272a]">
          <p>
            Lumio is designed as a **modern, minimalist, and lightweight** search interface. It functions as a premium portal connecting to a self-hosted **SearXNG** metasearch engine instance.
          </p>
          
          <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-500" /> Why SearXNG?
          </h3>
          <p>
            SearXNG is a privacy-respecting, open-source metasearch engine that aggregates results from dozens of search engines (like Google, Bing, and DuckDuckGo) while guaranteeing user anonymity:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li>Strips tracking cookies, logs, and telemetry data from search requests.</li>
            <li>Prevents search profiling and tracking by proxying queries.</li>
            <li>No search metrics, query profiling, or advertising scripts are ever loaded.</li>
          </ul>

          <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" /> Privacy is Not a Setting, It&apos;s a Standard
          </h3>
          <p>
            Lumio does not record searches, store query logs, or analyze search metrics. Every search preference (like theme, region filters, safe search levels, custom accent colors, and search history) is stored **locally on your device** inside your browser&apos;s localStorage. No search data is ever logged or shared.
          </p>
        </article>
      </main>

      <Footer />

    </div>
  );
}
