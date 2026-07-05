import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SearchSettings, WebResult, Collection } from '@/types';

interface SearchState {
  settings: SearchSettings;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  recentSearches: string[];
  bookmarks: WebResult[];
  collections: Collection[];
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  updateSettings: (settings: Partial<SearchSettings>) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  toggleBookmark: (result: WebResult) => void;
  isBookmarked: (link: string) => boolean;

  // Collections Actions
  createCollection: (name: string) => void;
  deleteCollection: (name: string) => void;
  addBookmarkToCollection: (collectionName: string, bookmark: WebResult) => void;
  removeBookmarkFromCollection: (collectionName: string, bookmarkLink: string) => void;
}

const DEFAULT_SETTINGS: SearchSettings = {
  theme: 'dark',
  language: 'lang_id',
  region: 'ID',
  safeSearch: true,
  resultsPerPage: 10,
  compactMode: false,
  animations: true,
  accentColor: 'blue'
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      sidebarOpen: true,
      commandPaletteOpen: false,
      recentSearches: [],
      bookmarks: [],
      collections: [],

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      updateSettings: (newSettings) => set((state) => {
        const mergedSettings = { ...state.settings, ...newSettings };
        
        // Handle class and custom styles updates dynamically
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;
          
          // Apply Theme Class
          if (mergedSettings.theme === 'dark') {
            root.classList.add('dark');
          } else if (mergedSettings.theme === 'light') {
            root.classList.remove('dark');
          } else {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            if (systemTheme === 'dark') {
              root.classList.add('dark');
            } else {
              root.classList.remove('dark');
            }
          }

          // Apply Accent Color Variable
          const colors: Record<string, { dark: string; light: string; rgb: string }> = {
            blue: { dark: '#3b82f6', light: '#2563eb', rgb: '59, 130, 246' },
            purple: { dark: '#a855f7', light: '#7c3aed', rgb: '168, 85, 247' },
            emerald: { dark: '#10b981', light: '#059669', rgb: '16, 185, 129' },
            amber: { dark: '#f59e0b', light: '#d97706', rgb: '245, 158, 11' },
            rose: { dark: '#f43f5e', light: '#e11d48', rgb: '244, 63, 94' }
          };
          const selectedAccent = mergedSettings.accentColor || 'blue';
          const activeTheme = mergedSettings.theme === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : mergedSettings.theme;
          const accentHex = activeTheme === 'dark' ? colors[selectedAccent].dark : colors[selectedAccent].light;
          const accentRGB = colors[selectedAccent].rgb;
          root.style.setProperty('--color-accent', accentHex);
          root.style.setProperty('--color-accent-rgb', accentRGB);
        }

        return { settings: mergedSettings };
      }),

      addRecentSearch: (query) => set((state) => {
        if (!query.trim()) return state;
        const cleaned = query.trim();
        const filtered = state.recentSearches.filter(q => q.toLowerCase() !== cleaned.toLowerCase());
        return { recentSearches: [cleaned, ...filtered].slice(0, 10) };
      }),

      clearRecentSearches: () => set({ recentSearches: [] }),

      toggleBookmark: (result) => set((state) => {
        const exists = state.bookmarks.some(b => b.link === result.link);
        if (exists) {
          // Also remove from all collections
          const updatedCollections = state.collections.map(c => ({
            ...c,
            items: c.items.filter(item => item.link !== result.link)
          }));
          return { 
            bookmarks: state.bookmarks.filter(b => b.link !== result.link),
            collections: updatedCollections
          };
        } else {
          return { bookmarks: [...state.bookmarks, result] };
        }
      }),

      isBookmarked: (link) => {
        return get().bookmarks.some(b => b.link === link);
      },

      // Collections Management
      createCollection: (name) => set((state) => {
        if (!name.trim() || state.collections.some(c => c.name.toLowerCase() === name.trim().toLowerCase())) {
          return state;
        }
        return {
          collections: [...state.collections, { name: name.trim(), items: [] }]
        };
      }),

      deleteCollection: (name) => set((state) => ({
        collections: state.collections.filter(c => c.name !== name)
      })),

      addBookmarkToCollection: (collectionName, bookmark) => set((state) => {
        const updatedCollections = state.collections.map(c => {
          if (c.name === collectionName) {
            const alreadyExists = c.items.some(item => item.link === bookmark.link);
            if (!alreadyExists) {
              return { ...c, items: [...c.items, bookmark] };
            }
          }
          return c;
        });

        // Also ensure it is bookmarked globally
        const bookmarks = get().bookmarks;
        const isGlobal = bookmarks.some(b => b.link === bookmark.link);
        const updatedBookmarks = isGlobal ? bookmarks : [...bookmarks, bookmark];

        return { 
          collections: updatedCollections,
          bookmarks: updatedBookmarks
        };
      }),

      removeBookmarkFromCollection: (collectionName, bookmarkLink) => set((state) => ({
        collections: state.collections.map(c => {
          if (c.name === collectionName) {
            return { ...c, items: c.items.filter(item => item.link !== bookmarkLink) };
          }
          return c;
        })
      }))
    }),
    {
      name: 'lumio-search-store'
    }
  )
);
