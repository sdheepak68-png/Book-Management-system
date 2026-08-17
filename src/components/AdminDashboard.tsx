import {
  AlertTriangle,
  BookOpen,
  Check,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Layers,
  LayoutDashboard,
  Package,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  TrendingUp,
  Truck,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Book, BookFormat, Category, Order, OrderStatus } from '../types';
import { formatINR } from '../utils/currency';
import { BookCover } from './BookCover';

export const AdminDashboard: React.FC = () => {
  const {
    books,
    orders,
    users,
    categories,
    authors,
    promoCodes,
    addBook,
    updateBook,
    deleteBook,
    restockBook,
    updateOrderStatus,
    addCategory,
    addAuthor,
    setSelectedBook,
    showToast,
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'inventory' | 'orders' | 'categories' | 'promos'>('inventory');
  const [adminSearch, setAdminSearch] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Modals
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddAuthorOpen, setIsAddAuthorOpen] = useState(false);

  // Book Form State
  const [formTitle, setFormTitle] = useState('');
  const [formIsbn, setFormIsbn] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('499');
  const [formOriginalPrice, setFormOriginalPrice] = useState('799');
  const [formStock, setFormStock] = useState('20');
  const [formAuthorId, setFormAuthorId] = useState<number>(authors[0]?.id || 1);
  const [formCategoryId, setFormCategoryId] = useState<number>(categories[0]?.id || 1);
  const [formYear, setFormYear] = useState('2024');
  const [formPublisher, setFormPublisher] = useState('Prentice Hall');
  const [formImageUrl, setFormImageUrl] = useState(
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
  );
  const [formPageCount, setFormPageCount] = useState('350');
  const [formFormat, setFormFormat] = useState<BookFormat>('Paperback');
  const [formIsBestseller, setFormIsBestseller] = useState(false);
  const [formIsNewArrival, setFormIsNewArrival] = useState(true);

  // Category form state
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Author form state
  const [authorName, setAuthorName] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [authorYear, setAuthorYear] = useState('1980');
  const [authorNation, setAuthorNation] = useState('American');
  const [authorPhoto, setAuthorPhoto] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  );

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'CANCELLED' ? sum + o.totalAmount : sum), 0);
  const totalBooksInStock = books.reduce((sum, b) => sum + b.stock, 0);
  const lowStockBooks = books.filter((b) => b.stock <= 5);

  const filteredBooks = books.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      b.isbn.toLowerCase().includes(adminSearch.toLowerCase()) ||
      (b.authorName && b.authorName.toLowerCase().includes(adminSearch.toLowerCase()));
    if (filterLowStockOnly) {
      return matchSearch && b.stock <= 5;
    }
    return matchSearch;
  });

  const handleOpenAddBook = () => {
    setEditingBook(null);
    setFormTitle('');
    setFormIsbn('978-013' + Math.floor(100000 + Math.random() * 900000));
    setFormDescription('');
    setFormPrice('499');
    setFormOriginalPrice('799');
    setFormStock('25');
    setFormAuthorId(authors[0]?.id || 1);
    setFormCategoryId(categories[0]?.id || 1);
    setFormYear('2024');
    setFormPublisher('O’Reilly Media');
    setFormImageUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80');
    setFormPageCount('380');
    setFormFormat('Paperback');
    setFormIsBestseller(false);
    setFormIsNewArrival(true);
    setIsAddBookModalOpen(true);
  };

  const handleOpenEditBook = (b: Book) => {
    setEditingBook(b);
    setFormTitle(b.title);
    setFormIsbn(b.isbn);
    setFormDescription(b.description);
    setFormPrice(b.price.toString());
    setFormOriginalPrice(b.originalPrice ? b.originalPrice.toString() : '');
    setFormStock(b.stock.toString());
    setFormAuthorId(b.authorId);
    setFormCategoryId(b.categoryId);
    setFormYear(b.publicationYear.toString());
    setFormPublisher(b.publisher);
    setFormImageUrl(b.imageUrl);
    setFormPageCount(b.pageCount.toString());
    setFormFormat(b.format);
    setFormIsBestseller(!!b.isBestseller);
    setFormIsNewArrival(!!b.isNewArrival);
    setIsAddBookModalOpen(true);
  };

  const handleSaveBookForm = (e: React.FormEvent) => {
    e.preventDefault();
    const selAuthor = authors.find((a) => a.id === Number(formAuthorId));
    const selCat = categories.find((c) => c.id === Number(formCategoryId));

    const bookPayload = {
      title: formTitle.trim(),
      isbn: formIsbn.trim(),
      description: formDescription.trim() || 'Comprehensive technical and literary reference.',
      price: parseFloat(formPrice) || 499,
      originalPrice: formOriginalPrice ? parseFloat(formOriginalPrice) : undefined,
      stock: parseInt(formStock, 10) || 0,
      authorId: Number(formAuthorId),
      authorName: selAuthor?.name || 'Author',
      categoryId: Number(formCategoryId),
      categoryName: selCat?.name || 'Category',
      publicationYear: parseInt(formYear, 10) || 2024,
      publisher: formPublisher.trim() || 'Publisher',
      imageUrl: formImageUrl.trim(),
      pageCount: parseInt(formPageCount, 10) || 300,
      language: 'English',
      format: formFormat,
      isBestseller: formIsBestseller,
      isNewArrival: formIsNewArrival,
    };

    if (editingBook) {
      updateBook(editingBook.id, bookPayload);
    } else {
      addBook(bookPayload);
    }

    setIsAddBookModalOpen(false);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    addCategory({
      name: catName.trim(),
      slug: catName.toLowerCase().replace(/\s+/g, '-'),
      description: catDesc.trim() || 'Curated book category collection.',
    });
    setCatName('');
    setCatDesc('');
    setIsAddCategoryOpen(false);
  };

  const handleAddAuthorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) return;
    addAuthor({
      name: authorName.trim(),
      biography: authorBio.trim() || 'Distinguished thought leader and author.',
      birthYear: parseInt(authorYear, 10) || 1980,
      nationality: authorNation.trim() || 'International',
      photoUrl: authorPhoto.trim(),
    });
    setAuthorName('');
    setAuthorBio('');
    setIsAddAuthorOpen(false);
  };

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-800 text-purple-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              Spring Boot Admin Controller
            </span>
            <span className="text-purple-300 text-xs">Role: ADMIN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Bookstore <span className="text-amber-400 font-serif">Management Console</span>
          </h1>
          <p className="text-xs text-purple-200 mt-1 max-w-xl">
            Administer book inventory, review customer orders, restock low supplies, and manage categories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-admin-add-book"
            onClick={handleOpenAddBook}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-purple-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{formatINR(totalRevenue)}</div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Active fulfillment volume</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase">Total Orders</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{orders.length}</div>
          <p className="text-[11px] text-stone-500 mt-1">Processed in Spring Service</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase">Catalog Stock</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{totalBooksInStock} units</div>
          <p className="text-[11px] text-stone-500 mt-1">{books.length} distinct book titles</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{lowStockBooks.length}</div>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">Requires replenishment</p>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        {(
          [
            { id: 'inventory', label: 'Inventory & Books', count: books.length },
            { id: 'orders', label: 'Order Processing', count: orders.length },
            { id: 'categories', label: 'Categories & Authors', count: categories.length + authors.length },
            { id: 'promos', label: 'Promo Vouchers', count: promoCodes.length },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeAdminTab === tab.id
                ? 'bg-purple-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeAdminTab === tab.id ? 'bg-amber-400 text-purple-950 font-black' : 'bg-stone-300 text-stone-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: Book Inventory CRUD */}
      {activeAdminTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search catalog by title, ISBN, or author..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-stone-700 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterLowStockOnly}
                  onChange={(e) => setFilterLowStockOnly(e.target.checked)}
                  className="rounded border-stone-300 text-purple-600 accent-purple-600"
                />
                <span>Show Low Stock Only (≤ 5 units)</span>
              </label>

              <button
                onClick={handleOpenAddBook}
                className="bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
              >
                + Add Title
              </button>
            </div>
          </div>

          {/* Books Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100/90 text-stone-700 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Book Title & Cover</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Author</th>
                    <th className="p-3.5 text-right">Price</th>
                    <th className="p-3.5 text-center">Stock</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredBooks.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 rounded-md overflow-hidden shadow-2xs shrink-0">
                            <BookCover book={b} size="sm" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-stone-900 line-clamp-1">{b.title}</h4>
                            <span className="font-mono text-[10px] text-stone-400 block">{b.isbn}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 text-stone-600 font-medium">{b.categoryName}</td>

                      <td className="p-3.5 text-stone-600">{b.authorName}</td>

                      <td className="p-3.5 text-right font-bold text-stone-900">{formatINR(b.price)}</td>

                      <td className="p-3.5 text-center">
                        <span
                          className={`font-black px-2 py-0.5 rounded-full text-[11px] ${
                            b.stock <= 0
                              ? 'bg-rose-100 text-rose-800'
                              : b.stock <= 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {b.stock} units
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        {b.stock <= 0 ? (
                          <span className="text-rose-600 font-bold">Out of Stock</span>
                        ) : b.stock <= 5 ? (
                          <span className="text-amber-700 font-bold">Low Inventory</span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">Available</span>
                        )}
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => restockBook(b.id, 10)}
                            className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Restock +10 units"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditBook(b)}
                            className="p-1.5 text-stone-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit book details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedBook(b)}
                            className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="View Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteBook(b.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete book"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Order Fulfillment Manager */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100/90 text-stone-700 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Order ID & Date</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Items</th>
                    <th className="p-3.5 text-right">Total</th>
                    <th className="p-3.5 text-center">Fulfillment Status</th>
                    <th className="p-3.5 text-right">Update Lifecycle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-amber-900 block">{o.orderNumber}</span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(o.orderDate).toLocaleDateString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-stone-900 block">{o.userName}</span>
                        <span className="text-[10px] text-stone-500">{o.userEmail}</span>
                      </td>

                      <td className="p-3.5 text-stone-600">
                        {o.items.map((it) => (
                          <div key={it.id} className="truncate max-w-xs">
                            {it.quantity}x {it.title}
                          </div>
                        ))}
                      </td>

                      <td className="p-3.5 text-right font-black text-stone-900">{formatINR(o.totalAmount)}</td>

                      <td className="p-3.5 text-center">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            o.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.status === 'SHIPPED'
                              ? 'bg-purple-100 text-purple-800'
                              : o.status === 'PROCESSING'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="bg-stone-100 border border-stone-300 text-stone-800 text-xs font-semibold py-1 px-2 rounded-lg focus:outline-hidden"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Categories & Authors */}
      {activeAdminTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories Manager */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Categories ({categories.length})</h3>
              <button
                onClick={() => setIsAddCategoryOpen(true)}
                className="bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl"
              >
                + Add Category
              </button>
            </div>

            <div className="space-y-2">
              {categories.map((c) => (
                <div key={c.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-stone-900">{c.name}</span>
                    <p className="text-[10px] text-stone-500 line-clamp-1">{c.description}</p>
                  </div>
                  <span className="font-mono text-[10px] text-stone-400">{c.slug}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Authors Manager */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Authors ({authors.length})</h3>
              <button
                onClick={() => setIsAddAuthorOpen(true)}
                className="bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl"
              >
                + Add Author
              </button>
            </div>

            <div className="space-y-2">
              {authors.map((a) => (
                <div key={a.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3 text-xs">
                  <img src={a.photoUrl} alt={a.name} className="w-8 h-8 rounded-full object-cover border" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-stone-900 block truncate">{a.name}</span>
                    <p className="text-[10px] text-stone-500">{a.nationality} · {a.birthYear}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Promo Vouchers */}
      {activeAdminTab === 'promos' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-stone-900">Configured Promotion Vouchers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {promoCodes.map((p) => (
              <div key={p.code} className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-amber-900 text-sm">{p.code}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {p.discountPercent}% OFF
                  </span>
                </div>
                <p className="text-xs text-stone-600">{p.description}</p>
                <div className="text-[10px] text-stone-400 pt-1 border-t border-amber-200/60">
                  Min Spend: {formatINR(p.minSpend)} · Max Discount: {p.maxDiscount ? formatINR(p.maxDiscount) : 'Unlimited'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Book Modal */}
      {isAddBookModalOpen && (
        <div
          id="admin-book-modal-backdrop"
          onClick={() => setIsAddBookModalOpen(false)}
          className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            id="admin-book-modal-container"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">
                {editingBook ? `Edit: ${editingBook.title}` : 'Add New Book to Inventory'}
              </h3>
              <button onClick={() => setIsAddBookModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBookForm} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Book Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">ISBN-13 Code</label>
                  <input
                    type="text"
                    value={formIsbn}
                    onChange={(e) => setFormIsbn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Publisher</label>
                  <input
                    type="text"
                    value={formPublisher}
                    onChange={(e) => setFormPublisher(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Author</label>
                  <select
                    value={formAuthorId}
                    onChange={(e) => setFormAuthorId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    {authors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Retail Price (₹)</label>
                  <input
                    type="number"
                    step="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Synopsis & Description</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div className="flex items-center gap-4 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsBestseller}
                      onChange={(e) => setFormIsBestseller(e.target.checked)}
                      className="accent-purple-600"
                    />
                    <span>Mark as Bestseller</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsNewArrival}
                      onChange={(e) => setFormIsNewArrival(e.target.checked)}
                      className="accent-purple-600"
                    />
                    <span>Mark as New Arrival</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold shadow-md"
                >
                  {editingBook ? 'Save Changes' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryOpen && (
        <div
          onClick={() => setIsAddCategoryOpen(false)}
          className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-md p-6 space-y-4"
          >
            <h3 className="text-sm font-bold text-stone-900">Add New Category</h3>
            <form onSubmit={handleAddCategorySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Artificial Intelligence"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-900 text-white font-bold">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Author Modal */}
      {isAddAuthorOpen && (
        <div
          onClick={() => setIsAddAuthorOpen(false)}
          className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-md p-6 space-y-4"
          >
            <h3 className="text-sm font-bold text-stone-900">Add New Author</h3>
            <form onSubmit={handleAddAuthorSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Author Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Martin Fowler"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Birth Year</label>
                  <input
                    type="number"
                    value={authorYear}
                    onChange={(e) => setAuthorYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={authorNation}
                    onChange={(e) => setAuthorNation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={authorPhoto}
                  onChange={(e) => setAuthorPhoto(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Biography</label>
                <textarea
                  rows={2}
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAuthorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-900 text-white font-bold">
                  Save Author
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
