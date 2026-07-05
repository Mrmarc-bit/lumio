'use client';

import React from 'react';
import { ExternalLink, Calendar, MapPin, Globe, Compass, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface InfoboxUrl {
  title: string;
  url: string;
  official?: boolean;
}

interface InfoboxAttribute {
  label: string;
  value: string;
  entity?: string;
}

interface InfoboxData {
  infobox: string;
  id?: string;
  content: string;
  img_src?: string | null;
  urls?: InfoboxUrl[];
  attributes?: InfoboxAttribute[];
  engine?: string;
}

interface InfoboxCardProps {
  infobox: InfoboxData;
}

const WIKIDATA_LABELS: Record<string, string> = {
  P571: 'Inception',
  P17: 'Country',
  P281: 'Postal Code',
  P625: 'Coordinates',
  P856: 'Official Website',
  P31: 'Instance of',
  P18: 'Image',
  P131: 'Located in',
  P106: 'Occupation',
  P569: 'Date of Birth',
  P570: 'Date of Death',
  P19: 'Place of Birth',
  P20: 'Place of Death',
};

const getReadableLabel = (label: string) => {
  return WIKIDATA_LABELS[label] || label;
};

export default function InfoboxCard({ infobox }: InfoboxCardProps) {
  // Helpers to pick specific icons for specific link types
  const getUrlIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('official') || t.includes('website') || t.includes('situs') || t.includes('p856')) return <Globe className="h-4 w-4" />;
    if (t.includes('wikipedia')) return <BookOpen className="h-4 w-4" />;
    if (t.includes('wikidata')) return <Compass className="h-4 w-4" />;
    if (t.includes('map') || t.includes('openstreetmap')) return <MapPin className="h-4 w-4" />;
    return <ExternalLink className="h-4 w-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full premium-card rounded-2xl p-5 md:p-6 flex flex-col gap-5 border border-gray-200/50 dark:border-zinc-800/60 shadow-lg shadow-black/5 dark:shadow-black/40"
    >
      {/* Header Info */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-[#fafafa] tracking-tight leading-tight font-sans">
          {infobox.infobox}
        </h2>
        {infobox.engine && (
          <span className="text-[10px] font-bold tracking-wider text-blue-500 dark:text-blue-400/80 uppercase">
            Knowledge Panel • source: {infobox.engine}
          </span>
        )}
      </div>

      {/* Image if available */}
      {infobox.img_src && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-inner group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={infobox.img_src}
            alt={infobox.infobox}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      )}

      {/* Content description */}
      {infobox.content && (
        <div className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed font-sans font-medium">
          <p>{infobox.content}</p>
        </div>
      )}

      {/* Quick Action Badges */}
      {infobox.urls && infobox.urls.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {infobox.urls.slice(0, 3).map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-btn text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-gray-700 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 shadow-sm"
            >
              {getUrlIcon(item.title)}
              <span>{getReadableLabel(item.title)}</span>
            </a>
          ))}
        </div>
      )}

      {/* Divider */}
      {infobox.attributes && infobox.attributes.length > 0 && (
        <div className="h-px bg-gray-200/60 dark:bg-zinc-800/60 w-full" />
      )}

      {/* Attributes Grid */}
      {infobox.attributes && infobox.attributes.length > 0 && (
        <div className="flex flex-col gap-3 text-xs md:text-sm">
          {infobox.attributes.map((attr, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-gray-100/50 dark:border-zinc-900/30 pb-2 last:border-b-0 last:pb-0">
              <span className="font-bold text-gray-400 dark:text-zinc-500 sm:w-1/3 flex-shrink-0">
                {getReadableLabel(attr.label)}
              </span>
              <span className="text-gray-700 dark:text-zinc-300 font-semibold sm:w-2/3 text-left sm:text-right">
                {attr.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
