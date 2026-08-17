import {
  BookMarked,
  BookOpen,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Globe,
  Heart,
  Layers,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  ThumbsUp,
  Truck,
  User,
  X,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Book, BookFormat, ReadingStatus } from '../types';
import { formatINR } from '../utils/currency';
import { BookCover } from './BookCover';

export const BookDetailModal: React.FC = () => {
  const {
    selectedBook,
    setSelectedBook,
    addToCart,
    toggleWishlist,
    isInWishlist,
    books,
    authors,
    reviews,
    addReview,
    voteHelpfulReview,
    readingList,
    addToReadingList,
    setIsCartOpen,
    setIsCheckoutOpen,
    setSelectedAuthorId,
    setActiveTab,
    showToast,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>(selectedBook?.format || 'Paperback');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveDetailTab] = useState<'overview' | 'reviews' | 'author'>('overview');

  if (!selectedBook) return null;

  const author = authors.find((a) => a.id === selectedBook.authorId);
  const inWishlist = isInWishlist(selectedBook.id);
  const bookReviews = reviews.filter((r) => r.bookId === selectedBook.id);
  const currentReadingItem = readingList.find((r) => r.bookId === selectedBook.id);
  const relatedBooks = books
    .filter((b) => b.id !== selectedBook.id && (b.categoryId === selectedBook.categoryId || b.authorId === selectedBook.authorId))
    .slice(0, 3);

  const isOutOfStock = selectedBook.stock <= 0;

  // Rating distribution calculations
  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = bookReviews.filter((r) => r.rating === stars).length;
    const percent = bookReviews.length > 0 ? (count / bookReviews.length) * 100 : 0;
    return { stars, count, percent };
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) {
      showToast('Please provide both a review headline and comment.', 'warning');
      return;
    }
    addReview({
      bookId: selectedBook.id,
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
    });
    setNewTitle('');
    setNewComment('');
    setShowReviewForm(false);
  };

  const handleBuyNow = () => {
    addToCart(selectedBook, quantity);
    setSelectedBook(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      id="book-detail-modal-backdrop"
      onClick={() => setSelectedBook(null)}
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="book-detail-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">
              {selectedBook.categoryName}
            </span>
            <span>/</span>
            <span className="font-mono">ISBN: {selectedBook.isbn}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast('Book reference link copied to clipboard!', 'info');
              }}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors"
              title="Share Book"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              id="btn-close-detail-modal"
              onClick={() => setSelectedBook(null)}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body with Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Main Hero Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Cover Column */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[280px] aspect-3/4 bg-stone-100 rounded-2xl overflow-hidden shadow-xl border border-stone-200">
                <BookCover book={selectedBook} size="lg" />
                {selectedBook.isBestseller && (
                  <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
                    #1 Bestseller
                  </span>
                )}
              </div>

              {/* Quick Reading Shelf Action */}
              <div className="w-full max-w-[280px] mt-4 bg-stone-50 border border-stone-200 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
                  <span className="flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5 text-amber-600" />
                    Reading Shelf
                  </span>
                  {currentReadingItem && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                      {currentReadingItem.status.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  {(['WANT_TO_READ', 'CURRENTLY_READING', 'COMPLETED'] as ReadingStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => addToReadingList(selectedBook, st)}
                      className={`px-1.5 py-1 rounded text-center font-medium border transition-colors ${
                        currentReadingItem?.status === st
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'
                      }`}
                    >
                      {st === 'WANT_TO_READ' ? 'Want to Read' : st === 'CURRENTLY_READING' ? 'Reading' : 'Finished'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Information Column */}
            <div className="md:col-span-7 flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                {selectedBook.title}
              </h1>

              {/* Author & Rating */}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                <button
                  onClick={() => {
                    setSelectedAuthorId(selectedBook.authorId);
                    setSelectedBook(null);
                    setActiveTab('catalog');
                  }}
                  className="text-amber-800 font-semibold hover:underline"
                >
                  By {selectedBook.authorName || 'Unknown Author'}
                </button>
                <span className="text-stone-300">|</span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-stone-900">{selectedBook.rating.toFixed(1)}</span>
                  <span className="text-stone-400">({selectedBook.reviewCount} reviews)</span>
                </div>
                <span className="text-stone-300">|</span>
                <span className="text-stone-500">{selectedBook.publicationYear}</span>
              </div>

              {/* Price & Stock Status */}
              <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-stone-900">{formatINR(selectedBook.price)}</span>
                  {selectedBook.originalPrice && selectedBook.originalPrice > selectedBook.price && (
                    <>
                      <span className="text-sm text-stone-400 line-through">
                        {formatINR(selectedBook.originalPrice)}
                      </span>
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        Save {formatINR(selectedBook.originalPrice - selectedBook.price)} (
                        {Math.round(((selectedBook.originalPrice - selectedBook.price) / selectedBook.originalPrice) * 100)}%)
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Indicator */}
                <div className="mt-2 flex items-center gap-2 text-xs">
                  {selectedBook.stock > 10 ? (
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      In Stock ({selectedBook.stock} available) · Ready to ship
                    </span>
                  ) : selectedBook.stock > 0 ? (
                    <span className="flex items-center gap-1 text-amber-700 font-bold">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Hurry, only {selectedBook.stock} units left in stock!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600 font-bold">
                      <X className="w-3.5 h-3.5" />
                      Currently Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Format Selector */}
              <div className="mt-4">
                <label className="text-xs font-bold text-stone-700 block mb-1.5">Available Formats:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Paperback', 'Hardcover', 'E-Book'] as BookFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`p-2 rounded-xl text-left border text-xs transition-all ${
                        selectedFormat === fmt
                          ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-500/30 font-bold text-stone-900'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      <div className="text-[11px] font-semibold">{fmt}</div>
                      <div className="text-stone-500 font-normal">
                        {fmt === 'E-Book' ? formatINR(Math.round(selectedBook.price * 0.75)) : formatINR(selectedBook.price)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Action Buttons */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="p-2.5 text-stone-600 hover:bg-stone-200 disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-xs font-bold text-stone-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedBook.stock, quantity + 1))}
                      disabled={quantity >= selectedBook.stock || isOutOfStock}
                      className="p-2.5 text-stone-600 hover:bg-stone-200 disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    id="btn-modal-add-to-cart"
                    onClick={() => addToCart(selectedBook, quantity)}
                    disabled={isOutOfStock}
                    className="flex-1 flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400 text-amber-400 font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-xs active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {quantity > 1 ? `${quantity} to Cart` : 'to Cart'}</span>
                  </button>

                  <button
                    id="btn-modal-toggle-wishlist"
                    onClick={() => toggleWishlist(selectedBook)}
                    className={`p-3 rounded-xl border transition-all ${
                      inWishlist
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                    title={inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {!isOutOfStock && (
                  <button
                    id="btn-modal-buy-now"
                    onClick={handleBuyNow}
                    className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-xs"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Buy Now (Instant Checkout)</span>
                  </button>
                )}
              </div>

              {/* Guarantees */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-stone-600 pt-3 border-t border-stone-100">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  Free delivery over ₹499
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Genuine Publisher Stock
                </span>
              </div>
            </div>
          </div>

          {/* Section Tabs: Overview / Specs / Reviews / Author */}
          <div className="border-t border-stone-200 pt-6">
            <div className="flex border-b border-stone-200 gap-6 text-sm font-semibold mb-6">
              <button
                onClick={() => setActiveDetailTab('overview')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-amber-600 text-stone-900'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Overview & Description
              </button>
              <button
                onClick={() => setActiveDetailTab('reviews')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-amber-600 text-stone-900'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Customer Reviews ({bookReviews.length})
              </button>
              <button
                onClick={() => setActiveDetailTab('author')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'author'
                    ? 'border-amber-600 text-stone-900'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Author Spotlight
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-2">Book Synopsis</h3>
                  <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                    {selectedBook.description}
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Publisher</span>
                    <span className="font-bold text-stone-800">{selectedBook.publisher}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Publication Year</span>
                    <span className="font-bold text-stone-800">{selectedBook.publicationYear}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Print Length</span>
                    <span className="font-bold text-stone-800">{selectedBook.pageCount} pages</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Language</span>
                    <span className="font-bold text-stone-800">{selectedBook.language}</span>
                  </div>
                </div>

                {/* Tags */}
                {selectedBook.tags && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="text-xs font-semibold text-stone-500 mr-1">Topics:</span>
                    {selectedBook.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-stone-100 text-stone-700 text-xs px-2.5 py-1 rounded-lg border border-stone-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Rating summary breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-stone-50 p-5 rounded-2xl border border-stone-200 items-center">
                  <div className="md:col-span-4 text-center md:text-left">
                    <div className="text-4xl font-black text-stone-900">{selectedBook.rating.toFixed(1)}</div>
                    <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500 my-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= Math.round(selectedBook.rating) ? 'fill-current text-amber-500' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-stone-500">Based on {selectedBook.reviewCount} verified ratings</p>
                  </div>

                  <div className="md:col-span-8 space-y-1.5">
                    {ratingCounts.map((item) => (
                      <div key={item.stars} className="flex items-center gap-2 text-xs">
                        <span className="w-12 text-stone-600 font-medium">{item.stars} stars</span>
                        <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-stone-400 text-[11px]">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Write a Review Button / Form */}
                {!showReviewForm ? (
                  <div className="flex justify-between items-center pt-2">
                    <h4 className="text-sm font-bold text-stone-900">Customer Feedback</h4>
                    <button
                      id="btn-open-review-form"
                      onClick={() => setShowReviewForm(true)}
                      className="bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs"
                    >
                      Write a Review
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-stone-900">Submit Your Book Review</h4>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="text-stone-400 hover:text-stone-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Your Rating:</label>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= newRating ? 'fill-current text-amber-500' : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-stone-800 ml-2">
                          {newRating} / 5 Stars
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Review Headline</label>
                      <input
                        type="text"
                        placeholder="e.g. Essential read for Java architects"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Review</label>
                      <textarea
                        rows={3}
                        placeholder="What did you like or dislike about this book? How did it help your engineering craft?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-xs"
                      >
                        Publish Review
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {bookReviews.length === 0 ? (
                    <div className="text-center py-8 text-stone-400 text-xs">
                      No reviews written yet. Be the first to share your thoughts on this title!
                    </div>
                  ) : (
                    bookReviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                              alt={rev.userName}
                              className="w-7 h-7 rounded-full object-cover border border-stone-200"
                            />
                            <div>
                              <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                                {rev.userName}
                                {rev.verifiedPurchase && (
                                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                    <Check className="w-2.5 h-2.5" /> Verified Purchase
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-stone-400">{rev.createdAt}</span>
                            </div>
                          </div>

                          <div className="flex items-center text-amber-500">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= rev.rating ? 'fill-current text-amber-500' : 'text-stone-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <h5 className="text-xs font-bold text-stone-900">{rev.title}</h5>
                        <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                          <span>Was this review helpful?</span>
                          <button
                            onClick={() => voteHelpfulReview(rev.id)}
                            className="flex items-center gap-1 hover:text-stone-900 font-medium px-2 py-1 rounded hover:bg-stone-50 transition-colors"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Helpful ({rev.helpfulCount})</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab: Author */}
            {activeTab === 'author' && (
              <div className="space-y-4 animate-in fade-in">
                {author ? (
                  <div className="flex flex-col sm:flex-row gap-5 p-5 bg-stone-50 rounded-2xl border border-stone-200 items-start">
                    <img
                      src={author.photoUrl}
                      alt={author.name}
                      className="w-24 h-24 rounded-2xl object-cover shadow-md border border-stone-300"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-base font-bold text-stone-900">{author.name}</h4>
                        <button
                          onClick={() => {
                            setSelectedAuthorId(author.id);
                            setSelectedBook(null);
                            setActiveTab('catalog');
                          }}
                          className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline"
                        >
                          View all books by this author &rarr;
                        </button>
                      </div>
                      <p className="text-xs text-stone-500">
                        {author.nationality} · Born {author.birthYear}
                      </p>
                      <p className="text-xs text-stone-600 leading-relaxed">{author.biography}</p>

                      {author.notableWorks && (
                        <div className="pt-2">
                          <span className="text-[11px] font-bold text-stone-700 block mb-1">Notable Works:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {author.notableWorks.map((work) => (
                              <span
                                key={work}
                                className="bg-white text-stone-700 text-[11px] font-medium px-2 py-0.5 rounded border border-stone-200"
                              >
                                {work}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500">Author profile details not available.</p>
                )}
              </div>
            )}
          </div>

          {/* Readers Also Purchased Rail */}
          {relatedBooks.length > 0 && (
            <div className="border-t border-stone-200 pt-6">
              <h3 className="text-sm font-bold text-stone-900 mb-4">Readers Also Purchased</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedBooks.map((rb) => (
                  <div
                    key={rb.id}
                    onClick={() => setSelectedBook(rb)}
                    className="flex gap-3 p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer"
                  >
                    <div className="w-12 h-16 rounded-md overflow-hidden shadow-xs shrink-0">
                      <BookCover book={rb} size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-stone-900 line-clamp-1">{rb.title}</h5>
                      <p className="text-[10px] text-stone-500 line-clamp-1">{rb.authorName}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">{formatINR(rb.price)}</span>
                        <div className="flex items-center text-amber-500 text-[10px]">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-bold ml-0.5">{rb.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
