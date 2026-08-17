import { BookOpen, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/currency';
import { BookCover } from './BookCover';

export const WishlistView: React.FC = () => {
  const { wishlist, moveToCartFromWishlist, toggleWishlist, setSelectedBook, setActiveTab, showToast } = useStore();

  const handleMoveAllToCart = () => {
    let movedCount = 0;
    wishlist.forEach((item) => {
      if (item.book.stock > 0) {
        moveToCartFromWishlist(item.book);
        movedCount++;
      }
    });
    if (movedCount > 0) {
      showToast(`Moved ${movedCount} available books to your shopping cart!`, 'success');
    }
  };

  return (
    <div id="wishlist-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-current" />
            My Saved Wishlist
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {wishlist.length} {wishlist.length === 1 ? 'book' : 'books'} saved for future reading.
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={handleMoveAllToCart}
            className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Move All in Stock to Cart</span>
          </button>
        )}
      </div>

      {/* Wishlist Items Grid */}
      {wishlist.length === 0 ? (
        <div className="text-center py-16 bg-stone-50 rounded-3xl border border-stone-200 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-rose-300 mx-auto shadow-xs">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-800">Your wishlist is empty</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Click the heart icon on any book cover to save it to your personal wishlist for later.
          </p>
          <button
            onClick={() => setActiveTab('catalog')}
            className="bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all"
          >
            Explore Book Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlist.map((item) => {
            const isOutOfStock = item.book.stock <= 0;
            return (
              <div
                key={item.id}
                className="group flex flex-col bg-white rounded-2xl border border-stone-200 hover:border-amber-400 p-4 shadow-xs transition-all"
              >
                <div className="flex gap-3">
                  <div
                    onClick={() => setSelectedBook(item.book)}
                    className="w-20 h-28 rounded-xl overflow-hidden shadow-xs cursor-pointer group-hover:scale-105 transition-transform shrink-0"
                  >
                    <BookCover book={item.book} size="sm" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-700">{item.book.categoryName}</span>
                      <h4
                        onClick={() => setSelectedBook(item.book)}
                        className="text-xs font-bold text-stone-900 line-clamp-2 hover:text-amber-800 cursor-pointer mt-0.5"
                      >
                        {item.book.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1">by {item.book.authorName}</p>
                    </div>

                    <div className="mt-2">
                      <span className="text-sm font-extrabold text-stone-900">{formatINR(item.book.price)}</span>
                      <span className={`block text-[10px] font-semibold ${isOutOfStock ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {isOutOfStock ? 'Out of Stock' : `${item.book.stock} in stock`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => toggleWishlist(item.book)}
                    className="text-stone-400 hover:text-rose-600 p-2 rounded-lg hover:bg-stone-50 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => moveToCartFromWishlist(item.book)}
                    disabled={isOutOfStock}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-100 disabled:text-stone-400 text-amber-400 font-bold py-2 rounded-xl text-xs shadow-xs transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
