import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  INITIAL_AUTHORS,
  INITIAL_BOOKS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_PROMO_CODES,
  INITIAL_REVIEWS,
  INITIAL_USERS,
} from '../data/mockData';
import {
  ActiveTab,
  Author,
  Book,
  CartItem,
  Category,
  Order,
  OrderStatus,
  PromoCode,
  ReadingListItem,
  ReadingStatus,
  Review,
  User,
  WishlistItem,
} from '../types';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface StoreContextType {
  // Navigation & UI
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedOrderForDetail: Order | null;
  setSelectedOrderForDetail: (order: Order | null) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
  selectedAuthorId: number | null;
  setSelectedAuthorId: (id: number | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest') => void;
  inStockOnly: boolean;
  setInStockOnly: (inStock: boolean) => void;
  resetFilters: () => void;

  // Authentication & Users
  currentUser: User;
  users: User[];
  login: (email: string, role?: 'USER' | 'ADMIN') => boolean;
  register: (data: { email: string; firstName: string; lastName: string; role?: 'USER' | 'ADMIN' }) => boolean;
  logout: () => void;
  switchUserRole: (role: 'USER' | 'ADMIN') => void;

  // Entities Data
  books: Book[];
  categories: Category[];
  authors: Author[];
  promoCodes: PromoCode[];
  reviews: Review[];

  // Admin Book & Inventory Operations
  addBook: (bookData: Omit<Book, 'id' | 'rating' | 'reviewCount'>) => void;
  updateBook: (id: number, bookData: Partial<Book>) => void;
  deleteBook: (id: number) => void;
  restockBook: (id: number, addedStock: number) => void;
  addCategory: (cat: Omit<Category, 'id'>) => void;
  addAuthor: (author: Omit<Author, 'id'>) => void;

  // Cart Operations
  cart: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  updateCartQuantity: (bookId: number, quantity: number) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
  appliedPromo: PromoCode | null;
  applyPromoCode: (codeStr: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartTax: number;
  cartShipping: number;
  cartTotal: number;

  // Wishlist Operations
  wishlist: WishlistItem[];
  toggleWishlist: (book: Book) => void;
  isInWishlist: (bookId: number) => boolean;
  moveToCartFromWishlist: (book: Book) => void;

  // Reading List / Book Club
  readingList: ReadingListItem[];
  addToReadingList: (book: Book, status: ReadingStatus) => void;
  updateReadingProgress: (bookId: number, currentPage: number, status?: ReadingStatus, notes?: string) => void;
  removeFromReadingList: (bookId: number) => void;

  // Order Operations
  orders: Order[];
  placeOrder: (orderDetails: {
    shippingAddress: Order['shippingAddress'];
    paymentMethod: Order['paymentMethod'];
  }) => Order;
  updateOrderStatus: (orderId: number, status: OrderStatus, description?: string) => void;
  cancelOrder: (orderId: number) => void;

  // Reviews
  addReview: (data: { bookId: number; rating: number; title: string; comment: string }) => void;
  voteHelpfulReview: (reviewId: number) => void;

  // Toast System
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage fallbacks
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('das_bookstore_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('das_bookstore_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // default to Alex Morgan (User)
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('das_bookstore_books');
    if (saved) {
      try {
        const parsed: Book[] = JSON.parse(saved);
        // If saved data has legacy dollar pricing (<100 max price), migrate to INR
        if (parsed.length > 0 && Math.max(...parsed.map((b) => b.price)) < 100) {
          return INITIAL_BOOKS;
        }
        return parsed;
      } catch {
        return INITIAL_BOOKS;
      }
    }
    return INITIAL_BOOKS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('das_bookstore_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [authors, setAuthors] = useState<Author[]>(() => {
    const saved = localStorage.getItem('das_bookstore_authors');
    return saved ? JSON.parse(saved) : INITIAL_AUTHORS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('das_bookstore_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [promoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('das_bookstore_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('das_bookstore_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('das_bookstore_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [readingList, setReadingList] = useState<ReadingListItem[]>(() => {
    const saved = localStorage.getItem('das_bookstore_readinglist');
    if (saved) return JSON.parse(saved);
    // Initial sample item
    const sampleBook = INITIAL_BOOKS[0];
    return [
      {
        id: 1,
        userId: 2,
        bookId: sampleBook.id,
        book: sampleBook,
        status: 'CURRENTLY_READING',
        currentPage: 180,
        notes: 'Reviewing Chapter 7 on Error Handling & Defensive Coding.',
        updatedAt: '2026-08-14',
      },
    ];
  });

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalog');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('das_bookstore_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('das_bookstore_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('das_bookstore_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('das_bookstore_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('das_bookstore_authors', JSON.stringify(authors));
  }, [authors]);

  useEffect(() => {
    localStorage.setItem('das_bookstore_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('das_bookstore_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('das_bookstore_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('das_bookstore_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('das_bookstore_readinglist', JSON.stringify(readingList));
  }, [readingList]);

  // Auth methods
  const login = (email: string, role?: 'USER' | 'ADMIN'): boolean => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      showToast(`Welcome back, ${found.firstName}! (${found.role})`, 'success');
      return true;
    }
    // Auto-create for demo convenience if not found
    const newUser: User = {
      id: Date.now(),
      email,
      firstName: email.split('@')[0] || 'User',
      lastName: 'Member',
      role: role || (email.includes('admin') ? 'ADMIN' : 'USER'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Account created! Welcome, ${newUser.firstName}!`, 'success');
    return true;
  };

  const register = (data: { email: string; firstName: string; lastName: string; role?: 'USER' | 'ADMIN' }): boolean => {
    const exists = users.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      showToast('Email is already registered. Please log in.', 'warning');
      return false;
    }
    const newUser: User = {
      id: Date.now(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || (data.email.includes('admin') ? 'ADMIN' : 'USER'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Registration complete! Welcome, ${newUser.firstName}!`, 'success');
    return true;
  };

  const logout = () => {
    const demoUser = users.find((u) => u.role === 'USER') || INITIAL_USERS[1];
    setCurrentUser(demoUser);
    showToast('Logged out. Switched to visitor mode.', 'info');
  };

  const switchUserRole = (role: 'USER' | 'ADMIN') => {
    const targetUser = users.find((u) => u.role === role) || (role === 'ADMIN' ? INITIAL_USERS[0] : INITIAL_USERS[1]);
    setCurrentUser(targetUser);
    showToast(`Switched active profile to ${targetUser.firstName} (${targetUser.role})`, 'info');
  };

  // Filter reset
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId(null);
    setSelectedAuthorId(null);
    setPriceRange([0, 2000]);
    setSelectedFormat('all');
    setMinRating(0);
    setSortBy('featured');
    setInStockOnly(false);
    showToast('All filters have been reset.', 'info');
  };

  // Cart operations
  const addToCart = (book: Book, quantity = 1) => {
    if (book.stock <= 0) {
      showToast(`Sorry, "${book.title}" is currently out of stock.`, 'warning');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.bookId === book.id && item.userId === currentUser.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, book.stock);
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: newQty } : item
        );
      }
      const newItem: CartItem = {
        id: Date.now() + Math.random(),
        userId: currentUser.id,
        bookId: book.id,
        book,
        quantity: Math.min(quantity, book.stock),
        addedAt: new Date().toISOString(),
      };
      return [...prev, newItem];
    });

    showToast(`Added "${book.title}" to cart.`, 'success');
  };

  const updateCartQuantity = (bookId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    const book = books.find((b) => b.id === bookId);
    const validQty = book ? Math.min(quantity, book.stock) : quantity;

    setCart((prev) =>
      prev.map((item) =>
        item.bookId === bookId && item.userId === currentUser.id
          ? { ...item, quantity: validQty }
          : item
      )
    );
  };

  const removeFromCart = (bookId: number) => {
    setCart((prev) => prev.filter((item) => !(item.bookId === bookId && item.userId === currentUser.id)));
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart((prev) => prev.filter((item) => item.userId !== currentUser.id));
    setAppliedPromo(null);
  };

  // Promo code calculation
  const applyPromoCode = (codeStr: string) => {
    const trimmed = codeStr.trim().toUpperCase();
    const promo = promoCodes.find((p) => p.code.toUpperCase() === trimmed && p.active);
    if (!promo) {
      return { success: false, message: 'Invalid or expired promo voucher.' };
    }
    if (cartSubtotal < promo.minSpend) {
      return {
        success: false,
        message: `Order subtotal must be at least ₹${promo.minSpend} to apply ${promo.code}.`,
      };
    }
    setAppliedPromo(promo);
    return { success: true, message: `Promo code ${promo.code} applied (${promo.discountPercent}% OFF)!` };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed.', 'info');
  };

  const userCart = useMemo(() => cart.filter((item) => item.userId === currentUser.id), [cart, currentUser.id]);

  const cartSubtotal = useMemo(() => {
    return userCart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  }, [userCart]);

  const cartDiscount = useMemo(() => {
    if (!appliedPromo) return 0;
    const rawDiscount = (cartSubtotal * appliedPromo.discountPercent) / 100;
    return appliedPromo.maxDiscount ? Math.min(rawDiscount, appliedPromo.maxDiscount) : rawDiscount;
  }, [cartSubtotal, appliedPromo]);

  const cartShipping = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    // Free delivery on orders ₹499 and above in India, else ₹49
    return cartSubtotal >= 499 ? 0 : 49;
  }, [cartSubtotal]);

  const cartTax = useMemo(() => {
    const taxable = Math.max(0, cartSubtotal - cartDiscount);
    return taxable * 0.05; // 5% GST on books
  }, [cartSubtotal, cartDiscount]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - cartDiscount + cartTax + cartShipping);
  }, [cartSubtotal, cartDiscount, cartTax, cartShipping]);

  // Wishlist operations
  const userWishlist = useMemo(
    () => wishlist.filter((item) => item.userId === currentUser.id),
    [wishlist, currentUser.id]
  );

  const isInWishlist = (bookId: number) => {
    return userWishlist.some((item) => item.bookId === bookId);
  };

  const toggleWishlist = (book: Book) => {
    const exists = isInWishlist(book.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => !(item.bookId === book.id && item.userId === currentUser.id)));
      showToast(`Removed "${book.title}" from wishlist.`, 'info');
    } else {
      const newItem: WishlistItem = {
        id: Date.now() + Math.random(),
        userId: currentUser.id,
        bookId: book.id,
        book,
        addedAt: new Date().toISOString(),
      };
      setWishlist((prev) => [...prev, newItem]);
      showToast(`Added "${book.title}" to wishlist!`, 'success');
    }
  };

  const moveToCartFromWishlist = (book: Book) => {
    addToCart(book, 1);
    setWishlist((prev) => prev.filter((item) => !(item.bookId === book.id && item.userId === currentUser.id)));
  };

  // Reading List
  const addToReadingList = (book: Book, status: ReadingStatus) => {
    setReadingList((prev) => {
      const existingIndex = prev.findIndex((item) => item.bookId === book.id && item.userId === currentUser.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          status,
          updatedAt: new Date().toISOString().split('T')[0],
        };
        return updated;
      }
      const newItem: ReadingListItem = {
        id: Date.now(),
        userId: currentUser.id,
        bookId: book.id,
        book,
        status,
        currentPage: status === 'COMPLETED' ? book.pageCount : 0,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      return [...prev, newItem];
    });
    showToast(`Added "${book.title}" to your reading shelf (${status.replace(/_/g, ' ')}).`, 'success');
  };

  const updateReadingProgress = (bookId: number, currentPage: number, status?: ReadingStatus, notes?: string) => {
    setReadingList((prev) =>
      prev.map((item) => {
        if (item.bookId === bookId && item.userId === currentUser.id) {
          const autoStatus = currentPage >= item.book.pageCount ? 'COMPLETED' : status || item.status;
          return {
            ...item,
            currentPage,
            status: autoStatus,
            notes: notes !== undefined ? notes : item.notes,
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return item;
      })
    );
    showToast('Reading progress updated!', 'success');
  };

  const removeFromReadingList = (bookId: number) => {
    setReadingList((prev) => prev.filter((item) => !(item.bookId === bookId && item.userId === currentUser.id)));
    showToast('Removed from reading shelf.', 'info');
  };

  // Orders
  const placeOrder = (orderDetails: {
    shippingAddress: Order['shippingAddress'];
    paymentMethod: Order['paymentMethod'];
  }): Order => {
    const newOrderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNum = `DAS-TRK-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const orderItems: Order['items'] = userCart.map((item) => ({
      id: Date.now() + Math.random(),
      orderId: Date.now(),
      bookId: item.bookId,
      title: item.book.title,
      authorName: item.book.authorName || 'Unknown Author',
      price: item.book.price,
      quantity: item.quantity,
      imageUrl: item.book.imageUrl,
    }));

    // Deduct stock in books
    setBooks((prev) =>
      prev.map((b) => {
        const cartMatch = userCart.find((ci) => ci.bookId === b.id);
        if (cartMatch) {
          return { ...b, stock: Math.max(0, b.stock - cartMatch.quantity) };
        }
        return b;
      })
    );

    const newOrder: Order = {
      id: Date.now(),
      orderNumber: newOrderNumber,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      userEmail: currentUser.email,
      orderDate: new Date().toISOString(),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      promoCode: appliedPromo?.code,
      tax: cartTax,
      shippingFee: cartShipping,
      totalAmount: cartTotal,
      status: 'PROCESSING',
      shippingAddress: orderDetails.shippingAddress,
      paymentMethod: orderDetails.paymentMethod,
      paymentStatus: 'PAID',
      trackingNumber: trackingNum,
      items: orderItems,
      timeline: [
        {
          status: 'PENDING',
          label: 'Order Placed',
          timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
          description: 'Order created and payment authorized via Spring Security Gateway.',
          completed: true,
        },
        {
          status: 'PROCESSING',
          label: 'Processing & Packaging',
          timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
          description: 'Item reserved in MySQL inventory, packed with eco-cushioning.',
          completed: true,
        },
        {
          status: 'SHIPPED',
          label: 'In Transit',
          timestamp: 'Scheduled within 24 hours',
          description: `Consignment tracking ID: ${trackingNum}`,
          completed: false,
        },
        {
          status: 'DELIVERED',
          label: 'Delivered',
          timestamp: 'Estimated 3-5 business days',
          description: 'Handed to recipient with digital signature.',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: number, status: OrderStatus, description?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedTimeline = order.timeline.map((step) => {
            if (step.status === status) {
              return {
                ...step,
                completed: true,
                timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
                description: description || step.description,
              };
            }
            return step;
          });

          return {
            ...order,
            status,
            timeline: updatedTimeline,
          };
        }
        return order;
      })
    );
    showToast(`Order #${orderId} status updated to ${status}.`, 'info');
  };

  const cancelOrder = (orderId: number) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'CANCELLED',
            timeline: [
              ...order.timeline,
              {
                status: 'CANCELLED',
                label: 'Order Cancelled',
                timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
                description: 'Order was cancelled by customer / administrator.',
                completed: true,
              },
            ],
          };
        }
        return order;
      })
    );
    showToast(`Order #${orderId} has been cancelled.`, 'warning');
  };

  // Reviews
  const addReview = (data: { bookId: number; rating: number; title: string; comment: string }) => {
    const newRev: Review = {
      id: Date.now(),
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      userAvatar: currentUser.avatar,
      bookId: data.bookId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      verifiedPurchase: true,
      createdAt: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
    };

    setReviews((prev) => [newRev, ...prev]);

    // Recalculate book rating
    const allBookReviews = [...reviews.filter((r) => r.bookId === data.bookId), newRev];
    const avg = allBookReviews.reduce((sum, r) => sum + r.rating, 0) / allBookReviews.length;
    const roundedAvg = Math.round(avg * 10) / 10;

    setBooks((prev) =>
      prev.map((b) =>
        b.id === data.bookId
          ? {
              ...b,
              rating: roundedAvg,
              reviewCount: allBookReviews.length,
            }
          : b
      )
    );

    showToast('Your review was published successfully!', 'success');
  };

  const voteHelpfulReview = (reviewId: number) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    showToast('Thank you for your feedback!', 'info');
  };

  // Admin Book Management
  const addBook = (bookData: Omit<Book, 'id' | 'rating' | 'reviewCount'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now(),
      rating: 5.0,
      reviewCount: 0,
    };
    setBooks((prev) => [newBook, ...prev]);
    showToast(`Book "${newBook.title}" added to catalog.`, 'success');
  };

  const updateBook = (id: number, bookData: Partial<Book>) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...bookData } : b)));
    if (selectedBook && selectedBook.id === id) {
      setSelectedBook((prev) => (prev ? { ...prev, ...bookData } : null));
    }
    showToast('Book details updated successfully.', 'success');
  };

  const deleteBook = (id: number) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    showToast('Book removed from catalog.', 'info');
  };

  const restockBook = (id: number, addedStock: number) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, stock: b.stock + addedStock } : b))
    );
    showToast(`Restocked +${addedStock} units.`, 'success');
  };

  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = { ...cat, id: Date.now() };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${newCat.name}" created!`, 'success');
  };

  const addAuthor = (author: Omit<Author, 'id'>) => {
    const newAuthor: Author = { ...author, id: Date.now() };
    setAuthors((prev) => [...prev, newAuthor]);
    showToast(`Author "${newAuthor.name}" added!`, 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedBook,
        setSelectedBook,
        isCartOpen,
        setIsCartOpen,
        isAuthOpen,
        setIsAuthOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedOrderForDetail,
        setSelectedOrderForDetail,

        searchQuery,
        setSearchQuery,
        selectedCategoryId,
        setSelectedCategoryId,
        selectedAuthorId,
        setSelectedAuthorId,
        priceRange,
        setPriceRange,
        selectedFormat,
        setSelectedFormat,
        minRating,
        setMinRating,
        sortBy,
        setSortBy,
        inStockOnly,
        setInStockOnly,
        resetFilters,

        currentUser,
        users,
        login,
        register,
        logout,
        switchUserRole,

        books,
        categories,
        authors,
        promoCodes,
        reviews,

        addBook,
        updateBook,
        deleteBook,
        restockBook,
        addCategory,
        addAuthor,

        cart: userCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        cartSubtotal,
        cartDiscount,
        cartTax,
        cartShipping,
        cartTotal,

        wishlist: userWishlist,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,

        readingList,
        addToReadingList,
        updateReadingProgress,
        removeFromReadingList,

        orders,
        placeOrder,
        updateOrderStatus,
        cancelOrder,

        addReview,
        voteHelpfulReview,

        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
