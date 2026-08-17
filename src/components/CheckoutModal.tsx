import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  CreditCard,
  Lock,
  PackageCheck,
  Phone,
  QrCode,
  ShieldCheck,
  Truck,
  User,
  X,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { formatINR } from '../utils/currency';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    cartTax,
    cartShipping,
    cartTotal,
    appliedPromo,
    currentUser,
    placeOrder,
    setActiveTab,
    setSelectedOrderForDetail,
    showToast,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Payment, 3: Success Confirmation
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Address form
  const [fullName, setFullName] = useState(`${currentUser.firstName} ${currentUser.lastName}`);
  const [street, setStreet] = useState(currentUser.address?.street || '42 Innovation Highway');
  const [city, setCity] = useState(currentUser.address?.city || 'Chennai');
  const [state, setState] = useState(currentUser.address?.state || 'TN');
  const [zipCode, setZipCode] = useState(currentUser.address?.zipCode || '600001');
  const [phone, setPhone] = useState(currentUser.phone || '+91 9600095045');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('890');
  const [upiId, setUpiId] = useState('alex.reader@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !street.trim() || !city.trim() || !zipCode.trim()) {
      showToast('Please fill all required shipping address fields.', 'warning');
      return;
    }
    setStep(2);
  };

  const handleCompleteOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const order = placeOrder({
        shippingAddress: {
          fullName,
          street,
          city,
          state,
          zipCode,
          phone,
        },
        paymentMethod,
      });

      setCreatedOrder(order);
      setIsProcessing(false);
      setStep(3);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d97706', '#059669', '#2563eb', '#f59e0b', '#7c3aed'],
        });
      } catch {
        // Safe fallback if confetti canvas fails
      }

      showToast(`Order #${order.orderNumber} successfully placed!`, 'success');
    }, 1000);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep(1);
    setCreatedOrder(null);
  };

  return (
    <div
      id="checkout-modal-backdrop"
      onClick={handleClose}
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="checkout-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                {step === 3 ? 'Order Confirmed!' : 'Secure Spring Checkout Service'}
              </h2>
              <p className="text-[11px] text-stone-500">256-Bit SSL Encrypted Transaction</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {step !== 3 && (
          <div className="px-6 py-3 bg-stone-100/60 border-b border-stone-200 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step >= 1 ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                1
              </span>
              <span className={step === 1 ? 'text-stone-900 font-bold' : 'text-stone-500'}>Shipping Address</span>
            </div>
            <div className="h-0.5 w-12 bg-stone-200" />
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step >= 2 ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                2
              </span>
              <span className={step === 2 ? 'text-stone-900 font-bold' : 'text-stone-500'}>Payment & Review</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* STEP 1: Shipping Address Form */}
          {step === 1 && (
            <form onSubmit={handleNextToPayment} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-700" />
                  Delivery Destination
                </h3>
                <span className="text-xs text-stone-500">Logged in as {currentUser.email}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Recipient Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    placeholder="House / Flat No, Street, Landmark"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">State / Prov.</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile / Delivery Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Order quick summary teaser */}
              <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                <span className="text-stone-600">
                  Total Items: <strong>{cart.reduce((a, b) => a + b.quantity, 0)} books</strong>
                </span>
                <span className="text-sm font-extrabold text-stone-900">{formatINR(cartTotal)}</span>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-all"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment & Final Review */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-stone-900 mb-2">Select Payment Method</h3>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between h-20 ${
                      paymentMethod === 'CREDIT_CARD'
                        ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/30'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-700" />
                    <span className="font-bold text-stone-900">Card / Visa / MC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between h-20 ${
                      paymentMethod === 'UPI'
                        ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/30'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-amber-700" />
                    <span className="font-bold text-stone-900">UPI / QR Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all flex flex-col justify-between h-20 ${
                      paymentMethod === 'COD'
                        ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/30'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-amber-700" />
                    <span className="font-bold text-stone-900">Cash on Delivery</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Fields */}
              {paymentMethod === 'CREDIT_CARD' && (
                <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl shadow-md space-y-3">
                  <div className="flex justify-between items-center text-xs text-amber-400">
                    <span className="font-mono">SECURE CARD PAYMENT</span>
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 uppercase">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-stone-800/80 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-stone-400 uppercase">Valid Thru</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-stone-800/80 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-400 uppercase">CVV Security Code</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-stone-800/80 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'UPI' && (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                  <label className="block text-xs font-semibold text-stone-700">Enter UPI VPA ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@bank"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[11px] text-stone-500">Google Pay, PhonePe, Paytm, or BHIM.</p>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
                  <p className="font-semibold">Cash On Delivery Selected</p>
                  <p className="text-[11px] text-amber-800 mt-1">
                    Pay with cash or digital UPI when your consignment arrives at your doorstep.
                  </p>
                </div>
              )}

              {/* Price Summary Breakdown */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-stone-900">{formatINR(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Voucher ({appliedPromo?.code})</span>
                    <span className="font-semibold">-{formatINR(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-stone-900">{formatINR(cartTax)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span>{cartShipping === 0 ? <strong className="text-emerald-700">FREE</strong> : formatINR(cartShipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="text-base text-amber-900">{formatINR(cartTotal)}</span>
                </div>
              </div>

              {/* Step Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-semibold px-3 py-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Address</span>
                </button>

                <button
                  type="button"
                  id="btn-confirm-place-order"
                  disabled={isProcessing}
                  onClick={handleCompleteOrder}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing in JPA...</span>
                    </>
                  ) : (
                    <>
                      <PackageCheck className="w-4 h-4" />
                      <span>Place Order ({formatINR(cartTotal)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Placed Successfully */}
          {step === 3 && createdOrder && (
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-black text-stone-900">Thank You for Your Order!</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Your order has been recorded in the Spring Boot Hibernate database.
                </p>
              </div>

              {/* Order Meta Box */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Order Number:</span>
                  <span className="font-mono font-bold text-stone-900">{createdOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Tracking Code:</span>
                  <span className="font-mono font-semibold text-amber-800">{createdOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Total Paid:</span>
                  <span className="font-black text-stone-900">{formatINR(createdOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Delivery Address:</span>
                  <span className="font-medium text-stone-800 text-right">
                    {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.state} ({createdOrder.shippingAddress.zipCode})
                  </span>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    setSelectedOrderForDetail(createdOrder);
                    setActiveTab('orders');
                  }}
                  className="flex-1 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold py-3 rounded-xl text-xs transition-all shadow-xs"
                >
                  Track Order Live
                </button>
                <button
                  onClick={() => {
                    handleClose();
                    setActiveTab('catalog');
                  }}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 rounded-xl text-xs transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
