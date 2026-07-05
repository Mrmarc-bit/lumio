import React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-500 dark:text-zinc-400 font-sans">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {item.href && !isLast ? (
              <Link 
                href={item.href} 
                className="hover:text-gray-950 dark:hover:text-white transition-colors truncate max-w-[120px] md:max-w-none"
              >
                {item.label}
              </Link>
            ) : (
              <span className={`truncate max-w-[120px] md:max-w-none ${isLast ? 'text-gray-950 dark:text-[#fafafa] font-bold' : ''}`}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="h-3 w-3 text-gray-300 dark:text-zinc-700 flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
