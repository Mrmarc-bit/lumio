'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#fafafa] dark:bg-[#09090b] border-t border-[#ececec] dark:border-[#27272a] py-6 px-4 md:px-8 text-center text-xs text-gray-500 dark:text-zinc-500 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span>&copy; {currentYear} Lumio Search. by Maruf Muchlisin.</span>
        </div>
        <div className="flex gap-6 font-sans">
          <Link href="/about" className="hover:text-accent hover:underline transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-accent hover:underline transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
