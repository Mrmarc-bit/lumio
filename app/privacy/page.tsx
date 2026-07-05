'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShieldCheck, Lock, EyeOff } from 'lucide-react';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
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
          <span className="font-bold text-gray-900 dark:text-[#fafafa]">Privacy Guidelines</span>
          <div className="w-16" />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl w-full mx-auto px-6 py-12 flex-1 flex flex-col gap-8">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="h-10 w-10 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#fafafa] mt-2">Privacy & Telemetry policy</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Zero tracking, zero analytics, zero data harvesting.</p>
        </div>

        <article className="prose dark:prose-invert text-sm md:text-base leading-relaxed text-gray-700 dark:text-zinc-300 flex flex-col gap-6 pt-4 border-t border-[#ececec] dark:border-[#27272a]">
          <p>
            Your search patterns, keywords, IP addresses, and digital footprint are highly sensitive. Lumio implements strict architectural constraints to ensure your search queries remain private.
          </p>

          <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <EyeOff className="h-4 w-4 text-blue-500" /> 1. No Server-Side Logging
          </h3>
          <p>
            Lumio does not maintain databases of users or search history on its backend. The Next.js API layer acts strictly as a stateless router. It receives your query, proxies it to the self-hosted SearXNG container, and responds with the sanitized results immediately without writing anything to disk.
          </p>

          <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-500" /> 2. Local Storage Control
          </h3>
          <p>
            Your search history and bookmarks dashboard are stored entirely in your web browser&apos;s local storage. This data is never uploaded to the cloud or shared with third parties. You can clear this data at any time under the **Data Management** panel in settings.
          </p>

          <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-500" /> 3. SearXNG API Sanitization
          </h3>
          <p>
            When requests are sent to the SearXNG metasearch backend:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li>Search queries are stripped of any identification tokens.</li>
            <li>HTTP Referrer headers and browser headers are fully anonymized.</li>
            <li>Tracking links, ad scripts, and sponsored trackers are scrubbed before the results reach the frontend.</li>
          </ul>
        </article>
      </main>

      <Footer />

    </div>
  );
}
