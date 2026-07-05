'use client';

import React, { useState } from 'react';
import { Download, ExternalLink, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageResult } from '@/types';

interface ImageCardProps {
  image: ImageResult;
}

export default function ImageCard({ image }: ImageCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Extract domain name
  let domain = '';
  try {
    domain = new URL(image.link).hostname;
  } catch (e) {
    domain = image.link;
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(image.src);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Get unique filename
      a.download = `lumio-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback: open raw src in new tab
      window.open(image.src, '_blank');
    }
  };

  return (
    <>
      <motion.div 
        onClick={() => setIsPreviewOpen(true)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#ececec] dark:border-[#27272a] bg-white dark:bg-[#18181b] hover:shadow-lg transition-all duration-300 mb-4 break-inside-avoid"
      >
        {/* Shimmer loading background */}
        {!imgLoaded && (
          <div className="w-full h-48 shimmer-loading flex items-center justify-center text-gray-400">
            <ImageIcon className="h-6 w-6 animate-pulse" />
          </div>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={image.src} 
          alt={image.title} 
          onLoad={() => setImgLoaded(true)}
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? 'block' : 'hidden'}`}
        />

        {/* Hover Info Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
          <p className="text-white font-medium text-xs truncate mb-1">{image.title}</p>
          <span className="text-gray-300 text-[10px] truncate flex items-center gap-1">
            <ExternalLink className="h-3 w-3" /> {domain}
          </span>
        </div>

      </motion.div>

      {/* Screen Overlay Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Close Button */}
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left Side: Full Image */}
              <div className="flex-1 bg-black flex items-center justify-center p-6 max-h-[60vh] md:max-h-[80vh]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={image.src} 
                  alt={image.title} 
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              </div>

              {/* Right Side: Meta Sidebar */}
              <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-800 text-zinc-100">
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">{domain}</span>
                    <h3 className="text-lg font-semibold leading-snug mt-1">{image.title}</h3>
                  </div>
                  <div className="text-xs text-zinc-400 leading-relaxed">
                    Source Link: <a href={image.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">{image.link} <ExternalLink className="h-3 w-3" /></a>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-8 md:mt-0">
                  <button
                    onClick={handleDownload}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="h-4 w-4" /> Download Image
                  </button>
                  <a
                    href={image.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                  >
                    Visit Website <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
