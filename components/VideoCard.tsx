'use client';

import React, { useState } from 'react';
import { Play, ExternalLink, X, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoResult } from '@/types';

interface VideoCardProps {
  video: VideoResult;
  index?: number;
}

export default function VideoCard({ video, index = 0 }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Try to parse YouTube Video ID for inline player
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytId = getYouTubeId(video.link);

  return (
    <>
      <motion.article 
        onClick={() => ytId && setIsPlaying(true)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.35), ease: [0.16, 1, 0.3, 1] }}
        className={`group p-4 premium-card rounded-2xl flex flex-col md:flex-row gap-4 ${ytId ? 'cursor-pointer' : ''}`}
      >
        
        {/* Left Side: Thumbnail & Play Indicator */}
        <div className="w-full md:w-48 h-28 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={video.thumbnail || `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=320&h=180&q=80`} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Duration Badge */}
          {video.duration && (
            <span className="absolute bottom-2 right-2 bg-black/75 px-1.5 py-0.5 rounded text-[10px] font-bold text-white tracking-wide">
              {video.duration}
            </span>
          )}

          {/* Hover Play Button Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transition-transform scale-90 group-hover:scale-100 duration-300">
              <Play className="h-5 w-5 fill-white" />
            </div>
          </div>
        </div>

        {/* Right Side: Metadata & Description */}
        <div className="flex-1 flex flex-col justify-between py-1 gap-2">
          <div className="flex flex-col gap-1.5">
            {/* Publisher Channel info */}
            <div className="text-xs text-gray-500 dark:text-zinc-400 font-semibold flex items-center gap-1.5">
              <Film className="h-3.5 w-3.5 text-blue-500" />
              <span>{video.author}</span>
            </div>

            {/* Title */}
            <h2 className="text-sm md:text-base font-bold leading-snug font-display tracking-tight">
              {ytId ? (
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="text-left relative group/link text-gray-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="relative pb-0.5">
                    {video.title}
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 transition-all duration-300 group-hover:w-full" />
                  </span>
                </button>
              ) : (
                <a 
                  href={video.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="relative group/link text-gray-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="relative pb-0.5">
                    {video.title}
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 transition-all duration-300 group-hover:w-full" />
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </a>
              )}
            </h2>

            {/* Description Snippet */}
            <p className="text-xs md:text-sm text-gray-600 dark:text-zinc-400 line-clamp-2 font-sans">
              {video.snippet}
            </p>
          </div>

          {/* External Link */}
          <div className="text-xs font-semibold">
            <a 
              href={video.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
            >
              Watch on source platform <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

      </motion.article>

      {/* Screen Overlay Video Modal */}
      <AnimatePresence>
        {isPlaying && ytId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Bar */}
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between text-zinc-100">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">{video.author}</span>
                <button
                  onClick={() => setIsPlaying(false)}
                  className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Responsive Video Container */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>

              {/* Title & Desc Details */}
              <div className="p-6 text-zinc-100 bg-zinc-950">
                <h3 className="text-base md:text-lg font-semibold leading-snug mb-2">{video.title}</h3>
                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">{video.snippet}</p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

