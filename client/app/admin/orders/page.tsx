"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdminAuthStore } from '../../../store/useAdminAuthStore';
import { Check, X, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  totalPrice: number;
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string;
  createdAt: string;
  isCancelled?: boolean;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAdminAuthStore();

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deliverHandler = async (id: string) => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/${id}/deliver`, {}, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setOrders(orders.map(o => o._id === id ? data : o));
        toast.success('Order marked as delivered');
      } catch (error) {
        console.error('Error delivering order:', error);
        toast.error('Failed to update order');
      }
    }
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setOrders(orders.filter(o => o._id !== id));
        toast.success('Order deleted successfully');
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Failed to delete order');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium tracking-wide text-gray-900 uppercase">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track customer orders.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary text-sm"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto justify-center">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px] whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Paid</th>
                <th className="p-4">Delivered</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors text-sm">
                    <td className="p-4 font-mono text-gray-600">{order._id.substring(0, 10)}...</td>
                    <td className="p-4 font-semibold text-gray-800">{order.shippingAddress?.name || order.user?.name || 'Guest'}</td>
                    <td className="p-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-gray-900">৳{order.totalPrice.toFixed(2)}</td>
                    <td className="p-4">
                      {order.isPaid ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                    <td className="p-4">
                      {order.isDelivered ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                    <td className="p-4 text-right min-w-[150px]">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/orders/${order._id}`}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md font-bold text-xs hover:bg-blue-100 transition-colors inline-block"
                        >
                          View Details
                        </Link>
                        {order.isCancelled ? (
                          <span className="px-3 py-1 bg-red-50 text-red-600 rounded-md font-bold text-xs inline-block">
                            Cancelled
                          </span>
                        ) : (
                          <button
                            onClick={() => deleteHandler(order._id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Cancel Order"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
