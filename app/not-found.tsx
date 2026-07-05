'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Home, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#ffffff] dark:bg-[#09090b] text-[#111111] dark:text-[#fafafa] px-6 text-center relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative Glow */}
      <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <main className="max-w-md w-full flex flex-col items-center justify-center gap-6 z-10">
        
        {/* Animated Compass Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20"
        >
          <Compass className="h-10 w-10 text-white" />
        </motion.div>

        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight">404 - Page Lost</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            The page you are looking for has either been moved, deleted, or never existed in the index.
          </p>
        </div>

        <Link
          href="/"
          className="h-11 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <Home className="h-4 w-4" /> Go back home
        </Link>

      </main>

    </div>
  );
}
