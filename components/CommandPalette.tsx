'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Settings, Home, Info, Shield, Moon, Sun, ShieldAlert, History, Bookmark, X, Terminal, FolderHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '@/store/searchStore';

export default function CommandPalette() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandPaletteOpen = useSearchStore(state => state.commandPaletteOpen);
  const setCommandPaletteOpen = useSearchStore(state => state.setCommandPaletteOpen);
  
  const settings = useSearchStore(state => state.settings);
  const updateSettings = useSearchStore(state => state.updateSettings);
  const recentSearches = useSearchStore(state => state.recentSearches);
  const clearRecentSearches = useSearchStore(state => state.clearRecentSearches);
  const bookmarks = useSearchStore(state => state.bookmarks);
  const collections = useSearchStore(state => state.collections);

  // Global listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setSearch('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  // Build command items list
  const items = [
    // 1. Actions / Commands
    {
      category: 'COMMANDS',
      label: `Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      icon: settings.theme === 'dark' ? Sun : Moon,
      action: () => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
    },
    {
      category: 'COMMANDS',
      label: `${settings.safeSearch ? 'Disable' : 'Enable'} Safe Search`,
      icon: ShieldAlert,
      action: () => updateSettings({ safeSearch: !settings.safeSearch })
    },
    {
      category: 'COMMANDS',
      label: 'Clear Local Search History',
      icon: History,
      action: () => {
        if (confirm('Clear all search history?')) clearRecentSearches();
      }
    },
    // 2. Navigation
    {
      category: 'NAVIGATION',
      label: 'Go to Home Page',
      icon: Home,
      action: () => router.push('/')
    },
    {
      category: 'NAVIGATION',
      label: 'Go to Settings Panel',
      icon: Settings,
      action: () => router.push('/settings')
    },
    {
      category: 'NAVIGATION',
      label: 'Go to About Info Page',
      icon: Info,
      action: () => router.push('/about')
    },
    {
      category: 'NAVIGATION',
      label: 'Go to Privacy Policy Page',
      icon: Shield,
      action: () => router.push('/privacy')
    },
    // 3. Recent queries
    ...recentSearches.slice(0, 4).map(query => ({
      category: 'RECENT SEARCHES',
      label: query,
      icon: History,
      action: () => router.push(`/search?q=${encodeURIComponent(query)}`)
    })),
    // 4. Bookmarks
    ...bookmarks.slice(0, 4).map(bookmark => ({
      category: 'BOOKMARKS',
      label: bookmark.title,
      icon: Bookmark,
      action: () => window.open(bookmark.link, '_blank')
    })),
    // 5. Collections
    ...collections.map(collection => ({
      category: 'COLLECTIONS',
      label: `Collection: ${collection.name} (${collection.items.length} items)`,
      icon: FolderHeart,
      action: () => router.push('/settings')
    }))
  ];

  // Filter items based on search input
  const filtered = items.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIndex]) {
        filtered[activeIndex].action();
        setCommandPaletteOpen(false);
      }
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  // Group filtered results by category
  const categories: Record<string, typeof filtered> = {};
  filtered.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });

  // Calculate absolute item index across groups for active highlighting
  let globalIndexCounter = 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/55 backdrop-blur-sm"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -8 }}
        className="w-full max-w-xl bg-white dark:bg-[#111113] border border-[#ececec] dark:border-[#27272a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[50vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header box */}
        <div className="flex items-center gap-3 px-4 border-b border-[#ececec] dark:border-[#27272a] h-12 flex-shrink-0">
          <Terminal className="h-4.5 w-4.5 text-gray-400 dark:text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search settings..."
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-[#fafafa] outline-none placeholder-gray-400 font-sans"
          />
          <kbd className="bg-gray-100 dark:bg-zinc-800 text-[10px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-zinc-700 text-gray-400 dark:text-zinc-500 shadow-sm flex-shrink-0">ESC</kbd>
        </div>

        {/* Dynamic results scroll viewport */}
        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400 dark:text-zinc-500">
              No matching commands or links found
            </div>
          ) : (
            Object.keys(categories).map(catName => (
              <div key={catName} className="mb-2">
                <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 tracking-wider px-3 py-1.5 block">
                  {catName}
                </span>
                
                <div className="flex flex-col gap-0.5">
                  {categories[catName].map((item, idx) => {
                    const currentGlobalIndex = globalIndexCounter++;
                    const isSelected = activeIndex === currentGlobalIndex;
                    const ItemIcon = item.icon;

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          item.action();
                          setCommandPaletteOpen(false);
                        }}
                        onMouseEnter={() => setActiveIndex(currentGlobalIndex)}
                        className={`w-full h-10 px-3 rounded-xl flex items-center gap-3 text-left transition-all ${
                          isSelected 
                            ? 'bg-accent/10 border border-accent/15 text-accent font-semibold' 
                            : 'text-gray-700 dark:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30'
                        }`}
                      >
                        <ItemIcon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm truncate flex-1">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info bar */}
        <div className="bg-gray-50 dark:bg-zinc-800/10 border-t border-[#ececec] dark:border-[#27272a] px-4 py-2 text-[10px] text-gray-400 dark:text-zinc-500 flex justify-between items-center flex-shrink-0">
          <span>Navigate with arrows, Enter to execute</span>
          <span>Lumio Cmd+K Menu</span>
        </div>

      </motion.div>
    </div>
  );
}
