"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

function LoginForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const setCredentials = useAuthStore((state) => state.setCredentials);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (phone.length !== 11) {
      return setError('Phone number must be exactly 11 digits.');
    }

    if (password.length < 8) {
      return setError('Password must be at least 8 characters.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/register`, { 
        name, phone, email, password 
      });
      // The screenshot shows "Registered ! Click here to login", meaning we don't automatically log them in
      // So we will just show the success message and clear form.
      setSuccessMsg('Registered !');
      setName('');
      setIdentifier('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    setLoading(true);
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/login`, { identifier, password });
      setCredentials(data);
      toast.success('Login successful!');
      router.push(redirect);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid phone number or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[70vh] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 max-w-md w-full flex flex-col p-8 md:p-10">
        
        <h2 className="text-2xl font-black text-[#1e293b] mb-6">
          {mode === 'register' ? 'Registration' : 'Login'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-6 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-[#e9ecef] text-gray-800 p-4 rounded-md text-sm mb-6 flex items-center gap-2 font-medium">
            <div className="w-5 h-5 bg-[#1e293b] rounded-full flex items-center justify-center text-white font-bold text-xs">!</div>
            {successMsg} <button type="button" onClick={() => setMode('login')} className="underline hover:text-gray-600">Click here to login</button>
          </div>
        )}

        {mode === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-5" autoComplete="off">
            {/* Dummy inputs to trick Chrome autofill (must not be display: none) */}
            <input type="email" name="fakeusernameremembered" style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1 }} tabIndex={-1} aria-hidden="true" autoComplete="username" />
            <input type="password" name="fakepasswordremembered" style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1 }} tabIndex={-1} aria-hidden="true" autoComplete="current-password" />
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="Enter full name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-gray-400 transition-colors text-gray-700"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Phone number <span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                placeholder="Enter phone number" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={11}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-gray-400 transition-colors text-gray-700"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Email address <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input 
                type="email" 
                placeholder="Enter email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-gray-400 transition-colors text-gray-700"
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Password <span className="text-red-500">*</span> <span className="text-orange-500 font-normal">[Min 8 character]</span></label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 pr-12 focus:outline-none focus:border-gray-400 transition-colors text-gray-700"
                  required
                  minLength={8}
                  disabled={loading}
                  autoComplete="new-password"
                  name="register-password"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Repeat Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  placeholder="Confirm password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 pr-12 focus:outline-none focus:border-gray-400 transition-colors text-gray-700"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  name="register-confirm-password"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1e293b] text-white font-bold py-3 rounded-md hover:bg-secondary transition-colors disabled:opacity-50 mt-4"
            >
              Register
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account? <button type="button" onClick={() => setMode('login')} className="text-blue-600 font-semibold hover:underline">Login here</button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Email or Phone number <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="Enter email or phone number" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-gray-400 transition-colors text-gray-700"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 pr-12 focus:outline-none focus:border-gray-400 transition-colors text-gray-700"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1e293b] text-white font-bold py-3 rounded-md hover:bg-secondary transition-colors disabled:opacity-50 mt-4"
            >
              Login
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account? <button type="button" onClick={() => { setMode('register'); setSuccessMsg(''); }} className="text-blue-600 font-semibold hover:underline">Register here</button>
            </p>
          </form>
        )}

      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}