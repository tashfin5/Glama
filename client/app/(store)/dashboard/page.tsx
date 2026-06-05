"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  LayoutGrid, ShoppingBag, MapPin, User, LogOut, 
  Loader2, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, ShoppingCart,
  Package, CreditCard, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';

export default function UserDashboard() {
  const router = useRouter();
  const { userInfo, logout, setCredentials } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Hydration fix
  const [mounted, setMounted] = useState(false);

  // Profile Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Address States
  const [addresses, setAddresses] = useState<any[]>([]);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  
  const [addrFirstName, setAddrFirstName] = useState('');
  const [addrLastName, setAddrLastName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrShippingArea, setAddrShippingArea] = useState('Inside Dhaka');
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      if (userInfo.addresses) {
        setAddresses(userInfo.addresses);
      }
    }
  }, [userInfo]);

  // Fetch orders when component mounts to show stats on dashboard
  useEffect(() => {
    if (userInfo) {
      fetchMyOrders();
    }
  }, [userInfo]);

  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    setError('');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/myorders`, config);
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders.');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password && password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password && password.length < 8) {
      return setError('Password must be at least 8 characters');
    }

    setLoadingProfile(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      };
      const payload: any = { name, email };
      if (password) {
        payload.password = password;
      }

      const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/profile`, payload, config);
      setCredentials(data);
      setSuccess('Profile updated successfully!');
      toast.success('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile.');
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const saveAddresses = async (newAddresses: any[]) => {
    setError('');
    setSuccess('');
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/profile`, { addresses: newAddresses }, config);
      setCredentials(data);
      setAddresses(data.addresses || []);
      setSuccess('Addresses updated successfully!');
      toast.success('Address saved successfully');
      setIsAddingAddress(false);
      setEditingAddressId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update addresses.');
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress = {
      firstName: addrFirstName,
      lastName: addrLastName,
      phone: addrPhone,
      address: addrStreet,
      city: addrCity,
      shippingArea: addrShippingArea,
      label: addrLabel,
      isDefault: addrIsDefault
    };

    let updatedAddresses = [...addresses];
    
    // If setting this to default, unset others
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    } else if (updatedAddresses.length === 0) {
      newAddress.isDefault = true;
    }

    if (editingAddressId !== null) {
      updatedAddresses[parseInt(editingAddressId)] = newAddress;
    } else {
      updatedAddresses.push(newAddress);
    }

    saveAddresses(updatedAddresses);
  };

  const handleDeleteAddress = (index: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter((_, i) => i !== index);
      saveAddresses(updatedAddresses);
    }
  };

  const handleSetDefaultAddress = (index: number) => {
    const updatedAddresses = addresses.map((a, i) => ({
      ...a,
      isDefault: i === index
    }));
    saveAddresses(updatedAddresses);
  };

  const openEditAddress = (index: number) => {
    const addr = addresses[index];
    setAddrFirstName(addr.firstName);
    setAddrLastName(addr.lastName);
    setAddrPhone(addr.phone);
    setAddrStreet(addr.address || '');
    setAddrCity(addr.city || '');
    setAddrShippingArea(addr.shippingArea || 'Inside Dhaka');
    setAddrLabel(addr.label || 'Home');
    setAddrIsDefault(addr.isDefault);
    setEditingAddressId(index.toString());
    setIsAddingAddress(true);
  };

  const openAddAddress = () => {
    setAddrFirstName('');
    setAddrLastName('');
    setAddrPhone('');
    setAddrStreet('');
    setAddrCity('');
    setAddrShippingArea('Inside Dhaka');
    setAddrLabel('Home');
    setAddrIsDefault(addresses.length === 0);
    setIsAddingAddress(true);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Auth Guard
  if (!userInfo) {
    return (
      <main className="min-h-[70vh] bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl max-w-md w-full text-center">
          <User className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-medium text-gray-900 mb-2 uppercase tracking-widest">Login Required</h2>
          <p className="text-gray-500 mb-6 font-medium">Please login with your phone number to access your account dashboard.</p>
          <Link 
            href="/login" 
            className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-secondary transition-colors shadow-lg block text-center"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  // Derive latest shipping details for address tab
  const latestOrder = orders.length > 0 ? orders[0] : null;

  // Derive customer stats
  const totalSpent = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'account', label: 'Account Details', icon: <User className="w-5 h-5" /> },
    { id: 'address', label: 'Shipping Address', icon: <MapPin className="w-5 h-5" /> },
  ];

  return (
    <main className="min-h-screen bg-gray-50/50 py-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 max-w-6xl">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden py-3 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-50">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Welcome Back</span>
              <h3 className="text-lg font-semibold text-gray-800 uppercase tracking-wider mt-1 truncate">{userInfo.name}</h3>
              <p className="text-[10px] text-gray-400 font-bold tracking-wider mt-0.5">{userInfo.phone}</p>
            </div>
            <nav className="flex flex-row md:flex-col mt-2 md:mt-3 mb-2 md:mb-0 overflow-x-auto whitespace-nowrap hide-scrollbar px-2 md:px-0 gap-2 md:gap-0">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setError('');
                    setSuccess('');
                  }}
                  className={`flex-shrink-0 flex items-center space-x-2 md:space-x-3 px-4 md:px-6 py-3 md:py-4 text-left transition-all rounded-xl md:rounded-none md:border-l-4 ${
                    activeTab === item.id 
                      ? 'bg-pink-50/50 text-primary font-bold md:border-primary md:bg-pink-50/20' 
                      : 'md:border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span className="text-xs md:text-sm uppercase tracking-wide">{item.label}</span>
                </button>
              ))}
              <button 
                onClick={handleLogout}
                className="flex-shrink-0 flex items-center space-x-2 md:space-x-3 px-4 md:px-6 py-3 md:py-4 text-left text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors rounded-xl md:rounded-none md:border-l-4 md:border-transparent md:mt-4 md:border-t md:border-gray-50 font-bold"
              >
                <LogOut className="w-5 h-5 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm uppercase tracking-wide">Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-grow bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-sm min-h-[500px]">
          
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm mb-6 font-semibold border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-sm mb-6 font-semibold border border-green-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="text-gray-700 space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-2xl font-serif font-medium text-gray-900 uppercase tracking-widest mb-2">Hello, {userInfo.name}!</h2>
                <p className="text-gray-500 text-sm font-medium">From your account dashboard you can easily check & track your recent orders, manage shipping addresses, and edit account details.</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-pink-50/20 border border-pink-100/50 p-6 rounded-3xl relative overflow-hidden">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest relative z-10">Verification Status</span>
                  <div className="flex items-center gap-2 mt-2 relative z-10">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-lg font-serif font-medium text-secondary uppercase tracking-widest">Verified</span>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl relative overflow-hidden">
                  <Package className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-100 opacity-50" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest relative z-10">Total Orders</span>
                  <div className="text-3xl font-medium text-gray-800 tracking-tight mt-1 relative z-10">
                    {loadingOrders ? (
                      <Loader2 className="w-8 h-8 animate-spin text-gray-300 mt-1" />
                    ) : orders.length > 0 ? orders.length : '-'}
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl relative overflow-hidden">
                  <CreditCard className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-100 opacity-50" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest relative z-10">Total Spent</span>
                  <div className="text-3xl font-medium text-primary tracking-tight mt-1 relative z-10">
                    {loadingOrders ? (
                      <Loader2 className="w-8 h-8 animate-spin text-primary/30 mt-1" />
                    ) : `৳${totalSpent > 0 ? totalSpent.toLocaleString() : '0'}`}
                  </div>
                </div>
              </div>

              <div className="bg-pink-50/10 border border-pink-100/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-50 text-primary rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary uppercase tracking-wide text-sm">Need anything else?</h4>
                    <p className="text-xs text-gray-500 font-medium">Explore premium Korean beauty products trending today.</p>
                  </div>
                </div>
                <Link href="/" className="bg-primary text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-secondary transition-colors shadow-md text-center whitespace-nowrap">
                  Shop Trending
                </Link>
              </div>

              {/* Recent Order Preview */}
              {!loadingOrders && orders.length > 0 && (
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-primary inline-block pb-1">Recent Order</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-primary uppercase hover:text-black transition-colors">View All</button>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('orders')}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                        <Clock className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-secondary text-sm">#{orders[0]._id}</h4>
                        <p className="text-xs font-semibold text-gray-400">{new Date(orders[0].createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Status</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                          orders[0].isCancelled ? 'bg-red-50 text-red-600' :
                          orders[0].isDelivered ? 'bg-green-50 text-green-600' : orders[0].isPaid ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'
                        }`}>
                          {orders[0].isCancelled ? 'Cancelled' : orders[0].isDelivered ? 'Delivered' : orders[0].isPaid ? 'Paid' : 'Processing'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total</span>
                        <span className="font-bold text-primary text-base">৳{orders[0].totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-serif font-medium text-secondary uppercase tracking-widest mb-6 border-b border-gray-50 pb-3">Your Orders</h2>
              
              {loadingOrders ? (
                <div className="py-20 flex justify-center items-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium mb-6">You haven't placed any orders yet.</p>
                  <Link 
                    href="/" 
                    className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-secondary transition-colors shadow-lg"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const isExpanded = expandedOrderId === order._id;
                    const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });

                    return (
                      <div key={order._id} className="border border-gray-100 rounded-3xl shadow-sm overflow-hidden bg-white">
                        
                        {/* Order Header / Summary Row */}
                        <div 
                          onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                          className="p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                            <h4 className="font-bold text-secondary text-sm">#{order._id}</h4>
                            <p className="text-xs font-semibold text-gray-400">{dateStr}</p>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total</span>
                              <span className="font-bold text-primary text-base">৳{order.totalPrice}</span>
                            </div>
                            
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Status</span>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                                order.isCancelled
                                  ? 'bg-red-50 text-red-600'
                                  : order.isDelivered 
                                    ? 'bg-green-50 text-green-600' 
                                    : order.isPaid 
                                      ? 'bg-blue-50 text-blue-600' 
                                      : 'bg-yellow-50 text-yellow-600'
                              }`}>
                                {order.isCancelled ? 'Cancelled' : order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Processing'}
                              </span>
                            </div>

                            <button className="text-gray-400 p-1 hover:text-primary transition-colors">
                              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Order Details / Expanded Content */}
                        {isExpanded && (
                          <div className="border-t border-gray-50 bg-gray-50/30 p-6 space-y-6">
                            
                            {/* Products in this order */}
                            <div>
                              <h5 className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">Items</h5>
                              <div className="space-y-3">
                                {order.orderItems.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gray-50">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-white rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                        <span className="font-bold text-gray-800 text-xs leading-tight line-clamp-1">{item.name}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase block mt-0.5">Qty: {item.qty} • Price: ৳{item.price}</span>
                                      </div>
                                    </div>
                                    <span className="font-bold text-secondary text-xs ml-4">৳{item.price * item.qty}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-5 rounded-2xl border border-gray-50">
                              <div>
                                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Shipping Details</h5>
                                <p className="text-xs font-bold text-secondary">{order.shippingAddress?.address}</p>
                                <p className="text-xs font-medium text-gray-500 mt-1">{order.shippingAddress?.city}, Bangladesh</p>
                              </div>
                              <div>
                                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Payment Details</h5>
                                <p className="text-xs font-bold text-secondary">{order.paymentMethod}</p>
                                <p className="text-xs font-medium text-gray-500 mt-1">Payment Status: <span className="font-bold">{order.isPaid ? 'Paid' : 'Unpaid (COD)'}</span></p>
                              </div>
                            </div>

                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Account Details Form */}
          {activeTab === 'account' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-serif font-medium text-secondary uppercase tracking-widest mb-6 border-b border-gray-50 pb-3">Account Details</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm font-bold text-gray-800" 
                    placeholder="First Name" 
                    disabled={loadingProfile}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-100 bg-gray-50 rounded-md px-4 py-3 text-gray-400 outline-none text-sm font-bold cursor-not-allowed" 
                    value={userInfo.phone || ''} 
                    readOnly 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address (Optional)</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm font-bold text-gray-800" 
                    placeholder="you@example.com" 
                    disabled={loadingProfile}
                  />
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">New Password <span className="text-gray-400 font-normal lowercase">(optional)</span></label>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm font-bold text-gray-800" 
                        placeholder="Leave blank to keep current" 
                        disabled={loadingProfile}
                        autoComplete="new-password"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm font-bold text-gray-800" 
                        placeholder="Confirm new password" 
                        disabled={loadingProfile}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </div>


                <button 
                  type="submit" 
                  disabled={loadingProfile}
                  className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-secondary transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {loadingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Shipping Address */}
          {activeTab === 'address' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-3">
                <h2 className="text-xl font-serif font-medium text-gray-900 uppercase tracking-widest">My Addresses</h2>
                {!isAddingAddress && (
                  <button 
                    onClick={openAddAddress}
                    className="text-xs font-bold text-white bg-primary px-4 py-2 rounded hover:bg-secondary transition-colors uppercase tracking-widest"
                  >
                    + Add New
                  </button>
                )}
              </div>
              
              {isAddingAddress ? (
                <form onSubmit={handleSaveAddress} className="space-y-6 max-w-lg bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">First Name</label>
                      <input type="text" required value={addrFirstName} onChange={(e) => setAddrFirstName(e.target.value)} className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm font-bold text-gray-800" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Last Name</label>
                      <input type="text" required value={addrLastName} onChange={(e) => setAddrLastName(e.target.value)} className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm font-bold text-gray-800" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone</label>
                    <input type="text" required value={addrPhone} onChange={(e) => setAddrPhone(e.target.value)} className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm font-bold text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Street Address</label>
                    <input type="text" required value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm font-bold text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">City / District</label>
                    <input type="text" required value={addrCity} onChange={(e) => setAddrCity(e.target.value)} className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm font-bold text-gray-800" placeholder="Enter City/District" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Shipping Area</label>
                    <select value={addrShippingArea} onChange={(e) => setAddrShippingArea(e.target.value)} className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm font-bold text-gray-800 bg-white">
                      <option value="Inside Dhaka">Inside Dhaka (৳60 Shipping)</option>
                      <option value="Outside Dhaka">Outside Dhaka (৳120 Shipping)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Label (Home, Work)</label>
                      <input type="text" required value={addrLabel} onChange={(e) => setAddrLabel(e.target.value)} className="w-full border border-gray-200 rounded-md px-4 py-3 focus:border-primary outline-none text-sm font-bold text-gray-800" />
                    </div>
                    <div className="flex items-center mt-6">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-600">
                        <input type="checkbox" checked={addrIsDefault} onChange={(e) => setAddrIsDefault(e.target.checked)} className="w-4 h-4 text-primary" />
                        Set as default address
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsAddingAddress(false)} className="flex-1 bg-white border border-gray-200 text-gray-600 px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">Cancel</button>
                    <button type="submit" className="flex-1 bg-primary text-white px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-secondary transition-all shadow-md active:scale-95">Save Address</button>
                  </div>
                </form>
              ) : addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr, idx) => (
                    <div key={idx} className={`p-6 rounded-3xl border ${addr.isDefault ? 'border-primary bg-pink-50/20' : 'border-gray-100 bg-gray-50'} space-y-4`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-5 h-5 ${addr.isDefault ? 'text-primary' : 'text-gray-400'}`} />
                          <span className="text-xs font-bold uppercase tracking-widest text-gray-800">{addr.label}</span>
                          {addr.isDefault && <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ml-2">Default</span>}
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => openEditAddress(idx)} className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase">Edit</button>
                          <button onClick={() => handleDeleteAddress(idx)} className="text-xs font-bold text-red-600 hover:text-red-800 uppercase">Delete</button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{addr.firstName} {addr.lastName}</p>
                        <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                        <p className="text-sm text-gray-600">{addr.city}</p>
                        <p className="text-sm text-gray-600 font-medium text-secondary">{addr.shippingArea || 'Inside Dhaka'}</p>
                        <p className="text-sm text-gray-600 mt-1">Phone: {addr.phone}</p>
                      </div>
                      {!addr.isDefault && (
                        <button onClick={() => handleSetDefaultAddress(idx)} className="text-xs font-bold text-primary hover:text-secondary uppercase tracking-widest border border-primary/20 px-3 py-1.5 rounded-md mt-2 w-full text-center">
                          Set as Default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-w-md bg-gray-50 rounded-3xl p-6 border border-gray-100 text-center py-10 space-y-3 mx-auto mt-10">
                  <MapPin className="w-10 h-10 text-gray-300 mx-auto" />
                  <h4 className="font-bold text-gray-900 uppercase tracking-wide text-sm">No address saved yet</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">Save your shipping addresses for faster checkout.</p>
                  <button onClick={openAddAddress} className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-secondary transition-colors mt-2 shadow-sm">
                    Add Address
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}