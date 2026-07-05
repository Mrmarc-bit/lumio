'use client';

import React from 'react';
import { Newspaper, ExternalLink, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { NewsResult } from '@/types';

interface NewsCardProps {
  news: NewsResult;
  index?: number;
}

export default function NewsCard({ news, index = 0 }: NewsCardProps) {
  // Generate a premium news placeholder image based on title/hash
  const hash = news.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageKeywords = ['technology', 'finance', 'world', 'science', 'business'];
  const keyword = imageKeywords[hash % imageKeywords.length];
  const placeholderImg = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=300&h=180&q=80&sig=${hash % 1000}`;

  return (
    <motion.article 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.35), ease: [0.16, 1, 0.3, 1] }}
      className="group p-5 premium-card rounded-2xl flex flex-col md:flex-row gap-5"
    >
      
      {/* Thumbnail */}
      <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0 relative shadow-sm border border-gray-100 dark:border-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={placeholderImg} 
          alt={news.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider flex items-center gap-1">
          <Newspaper className="h-3 w-3" /> NEWS
        </div>
      </div>

      {/* Info Content */}
      <div className="flex-1 flex flex-col justify-between gap-2.5">
        <div className="flex flex-col gap-1.5">
          {/* Publisher & Timestamp */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
            <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">{news.source}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {news.date}</span>
          </div>

          {/* Headline Title */}
          <h2 className="text-base md:text-lg font-bold leading-snug font-display tracking-tight">
            <a 
              href={news.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group/link text-gray-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
            >
              <span className="relative pb-0.5">
                {news.title}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 transition-all duration-300 group-hover:w-full" />
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </a>
          </h2>

          {/* Abstract Snippet */}
          <p className="text-xs md:text-sm text-gray-600 dark:text-zinc-300 leading-relaxed font-sans">
            {news.snippet}
          </p>
        </div>

        {/* Visit link */}
        <div className="mt-2 text-xs font-semibold">
          <a 
            href={news.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
          >
            Read full coverage <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

    </motion.article>
  );
}

