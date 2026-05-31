"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function OfferCarousel({ offers }: { offers: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    if (offers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === offers.length - 1 ? 0 : prev + 1));
    }, 5000); // Auto change every 5 seconds
    return () => clearInterval(interval);
  }, [offers.length, timerKey]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? offers.length - 1 : prev - 1));
    setTimerKey(prev => prev + 1);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === offers.length - 1 ? 0 : prev + 1));
    setTimerKey(prev => prev + 1);
  };

  if (!offers || offers.length === 0) {
    return null; // Don't show anything if no active offers
  }

  return (
    <div className="relative w-full overflow-hidden group mb-16 aspect-[4/5] md:aspect-[21/9] lg:aspect-[4/1]">
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full w-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {offers.map((offer) => {
          return (
          <div key={offer._id} className="min-w-full h-full relative">
            <Link href={`/offer/${offer.slug}`} className="block w-full h-full">
              <picture className="w-full h-full">
                <source media="(max-width: 768px)" srcSet={offer.mobileImage || offer.image} />
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                <h2 
                  className="text-2xl md:text-4xl font-serif font-bold uppercase tracking-widest drop-shadow-md transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500"
                  style={{ color: offer.titleColor || offer.textColor || '#ffffff' }}
                >
                  {offer.title}
                </h2>
                {offer.description && (
                  <p 
                    className="mt-2 text-sm md:text-base max-w-2xl line-clamp-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100"
                    style={{ color: offer.descriptionColor || offer.textColor || '#e5e7eb' }}
                  >
                    {offer.description}
                  </p>
                )}
              </div>
            </Link>
          </div>
        )})}
      </div>

      {offers.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.preventDefault(); prevSlide(); }}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-white/40 hover:bg-white/90 text-white hover:text-black backdrop-blur-md rounded-full flex items-center justify-center opacity-100 transition-all duration-300 shadow-lg z-10"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); nextSlide(); }}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-white/40 hover:bg-white/90 text-white hover:text-black backdrop-blur-md rounded-full flex items-center justify-center opacity-100 transition-all duration-300 shadow-lg z-10"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {offers.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); setTimerKey(prev => prev + 1); }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 z-10 ${
                  currentIndex === idx ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
