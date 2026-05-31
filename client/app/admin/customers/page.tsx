"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAdminAuthStore } from '../../../store/useAdminAuthStore';
import { Search, Filter, ShieldCheck, User, Trash2 } from 'lucide-react';

interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAdminAuthStore();

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setCustomers(customers.filter((c) => c._id !== id));
      toast.success('Customer deleted successfully');
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      toast.error(error.response?.data?.message || 'Failed to delete customer');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium tracking-wide text-gray-900 uppercase">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your user base.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary text-sm"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto justify-center">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px] whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Customer</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">Loading customers...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No customers found.</td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50 transition-colors text-sm">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full border border-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400">
                        <User className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-gray-800">{customer.name}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col text-gray-600">
                        {customer.email && <span>{customer.email}</span>}
                        {customer.phone && <span>{customer.phone}</span>}
                        {!customer.email && !customer.phone && <span className="text-gray-400 italic">No contact info</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      {customer.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase">
                          <ShieldCheck className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold uppercase">
                          User
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      {customer.role !== 'admin' && (
                        <button 
                          onClick={() => handleDeleteCustomer(customer._id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
