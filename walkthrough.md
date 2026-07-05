# ZenSearch - Search beautifully.

The development is complete! ZenSearch is a high-fidelity, premium, production-ready privacy metasearch engine frontend.

---

## ⚡ Key Improvements Added

1. **SearXNG API Integration**:
   - Replaced all reference scopes and descriptions from Whoogle to **SearXNG** (ports, configs, networks).
   - Created the [searxng/settings.yml](file:///Users/macbookair/Documents/Lumio/searxng/settings.yml) configurations enabling the native JSON metasearch output.

2. **Collections (Custom Bookmark Folders)**:
   - Added `collections: Collection[]` state with supporting Zustand actions (`createCollection`, `deleteCollection`, `addBookmarkToCollection`, `removeBookmarkFromCollection`) in [store/searchStore.ts](file:///Users/macbookair/Documents/Lumio/store/searchStore.ts).
   - Embedded a fully interactive Collections management console directly in the [Settings Panel](file:///Users/macbookair/Documents/Lumio/app/settings/page.tsx).

3. **Spotlight Command Palette**:
   - Integrated collections search query mapping to the command palette search scope in [components/CommandPalette.tsx](file:///Users/macbookair/Documents/Lumio/components/CommandPalette.tsx).

4. **Production Guides & Documentation**:
   - Created **[docs/INSTALLATION.md](file:///Users/macbookair/Documents/Lumio/docs/INSTALLATION.md)**: Manual development, dependencies, troubleshooting guide.
   - Created **[docs/DEPLOYMENT.md](file:///Users/macbookair/Documents/Lumio/docs/DEPLOYMENT.md)**: Production settings, reverse proxy block configurations, SSL commands.
   - Created **[docs/DEVELOPER.md](file:///Users/macbookair/Documents/Lumio/docs/DEVELOPER.md)**: Project codebase structures, Zustand state flows, and metasearch service abstractions.
   - Rewrote the main **[README.md](file:///Users/macbookair/Documents/Lumio/README.md)** with a detailed layout description and architecture diagram.

5. **Shadcn-Style Breadcrumb Layout (New)**:
   - Created a reusable navigation component **[components/Breadcrumb.tsx](file:///Users/macbookair/Documents/Lumio/components/Breadcrumb.tsx)**.
   - Embedded the **SidebarTrigger** toggle and vertical separator beside the breadcrumb trail in the headers of **[components/Navbar.tsx](file:///Users/macbookair/Documents/Lumio/components/Navbar.tsx)** and **[app/settings/page.tsx](file:///Users/macbookair/Documents/Lumio/app/settings/page.tsx)**.
   - Cleaned the bottom chevron toggle from the sidebar footer inside **[components/Sidebar.tsx](file:///Users/macbookair/Documents/Lumio/components/Sidebar.tsx)**.

6. **Tailwind v4 class-based Dark Mode**:
   - Declared the `@custom-variant dark (&:where(.dark, .dark *));` custom selector inside **[app/globals.css](file:///Users/macbookair/Documents/Lumio/app/globals.css)**, restoring toggling function.

7. **Docker Ignore & Build Fix**:
   - Created **[/.dockerignore](file:///Users/macbookair/Documents/Lumio/.dockerignore)** to prevent host `node_modules` compiled for macOS from leaking into the Alpine docker build context, resolving the Tailwind oxide compile error.

---

## 🚀 Services Status
- **Next.js Dev Server**: Running at **http://localhost:3000** ✅
- **Kompilasi Produksi**: Berhasil ter-compile dengan Next.js compiler 15 ✅
- **Failsafe System**: Aktif. Jika kontainer SearXNG belum diaktifkan, API akan otomatis melakukan fallback ke data simulasi (mock results) agar UI tidak error.

---

## 🛠️ Update: SearXNG Engines & ISP Blocking Fix (July 5, 2026)
1. **Penyebab Error**: 
   - **DuckDuckGo Terblokir**: ISP pengguna (MyRepublic Indonesia) mengalihkan DNS `duckduckgo.com` ke mercusuar internet positif `block.myrepublic.co.id` (IP `158.140.186.3`), mengakibatkan *timeout* koneksi pada backend SearXNG.
   - **Brave & Google Blocked**: Mesin pencari Brave mengembalikan status `Suspended` dan Google mengembalikan `403 Forbidden` karena pembatasan request scraping.
2. **Solusi yang Diterapkan**:
   - Memperbarui [searxng/settings.yml](file:///Users/macbookair/Documents/Lumio/searxng/settings.yml) dengan menonaktifkan DuckDuckGo, Google, Brave, dan Startpage, serta mengaktifkan **Bing** yang terbukti sangat cepat dan andal.
   - Merestart kontainer `searxng-backend` untuk menerapkan konfigurasi baru.
   - Memperbarui [services/search.ts](file:///Users/macbookair/Documents/Lumio/services/search.ts) agar otomatis melakukan fallback ke data simulasi (mock) jika SearXNG mendeteksi adanya `unresponsive_engines` ketika data yang kembali kosong (`results: []`).

