'use client';

import React, { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Trash2, Shield, Eye, Globe, Sparkles, Sun, Moon, Info, Bookmark, Trash, FolderHeart, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchStore } from '@/store/searchStore';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';

function SettingsContent() {
  const router = useRouter();
  
  const settings = useSearchStore(state => state.settings);
  const updateSettings = useSearchStore(state => state.updateSettings);
  const recentSearches = useSearchStore(state => state.recentSearches);
  const clearRecentSearches = useSearchStore(state => state.clearRecentSearches);
  
  const bookmarks = useSearchStore(state => state.bookmarks);
  const toggleBookmark = useSearchStore(state => state.toggleBookmark);
  const collections = useSearchStore(state => state.collections);
  const createCollection = useSearchStore(state => state.createCollection);
  const deleteCollection = useSearchStore(state => state.deleteCollection);
  const addBookmarkToCollection = useSearchStore(state => state.addBookmarkToCollection);
  const removeBookmarkFromCollection = useSearchStore(state => state.removeBookmarkFromCollection);

  const [newCollectionName, setNewCollectionName] = useState('');

  const languages = [
    { code: 'lang_en', label: 'English' },
    { code: 'lang_id', label: 'Bahasa Indonesia' },
    { code: 'lang_es', label: 'Español' },
    { code: 'lang_fr', label: 'Français' },
    { code: 'lang_de', label: 'Deutsch' }
  ];

  const regions = [
    { code: 'US', label: 'United States' },
    { code: 'ID', label: 'Indonesia' },
    { code: 'ES', label: 'Spain' },
    { code: 'FR', label: 'France' },
    { code: 'DE', label: 'Germany' }
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1 flex flex-col h-[calc(100vh-32px)] my-4 mr-4 bg-[#ffffff] dark:bg-[#111113] border border-[#ececec] dark:border-[#27272a]/70 shadow-[0_8px_30px_rgb(0,0,0,0.01)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] rounded-3xl overflow-y-auto transition-colors duration-300">
      
      {/* Small Simple Header */}
      <header className="sticky top-0 w-full z-40 bg-white/80 dark:bg-[#111113]/80 backdrop-blur-md border-b border-[#ececec] dark:border-[#27272a]/70 h-16 flex items-center">
        <div className="w-full mx-auto px-6 flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb 
            items={[
              { label: 'Lumio', href: '/' },
              { label: 'Settings' }
            ]} 
          />
        </div>
      </header>

      {/* Main settings container */}
      <main className="max-w-2xl w-full mx-auto px-6 py-12 flex-1 flex flex-col gap-10">
        
        {/* Profile/General section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#fafafa] mb-1">Preferences</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-500">Configure search parameters, interface preferences, and local data settings.</p>
        </div>

        {/* 1. Theme Preferences */}
        <section className="flex flex-col gap-4 p-5 border border-[#ececec] dark:border-[#27272a] rounded-2xl bg-gray-50/50 dark:bg-[#18181b]/50">
          <h2 className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><Sun className="h-4 w-4" /> Interface Theme</h2>
          <div className="flex gap-4">
            {['light', 'dark'].map((theme) => (
              <button
                key={theme}
                onClick={() => updateSettings({ theme: theme as any })}
                className={`flex-1 h-11 rounded-xl text-sm font-semibold border transition-all capitalize ${
                  settings.theme === theme 
                    ? 'border-blue-500 bg-blue-500/5 text-blue-600 dark:text-blue-400 font-bold' 
                    : 'border-[#ececec] dark:border-[#27272a] bg-white dark:bg-[#18181b] text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                {theme} Mode
              </button>
            ))}
          </div>

          {/* Accent Color selection */}
          <div className="flex flex-col gap-2.5 pt-4 border-t border-[#ececec] dark:border-[#27272a] mt-2">
            <div>
              <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Accent Theme Color</span>
              <p className="text-xs text-gray-500 dark:text-zinc-500">Pick a custom accent highlight color for buttons, active tabs, and focus outlines.</p>
            </div>
            <div className="flex gap-3 mt-1">
              {[
                { name: 'blue', color: 'bg-blue-500' },
                { name: 'purple', color: 'bg-purple-500' },
                { name: 'emerald', color: 'bg-emerald-500' },
                { name: 'amber', color: 'bg-amber-500' },
                { name: 'rose', color: 'bg-rose-500' }
              ].map((accent) => (
                <button
                  key={accent.name}
                  onClick={() => updateSettings({ accentColor: accent.name as any })}
                  className={`w-8 h-8 rounded-xl ${accent.color} flex items-center justify-center cursor-pointer transition-all relative ${
                    settings.accentColor === accent.name 
                      ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#18181b] ring-blue-500 scale-105' 
                      : 'hover:scale-105'
                  }`}
                  title={`${accent.name} accent`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 2. Search Settings */}
        <section className="flex flex-col gap-5 p-5 border border-[#ececec] dark:border-[#27272a] rounded-2xl bg-gray-50/50 dark:bg-[#18181b]/50">
          <h2 className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><Globe className="h-4 w-4" /> Search Settings</h2>
          
          {/* Language Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Search Language</span>
              <p className="text-xs text-gray-500 dark:text-zinc-500">Language query parameters sent to SearXNG Search.</p>
            </div>
            <select
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value })}
              className="h-10 px-3 border border-[#ececec] dark:border-[#27272a] bg-white dark:bg-[#18181b] rounded-xl text-sm outline-none text-gray-800 dark:text-zinc-200 min-w-[160px]"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Region Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pt-4 border-t border-[#ececec] dark:border-[#27272a]">
            <div>
              <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Search Region</span>
              <p className="text-xs text-gray-500 dark:text-zinc-500">Filter search results based on geographic region.</p>
            </div>
            <select
              value={settings.region}
              onChange={(e) => updateSettings({ region: e.target.value })}
              className="h-10 px-3 border border-[#ececec] dark:border-[#27272a] bg-white dark:bg-[#18181b] rounded-xl text-sm outline-none text-gray-800 dark:text-zinc-200 min-w-[160px]"
            >
              {regions.map((r) => (
                <option key={r.code} value={r.code}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Safe Search Toggle */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#ececec] dark:border-[#27272a]">
            <div>
              <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Safe Search Filter</span>
              <p className="text-xs text-gray-500 dark:text-zinc-500">Blocks explicit contents and images from showing in search queries.</p>
            </div>
            <button
              onClick={() => updateSettings({ safeSearch: !settings.safeSearch })}
              className={`h-7 w-12 rounded-full p-1 transition-colors ${
                settings.safeSearch ? 'bg-blue-600' : 'bg-gray-300 dark:bg-zinc-700'
              }`}
            >
              <div className={`h-5 w-5 rounded-full bg-white transition-transform ${
                settings.safeSearch ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </section>

        {/* 3. History and Local Storage */}
        <section className="flex flex-col gap-4 p-5 border border-[#ececec] dark:border-[#27272a] rounded-2xl bg-gray-50/50 dark:bg-[#18181b]/50">
          <h2 className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><Trash2 className="h-4 w-4" /> Data Management</h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Clear Search History</span>
              <p className="text-xs text-gray-500 dark:text-zinc-500">Delete all your {recentSearches.length} locally cached queries from this device.</p>
            </div>
            <button
              onClick={clearRecentSearches}
              disabled={recentSearches.length === 0}
              className="h-10 px-4 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Trash className="h-4 w-4" /> Clear History
            </button>
          </div>
        </section>

        {/* 4. Bookmarks Dashboard */}
        <section className="flex flex-col gap-4 p-5 border border-[#ececec] dark:border-[#27272a] rounded-2xl bg-gray-50/50 dark:bg-[#18181b]/50">
          <h2 className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><Bookmark className="h-4 w-4" /> Saved Bookmarks ({bookmarks.length})</h2>
          
          {bookmarks.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-zinc-500">You haven&apos;t saved any bookmarks yet. Click the bookmark icon on result cards to save items here.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {bookmarks.map((bookmark, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-[#18181b] border border-[#ececec] dark:border-[#27272a] rounded-xl text-xs">
                  <div className="flex-1 truncate">
                    <a href={bookmark.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate block">
                      {bookmark.title}
                    </a>
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 block truncate">{bookmark.link}</span>
                  </div>
                  <button
                    onClick={() => toggleBookmark(bookmark)}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                    title="Remove Bookmark"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. Collections Dashboard */}
        <section className="flex flex-col gap-4 p-5 border border-[#ececec] dark:border-[#27272a] rounded-2xl bg-gray-50/50 dark:bg-[#18181b]/50">
          <h2 className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><FolderHeart className="h-4 w-4" /> Collections ({collections.length})</h2>
          
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="New collection name..."
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="flex-1 h-9 px-3 text-xs bg-white dark:bg-[#18181b] border border-[#ececec] dark:border-[#27272a] rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              onClick={() => {
                if (newCollectionName.trim()) {
                  createCollection(newCollectionName);
                  setNewCollectionName('');
                }
              }}
              className="h-9 px-4 bg-accent hover:opacity-90 text-white font-semibold rounded-xl text-xs flex items-center gap-1 transition-all"
            >
              <Plus className="h-3.5 w-3.5" /> Create
            </button>
          </div>

          {collections.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-zinc-500">No collections created yet. Build a collection to organize your bookmarks.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {collections.map((collection, idx) => (
                <div key={idx} className="p-4 bg-white dark:bg-[#18181b] border border-[#ececec] dark:border-[#27272a] rounded-xl flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-800 dark:text-zinc-200">{collection.name} ({collection.items.length} items)</span>
                    <button
                      onClick={() => deleteCollection(collection.name)}
                      className="text-xs text-red-500 hover:underline flex items-center gap-0.5"
                    >
                      <Trash className="h-3 w-3" /> Delete Collection
                    </button>
                  </div>
                  
                  {collection.items.length === 0 ? (
                    <p className="text-[11px] text-gray-400 dark:text-zinc-500 italic">This collection is empty. Add bookmarks to it below.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {collection.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center justify-between gap-4 p-2 bg-gray-50 dark:bg-zinc-800/40 rounded-lg text-[11px]">
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate flex-1">
                            {item.title}
                          </a>
                          <button
                            onClick={() => removeBookmarkFromCollection(collection.name, item.link)}
                            className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                            title="Remove from Collection"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add existing bookmark to this collection */}
                  {bookmarks.length > 0 && bookmarks.some(b => !collection.items.some(item => item.link === b.link)) && (
                    <div className="flex items-center gap-2 mt-1">
                      <select
                        onChange={(e) => {
                          const selectedLink = e.target.value;
                          const found = bookmarks.find(b => b.link === selectedLink);
                          if (found) {
                            addBookmarkToCollection(collection.name, found);
                          }
                          e.target.value = '';
                        }}
                        className="text-[10px] w-full max-w-xs h-7 px-2 bg-gray-50 dark:bg-zinc-800 border border-[#ececec] dark:border-[#27272a] rounded-lg text-gray-700 dark:text-zinc-300"
                      >
                        <option value="">+ Add existing bookmark...</option>
                        {bookmarks
                          .filter(b => !collection.items.some(item => item.link === b.link))
                          .map((b, bIdx) => (
                            <option key={bIdx} value={b.link}>{b.title}</option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#ffffff] dark:bg-[#09090b]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
