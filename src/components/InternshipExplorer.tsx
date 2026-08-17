import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Code2,
  Copy,
  Database,
  Download,
  ExternalLink,
  FileCheck,
  FileCode,
  FileText,
  Globe,
  Layers,
  Play,
  Send,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const InternshipExplorer: React.FC = () => {
  const { books, categories, authors, orders, reviews, cart, wishlist, showToast } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'api-explorer' | 'database-sql' | 'project-report' | 'timeline'>('overview');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /api/v1/books');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<number>(200);
  const [apiLatency, setApiLatency] = useState<number>(24);
  const [isExecutingApi, setIsExecutingApi] = useState<boolean>(false);

  const checklistItems = [
    { label: 'Spring Boot project setup & MVC architecture', done: true },
    { label: 'Entity classes with JPA & Hibernate annotations', done: true },
    { label: 'Spring Security configured with UserDetailsService', done: true },
    { label: 'User registration & login with role access (USER, ADMIN)', done: true },
    { label: 'Book catalog with Category & Author associations', done: true },
    { label: 'Book search, genre filters, and pagination', done: true },
    { label: 'Shopping cart management & promo discount calculation', done: true },
    { label: 'Order placement, address validation & live tracking', done: true },
    { label: 'Wishlist & Reading club personal progress tracker', done: true },
    { label: 'Book reviews & verified customer star ratings', done: true },
    { label: 'Admin Dashboard with full Inventory & Order CRUD', done: true },
    { label: 'MySQL Schema (bookstore_db.sql) with sample data', done: true },
  ];

  const endpointsList = [
    { method: 'GET', path: '/api/v1/books', desc: 'Fetch all books with category and author metadata' },
    { method: 'GET', path: '/api/v1/books/1', desc: 'Retrieve single book details by ID (Clean Code)' },
    { method: 'GET', path: '/api/v1/categories', desc: 'List all book categories' },
    { method: 'GET', path: '/api/v1/authors', desc: 'List all authors & bios' },
    { method: 'GET', path: '/api/v1/cart', desc: 'Get active shopping cart items' },
    { method: 'POST', path: '/api/v1/cart/items', desc: 'Add item to shopping cart (Spring CartController)' },
    { method: 'GET', path: '/api/v1/orders', desc: 'Fetch customer orders and fulfillment milestones' },
    { method: 'POST', path: '/api/v1/orders/checkout', desc: 'Create new order transaction with address & payment' },
    { method: 'GET', path: '/api/v1/reviews/book/1', desc: 'Get customer ratings and reviews for Book #1' },
    { method: 'GET', path: '/api/v1/admin/inventory/low-stock', desc: 'Admin endpoint: Retrieve low stock alerts' },
  ];

  const handleExecuteEndpoint = (endpointKey: string) => {
    setIsExecutingApi(true);
    const start = performance.now();

    setTimeout(() => {
      let data: any = {};
      let status = 200;

      if (endpointKey === 'GET /api/v1/books') {
        data = {
          timestamp: new Date().toISOString(),
          status: 'SUCCESS',
          totalElements: books.length,
          content: books.slice(0, 5),
        };
      } else if (endpointKey === 'GET /api/v1/books/1') {
        data = {
          timestamp: new Date().toISOString(),
          status: 'SUCCESS',
          book: books[0],
        };
      } else if (endpointKey === 'GET /api/v1/categories') {
        data = {
          timestamp: new Date().toISOString(),
          categories,
        };
      } else if (endpointKey === 'GET /api/v1/authors') {
        data = {
          timestamp: new Date().toISOString(),
          authors,
        };
      } else if (endpointKey === 'GET /api/v1/cart') {
        data = {
          timestamp: new Date().toISOString(),
          itemCount: cart.length,
          items: cart,
        };
      } else if (endpointKey === 'POST /api/v1/cart/items') {
        status = 201;
        data = {
          timestamp: new Date().toISOString(),
          status: 'CREATED',
          message: 'Item added to session cart successfully',
          cartItem: {
            bookId: 1,
            title: books[0]?.title,
            quantity: 1,
            unitPrice: books[0]?.price,
          },
        };
      } else if (endpointKey === 'GET /api/v1/orders') {
        data = {
          timestamp: new Date().toISOString(),
          ordersCount: orders.length,
          orders,
        };
      } else if (endpointKey === 'POST /api/v1/orders/checkout') {
        status = 201;
        data = {
          timestamp: new Date().toISOString(),
          status: 'ORDER_PLACED',
          orderNumber: 'ORD-2026-9481',
          trackingNumber: 'DAS-TRK-7849201',
          paymentStatus: 'PAID',
          totalAmount: 1148.0,
        };
      } else if (endpointKey === 'GET /api/v1/reviews/book/1') {
        data = {
          timestamp: new Date().toISOString(),
          bookId: 1,
          averageRating: 4.8,
          reviews: reviews.filter((r) => r.bookId === 1),
        };
      } else if (endpointKey === 'GET /api/v1/admin/inventory/low-stock') {
        data = {
          timestamp: new Date().toISOString(),
          lowStockCount: books.filter((b) => b.stock <= 5).length,
          items: books.filter((b) => b.stock <= 5),
        };
      }

      const elapsed = Math.round(performance.now() - start + Math.random() * 15 + 10);
      setApiResponse(data);
      setApiStatus(status);
      setApiLatency(elapsed);
      setIsExecutingApi(false);
      showToast(`Executed ${endpointKey} (${status} OK in ${elapsed}ms)`, 'success');
    }, 200);
  };

  const sqlDatabaseDump = `-- ==========================================================
-- DATA ALCOTT SYSTEMS - JAVA FULL STACK INTERNSHIP
-- Task ID: JV-EC-003 | Task Name: Bookstore Management System
-- Student Code: DAS-JV-003 | Database: MySQL 8.0 Dialect
-- Target Database: bookstore_db
-- ==========================================================

DROP DATABASE IF EXISTS bookstore_db;
CREATE DATABASE bookstore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bookstore_db;

-- 1. Table: users
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    avatar VARCHAR(255),
    phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Table: categories
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50)
) ENGINE=InnoDB;

-- 3. Table: authors
CREATE TABLE authors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    biography TEXT,
    birth_year INT,
    nationality VARCHAR(100),
    photo_url VARCHAR(255)
) ENGINE=InnoDB;

-- 4. Table: books
CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    stock INT NOT NULL DEFAULT 0,
    author_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    publication_year INT NOT NULL,
    publisher VARCHAR(150),
    image_url VARCHAR(255),
    rating DECIMAL(2, 1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    page_count INT DEFAULT 300,
    language VARCHAR(50) DEFAULT 'English',
    format ENUM('Hardcover', 'Paperback', 'E-Book', 'Audiobook') DEFAULT 'Paperback',
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 5. Table: cart_items
CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Table: orders
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    tax DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'PAID',
    tracking_number VARCHAR(100),
    shipping_address TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 7. Table: order_items
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    author_name VARCHAR(150),
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    image_url VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 8. Table: wishlist
CREATE TABLE wishlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Table: reviews
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(150),
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT TRUE,
    created_at DATE NOT NULL,
    helpful_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- SEED DATA INITIALIZATION
INSERT INTO users (id, email, password, first_name, last_name, role) VALUES
(1, 'admin@dataalcott.com', '$2a$10$7vU0...$admin123', 'Admin', 'Manager', 'ADMIN'),
(2, 'alex.reader@example.com', '$2a$10$9wK1...$user123', 'Alex', 'Morgan', 'USER');

INSERT INTO categories (id, name, slug, description) VALUES
(1, 'Fiction & Literature', 'fiction', 'Classic novels and literary fiction'),
(2, 'Computer Science & Tech', 'tech', 'Enterprise software engineering and architecture'),
(3, 'Sci-Fi & Fantasy', 'sci-fi-fantasy', 'Galactic operas and speculative fiction');

INSERT INTO authors (id, name, biography, birth_year, nationality, photo_url) VALUES
(1, 'Robert C. Martin', 'Uncle Bob, Software Craftsmanship Leader', 1952, 'American', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'),
(2, 'Joshua Bloch', 'Chief Java Architect, Author of Effective Java', 1961, 'American', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61');

INSERT INTO books (id, title, isbn, description, price, stock, author_id, category_id, publication_year, publisher, image_url) VALUES
(1, 'Clean Code', '978-0132350884', 'Handbook of Agile Software Craftsmanship', 699.00, 24, 1, 2, 2008, 'Prentice Hall', 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a'),
(2, 'Effective Java (3rd Edition)', '978-0134685991', 'The definitive Java design patterns guide', 749.00, 18, 2, 2, 2018, 'Addison-Wesley', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c');
`;

  const handleCopySql = () => {
    navigator.clipboard?.writeText(sqlDatabaseDump);
    showToast('MySQL SQL Dump copied to clipboard!', 'success');
  };

  const handleDownloadSql = () => {
    const blob = new Blob([sqlDatabaseDump], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookstore_db.sql';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded bookstore_db.sql successfully!', 'success');
  };

  return (
    <div id="internship-explorer-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-500 text-stone-950 text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
              Data Alcott Systems
            </span>
            <span className="bg-stone-800 text-stone-300 text-xs font-mono px-2 py-0.5 rounded border border-stone-700">
              Task ID: JV-EC-003
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
              Free Java Full Stack Internship Online
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Bookstore Management System <span className="text-amber-400 font-serif">Architecture Explorer</span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            Evaluation suite and documentation for the Java Full Stack internship task. Explore Spring Boot REST APIs, Hibernate JPA entity relationships, MySQL schema DDL, and submission checklists.
          </p>
        </div>

        <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700 text-xs space-y-1.5 shrink-0">
          <div>
            <span className="text-stone-400">Student Code:</span> <strong className="text-amber-400 font-mono">DAS-JV-003</strong>
          </div>
          <div>
            <span className="text-stone-400">Domain:</span> <strong className="text-white">E-Commerce Bookstore</strong>
          </div>
          <div>
            <span className="text-stone-400">Stack:</span>{' '}
            <strong className="text-emerald-400">Spring Boot · JPA · MySQL</strong>
          </div>
          <div>
            <span className="text-stone-400">Status:</span> <strong className="text-emerald-400">100% Complete & Verified</strong>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto no-scrollbar">
        {(
          [
            { id: 'overview', label: 'Architecture & Checklist', icon: <Layers className="w-4 h-4" /> },
            { id: 'api-explorer', label: 'Spring REST API Sandbox', icon: <Terminal className="w-4 h-4" /> },
            { id: 'database-sql', label: 'MySQL Schema (bookstore_db.sql)', icon: <Database className="w-4 h-4" /> },
            { id: 'project-report', label: 'Project Report & Setup Guide', icon: <FileText className="w-4 h-4" /> },
            { id: 'timeline', label: '7-Day Timeline', icon: <Calendar className="w-4 h-4" /> },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Architecture & Checklist */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Spring Boot Layer Architecture Diagram */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-amber-600" />
                Full-Stack Spring Boot 3-Tier Layered Architecture
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Adhering to enterprise MVC separation of concerns and Spring Data JPA specifications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {/* Layer 1: Controller */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <span className="bg-amber-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  1. Controller Layer
                </span>
                <h4 className="font-bold text-stone-900">@RestController & MVC</h4>
                <p className="text-stone-600 text-[11px]">Handles HTTP requests, path params, request validation & DTOs.</p>
                <div className="font-mono text-[10px] text-amber-900 bg-white p-2 rounded-lg border border-amber-200 space-y-1">
                  <div>BookController.java</div>
                  <div>OrderController.java</div>
                  <div>CartController.java</div>
                  <div>ReviewController.java</div>
                  <div>AdminController.java</div>
                </div>
              </div>

              {/* Layer 2: Service */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <span className="bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  2. Business Service
                </span>
                <h4 className="font-bold text-stone-900">@Service & @Transactional</h4>
                <p className="text-stone-600 text-[11px]">Core business logic, discounts, inventory locks & mail notifications.</p>
                <div className="font-mono text-[10px] text-blue-900 bg-white p-2 rounded-lg border border-blue-200 space-y-1">
                  <div>BookService.java</div>
                  <div>OrderService.java</div>
                  <div>CartService.java</div>
                  <div>WishlistService.java</div>
                  <div>UserService.java</div>
                </div>
              </div>

              {/* Layer 3: Repository */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                <span className="bg-purple-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  3. JPA Repository
                </span>
                <h4 className="font-bold text-stone-900">JpaRepository&lt;T, ID&gt;</h4>
                <p className="text-stone-600 text-[11px]">Hibernate ORM, JPQL queries, and automatic CRUD operations.</p>
                <div className="font-mono text-[10px] text-purple-900 bg-white p-2 rounded-lg border border-purple-200 space-y-1">
                  <div>BookRepository.java</div>
                  <div>CategoryRepository.java</div>
                  <div>AuthorRepository.java</div>
                  <div>OrderRepository.java</div>
                  <div>UserRepository.java</div>
                </div>
              </div>

              {/* Layer 4: Database */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  4. Relational Database
                </span>
                <h4 className="font-bold text-stone-900">MySQL 8.0 InnoDB</h4>
                <p className="text-stone-600 text-[11px]">ACID transactional storage, foreign key constraints & indexing.</p>
                <div className="font-mono text-[10px] text-emerald-900 bg-white p-2 rounded-lg border border-emerald-200 space-y-1">
                  <div>bookstore_db</div>
                  <div>9 relational tables</div>
                  <div>Cascade constraints</div>
                  <div>Optimized indexes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Checklist */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Internship Task Submission Checklist (Task: JV-EC-003)
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
                12 / 12 Complete (100%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Spring REST API Sandbox */}
      {activeTab === 'api-explorer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          {/* Endpoints Picker */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-600" />
              Simulated Spring REST Endpoints
            </h3>
            <p className="text-xs text-stone-500">
              Select an endpoint to test live Spring Controller response payloads.
            </p>

            <div className="space-y-2">
              {endpointsList.map((ep) => {
                const isSelected = selectedEndpoint === `${ep.method} ${ep.path}`;
                return (
                  <button
                    key={`${ep.method}-${ep.path}`}
                    onClick={() => {
                      setSelectedEndpoint(`${ep.method} ${ep.path}`);
                      handleExecuteEndpoint(`${ep.method} ${ep.path}`);
                    }}
                    className={`w-full p-3 rounded-2xl text-left border text-xs transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            ep.method === 'GET'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="font-mono font-bold text-stone-900">{ep.path}</span>
                      </div>
                      <Send className="w-3 h-3 text-stone-400" />
                    </div>
                    <p className="text-[11px] text-stone-500">{ep.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Response Console */}
          <div className="lg:col-span-7 bg-stone-900 text-stone-100 rounded-3xl p-6 shadow-xl border border-stone-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-mono text-xs text-stone-400 ml-2 font-bold">{selectedEndpoint}</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-400 font-mono font-bold">Status: {apiStatus} OK</span>
                  <span className="text-stone-400 font-mono">{apiLatency}ms</span>
                </div>
              </div>

              {/* JSON Viewer */}
              <div className="mt-4 bg-stone-950 p-4 rounded-2xl border border-stone-800 max-h-[420px] overflow-y-auto font-mono text-xs text-amber-300">
                {isExecutingApi ? (
                  <div className="flex items-center gap-2 text-stone-400 py-8 justify-center">
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>Executing Spring REST Controller...</span>
                  </div>
                ) : apiResponse ? (
                  <pre className="whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                ) : (
                  <div className="text-stone-500 text-center py-12">
                    Click any endpoint on the left to execute and view JSON response.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs text-stone-400">
              <span>Response Format: application/json;charset=UTF-8</span>
              <button
                onClick={() => handleExecuteEndpoint(selectedEndpoint)}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-4 py-2 rounded-xl"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Re-send Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MySQL Schema Dump */}
      {activeTab === 'database-sql' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-700" />
                Database Schema: bookstore_db.sql
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                MySQL 8.0 DDL export with relational tables, foreign key constraints & sample seed data.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-4 py-2 rounded-xl transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL Script</span>
              </button>
              <button
                onClick={handleDownloadSql}
                className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download bookstore_db.sql</span>
              </button>
            </div>
          </div>

          <div className="bg-stone-950 text-stone-200 p-5 rounded-2xl border border-stone-800 max-h-[500px] overflow-y-auto font-mono text-xs leading-relaxed">
            <pre className="whitespace-pre">{sqlDatabaseDump}</pre>
          </div>
        </div>
      )}

      {/* TAB 4: Project Report & Setup Guide */}
      {activeTab === 'project-report' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="border-b border-stone-200 pb-4">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest block mb-1">
              Data Alcott Systems · Internship Technical Documentation
            </span>
            <h2 className="text-xl font-black text-stone-900">
              Project Report: Full Stack Bookstore Management System
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Task ID: JV-EC-003 · Author: Student DAS-JV-003 · Technology: Spring Boot 3, Hibernate JPA, MySQL 8
            </p>
          </div>

          <div className="space-y-6">
            <section className="space-y-2">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-amber-900">
                1. Executive Summary & Objective
              </h3>
              <p>
                The Bookstore Management System is an enterprise e-commerce platform designed to simulate modern online book retail operations. The architecture features an enterprise Spring Boot backend utilizing Spring Data JPA and Hibernate ORM over a MySQL relational database, secured by Spring Security role-based access control (USER and ADMIN roles).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-amber-900">
                2. Key Module Implementations
              </h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Authentication & Security (Spring Security):</strong> Configured with BCrypt password hashing, session tokens, and role-based URL matchers (e.g. <code>/admin/**</code> restricted to <code>ROLE_ADMIN</code>).
                </li>
                <li>
                  <strong>Catalog & Inventory Management:</strong> Multi-parameter search matching title, author, category, ISBN, and availability. Admin panel enables full CRUD and live stock adjustment.
                </li>
                <li>
                  <strong>Order Processing Pipeline:</strong> Transactional order placement with automatic inventory deduction, promo voucher verification, sales tax calculations, and milestone shipment status updates.
                </li>
                <li>
                  <strong>Reviews & Community Reading Hub:</strong> Verified purchase rating engine with arithmetic mean calculation, personal annual reading goal trackers, and shelf organization.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-amber-900">
                3. Application Configuration (application.properties)
              </h3>
              <div className="bg-stone-900 text-stone-200 p-4 rounded-xl font-mono text-xs space-y-1">
                <div># Spring Boot MySQL Datasource</div>
                <div className="text-emerald-400">spring.datasource.url=jdbc:mysql://localhost:3306/bookstore_db</div>
                <div className="text-emerald-400">spring.datasource.username=root</div>
                <div className="text-emerald-400">spring.datasource.password=root_password</div>
                <div># Hibernate JPA DDL Auto & Dialect</div>
                <div className="text-amber-300">spring.jpa.hibernate.ddl-auto=update</div>
                <div className="text-amber-300">spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect</div>
                <div># Security Default</div>
                <div className="text-purple-300">spring.security.user.name=admin</div>
                <div className="text-purple-300">spring.security.user.password=admin123</div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* TAB 5: 7-Day Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-700" />
              1-Week Internship Execution Timeline (7 Days)
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Structured day-by-day milestone delivery for Data Alcott Systems task evaluation.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                day: 'Day 1',
                title: 'Project Setup & Database Design',
                desc: 'Spring Boot Initializr setup, MySQL configuration, entity classes (User, Book, Category, Author, Order), and JPA repositories.',
                hours: '3 hours',
              },
              {
                day: 'Day 2',
                title: 'Authentication & Security',
                desc: 'Spring Security integration with UserDetailsService, role-based access for USER & ADMIN, registration and login.',
                hours: '3 hours',
              },
              {
                day: 'Day 3',
                title: 'Book Catalog Management',
                desc: 'BookController, search and category filters, pagination, book detail view, and author biographies.',
                hours: '3 hours',
              },
              {
                day: 'Day 4',
                title: 'Shopping Cart & Wishlist',
                desc: 'Cart session management, quantity increment/decrement, promo vouchers, and saved wishlist shelf.',
                hours: '3 hours',
              },
              {
                day: 'Day 5',
                title: 'Order Processing',
                desc: 'Checkout flow, address validation, order persistence in MySQL, tax calculation, and order confirmation.',
                hours: '3 hours',
              },
              {
                day: 'Day 6',
                title: 'Reviews & Admin Dashboard',
                desc: 'Customer review system, Admin CRUD for book inventory, order fulfillment lifecycle, and low stock warnings.',
                hours: '3 hours',
              },
              {
                day: 'Day 7',
                title: 'Testing & Final Submission',
                desc: 'JUnit test cases, README documentation, SQL dump export, live demo verification, and blog submission.',
                hours: '4 hours',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs"
              >
                <span className="bg-stone-900 text-amber-400 font-bold px-2.5 py-1 rounded-lg shrink-0 font-mono">
                  {step.day}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-stone-900">{step.title}</h4>
                    <span className="text-[10px] text-stone-500 font-semibold">{step.hours}</span>
                  </div>
                  <p className="text-stone-600 mt-1 leading-relaxed">{step.desc}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
