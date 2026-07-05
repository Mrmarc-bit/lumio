'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Image, Film, Newspaper, Settings, Compass, Sun, Moon, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchBox from './SearchBox';
import Breadcrumb from './Breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { useSearchStore } from '@/store/searchStore';

interface NavbarProps {
  tbm?: string;
  query: string;
}

export default function Navbar({ tbm = 'web', query = '' }: NavbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const settings = useSearchStore(state => state.settings);
  const updateSettings = useSearchStore(state => state.updateSettings);
  const toggleCommandPalette = useSearchStore(state => state.toggleCommandPalette);

  const filterTabs = [
    { id: 'web', label: 'All', icon: Search },
    { id: 'isch', label: 'Images', icon: Image },
    { id: 'vid', label: 'Videos', icon: Film },
    { id: 'nws', label: 'News', icon: Newspaper }
  ];

  const handleTabClick = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tabId === 'web') {
      params.delete('tbm');
    } else {
      params.set('tbm', tabId);
    }
    router.push(`/search?${params.toString()}`);
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="sticky top-0 w-full z-40 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-[#ececec] dark:border-[#27272a] transition-colors duration-300">
      
      {/* Top Main Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Sidebar Trigger, Separator, and Breadcrumbs */}
        <div className="flex items-center gap-2 flex-shrink-0 font-sans">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb 
            items={[
              {label: 'Lumio', href: '/'},
              { label: tbm === 'isch' ? 'Images' : tbm === 'vid' ? 'Videos' : tbm === 'nws' ? 'News' : 'Web' }
            ]} 
          />
        </div>

        {/* Mid Section: Search box */}
        <div className="flex-1 max-w-2xl">
          <SearchBox initialValue={query} size="small" tbm={tbm} />
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2">
          {/* Cmd+K Command Palette Trigger Button */}
          <button
            onClick={toggleCommandPalette}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-[#fafafa] hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all flex items-center gap-1.5"
            title="Open Command Palette (Cmd+K)"
          >
            <Terminal className="h-4.5 w-4.5" />
            <kbd className="hidden md:inline bg-white dark:bg-zinc-800 text-[10px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-zinc-700 text-gray-400 dark:text-zinc-500 shadow-sm leading-none">⌘K</kbd>
          </button>

          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-[#fafafa] hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
            title="Toggle theme"
          >
            {settings.theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Settings button */}
          <button
            onClick={() => router.push('/settings')}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-[#fafafa] hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
            title="Search Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tabs Filter Bar (aligned with search results) */}
      <div className="max-w-7xl mx-auto px-4 md:px-36">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = tbm === tab.id;
            const TabIcon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative py-3.5 flex items-center gap-2 text-xs md:text-sm font-semibold transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400 font-bold' 
                    : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                <TabIcon className="h-4 w-4" />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
}
