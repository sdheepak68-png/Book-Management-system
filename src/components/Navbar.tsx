import {
  BookMarked,
  BookOpen,
  CheckCircle2,
  Code2,
  Heart,
  LayoutDashboard,
  LogOut,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ActiveTab } from '../types';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    categories,
    cart,
    wishlist,
    readingList,
    setIsCartOpen,
    setIsAuthOpen,
    currentUser,
    switchUserRole,
    logout,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const activeReadsCount = readingList.filter((r) => r.status === 'CURRENTLY_READING').length;

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'catalog', label: 'Explore Books', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'bestsellers', label: 'Bestsellers', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { id: 'new-arrivals', label: 'New Arrivals', icon: <Sparkles className="w-4 h-4 text-emerald-500" /> },
    { id: 'authors', label: 'Authors', icon: <Users className="w-4 h-4" /> },
    { id: 'reading-list', label: 'Reading Club', icon: <BookMarked className="w-4 h-4" />, badge: activeReadsCount > 0 ? activeReadsCount : undefined },
    { id: 'orders', label: 'My Orders', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Internship & Quick Announcement Bar */}
      <div id="top-announcement-bar" className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide">
              DATA ALCOTT SYSTEMS
            </span>
            <span className="hidden sm:inline text-stone-400">
              Free Java Full Stack Internship · Task ID: <strong className="text-white">JV-EC-003</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              id="btn-open-internship-suite"
              onClick={() => setActiveTab('internship-project')}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Architecture & API Explorer</span>
            </button>
            <span className="text-stone-600 hidden md:inline">|</span>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-stone-400">Current Role:</span>
              <span
                className={`font-semibold px-1.5 py-0.5 rounded ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-purple-900/60 text-purple-200 border border-purple-700/40'
                    : 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/40'
                }`}
              >
                {currentUser.role}
              </span>
              <button
                id="btn-quick-switch-role"
                onClick={() => switchUserRole(currentUser.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                className="text-stone-300 hover:text-white underline underline-offset-2 ml-1"
                title="Switch between Admin and Customer account"
              >
                Switch to {currentUser.role === 'ADMIN' ? 'Customer' : 'Admin'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => {
              setActiveTab('catalog');
              setSelectedCategoryId(null);
            }}
            className="flex items-center gap-2.5 text-left focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-stone-900 block leading-tight">
                Data Alcott <span className="text-amber-700 font-serif">Bookstore</span>
              </span>
              <span className="text-[10px] text-stone-500 uppercase tracking-widest block font-mono">
                Spring JPA · MySQL Architecture
              </span>
            </div>
          </button>

          {/* Search Bar & Category Dropdown */}
          <div className="hidden lg:flex flex-1 max-w-xl items-center mx-2">
            <div className="relative w-full flex items-center bg-stone-100/90 rounded-xl border border-stone-200 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all overflow-hidden">
              <select
                id="search-category-select"
                aria-label="Filter books by category"
                value={selectedCategoryId || ''}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value ? Number(e.target.value) : null);
                  if (activeTab !== 'catalog') setActiveTab('catalog');
                }}
                className="bg-stone-200/70 hover:bg-stone-200 text-stone-700 text-xs font-medium py-2.5 px-3 border-r border-stone-300 focus:outline-hidden cursor-pointer shrink-0 max-w-[130px] truncate"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                <input
                  id="global-search-input"
                  type="text"
                  placeholder="Search by title, author, genre, ISBN (e.g. Clean Code, Andy Weir)..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeTab !== 'catalog') setActiveTab('catalog');
                  }}
                  className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm text-stone-900 bg-transparent placeholder-stone-400 focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-stone-400 hover:text-stone-600 p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Icons & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Internship Tech Suite Quick Link */}
            <button
              id="btn-internship-tab"
              onClick={() => setActiveTab('internship-project')}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                activeTab === 'internship-project'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Internship Task</span>
            </button>

            {/* Admin Dashboard button if Admin */}
            {currentUser.role === 'ADMIN' && (
              <button
                id="btn-admin-tab"
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-purple-800 text-white border-purple-800 shadow-xs'
                    : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Admin Panel</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              id="btn-navbar-wishlist"
              onClick={() => setActiveTab('wishlist')}
              className={`relative p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors ${
                activeTab === 'wishlist' ? 'text-amber-700 bg-stone-100' : ''
              }`}
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              id="btn-navbar-cart"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium px-3 py-2 rounded-xl transition-all shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline font-semibold">Cart</span>
              {totalCartItems > 0 ? (
                <span className="bg-amber-500 text-stone-950 text-[11px] font-black px-1.5 py-0.2 rounded-full">
                  {totalCartItems}
                </span>
              ) : null}
            </button>

            {/* User Profile / Auth */}
            <div className="relative">
              <button
                id="btn-user-menu"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 border border-stone-200 transition-colors"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.firstName}
                  className="w-7 h-7 rounded-lg object-cover border border-stone-300"
                />
                <span className="hidden xl:inline text-xs font-medium text-stone-800">
                  {currentUser.firstName}
                </span>
              </button>

              {showUserDropdown && (
                <div
                  id="user-dropdown-menu"
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-900">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400">Role:</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          currentUser.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      id="menu-orders-btn"
                      onClick={() => {
                        setActiveTab('orders');
                        setShowUserDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
                      <span>My Orders & Live Tracking</span>
                    </button>
                    <button
                      id="menu-reading-list-btn"
                      onClick={() => {
                        setActiveTab('reading-list');
                        setShowUserDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <BookMarked className="w-3.5 h-3.5 text-stone-400" />
                      <span>Reading Shelf ({activeReadsCount} active)</span>
                    </button>
                    <button
                      id="menu-wishlist-btn"
                      onClick={() => {
                        setActiveTab('wishlist');
                        setShowUserDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <Heart className="w-3.5 h-3.5 text-stone-400" />
                      <span>Wishlist ({wishlistCount})</span>
                    </button>
                    {currentUser.role === 'ADMIN' && (
                      <button
                        id="menu-admin-btn"
                        onClick={() => {
                          setActiveTab('admin');
                          setShowUserDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-purple-500" />
                        <span>Admin Inventory & Orders</span>
                      </button>
                    )}
                  </div>

                  <div className="border-t border-stone-100 pt-1">
                    <button
                      id="menu-switch-role-btn"
                      onClick={() => {
                        switchUserRole(currentUser.role === 'ADMIN' ? 'USER' : 'ADMIN');
                        setShowUserDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-medium"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Switch to {currentUser.role === 'ADMIN' ? 'Customer Account' : 'Admin Account'}</span>
                    </button>
                    <button
                      id="menu-auth-modal-btn"
                      onClick={() => {
                        setIsAuthOpen(true);
                        setShowUserDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-stone-600 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Login with Different Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Navigation Row */}
        <nav className="flex items-center justify-between overflow-x-auto py-2 border-t border-stone-100 no-scrollbar text-xs">
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {navLinks.map((tab) => (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'catalog') {
                    setSelectedCategoryId(null);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                      activeTab === tab.id ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-stone-500 text-[11px]">
            <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Promo: <strong>DASINTERN15</strong> (15% OFF)
            </span>
            <span>·</span>
            <span>Free delivery on orders &gt; ₹499</span>
          </div>
        </nav>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 pb-2.5 pt-1 border-t border-stone-100 bg-stone-50">
        <div className="relative flex items-center bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search books, authors, ISBN..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'catalog') setActiveTab('catalog');
            }}
            className="w-full pl-9 pr-8 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
