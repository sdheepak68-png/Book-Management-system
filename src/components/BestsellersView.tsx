import {
  Award,
  BookOpen,
  Check,
  ChevronRight,
  Filter,
  Flame,
  Heart,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/currency';
import { BookCard } from './BookCard';
import { BookCover } from './BookCover';

export const BestsellersView: React.FC = () => {
  const { books, categories, setSelectedBook, addToCart, isInWishlist, toggleWishlist, setActiveTab, setSelectedCategoryId } =
    useStore();

  const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>('ALL');
  const [sortOption, setSortOption] = useState<'rank' | 'rating' | 'reviews' | 'price-asc' | 'price-desc'>('rank');

  // Filter bestseller books
  const bestsellerBooks = useMemo(() => {
    let list = books.filter((b) => b.isBestseller || b.rating >= 4.8);
    if (selectedCategory !== 'ALL') {
      list = list.filter((b) => b.categoryId === selectedCategory);
    }

    return [...list].sort((a, b) => {
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      // Default: prioritize rating * reviewCount popularity
      return b.rating * b.reviewCount - a.rating * a.reviewCount;
    });
  }, [books, selectedCategory, sortOption]);

  const topBook = bestsellerBooks[0] || books[0];

  return (
    <div id="bestsellers-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Hero Spotlight Banner */}
      <div className="bg-stone-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-stone-800 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-amber-600/5 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full">
              <Flame className="w-4 h-4 text-amber-400 fill-current" />
              <span>Official Bestsellers & Community Favorites</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Top Ranked <span className="text-amber-400 font-serif">Bestsellers</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-xl leading-relaxed">
              Explore the most influential, widely read, and critically acclaimed titles across software architecture, timeless wisdom, science fiction, and behavioral psychology.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
              <div className="bg-stone-900/90 border border-stone-800 p-3 rounded-2xl">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Titles Ranked</span>
                <p className="text-lg font-black text-amber-400">{bestsellerBooks.length} Books</p>
              </div>
              <div className="bg-stone-900/90 border border-stone-800 p-3 rounded-2xl">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Avg Rating</span>
                <p className="text-lg font-black text-white flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" /> 4.85
                </p>
              </div>
              <div className="bg-stone-900/90 border border-stone-800 p-3 rounded-2xl">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Stock Status</span>
                <p className="text-lg font-black text-emerald-400">Ready to Ship</p>
              </div>
            </div>
          </div>

          {/* Featured #1 Spotlight Card */}
          {topBook && (
            <div className="lg:col-span-5 bg-gradient-to-b from-stone-900 to-stone-900/90 p-5 sm:p-6 rounded-2xl border border-stone-700/80 shadow-xl flex flex-col sm:flex-row gap-5 items-center">
              <div className="relative w-32 sm:w-36 aspect-3/4 rounded-xl overflow-hidden shadow-2xl shrink-0 border border-stone-700">
                <BookCover book={topBook} size="md" />
                <span className="absolute top-2 left-2 bg-amber-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                  #1 BESTSELLER
                </span>
              </div>

              <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Spotlight Pick</span>
                <h3
                  onClick={() => setSelectedBook(topBook)}
                  className="text-base font-bold text-white line-clamp-2 hover:text-amber-300 cursor-pointer transition-colors"
                >
                  {topBook.title}
                </h3>
                <p className="text-xs text-stone-400">by {topBook.authorName}</p>

                <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold">{topBook.rating}</span>
                  <span className="text-stone-500">({topBook.reviewCount} reviews)</span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-lg font-black text-white">{formatINR(topBook.price)}</span>
                  <button
                    onClick={() => setSelectedBook(topBook)}
                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-xs flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter & Sort Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-stone-900 text-amber-400 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Genres ({books.filter((b) => b.isBestseller || b.rating >= 4.8).length})
          </button>
          {categories.map((cat) => {
            const count = books.filter(
              (b) => (b.isBestseller || b.rating >= 4.8) && b.categoryId === cat.id
            ).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-amber-400 shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.name.split('&')[0]} ({count})
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Sort:
          </span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500"
          >
            <option value="rank">Popularity Rank</option>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Bestseller Book Grid with Ranking Numbers */}
      {bestsellerBooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 space-y-3">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No bestsellers in this category</h3>
          <p className="text-xs text-stone-500">Try selecting "All Genres" to view all top sellers.</p>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className="bg-stone-900 text-amber-400 text-xs font-bold px-4 py-2 rounded-xl"
          >
            Show All Bestsellers
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestsellerBooks.map((book, index) => (
            <BookCard key={book.id} book={book} rankBadge={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
