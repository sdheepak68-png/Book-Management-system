import {
  ArrowUpDown,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flame,
  Globe,
  Grid,
  Heart,
  HelpCircle,
  Layers,
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  Truck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthorsView } from './components/AuthorsView';
import { BestsellersView } from './components/BestsellersView';
import { BookCard } from './components/BookCard';
import { BookCover } from './components/BookCover';
import { BookDetailModal } from './components/BookDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { InternshipExplorer } from './components/InternshipExplorer';
import { Navbar } from './components/Navbar';
import { NewArrivalsView } from './components/NewArrivalsView';
import { OrdersView } from './components/OrdersView';
import { ReadingListView } from './components/ReadingListView';
import { WishlistView } from './components/WishlistView';
import { StoreProvider, useStore } from './context/StoreContext';
import { BookFormat } from './types';
import { formatINR } from './utils/currency';

const MainContent: React.FC = () => {
  const {
    books,
    categories,
    authors,
    activeTab,
    setActiveTab,
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
    sortBy,
    setSortBy,
    inStockOnly,
    setInStockOnly,
    resetFilters,
    toasts,
    dismissToast,
    setSelectedBook,
  } = useStore();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filtered and Sorted Books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Search query filter (title, isbn, author, description, tags)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            book.title.toLowerCase().includes(q) ||
            book.isbn.toLowerCase().includes(q) ||
            (book.authorName && book.authorName.toLowerCase().includes(q)) ||
            book.description.toLowerCase().includes(q) ||
            (book.tags && book.tags.some((t) => t.toLowerCase().includes(q)));
          if (!matches) return false;
        }

        // Category filter
        if (selectedCategoryId && book.categoryId !== selectedCategoryId) {
          return false;
        }

        // Author filter
        if (selectedAuthorId && book.authorId !== selectedAuthorId) {
          return false;
        }

        // Format filter
        if (selectedFormat !== 'ALL' && book.format !== selectedFormat) {
          return false;
        }

        // Price range
        if (book.price < priceRange[0] || book.price > priceRange[1]) {
          return false;
        }

        // In-stock only
        if (inStockOnly && book.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return b.publicationYear - a.publicationYear;
        // Default: featured
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [
    books,
    searchQuery,
    selectedCategoryId,
    selectedAuthorId,
    selectedFormat,
    priceRange,
    inStockOnly,
    sortBy,
  ]);

  // Reset to page 1 on filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategoryId, selectedAuthorId, selectedFormat, priceRange, inStockOnly, sortBy]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / itemsPerPage));
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeAuthorObj = authors.find((a) => a.id === selectedAuthorId);
  const activeCategoryObj = categories.find((c) => c.id === selectedCategoryId);
  const spotlightBook = books[0];

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Multi-Toast Notifications */}
      {toasts.length > 0 && (
        <div
          id="global-toast-container"
          className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              onClick={() => dismissToast(t.id)}
              className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold cursor-pointer animate-in slide-in-from-bottom-5 duration-200 ${
                t.type === 'success'
                  ? 'bg-stone-900 text-white border-stone-800'
                  : t.type === 'warning'
                  ? 'bg-amber-900 text-amber-100 border-amber-800'
                  : 'bg-rose-900 text-white border-rose-800'
              }`}
            >
              {t.type === 'success' && <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />}
              <span>{t.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Top Navbar */}
      <Navbar />

      {/* Main App Body Depending on Active Tab */}
      <main className="flex-1">
        {/* Catalog View */}
        {activeTab === 'catalog' && (
          <div id="catalog-view" className="space-y-8 pb-16">
            {/* Hero Feature Banner (Only when not searching/filtering deeply) */}
            {!searchQuery && !selectedAuthorId && !selectedCategoryId && (
              <section className="bg-stone-900 text-white border-b border-stone-800 py-10 sm:py-14 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-3 py-1 rounded-full">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Data Alcott Systems · Task JV-EC-003</span>
                      </div>

                      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                        Timeless Knowledge, <br />
                        <span className="text-amber-400 font-serif italic">Curated for Architects.</span>
                      </h1>

                      <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                        Explore classic computer science literature, high-yield system design blueprints, and celebrated world fiction with real-time Spring Boot inventory tracking.
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            setSelectedCategoryId(2);
                            window.scrollTo({ top: 450, behavior: 'smooth' });
                          }}
                          className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold px-5 py-3 rounded-xl shadow-lg transition-all cursor-pointer"
                        >
                          Explore Tech & CS Classics &rarr;
                        </button>
                        <button
                          onClick={() => setActiveTab('internship-project')}
                          className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold px-4 py-3 rounded-xl border border-stone-700 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Layers className="w-4 h-4 text-amber-400" />
                          <span>View Spring Architecture & Task Docs</span>
                        </button>
                      </div>
                    </div>

                    {/* Featured Book Preview Spotlight with BookCover */}
                    {spotlightBook && (
                      <div className="lg:col-span-5 flex justify-center">
                        <div
                          onClick={() => setSelectedBook(spotlightBook)}
                          className="bg-stone-800/90 hover:bg-stone-800 rounded-3xl p-5 border border-stone-700 max-w-sm w-full shadow-2xl flex gap-4 items-center cursor-pointer transition-all hover:border-amber-500/50 group"
                        >
                          <div className="w-24 h-36 rounded-xl overflow-hidden shadow-lg shrink-0 group-hover:scale-105 transition-transform">
                            <BookCover book={spotlightBook} size="sm" />
                          </div>
                          <div className="space-y-1.5 min-w-0">
                            <span className="text-[10px] font-bold uppercase text-amber-400">Spotlight Title</span>
                            <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                              {spotlightBook.title}
                            </h3>
                            <p className="text-xs text-stone-400">by {spotlightBook.authorName}</p>
                            <div className="flex items-center gap-1 text-amber-400 text-xs pt-1">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="font-bold">{spotlightBook.rating}</span>
                              <span className="text-stone-400 text-[10px]">({spotlightBook.reviewCount} reviews)</span>
                            </div>
                            <div className="pt-1 flex items-center justify-between">
                              <p className="text-sm font-black text-white">{formatINR(spotlightBook.price)}</p>
                              <span className="text-[11px] text-amber-400 font-semibold group-hover:underline">
                                Details &rarr;
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Catalog Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Category Filter Pills Bar */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-b border-stone-200">
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    !selectedCategoryId
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
                  }`}
                >
                  All Genres ({books.length})
                </button>

                {categories.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  const catBookCount = books.filter((b) => b.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(isSelected ? null : cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-stone-900 text-amber-400 shadow-xs'
                          : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
                      }`}
                    >
                      {cat.name} ({catBookCount})
                    </button>
                  );
                })}
              </div>

              {/* Active Filter Chips & Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-stone-900">
                    Showing <strong className="text-amber-800">{filteredBooks.length}</strong> books
                  </span>

                  {searchQuery && (
                    <span className="bg-amber-100 text-amber-900 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      Search: "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {activeCategoryObj && (
                    <span className="bg-stone-100 text-stone-800 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      Category: {activeCategoryObj.name}
                      <button onClick={() => setSelectedCategoryId(null)} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {activeAuthorObj && (
                    <span className="bg-stone-100 text-stone-800 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      Author: {activeAuthorObj.name}
                      <button onClick={() => setSelectedAuthorId(null)} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedFormat !== 'ALL' && (
                    <span className="bg-stone-100 text-stone-800 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      Format: {selectedFormat}
                      <button onClick={() => setSelectedFormat('ALL')} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {inStockOnly && (
                    <span className="bg-emerald-100 text-emerald-900 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      In Stock Only
                      <button onClick={() => setInStockOnly(false)} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {(searchQuery ||
                    selectedCategoryId ||
                    selectedAuthorId ||
                    selectedFormat !== 'ALL' ||
                    inStockOnly ||
                    priceRange[0] > 0 ||
                    priceRange[1] < 2000) && (
                    <button
                      onClick={resetFilters}
                      className="text-amber-800 hover:text-amber-950 font-bold underline ml-1"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Right Controls: Sort & Mobile Filter Toggle */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-3 py-1.5 font-semibold text-xs focus:outline-none focus:border-amber-600 cursor-pointer"
                    >
                      <option value="featured">Featured & Bestsellers</option>
                      <option value="rating">Highest Rated</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest Releases</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                    className="lg:hidden flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1.5 rounded-xl text-xs font-bold"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>

              {/* Main Content Layout (Sidebar + Books Grid) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Desktop Left Sidebar Filters */}
                <aside
                  className={`lg:col-span-3 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6 ${
                    isMobileFilterOpen ? 'block' : 'hidden lg:block'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h3 className="font-black text-stone-900 text-sm flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-amber-700" />
                      Filter Catalog
                    </h3>
                    <button
                      onClick={resetFilters}
                      className="text-[11px] text-stone-400 hover:text-stone-700 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  </div>

                  {/* Format Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-800 block">Book Format</label>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      {['ALL', 'Hardcover', 'Paperback'].map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setSelectedFormat(fmt)}
                          className={`py-1.5 px-2 rounded-xl font-medium border text-center transition-colors ${
                            selectedFormat === fmt
                              ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-stone-800">Price Range</label>
                      <span className="font-mono font-bold text-amber-800">
                        {formatINR(priceRange[0])} – {formatINR(priceRange[1])}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                      <span>₹0</span>
                      <span>₹1,000</span>
                      <span>₹2,000</span>
                    </div>
                  </div>

                  {/* Availability Toggle */}
                  <div className="pt-2 border-t border-stone-100">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                      />
                      <span>In Stock Items Only</span>
                    </label>
                  </div>

                  {/* Authors Direct Select */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <label className="text-xs font-bold text-stone-800 block">Featured Authors</label>
                    <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
                      {authors.map((auth) => (
                        <button
                          key={auth.id}
                          onClick={() => setSelectedAuthorId(selectedAuthorId === auth.id ? null : auth.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                            selectedAuthorId === auth.id
                              ? 'bg-amber-100 text-amber-900 font-bold'
                              : 'text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <span className="truncate">{auth.name}</span>
                          <span className="text-[10px] text-stone-400">
                            ({books.filter((b) => b.authorId === auth.id).length})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spring Architecture Internship Banner */}
                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Java Full Stack Intern</span>
                    </div>
                    <p className="text-[11px] text-amber-950/80 leading-relaxed">
                      Backend ready for Spring Boot & MySQL integration with REST API controllers.
                    </p>
                    <button
                      onClick={() => setActiveTab('internship-project')}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-2.5 rounded-xl text-[11px] transition-colors"
                    >
                      Explore Task JV-EC-003 &rarr;
                    </button>
                  </div>
                </aside>

                {/* Right Book Grid */}
                <div className="lg:col-span-9 space-y-6">
                  {filteredBooks.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
                        <BookOpen className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-stone-800">No books found matching your criteria</h3>
                        <p className="text-xs text-stone-500 max-w-sm mx-auto">
                          Try clearing your filters or searching for alternative titles, authors, or topics.
                        </p>
                      </div>
                      <button
                        onClick={resetFilters}
                        className="bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                      {paginatedBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                      ))}
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-stone-200 shadow-xs">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl border border-stone-300 bg-white text-stone-600 disabled:opacity-40 hover:bg-stone-50 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1 text-xs font-bold text-stone-700">
                        <span>
                          Page {currentPage} of {totalPages}
                        </span>
                      </div>

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl border border-stone-300 bg-white text-stone-600 disabled:opacity-40 hover:bg-stone-50 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Bestsellers Tab */}
        {activeTab === 'bestsellers' && <BestsellersView />}

        {/* Dedicated New Arrivals Tab */}
        {activeTab === 'new-arrivals' && <NewArrivalsView />}

        {/* Other Views */}
        {activeTab === 'reading-list' && <ReadingListView />}
        {activeTab === 'wishlist' && <WishlistView />}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'authors' && <AuthorsView />}
        {activeTab === 'admin' && <AdminDashboard />}
        {(activeTab === 'internship' || activeTab === 'internship-project') && <InternshipExplorer />}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <BookDetailModal />
      <CheckoutModal />

      {/* Application Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-black text-sm">
                  📚
                </div>
                <span className="font-black text-white text-base tracking-tight">DATA ALCOTT BOOKSTORE</span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Online bookstore management platform built for the Data Alcott Systems Java Full Stack Internship program (Task ID: JV-EC-003).
              </p>
              <div className="font-mono text-[11px] text-amber-400/90">
                Spring Boot · Hibernate · JPA · MySQL 8
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">System Views</h4>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setActiveTab('catalog')} className="hover:text-white transition-colors">
                    Book Catalog & Search
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('bestsellers')} className="hover:text-white transition-colors">
                    Top Bestsellers
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('new-arrivals')} className="hover:text-white transition-colors">
                    New Arrivals & Releases
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('authors')} className="hover:text-white transition-colors">
                    Featured Authors
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('reading-list')} className="hover:text-white transition-colors">
                    Reading Club & Goal Tracker
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('orders')} className="hover:text-white transition-colors">
                    Order Tracking & Invoices
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('admin')} className="hover:text-white transition-colors">
                    Admin Inventory Console
                  </button>
                </li>
              </ul>
            </div>

            {/* Internship Links */}
            <div className="space-y-2">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Task Verification</h4>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setActiveTab('internship-project')} className="hover:text-white transition-colors">
                    Internship Evaluation Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('internship-project')} className="hover:text-white transition-colors">
                    Spring REST API Sandbox
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('internship-project')} className="hover:text-white transition-colors">
                    Download MySQL Schema (SQL)
                  </button>
                </li>
                <li>
                  <a
                    href="https://www.dataalcott.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Data Alcott Systems Official
                  </a>
                </li>
              </ul>
            </div>

            {/* Company & Support */}
            <div className="space-y-2">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Internship Contact</h4>
              <p className="text-stone-400">
                Data Alcott Systems
                <br />
                Email: hr@dataalcott.com
                <br />
                Web: www.freeinternships.in
                <br />
                Chennai, Tamil Nadu, India
              </p>
              <div className="pt-2 text-[11px] text-emerald-400">
                ✓ Free Java Full Stack Internship Verified
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
            <div>
              &copy; {new Date().getFullYear()} Data Alcott Systems. All rights reserved. Task Code: JV-EC-003.
            </div>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Internship Project Guidelines</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}

export default App;
