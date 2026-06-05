"use client";
import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#F5DFCA] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] pt-20 pb-10 text-sm relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">

          {/* Brand & About */}
          <div className="flex flex-col space-y-6">
            <Link href="/" className="text-3xl font-serif font-medium text-primary tracking-widest">
              LUMIÈRE<span className="text-gray-900">.</span>
            </Link>
            <p className="text-gray-800 leading-relaxed font-light tracking-wide">
              Your ultimate destination for authentic K-Beauty and premium cosmetics. We bring the best of global skincare right to your doorstep.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full border border-blue-100 bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-pink-100 bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all shadow-sm">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-red-100 bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:justify-self-center">
            <h3 className="text-gray-900 font-serif font-normal text-lg tracking-widest mb-6">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-4 text-gray-800 font-light tracking-wide">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/category/all" className="hover:text-primary transition-colors">Shop All</Link></li>
              <li><Link href="/brands" className="hover:text-primary transition-colors">Brands</Link></li>
              <li><Link href="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link></li>
              <li><Link href="/checkout" className="hover:text-primary transition-colors">Checkout</Link></li>
              <li><Link href="/profile" className="hover:text-primary transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 font-serif font-normal text-lg tracking-widest mb-6">Contact Us</h3>
            <ul className="space-y-4 text-gray-800">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Level 4, Lumière Tower, Narayanganj, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>+880 1941 682148</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>support@lumiere.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-black text-[10px] uppercase tracking-widest font-medium">
          <p>&copy; {new Date().getFullYear()} Lumière Cosmetics. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;