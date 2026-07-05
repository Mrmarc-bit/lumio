'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { Compass, Keyboard, Lock, Sparkles, TrendingUp, Sun, Moon, Info, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchBox from '@/components/SearchBox';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import Breadcrumb from '@/components/Breadcrumb';
import { useSearchStore } from '@/store/searchStore';
import Footer from '@/components/Footer';

function HomeContent() {
  const settings = useSearchStore(state => state.settings);
  const updateSettings = useSearchStore(state => state.updateSettings);

  const trendings = [
    'nextjs 15 routing parameters',
    'information retrieval evaluation matrix',
    'docker compose environmental variables',
    'tailwind v4 glassmorphic border styling'
  ];

  const quickLinks = [
    { label: 'Academic Search', query: 'inverted index search retrieval' },
    { label: 'Next.js 15 Dev', query: 'nextjs 15 stable releases' },
    { label: 'Tailwind Guide', query: 'tailwindcss v4 setup guides' }
  ];

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative overflow-hidden bg-[#ffffff] premium-container border border-[#ececec] dark:border-[#27272a]/70 shadow-[0_8px_30px_rgb(0,0,0,0.01)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.25)] rounded-3xl h-[calc(100vh-32px)] my-4 mr-4 transition-all duration-300">
        
        {/* Decorative Glow Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[120px] pointer-events-none" />

        {/* Top Floating Header */}
        <header className="w-full px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb 
              items={[
                { label: 'Lumio' },
                { label: 'Home' }
              ]} 
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-[#fafafa] hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
              title="Toggle theme"
            >
              {settings.theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <Link
              href="/settings"
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-[#fafafa] hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
              title="Search Settings"
            >
              <Info className="h-5 w-5" />
            </Link>
          </div>
        </header>

        {/* Main Search Panel */}
        <main className="max-w-4xl w-full mx-auto px-6 py-12 flex flex-col items-center justify-center gap-10 flex-1 z-10">
          
          {/* Animated Brand Logo */}
          <div className="flex flex-col items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/25"
            >
              <Compass className="h-10 w-10 text-white animate-spin-slow" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-[#fafafa] font-sans">
                Lumio
              </h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-zinc-400 font-medium mt-1.5 flex items-center justify-center gap-1.5">
                Search beautifully. <Lock className="h-3 w-3" /> Private Search Client
              </p>
            </motion.div>
          </div>

          {/* Large Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="w-full"
          >
            <SearchBox size="large" />
          </motion.div>

          {/* Quick Links & Trending Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-2xl flex flex-col md:flex-row justify-between gap-8 text-sm"
          >
            
            {/* Quick links suggestions */}
            <div className="flex-1 flex flex-col gap-2.5">
              <h3 className="text-xs font-bold tracking-wider text-gray-400 dark:text-zinc-500 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-accent" /> QUICK RETRIEVALS
              </h3>
              <div className="flex flex-col gap-1.5">
                {quickLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={`/search?q=${encodeURIComponent(link.query)}`}
                    className="text-gray-600 hover:text-accent dark:text-zinc-400 dark:hover:text-accent transition-colors text-left"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending Searches */}
            <div className="flex-1 flex flex-col gap-2.5">
              <h3 className="text-xs font-bold tracking-wider text-gray-400 dark:text-zinc-500 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-accent" /> TRENDING SEARCHES
              </h3>
              <div className="flex flex-col gap-1.5">
                {trendings.map((query, idx) => (
                  <Link
                    key={idx}
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="text-gray-600 hover:text-accent dark:text-zinc-400 dark:hover:text-accent transition-colors truncate"
                    title={query}
                  >
                    {query}
                  </Link>
                ))}
              </div>
            </div>

          </motion.div>

          {/* Keyboard shortcut helper */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hidden md:flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-500 mt-4"
          >
            <Keyboard className="h-4 w-4" />
            <span>Press <kbd className="bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-1 py-0.5 rounded shadow-sm">⌘K</kbd> to open Command Menu</span>
          </motion.div>

        </main>

        {/* Footer */}
        <Footer />

      </SidebarInset>
    </SidebarProvider>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#ffffff] dark:bg-[#09090b]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
