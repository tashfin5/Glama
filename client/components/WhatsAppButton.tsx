"use client";
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  // Replace with actual WhatsApp number in international format without + or spaces
  const phoneNumber = "8801941682148";
  const message = encodeURIComponent("Hello! I need some help with my Glama Cosmetics order.");

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3 md:p-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-6 h-6 md:w-7 md:h-7" />

      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-medium py-1.5 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden md:block">
        Chat with us!
      </span>
    </a>
  );
};

export default WhatsAppButton;
