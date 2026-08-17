import { BookOpen, Code2, Sparkles, TrendingUp, Brain, Landmark, Search, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import { Book } from '../types';

interface BookCoverProps {
  book: Partial<Book> & { title: string; authorName?: string; categoryName?: string; imageUrl?: string; categoryId?: number };
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSpine?: boolean;
}

const CATEGORY_STYLES: Record<string, { bg: string; accent: string; icon: React.ReactNode }> = {
  'Computer Science & Tech': {
    bg: 'from-slate-900 via-indigo-950 to-stone-900 text-indigo-100',
    accent: 'bg-indigo-500/30 text-indigo-300 border-indigo-500/40',
    icon: <Code2 className="w-5 h-5 text-indigo-400" />,
  },
  'Fiction & Literature': {
    bg: 'from-amber-950 via-stone-900 to-stone-950 text-amber-100',
    accent: 'bg-amber-500/30 text-amber-300 border-amber-500/40',
    icon: <BookOpen className="w-5 h-5 text-amber-400" />,
  },
  'Sci-Fi & Fantasy': {
    bg: 'from-cyan-950 via-slate-900 to-stone-950 text-cyan-100',
    accent: 'bg-cyan-500/30 text-cyan-300 border-cyan-500/40',
    icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
  },
  'Business & Finance': {
    bg: 'from-emerald-950 via-stone-900 to-stone-950 text-emerald-100',
    accent: 'bg-emerald-500/30 text-emerald-300 border-emerald-500/40',
    icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
  },
  'Self-Improvement & Psychology': {
    bg: 'from-violet-950 via-stone-900 to-stone-950 text-violet-100',
    accent: 'bg-violet-500/30 text-violet-300 border-violet-500/40',
    icon: <Brain className="w-5 h-5 text-violet-400" />,
  },
  'History & Biography': {
    bg: 'from-amber-950 via-yellow-950 to-stone-950 text-amber-100',
    accent: 'bg-amber-500/30 text-amber-300 border-amber-500/40',
    icon: <Landmark className="w-5 h-5 text-amber-400" />,
  },
  'Mystery & Thriller': {
    bg: 'from-stone-950 via-red-950 to-stone-900 text-rose-100',
    accent: 'bg-rose-500/30 text-rose-300 border-rose-500/40',
    icon: <Search className="w-5 h-5 text-rose-400" />,
  },
};

export const BookCover: React.FC<BookCoverProps> = ({
  book,
  className = 'w-full h-full object-cover',
  size = 'md',
  showSpine = true,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const categoryName = book.categoryName || 'Fiction & Literature';
  const style = CATEGORY_STYLES[categoryName] || CATEGORY_STYLES['Fiction & Literature'];

  if (book.imageUrl && !imageFailed) {
    return (
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-stone-100">
        {!isLoaded && (
          <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-stone-400" />
          </div>
        )}
        <img
          src={book.imageUrl}
          alt={book.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setImageFailed(true)}
          className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        />
        {/* Book shadow & sheen */}
        {showSpine && (
          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none" />
        )}
      </div>
    );
  }

  // Beautiful fallback custom book cover design
  return (
    <div
      className={`relative w-full h-full bg-gradient-to-br ${style.bg} p-4 flex flex-col justify-between select-none overflow-hidden shadow-inner ${
        size === 'sm' ? 'p-2' : size === 'lg' ? 'p-6' : 'p-4'
      }`}
    >
      {/* Left spine gradient effect */}
      {showSpine && (
        <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />
      )}

      {/* Subtle background geometry */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full border-4 border-white/5 pointer-events-none" />
      <div className="absolute -left-6 top-10 w-24 h-24 rounded-full border-2 border-white/5 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 space-y-1">
        <div className="flex items-center justify-between">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${style.accent}`}>
            {book.categoryName?.split('&')[0] || 'CLASSIC'}
          </span>
          <div className="opacity-75">{style.icon}</div>
        </div>
      </div>

      {/* Center Title & Author */}
      <div className="relative z-10 my-auto py-2 space-y-1.5">
        <h4
          className={`font-black text-white leading-tight font-serif drop-shadow-md ${
            size === 'sm' ? 'text-xs line-clamp-2' : size === 'lg' || size === 'hero' ? 'text-lg line-clamp-3' : 'text-sm line-clamp-3'
          }`}
        >
          {book.title}
        </h4>
        <div className="w-8 h-0.5 bg-amber-400/70 rounded-full" />
        <p className="text-[11px] text-stone-300 font-medium tracking-wide drop-shadow-xs line-clamp-1">
          {book.authorName || 'Author'}
        </p>
      </div>

      {/* Bottom Publisher / Quality Badge */}
      <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-stone-400 font-mono">
        <span>DATA ALCOTT PRESS</span>
        {book.publicationYear && <span>{book.publicationYear}</span>}
      </div>
    </div>
  );
};
