"use client";
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAdminAuthStore } from '../../../../store/useAdminAuthStore';
import { ArrowLeft, Check, X, Loader2, Package, Truck, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { userInfo } = useAdminAuthStore();

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const markAsDelivered = async () => {
    if (!window.confirm('Mark this order as delivered?')) return;
    setActionLoading(true);
    try {
      const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/${id}/deliver`, {}, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      setOrder(data);
      toast.success('Order marked as delivered');
    } catch (error) {
      console.error(error);
      toast.error('Failed to mark as delivered');
    } finally {
      setActionLoading(false);
    }
  };

  const markAsPaid = async () => {
    if (!window.confirm('Mark this order as paid?')) return;
    setActionLoading(true);
    try {
      const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      setOrder(data);
      toast.success('Order marked as paid');
    } catch (error) {
      console.error(error);
      toast.error('Failed to mark as paid');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!order) {
    return <div className="p-10 text-center font-bold">Order not found</div>;
  }

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-medium tracking-wide text-gray-900 uppercase">Order Details</h1>
            <p className="text-sm text-gray-500 font-mono mt-1">ID: {order._id}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Order Items & details */}
        <div className="w-full lg:w-2/3 space-y-6">
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-500" /> Order Items
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-md border border-gray-200 overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product}`} className="font-bold text-gray-900 hover:text-primary truncate block text-sm">
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.qty}</p>
                  </div>
                  <div className="text-right shrink-0 font-bold text-gray-900">
                    ৳{(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-gray-500" /> Shipping Info
              </h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-bold text-gray-900">Name:</span> {order.shippingAddress?.name || order.user?.name}</p>
                <p><span className="font-bold text-gray-900">Email:</span> {order.user?.email || 'N/A'}</p>
                <p><span className="font-bold text-gray-900">Address:</span> {order.shippingAddress.address}</p>
                <p><span className="font-bold text-gray-900">City:</span> {order.shippingAddress.city}</p>
                <p><span className="font-bold text-gray-900">Phone:</span> {order.shippingAddress.phone}</p>
              </div>
              <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {order.isDelivered ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Not Delivered'}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-500" /> Payment Info
              </h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-bold text-gray-900">Method:</span> <span className="uppercase">{order.paymentMethod}</span></p>
              </div>
              <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {order.isPaid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: Order Summary & Actions */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4">Order Summary</h2>
            
            <div className="space-y-3 text-sm border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Items</span>
                <span className="font-medium">৳{order.itemsPrice?.toFixed(2)}</span>
              </div>
              
              {order.discounts && order.discounts.length > 0 && order.discounts.map((discount: any, idx: number) => (
                <div key={idx} className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Offer</span>
                    {discount.title}
                  </span>
                  <span className="font-medium">-৳{discount.discountAmount?.toFixed(2)}</span>
                </div>
              ))}
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">৳{order.shippingPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-medium">৳{order.taxPrice?.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
              <span>Total</span>
              <span>৳{order.totalPrice.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              {!order.isPaid && (
                <button 
                  onClick={markAsPaid}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-gray-900 text-white rounded-md font-bold text-sm hover:bg-secondary transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Mark As Paid
                </button>
              )}

              {order.isPaid && !order.isDelivered && (
                <button 
                  onClick={markAsDelivered}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-primary text-white rounded-md font-bold text-sm hover:bg-secondary transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                  Mark As Delivered
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
