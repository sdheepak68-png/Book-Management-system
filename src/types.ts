export type Role = 'USER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  bookCount?: number;
}

export interface Author {
  id: number;
  name: string;
  biography: string;
  birthYear?: number;
  nationality?: string;
  photoUrl: string;
  notableWorks?: string[];
}

export type BookFormat = 'Hardcover' | 'Paperback' | 'E-Book' | 'Audiobook';

export interface Book {
  id: number;
  title: string;
  isbn: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  authorId: number;
  authorName?: string;
  categoryId: number;
  categoryName?: string;
  publicationYear: number;
  publisher: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  pageCount: number;
  language: string;
  format: BookFormat;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  featured?: boolean;
  tags?: string[];
}

export interface CartItem {
  id: number;
  userId: number;
  bookId: number;
  book: Book;
  quantity: number;
  addedAt: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  orderId: number;
  bookId: number;
  title: string;
  authorName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface OrderTimelineItem {
  status: OrderStatus;
  label: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  userName: string;
  userEmail: string;
  orderDate: string;
  totalAmount: number;
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  promoCode?: string;
  status: OrderStatus;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: 'CREDIT_CARD' | 'UPI' | 'NET_BANKING' | 'COD';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  trackingNumber?: string;
  items: OrderItem[];
  timeline: OrderTimelineItem[];
}

export interface WishlistItem {
  id: number;
  userId: number;
  bookId: number;
  book: Book;
  addedAt: string;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  bookId: number;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  helpfulCount: number;
}

export type ReadingStatus = 'WANT_TO_READ' | 'CURRENTLY_READING' | 'COMPLETED';

export interface ReadingListItem {
  id: number;
  userId: number;
  bookId: number;
  book: Book;
  status: ReadingStatus;
  currentPage: number;
  notes?: string;
  rating?: number;
  updatedAt: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minSpend: number;
  description: string;
  active: boolean;
}

export type ActiveTab = 'catalog' | 'bestsellers' | 'new-arrivals' | 'authors' | 'reading-list' | 'orders' | 'wishlist' | 'admin' | 'internship-project';
