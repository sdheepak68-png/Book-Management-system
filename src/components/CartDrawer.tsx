import {
  ArrowRight,
  BookOpen,
  Check,
  Heart,
  Minus,
  Percent,
  Plus,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/currency';
import { BookCover } from './BookCover';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTax,
    cartShipping,
    cartTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    toggleWishlist,
    setIsCheckoutOpen,
    setSelectedBook,
    setActiveTab,
    showToast,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 499;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, error: !res.success });
    if (res.success) {
      setPromoInput('');
      showToast(res.message, 'success');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      id="cart-drawer-backdrop"
      onClick={() => setIsCartOpen(false)}
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
    >
      <div
        id="cart-drawer-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">Your Shopping Cart</h2>
              <p className="text-[11px] text-stone-500">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <button
            id="btn-close-cart"
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-amber-50/80 px-5 py-2.5 border-b border-amber-200/60">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-1.5">
            <span className="flex items-center gap-1.5 text-amber-900">
              <Truck className="w-3.5 h-3.5 text-amber-700" />
              {remainingForFreeShipping > 0
                ? `Add ${formatINR(remainingForFreeShipping)} more for FREE Delivery`
                : 'You unlocked FREE Delivery!'}
            </span>
            <span className="text-[10px] font-bold text-amber-800">{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-amber-200/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-600 rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-800">Your cart is currently empty</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Discover bestselling titles in Computer Science, Sci-Fi, Business, and Fiction.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveTab('catalog');
                }}
                className="bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all"
              >
                Browse Book Catalog
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-2xl border border-stone-200 bg-white hover:border-stone-300 transition-all"
              >
                {/* Book Thumbnail */}
                <div
                  onClick={() => {
                    setSelectedBook(item.book);
                    setIsCartOpen(false);
                  }}
                  className="w-16 h-22 rounded-lg overflow-hidden shadow-xs cursor-pointer shrink-0"
                >
                  <BookCover book={item.book} size="sm" />
                </div>

                {/* Info & Actions */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4
                        onClick={() => {
                          setSelectedBook(item.book);
                          setIsCartOpen(false);
                        }}
                        className="text-xs font-bold text-stone-900 line-clamp-1 hover:text-amber-800 cursor-pointer"
                      >
                        {item.book.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.bookId)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-stone-500 line-clamp-1">by {item.book.authorName}</p>
                    <div className="text-xs font-black text-stone-900 mt-1">{formatINR(item.book.price)}</div>
                  </div>

                  {/* Quantity Stepper & Move to Wishlist */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-2">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                      <button
                        onClick={() => updateCartQuantity(item.bookId, item.quantity - 1)}
                        className="px-2 py-1 text-stone-600 hover:bg-stone-200"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.bookId, item.quantity + 1)}
                        disabled={item.quantity >= item.book.stock}
                        className="px-2 py-1 text-stone-600 hover:bg-stone-200 disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        toggleWishlist(item.book);
                        removeFromCart(item.bookId);
                      }}
                      className="text-[10px] text-stone-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
                    >
                      <Heart className="w-3 h-3" />
                      <span>Save for later</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer: Promo code & Order Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-4">
            {/* Promo Code Input */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-700" />
                    <div>
                      <span className="font-bold text-emerald-900">{appliedPromo.code}</span>
                      <span className="text-[11px] text-emerald-700 ml-1.5">
                        ({appliedPromo.discountPercent}% OFF saved {formatINR(cartDiscount)})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-stone-400 hover:text-stone-700 text-xs font-semibold underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo voucher (e.g. DASINTERN15)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
                    >
                      Apply
                    </button>
                  </form>
                  {promoMessage && (
                    <p
                      className={`text-[10px] mt-1 font-medium ${
                        promoMessage.error ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {promoMessage.text}
                    </p>
                  )}
                  {/* Sample promo pill hint */}
                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-stone-500">
                    <span>Try:</span>
                    <button
                      type="button"
                      onClick={() => setPromoInput('DASINTERN15')}
                      className="text-amber-800 font-bold hover:underline"
                    >
                      DASINTERN15 (15% OFF)
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => setPromoInput('READMORE20')}
                      className="text-amber-800 font-bold hover:underline"
                    >
                      READMORE20
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatINR(cartSubtotal)}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span className="font-semibold">-{formatINR(cartDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated GST (5%)</span>
                <span className="font-semibold text-stone-900">{formatINR(cartTax)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {cartShipping === 0 ? (
                    <strong className="text-emerald-700 uppercase tracking-wide">FREE</strong>
                  ) : (
                    formatINR(cartShipping)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount</span>
                <span className="text-base text-amber-900 font-black">{formatINR(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Trigger */}
            <button
              id="btn-proceed-checkout"
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold py-3.5 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
