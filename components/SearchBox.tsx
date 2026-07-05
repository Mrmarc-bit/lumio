'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Search, X, Mic, Image as ImageIcon, History, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '@/store/searchStore';

interface SearchBoxProps {
  initialValue?: string;
  size?: 'large' | 'small';
  tbm?: string;
}

export default function SearchBox({ initialValue = '', size = 'large', tbm = 'web' }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const addRecentSearch = useSearchStore(state => state.addRecentSearch);
  const recentSearches = useSearchStore(state => state.recentSearches);
  const settings = useSearchStore(state => state.settings);

  // Client side mounting state
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Voice Search states
  const [isListening, setIsListening] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const hasVoiceErrorRef = useRef(false); // track if error fired so onend won't close the modal

  // Image Search states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync with initial value
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Speech Recognition effect setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = settings.language === 'lang_id' ? 'id-ID' : 'en-US';

        rec.onstart = () => {
          setIsListening(true);
          setAudioError(null);
        };

        rec.onend = () => {
          // If no error was set, we can close the modal, else let the user see the error
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error event:", event.error);
          if (event.error === 'not-allowed') {
            setAudioError("Akses mikrofon diblokir. Harap aktifkan izin mikrofon di sebelah kanan bilah URL browser Anda.");
          } else if (event.error === 'no-speech') {
            setAudioError("Tidak terdengar suara. Harap coba lagi.");
          } else {
            setAudioError(`Error: ${event.error}`);
          }
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          setIsListening(false);
          triggerSearch(transcript);
        };

        recognitionRef.current = rec;
      }
    }
  }, [settings.language]);

  const handleMicClick = () => {
    setAudioError(null);
    hasVoiceErrorRef.current = false;

    // Always build a fresh instance so we don't accidentally call .start() on null
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAudioError("Speech recognition tidak didukung browser ini. Gunakan Google Chrome.");
      setIsListening(true); // show modal with error
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = settings.language === 'lang_id' ? 'id-ID' : 'en-US';

    rec.onend = () => {
      // Only close the overlay if no error occurred.
      // If onerror fired first, keep the modal open so user can read the message.
      if (!hasVoiceErrorRef.current) {
        setIsListening(false);
      }
    };

    rec.onerror = (event: any) => {
      hasVoiceErrorRef.current = true; // prevent onend from closing modal
      if (event.error === 'not-allowed') {
        setAudioError("Akses mikrofon diblokir. Klik ikon kunci/mikrofon di bilah URL Chrome, lalu aktifkan izin mikrofon.");
      } else if (event.error === 'no-speech') {
        setAudioError("Tidak terdengar suara. Harap coba lagi.");
      } else if (event.error === 'network') {
        setAudioError("Masalah jaringan. Periksa koneksi internet Anda.");
      } else {
        setAudioError(`Terjadi kesalahan: ${event.error}`);
      }
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
      triggerSearch(transcript);
    };

    recognitionRef.current = rec;

    // Show overlay THEN start
    setIsListening(true);
    try {
      rec.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      hasVoiceErrorRef.current = true;
      setAudioError("Gagal memulai perekaman suara.");
    }
  };

  const handleCancelMic = () => {
    try {
      recognitionRef.current?.stop();
    } catch (e) {}
    setIsListening(false);
    setAudioError(null);
  };

  // Image search handlers
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setIsAnalyzing(true);
      setShowDropdown(false);

      // Simulate visual scanning analysis
      setTimeout(() => {
        setIsAnalyzing(false);
        // Extract basic query terms from filename
        let searchKeyword = file.name.split('.')[0]
          .replace(/[-_]+/g, ' ')
          .replace(/[0-9]+/g, '')
          .trim();
        
        if (!searchKeyword) {
          searchKeyword = "unugha cilacap";
        }

        setQuery(searchKeyword);
        triggerSearch(searchKeyword);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle Autocomplete fetch with debounce
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.slice(0, 5));
        }
      } catch (err) {
        console.error('Autocomplete error', err);
      }
    }, 150);

    return () => clearTimeout(handler);
  }, [query]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerSearch = (searchQuery: string, replace = false) => {
    if (!searchQuery.trim()) return;
    const finalQuery = searchQuery.trim();
    addRecentSearch(finalQuery);
    setShowDropdown(false);
    const url = tbm && tbm !== 'web'
      ? `/search?q=${encodeURIComponent(finalQuery)}&tbm=${tbm}`
      : `/search?q=${encodeURIComponent(finalQuery)}`;
    if (replace) {
      router.replace(url);
    } else {
      router.push(url);
    }
  };

  // Realtime search — auto-trigger 700ms after user stops typing (only on search results page)
  useEffect(() => {
    if (size !== 'small') return; // only on results page
    if (!query.trim() || query.trim().length < 2) return;

    const handler = setTimeout(() => {
      triggerSearch(query, true); // replace=true to avoid stacking history
    }, 700);

    return () => clearTimeout(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalItems = (suggestions.length) + (recentSearches.slice(0, 3).length);
    const combinedItems = [
      ...recentSearches.slice(0, 3).map(q => ({ text: q, isRecent: true })),
      ...suggestions.map(q => ({ text: q, isRecent: false }))
    ];

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < combinedItems.length) {
        setQuery(combinedItems[selectedIndex].text);
        triggerSearch(combinedItems[selectedIndex].text);
      } else {
        triggerSearch(query);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  const isLarge = size === 'large';

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
      
      {/* Hidden File Input for Image Search */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Search Input Box */}
      <div 
        className={`flex items-center w-full rounded-2xl border transition-all duration-300 ${
          showDropdown 
            ? 'border-blue-500 dark:border-blue-400/80 ring-4 ring-blue-500/10 dark:ring-blue-400/5 bg-white dark:bg-[#16161c] shadow-[0_4px_30px_rgba(59,130,246,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.25)]' 
            : 'border-gray-200/70 dark:border-zinc-800/60 bg-white/60 dark:bg-[#121218]/60 backdrop-blur-xl hover:border-gray-300 dark:hover:border-zinc-700/80 hover:bg-white/80 dark:hover:bg-[#121218]/80'
        } ${isLarge ? 'h-14 px-4' : 'h-10 px-3'}`}
      >
        <Search className={`text-gray-400 mr-3 flex-shrink-0 ${isLarge ? 'h-5 w-5' : 'h-4 w-4'}`} />
        
        {/* Uploaded Image Thumbnail Preview */}
        {selectedImage && (
          <div className="relative h-8 w-8 md:h-10 md:w-10 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800/80 mr-2.5 flex-shrink-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage} alt="preview" className="h-full w-full object-cover" />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/10">
                <div className="laser-scanner" />
              </div>
            )}
            <button 
              type="button"
              onClick={handleClearImage}
              className="absolute top-0 right-0 p-0.5 bg-black/60 hover:bg-black/85 text-white rounded-bl-md transition-colors"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        )}

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={isAnalyzing ? "Menganalisis gambar..." : "Search Lumio or enter URL..."}
          disabled={isAnalyzing}
          className="flex-1 bg-transparent text-gray-900 dark:text-[#fafafa] outline-none placeholder-gray-400 font-sans text-sm md:text-base h-full w-full disabled:opacity-50"
        />

        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full transition-colors mr-2"
            >
              <X className={isLarge ? 'h-5 w-5' : 'h-4 w-4'} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Action icons */}
        <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-800 pl-3">
          <button 
            type="button" 
            onClick={handleMicClick}
            title="Voice Search"
            className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <Mic className={isLarge ? 'h-5 w-5' : 'h-4 w-4'} />
          </button>
          <button 
            type="button" 
            onClick={handleImageClick}
            title="Search by Image"
            className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <ImageIcon className={isLarge ? 'h-5 w-5' : 'h-4 w-4'} />
          </button>
        </div>
      </div>

      {/* Autocomplete & Recents Dropdown */}
      <AnimatePresence>
        {showDropdown && (query || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 mt-2 bg-white/90 dark:bg-[#16161c]/90 backdrop-blur-xl border border-gray-200/60 dark:border-zinc-800/80 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/60 overflow-hidden z-50"
          >
            <div className="py-2">
              
              {/* Recent Searches */}
              {!query && recentSearches.length > 0 && (
                <div>
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                    <History className="h-3 w-3" /> RECENT SEARCHES
                  </div>
                  {recentSearches.slice(0, 3).map((item, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <button
                        key={`recent-${idx}`}
                        onClick={() => {
                          setQuery(item);
                          triggerSearch(item);
                        }}
                        className={`w-full px-4 py-2.5 text-left flex items-center text-sm transition-colors ${
                          isSelected 
                            ? 'bg-gray-100 dark:bg-zinc-800 text-blue-500 dark:text-blue-400' 
                            : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                        }`}
                      >
                        <History className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Suggestions */}
              {query && (
                <div>
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" /> SUGGESTED QUERIES
                  </div>
                  
                  {suggestions.length === 0 ? (
                    <button
                      onClick={() => triggerSearch(query)}
                      className="w-full px-4 py-3 text-left flex items-center text-sm text-blue-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                    >
                      <Search className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span>Search for &quot;<strong className="text-gray-900 dark:text-[#fafafa] font-semibold">{query}</strong>&quot;</span>
                    </button>
                  ) : (
                    suggestions.map((item, idx) => {
                      const offsetIdx = idx;
                      const isSelected = selectedIndex === offsetIdx;
                      return (
                        <button
                          key={`suggest-${idx}`}
                          onClick={() => {
                            setQuery(item);
                            triggerSearch(item);
                          }}
                          className={`w-full px-4 py-2.5 text-left flex items-center text-sm transition-colors ${
                            isSelected 
                              ? 'bg-gray-100 dark:bg-zinc-800 text-blue-500 dark:text-blue-400' 
                              : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                          }`}
                        >
                          <Search className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{item}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Keyboard Shortcuts Footer */}
            {isLarge && (
              <div className="bg-gray-50 dark:bg-zinc-800/30 px-4 py-2 text-xs text-gray-400 dark:text-gray-500 border-t border-[#ececec] dark:border-[#27272a] flex justify-between items-center">
                <span>Use arrows to navigate, Enter to search</span>
                <span className="flex gap-1.5">
                  <kbd className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-1.5 py-0.5 rounded shadow-sm">esc</kbd> to close
                </span>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Search Full-screen Overlay — rendered via Portal at body level */}
      {isListening && mounted && createPortal(
        <motion.div
          key="voice-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/85 backdrop-blur-md"
          onClick={handleCancelMic}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex flex-col items-center justify-center p-8 rounded-3xl bg-zinc-950/90 border border-zinc-800/50 max-w-sm w-full mx-4 shadow-2xl text-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center justify-center h-28 w-28">
              {audioError ? (
                <div className="relative h-20 w-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/10 animate-bounce">
                  <AlertCircle className="h-10 w-10" />
                </div>
              ) : (
                <>
                  {/* Audio pulse wave rings */}
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 pulse-wave" />
                  <div className="absolute inset-[-15px] rounded-full bg-blue-500/10 pulse-wave" style={{ animationDelay: '0.4s' }} />
                  
                  <div className="relative h-20 w-20 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/40">
                    <Mic className="h-9 w-9 animate-pulse" />
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col gap-1.5 px-2">
              <h3 className="text-xl font-bold text-zinc-100 font-display">
                {audioError ? "Akses Gagal" : "Mendengarkan..."}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {audioError ? audioError : "Katakan sesuatu untuk mencari"}
              </p>
            </div>

            <div className="flex gap-3 w-full justify-center mt-2">
              {audioError && (
                <button
                  type="button"
                  onClick={handleMicClick}
                  className="h-10 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold tracking-wider transition-colors"
                >
                  COBA LAGI
                </button>
              )}
              <button
                type="button"
                onClick={handleCancelMic}
                className="h-10 px-5 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold tracking-wider transition-colors"
              >
                {audioError ? "TUTUP" : "BATAL"}
              </button>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}

    </div>
  );
}
