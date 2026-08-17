import { BookOpen, Check, Heart, Plus, ShoppingBag, Star } from 'lucide-react';
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Book } from '../types';
import { formatINR } from '../utils/currency';
import { BookCover } from './BookCover';

interface BookCardProps {
  book: Book;
  rankBadge?: number;
}

export const BookCard: React.FC<BookCardProps> = ({ book, rankBadge }) => {
  const { setSelectedBook, addToCart, toggleWishlist, isInWishlist, setSelectedAuthorId, setActiveTab } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const inWishlist = isInWishlist(book.id);
  const isOutOfStock = book.stock <= 0;
  const isLowStock = book.stock > 0 && book.stock <= 5;
  const discountPercent =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(book, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAuthorId(book.authorId);
    setActiveTab('catalog');
  };

  return (
    <div
      id={`book-card-${book.id}`}
      onClick={() => setSelectedBook(book)}
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200 hover:border-amber-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-3/4 bg-stone-100 overflow-hidden flex items-center justify-center p-3">
        <div className="w-full h-full rounded-lg overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-500">
          <BookCover book={book} size="md" />
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {rankBadge && (
            <span className="bg-stone-950 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md shadow-md border border-amber-400/40">
              #{rankBadge} BESTSELLER
            </span>
          )}
          {book.isBestseller && !rankBadge && (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
              Bestseller
            </span>
          )}
          {book.isNewArrival && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
              New
            </span>
          )}
          {discountPercent && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Toggle Button */}
        <button
          id={`btn-wishlist-${book.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(book);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-sm z-10 ${
            inWishlist
              ? 'bg-rose-500 text-white shadow-rose-200'
              : 'bg-white/80 text-stone-600 hover:bg-white hover:text-rose-500'
          }`}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Format Pill */}
        <div className="absolute bottom-2.5 left-2.5 bg-stone-900/80 backdrop-blur-sm text-stone-200 text-[10px] font-medium px-2 py-0.5 rounded">
          {book.format}
        </div>

        {/* Stock Badge */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-stone-900 text-rose-300 border border-rose-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-2.5 right-2.5 bg-amber-500/90 text-stone-950 text-[10px] font-bold px-1.5 py-0.5 rounded">
            Only {book.stock} left!
          </div>
        ) : null}
      </div>

      {/* Book Information */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category tag */}
        <span className="text-[11px] font-semibold text-amber-700 tracking-wide uppercase">
          {book.categoryName || 'General'}
        </span>

        {/* Title */}
        <h3 className="text-sm font-bold text-stone-900 line-clamp-2 mt-1 group-hover:text-amber-800 transition-colors leading-snug">
          {book.title}
        </h3>

        {/* Author */}
        <button
          onClick={handleAuthorClick}
          className="text-xs text-stone-500 hover:text-stone-800 text-left line-clamp-1 mt-1 transition-colors hover:underline"
        >
          by {book.authorName || 'Unknown Author'}
        </button>

        {/* Ratings */}
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="ml-1 font-bold text-stone-900 text-xs">{book.rating.toFixed(1)}</span>
          </div>
          <span className="text-stone-400 text-[11px]">({book.reviewCount})</span>
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-stone-900">{formatINR(book.price)}</span>
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-xs text-stone-400 line-through">{formatINR(book.originalPrice)}</span>
              )}
            </div>
            <span className="text-[10px] text-stone-400 block font-mono">ISBN: {book.isbn.split('-')[1] || '978'}...</span>
          </div>

          <button
            id={`btn-add-cart-${book.id}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 text-amber-400 hover:bg-stone-800 active:scale-95 shadow-xs'
            }`}
            title={isOutOfStock ? 'Currently out of stock' : 'Add to cart'}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
