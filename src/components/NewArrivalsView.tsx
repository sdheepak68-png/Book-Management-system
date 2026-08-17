import {
  BookOpen,
  Calendar,
  Clock,
  Filter,
  Flame,
  Layers,
  Rocket,
  Search,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/currency';
import { BookCard } from './BookCard';
import { BookCover } from './BookCover';

export const NewArrivalsView: React.FC = () => {
  const { books, categories, setSelectedBook } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>('ALL');
  const [yearFilter, setYearFilter] = useState<'ALL' | '2024' | '2023' | '2021-2022'>('ALL');
  const [sortOption, setSortOption] = useState<'newest' | 'rating' | 'price-asc' | 'price-desc'>('newest');

  // Filter new arrival books
  const newArrivalBooks = useMemo(() => {
    let list = books.filter((b) => b.isNewArrival || b.publicationYear >= 2020);

    if (selectedCategory !== 'ALL') {
      list = list.filter((b) => b.categoryId === selectedCategory);
    }

    if (yearFilter === '2024') {
      list = list.filter((b) => b.publicationYear >= 2024);
    } else if (yearFilter === '2023') {
      list = list.filter((b) => b.publicationYear === 2023);
    } else if (yearFilter === '2021-2022') {
      list = list.filter((b) => b.publicationYear >= 2021 && b.publicationYear <= 2022);
    }

    return [...list].sort((a, b) => {
      if (sortOption === 'newest') return b.publicationYear - a.publicationYear;
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [books, selectedCategory, yearFilter, sortOption]);

  const latestBook = newArrivalBooks[0] || books[0];

  return (
    <div id="new-arrivals-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-stone-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/15 to-transparent pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Fresh Off The Press · Modern Releases</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              New Arrivals & <span className="text-emerald-400 font-serif">Recent Releases</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-xl leading-relaxed">
              Stay at the forefront of technology, modern storytelling, and behavioral science with our latest additions from world-renowned authors and publishers.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="bg-stone-800/90 text-stone-300 border border-stone-700 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Updated Weekly
              </span>
              <span className="bg-stone-800/90 text-stone-300 border border-stone-700 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-amber-400" />
                First Editions Available
              </span>
              <span className="bg-stone-800/90 text-stone-300 border border-stone-700 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-rose-400" />
                Special Launch Discounts
              </span>
            </div>
          </div>

          {/* Spotlight Release */}
          {latestBook && (
            <div className="lg:col-span-5 bg-stone-900/90 p-5 sm:p-6 rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row gap-5 items-center">
              <div className="relative w-32 sm:w-36 aspect-3/4 rounded-xl overflow-hidden shadow-2xl shrink-0 border border-stone-700">
                <BookCover book={latestBook} size="md" />
                <span className="absolute top-2 left-2 bg-emerald-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                  NEW RELEASE
                </span>
              </div>

              <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  Published {latestBook.publicationYear}
                </span>
                <h3
                  onClick={() => setSelectedBook(latestBook)}
                  className="text-base font-bold text-white line-clamp-2 hover:text-emerald-300 cursor-pointer transition-colors"
                >
                  {latestBook.title}
                </h3>
                <p className="text-xs text-stone-400">by {latestBook.authorName}</p>

                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-stone-300">
                  <span className="bg-stone-800 px-2 py-0.5 rounded text-[11px] font-mono">
                    {latestBook.pageCount} pages
                  </span>
                  <span className="bg-stone-800 px-2 py-0.5 rounded text-[11px] font-mono">
                    {latestBook.format}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-lg font-black text-white">{formatINR(latestBook.price)}</span>
                  <button
                    onClick={() => setSelectedBook(latestBook)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-xs"
                  >
                    Explore Edition &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-stone-900 text-emerald-300 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Genres ({books.filter((b) => b.isNewArrival || b.publicationYear >= 2020).length})
          </button>
          {categories.map((cat) => {
            const count = books.filter(
              (b) => (b.isNewArrival || b.publicationYear >= 2020) && b.categoryId === cat.id
            ).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-emerald-300 shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.name.split('&')[0]} ({count})
              </button>
            );
          })}
        </div>

        {/* Year Filter & Sort */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold text-stone-600">
            <button
              onClick={() => setYearFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                yearFilter === 'ALL' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'hover:text-stone-900'
              }`}
            >
              All Years
            </button>
            <button
              onClick={() => setYearFilter('2024')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                yearFilter === '2024' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'hover:text-stone-900'
              }`}
            >
              2024+
            </button>
            <button
              onClick={() => setYearFilter('2023')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                yearFilter === '2023' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'hover:text-stone-900'
              }`}
            >
              2023
            </button>
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* New Arrivals Grid */}
      {newArrivalBooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 space-y-3">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No recent releases found</h3>
          <p className="text-xs text-stone-500">Try adjusting your year or category filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setYearFilter('ALL');
            }}
            className="bg-stone-900 text-emerald-400 text-xs font-bold px-4 py-2 rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivalBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};
