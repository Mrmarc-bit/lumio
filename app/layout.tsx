import type { Metadata } from 'next';
import './globals.css';
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: 'Lumio Search',
    template: '%s - Lumio Search'
  },
  description: 'A premium, modern, and privacy-respecting search engine frontend for SearXNG.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Lumio Search',
    description: 'Privacy-focused Google search proxy interface.',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumio Search',
    description: 'Privacy-focused Google search proxy interface.'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flicker script to apply theme preference instantly */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const store = JSON.parse(localStorage.getItem('lumio-search-store'));
                const theme = store?.state?.settings?.theme || 'dark';
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `
          }}
        />
      </head>
      <body className="bg-[#fcfcfd] dark:bg-[#070708] text-[#111111] dark:text-[#fafafa] min-h-screen flex flex-col font-sans transition-colors duration-300 antialiased">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
