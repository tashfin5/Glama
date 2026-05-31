"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Truck, ArrowLeft, ShieldCheck, ShoppingBag, CheckCircle, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartCalculations, clearCart } = useCartStore();
  const { userInfo, setCredentials } = useAuthStore();

  // Hydration fix
  const [mounted, setMounted] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [shippingArea, setShippingArea] = useState('Inside Dhaka');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  // New Address Specific Fields
  const [saveAddress, setSaveAddress] = useState(true);
  const [label, setLabel] = useState('Home');

  // Address Selection State
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderCreated, setOrderCreated] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (userInfo) {
      setEmail(userInfo.email || '');

      // Try to parse name if not already set
      if (userInfo.name && !fullName) {
        setFullName(userInfo.name);
      }

      if (userInfo.addresses && userInfo.addresses.length > 0) {
        const defaultIdx = userInfo.addresses.findIndex((a: any) => a.isDefault);
        const idxToSelect = defaultIdx !== -1 ? defaultIdx : 0;
        selectAddress(idxToSelect, userInfo.addresses[idxToSelect]);
      } else {
        setShowNewAddressForm(true);
      }
    }
  }, [userInfo]);

  const selectAddress = (index: number, addr: any) => {
    setSelectedAddressIndex(index);
    setFullName(addr.fullName || `${addr.firstName || ''} ${addr.lastName || ''}`.trim());
    setPhone(addr.phone || '');
    setAddress(addr.address || '');
    setCity(addr.city || '');
    setShippingArea(addr.shippingArea || 'Inside Dhaka');
    setLabel(addr.label || 'Home');
    setShowNewAddressForm(false);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }


  // Empty Cart validation
  if (cart.length === 0 && !orderCreated) {
    return (
      <main className="min-h-[70vh] bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl max-w-md w-full text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-medium text-gray-900 mb-2 uppercase tracking-widest">Your Bag is Empty</h2>
          <p className="text-gray-500 mb-6 font-medium">You don't have any products in your cart to checkout.</p>
          <Link
            href="/"
            className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-colors shadow-lg block"
          >
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  const { subtotal, discounts, total: currentTotal } = getCartCalculations();
  const FREE_SHIPPING_THRESHOLD = 5000;
  const deliveryFee = currentTotal >= FREE_SHIPPING_THRESHOLD ? 0 : (shippingArea === 'Inside Dhaka' ? 60 : 100);
  const total = currentTotal + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const orderItems = cart.map(item => ({
      name: item.name,
      qty: item.quantity,
      image: item.image,
      price: item.discountPrice || item.price,
      product: item._id
    }));

    const payload = {
      orderItems,
      shippingAddress: {
        name: fullName.trim(),
        address,
        city,
        shippingArea,
        country: 'Bangladesh',
        phone
      },
      paymentMethod: 'Cash on Delivery',
      itemsPrice: subtotal, // Store the pure subtotal before discounts
      discounts, // Send the calculated discounts to the backend
      taxPrice: 0,
      shippingPrice: deliveryFee,
      totalPrice: total
    };

    try {
      const config = {
        headers: {
          ...(userInfo?.token && { Authorization: `Bearer ${userInfo.token}` })
        },
      };

      // Save address if user selected a new address and wants to save it
      if (userInfo && showNewAddressForm && saveAddress) {
        try {
          const nameParts = fullName.trim().split(' ');
          const firstName = nameParts[0] || 'Unknown';
          const lastName = nameParts.slice(1).join(' ') || 'User';

          const newAddr = {
            firstName,
            lastName,
            phone,
            address,
            city,
            shippingArea,
            label,
            isDefault: !userInfo.addresses || userInfo.addresses.length === 0
          };
          const updatedAddresses = [...(userInfo.addresses || []), newAddr];

          const { data: updatedUser } = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/profile`,
            { addresses: updatedAddresses },
            config
          );
          setCredentials(updatedUser);
        } catch (err) {
          console.error('Failed to save address to profile', err);
        }
      }

      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders`, payload, config);
      setOrderCreated(data);
      clearCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong while placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (orderCreated) {
    return (
      <main className="min-h-screen bg-gray-50 py-16 px-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full border border-gray-100 shadow-xl text-center">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-serif font-medium text-secondary uppercase tracking-widest mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 font-medium mb-6">Thank you for shopping with Glama. Your order has been placed successfully.</p>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left mb-8 space-y-3">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Order ID</span>
              <span className="text-sm font-bold text-gray-800">#{orderCreated._id}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Total Paid (COD)</span>
              <span className="text-sm font-bold text-primary">৳{orderCreated.totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">Deliver To</span>
              <span className="text-sm font-medium text-gray-800 text-right max-w-[200px] truncate">{orderCreated.shippingAddress?.address}, {orderCreated.shippingAddress?.city}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard"
              className="flex-1 bg-secondary text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-colors text-center text-sm shadow-md"
            >
              Track Order
            </Link>
            <Link
              href="/"
              className="flex-grow bg-white text-gray-700 border border-gray-200 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors text-center text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50 py-10">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Back to Cart / Shop Link */}
        <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
        </Link>

        <h1 className="text-3xl font-serif font-medium text-secondary uppercase tracking-widest mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm mb-8 font-semibold border border-red-100 text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Left Column: Forms */}
          <div className="w-full lg:w-2/3">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">

              {/* Contact Information */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-serif font-medium uppercase tracking-widest mb-6 text-secondary border-b border-gray-50 pb-3">1. Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address <span className="text-gray-400 normal-case">(Optional)</span></label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm"
                      placeholder="+880 1..."
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-3">
                  <h2 className="text-xl font-serif font-medium uppercase tracking-widest text-secondary">2. Shipping Address</h2>
                  {userInfo?.addresses && userInfo.addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                      className="text-xs font-bold text-primary hover:text-secondary uppercase tracking-widest"
                    >
                      {showNewAddressForm ? 'Use Saved Address' : '+ New Address'}
                    </button>
                  )}
                </div>

                {!showNewAddressForm && userInfo?.addresses && userInfo.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userInfo.addresses.map((addr: any, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => selectAddress(idx, addr)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressIndex === idx
                            ? 'border-primary bg-pink-50/20'
                            : 'border-gray-100 hover:border-gray-200'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{addr.label}</span>
                          {selectedAddressIndex === idx && <CheckCircle className="w-5 h-5 text-primary" />}
                        </div>
                        <p className="text-sm font-bold text-gray-900">{addr.fullName || `${addr.firstName || ''} ${addr.lastName || ''}`.trim()}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">{addr.address}</p>
                        <p className="text-xs text-gray-600">{addr.city}</p>
                        <p className="text-xs text-gray-600 mt-1">Phone: {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Street Address <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm"
                        placeholder="House number and street name"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">City / District <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm"
                        placeholder="Enter City/District"
                      />
                    </div>
                    <div className="mb-4">
                      <div className="flex flex-col space-y-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                        <label className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="shippingArea"
                              value="Outside Dhaka"
                              checked={shippingArea === "Outside Dhaka"}
                              onChange={(e) => setShippingArea(e.target.value)}
                              className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                            />
                            <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">Outside Dhaka City:</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">100৳</span>
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="shippingArea"
                              value="Inside Dhaka"
                              checked={shippingArea === "Inside Dhaka"}
                              onChange={(e) => setShippingArea(e.target.value)}
                              className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                            />
                            <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">Inside Dhaka City:</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">60৳</span>
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Address Label (Home, Work)</label>
                        <input
                          type="text"
                          required
                          value={label}
                          onChange={(e) => setLabel(e.target.value)}
                          className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm"
                          placeholder="e.g. Home"
                        />
                      </div>
                      <div className="flex items-center mt-6 md:mt-8">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-600">
                          <input
                            type="checkbox"
                            checked={saveAddress}
                            onChange={(e) => setSaveAddress(e.target.checked)}
                            className="w-4 h-4 text-primary"
                          />
                          Save this address to my profile
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Order Notes (Optional)</label>
                      <textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm h-24"
                        placeholder="Notes about your order, e.g. special delivery instructions."
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary & Payment */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
              <h2 className="text-lg font-serif font-medium uppercase tracking-widest text-secondary border-b border-gray-50 pb-4 mb-6">Order Summary</h2>

              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-start text-sm">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-md border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 line-clamp-1 leading-tight">{item.name}</span>
                        <span className="text-gray-400 text-xs font-bold uppercase mt-1">{item.brand} • Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 whitespace-nowrap ml-4">৳{(item.discountPrice || item.price) * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-b border-gray-50 py-4 mb-6 space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>৳{subtotal}</span>
                </div>
                
                {discounts.map((discount: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center py-2 text-sm text-green-600">
                    <span className="flex items-center gap-1">
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Offer</span>
                      {discount.title}
                    </span>
                    <span>-৳{discount.discountAmount}</span>
                  </div>
                ))}

                <div className="flex justify-between items-center py-2 text-sm text-gray-600">
                  <span className="font-medium">Shipping Fee</span>
                  <span className="font-bold text-gray-800">
                    {deliveryFee === 0 ? <span className="text-green-500 uppercase text-xs tracking-widest">Free</span> : `৳${deliveryFee}`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-serif font-medium text-secondary uppercase tracking-widest">Total</span>
                <span className="text-3xl font-serif font-medium text-primary">৳{total}</span>
              </div>

              {/* Payment Method Section */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Payment Method</h3>
                <label className="flex items-center p-4 border border-primary bg-pink-50/20 rounded-2xl cursor-pointer transition-all shadow-sm">
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                  />
                  <div className="ml-3 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    <span className="font-bold text-secondary text-sm">Cash on Delivery (COD)</span>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-colors shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Place Order (৳{total})
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed">
                By placing your order, you agree to Glama's terms of service and privacy policy.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}