import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Package,
  Printer,
  RefreshCw,
  Search,
  Truck,
  X,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { formatINR } from '../utils/currency';
import { BookCover } from './BookCover';

export const OrdersView: React.FC = () => {
  const { orders, currentUser, updateOrderStatus, cancelOrder, addToCart, selectedOrderForDetail, setSelectedOrderForDetail, setActiveTab, showToast } =
    useStore();

  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [showInvoiceModal, setShowInvoiceModal] = useState<Order | null>(null);

  // Filter orders for current user or admin
  const userOrders = currentUser.role === 'ADMIN' ? orders : orders.filter((o) => o.userId === currentUser.id);

  const filteredOrders = userOrders.filter((order) => {
    if (statusFilter === 'ALL') return true;
    return order.status === statusFilter;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-[11px] font-bold">Pending Approval</span>;
      case 'PROCESSING':
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full text-[11px] font-bold">Processing in Warehouse</span>;
      case 'SHIPPED':
        return <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full text-[11px] font-bold">In Transit</span>;
      case 'DELIVERED':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-bold">Delivered</span>;
      case 'CANCELLED':
        return <span className="bg-stone-100 text-stone-600 border border-stone-300 px-2 py-0.5 rounded-full text-[11px] font-bold">Cancelled</span>;
    }
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      // Find full book object or mock structure
      addToCart(
        {
          id: item.bookId,
          title: item.title,
          isbn: '978-0000000000',
          description: '',
          price: item.price,
          stock: 10,
          authorId: 1,
          authorName: item.authorName,
          categoryId: 1,
          publicationYear: 2024,
          publisher: 'Publisher',
          imageUrl: item.imageUrl,
          rating: 4.8,
          reviewCount: 10,
          pageCount: 300,
          language: 'English',
          format: 'Paperback',
        },
        item.quantity
      );
    });
    showToast('Items added back to your cart!', 'success');
  };

  return (
    <div id="orders-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-900">My Orders & Live Tracking</h1>
            {currentUser.role === 'ADMIN' && (
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded-md">
                Admin Mode: All Customer Orders
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time fulfillment tracking powered by Spring Boot Order Controller.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {(['ALL', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-medium border transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {st === 'ALL' ? 'All Orders' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-stone-50 rounded-3xl border border-stone-200 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-stone-400 mx-auto shadow-xs">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-800">No orders found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You have not placed any orders matching this filter yet.
          </p>
          <button
            onClick={() => setActiveTab('catalog')}
            className="bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              id={`order-card-${order.id}`}
              className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden transition-all hover:border-stone-300"
            >
              {/* Order Meta Top Bar */}
              <div className="p-4 sm:p-5 bg-stone-50/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Order Placed</span>
                    <span className="font-semibold text-stone-800">
                      {new Date(order.orderDate).toLocaleDateString([], { dateStyle: 'medium' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Amount</span>
                    <span className="font-black text-stone-900 text-sm">{formatINR(order.totalAmount)}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Ship To</span>
                    <span className="font-semibold text-stone-800">{order.shippingAddress.fullName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-bold">Order ID</span>
                    <span className="font-mono font-bold text-amber-900">{order.orderNumber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                  <button
                    onClick={() => setShowInvoiceModal(order)}
                    className="flex items-center gap-1 bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium px-2.5 py-1 rounded-lg border border-stone-200 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Invoice</span>
                  </button>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-5 sm:p-6 space-y-6">
                {/* Live Delivery Timeline */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-amber-700" />
                      Live Consignment Tracking: <strong className="font-mono text-amber-900">{order.trackingNumber}</strong>
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Carrier: <strong>Data Alcott Express Logistics</strong>
                    </span>
                  </div>

                  {/* Visual Steps */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                    {order.timeline.map((step, idx) => (
                      <div key={idx} className="flex flex-col relative">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              step.completed
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <span
                            className={`text-xs font-bold ${
                              step.completed ? 'text-stone-900' : 'text-stone-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 leading-snug">{step.description}</p>
                        <span className="text-[10px] text-stone-400 mt-1 font-mono">{step.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items in Order */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Ordered Books</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-3 rounded-2xl border border-stone-200 bg-white"
                      >
                        <div className="w-14 h-20 rounded-lg overflow-hidden shadow-xs shrink-0">
                          <BookCover book={item} size="sm" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h5 className="text-xs font-bold text-stone-900 line-clamp-1">{item.title}</h5>
                            <p className="text-[10px] text-stone-500 line-clamp-1">by {item.authorName}</p>
                          </div>
                          <div className="flex items-center justify-between text-xs pt-2">
                            <span className="text-stone-500 font-medium">Qty: {item.quantity}</span>
                            <span className="font-extrabold text-stone-900">{formatINR(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100 text-xs">
                  <div className="text-stone-500">
                    Payment Method: <strong className="text-stone-800">{order.paymentMethod.replace('_', ' ')}</strong> ·{' '}
                    Status: <span className="text-emerald-700 font-bold">{order.paymentStatus}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                    <button
                      onClick={() => handleReorder(order)}
                      className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Buy Again</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div
          id="invoice-modal-backdrop"
          onClick={() => setShowInvoiceModal(null)}
          className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            id="invoice-modal-container"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-xl p-6 sm:p-8 space-y-6"
          >
            <div className="flex justify-between items-start border-b border-stone-200 pb-4">
              <div>
                <h3 className="text-xl font-black text-stone-900">DATA ALCOTT BOOKSTORE</h3>
                <p className="text-xs text-stone-500">Tax Invoice & Order Receipt</p>
                <p className="text-[11px] text-stone-400">GSTIN: 33AABCD1234E1Z5 · Chennai, India</p>
              </div>
              <button
                onClick={() => setShowInvoiceModal(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block font-bold">Billed To:</span>
                <p className="font-bold text-stone-900">{showInvoiceModal.shippingAddress.fullName}</p>
                <p className="text-stone-600">{showInvoiceModal.shippingAddress.street}</p>
                <p className="text-stone-600">
                  {showInvoiceModal.shippingAddress.city}, {showInvoiceModal.shippingAddress.state}{' '}
                  {showInvoiceModal.shippingAddress.zipCode}
                </p>
                <p className="text-stone-600">{showInvoiceModal.shippingAddress.phone}</p>
              </div>
              <div>
                <span className="text-stone-400 block font-bold">Invoice Details:</span>
                <p className="text-stone-800">
                  Invoice #: <strong>INV-{showInvoiceModal.orderNumber}</strong>
                </p>
                <p className="text-stone-800">Date: {new Date(showInvoiceModal.orderDate).toLocaleDateString()}</p>
                <p className="text-stone-800">Payment: {showInvoiceModal.paymentMethod}</p>
                <p className="text-stone-800 font-mono">Tracking: {showInvoiceModal.trackingNumber}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-2.5">Book Title</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Price</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {showInvoiceModal.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2.5 font-medium text-stone-900">{item.title}</td>
                      <td className="p-2.5 text-center text-stone-600">{item.quantity}</td>
                      <td className="p-2.5 text-right text-stone-600">{formatINR(item.price)}</td>
                      <td className="p-2.5 text-right font-bold text-stone-900">
                        {formatINR(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="space-y-1 text-xs text-stone-600 text-right">
              <div>Subtotal: {formatINR(showInvoiceModal.subtotal)}</div>
              {showInvoiceModal.discount > 0 && (
                <div className="text-emerald-700">Discount: -{formatINR(showInvoiceModal.discount)}</div>
              )}
              <div>GST (5%): {formatINR(showInvoiceModal.tax)}</div>
              <div>Shipping: {showInvoiceModal.shippingFee === 0 ? 'FREE' : formatINR(showInvoiceModal.shippingFee)}</div>
              <div className="text-base font-black text-stone-900 pt-2 border-t border-stone-200">
                Total Paid: {formatINR(showInvoiceModal.totalAmount)}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-5 py-2.5 rounded-xl text-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
