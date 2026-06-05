"use client";
import React, { useState } from 'react';
import { ShoppingBag, Heart, X, Check, PackageSearch } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

interface ProductProps {
  id: string;
  slug?: string;
  brand: string;
  name: string;
  price: number;
  discountPrice?: number;
  imageUrl?: string;
  onRemove?: (id: string) => void;
}

const ProductCard = ({ id, slug, brand, name, price, discountPrice, imageUrl, onRemove }: ProductProps) => {
  const router = useRouter();
  // Pull the addToCart function and offers from Zustand
  const { addToCart, activeOffers } = useCartStore();
  
  // Auth & Wishlist
  const { userInfo, toggleWishlist } = useAuthStore();
  const isWishlisted = userInfo?.wishlist?.includes(id);

  let finalDiscountPrice = discountPrice;
  let promoBadge = '';

  if (activeOffers) {
    activeOffers.forEach((offer: any) => {
      if (!offer.isActive) return;
      
      let isIncluded = false;
      if (offer.products?.includes(id)) isIncluded = true;
      if (offer.bogoBuyProducts?.includes(id) || offer.bogoGetProducts?.includes(id)) isIncluded = true;
      if (offer.bundles?.some((b: any) => b.products?.includes(id))) isIncluded = true;

      if (isIncluded) {
        const offerTypes = Array.isArray(offer.offerType) ? offer.offerType : [offer.offerType || 'STANDARD'];
        
        if (offerTypes.includes('PERCENTAGE')) {
          const newPrice = price - (price * (offer.discountValue / 100));
          if (!finalDiscountPrice || newPrice < finalDiscountPrice) {
             finalDiscountPrice = newPrice;
             promoBadge = offer.title;
          }
        } 
        if (offerTypes.includes('FIXED')) {
          const newPrice = Math.max(0, price - offer.discountValue);
          if (!finalDiscountPrice || newPrice < finalDiscountPrice) {
             finalDiscountPrice = newPrice;
             promoBadge = offer.title;
          }
        } 
        if ((offerTypes.includes('BOGO') || offerTypes.includes('BUNDLE')) && !promoBadge) {
           promoBadge = offer.title; 
        }
      }
    });
  }

  const discountPercent = finalDiscountPrice 
    ? Math.round(((price - finalDiscountPrice) / price) * 100) 
    : 0;

  const [isAdded, setIsAdded] = useState(false);

  // The function that fires when you click the bag icon
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the link from triggering
    e.stopPropagation();
    addToCart({
      _id: id,
      name,
      brand,
      price,
      discountPrice: finalDiscountPrice,
      image: imageUrl || '',
      quantity: 1
    });

    // (Auto-add BOGO free item logic has been centralized in useCartStore.ts)

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  return (
    <Link 
      href={`/product/${slug || id}`} 
      className="group flex flex-col bg-white rounded-2xl p-0 border border-gray-100 hover:border-transparent shadow-sm hover:shadow-xl transition-all duration-500 ease-out relative cursor-pointer h-full overflow-hidden hover:-translate-y-1"
    >
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 bg-primary text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full z-20 shadow-md">
          {discountPercent}% OFF
        </div>
      )}

      {/* Promo Badge */}
      {promoBadge && !discountPercent && (
        <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full z-20 shadow-md">
          {promoBadge}
        </div>
      )}

      {/* Wishlist / Remove Button */}
      {onRemove ? (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(id);
          }} 
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors z-20 bg-white shadow-md rounded-full p-2"
        >
          <X className="w-4 h-4" />
        </button>
      ) : (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!userInfo) {
              router.push('/login');
              return;
            }
            toggleWishlist(id);
          }} 
          className="absolute top-3 right-3 text-gray-800 hover:text-primary transition-colors z-20 bg-white/70 backdrop-blur-md rounded-full p-2 shadow-sm hover:shadow-md"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-primary text-primary' : ''}`} />
        </button>
      )}

      {/* Image Container */}
      <div className="w-full aspect-[4/5] bg-gray-50 flex items-center justify-center overflow-hidden relative">
        {imageUrl ? (
           <img 
             src={imageUrl} 
             alt={name} 
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
           />
        ) : (
           <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-700 ease-out">
             <PackageSearch className="w-10 h-10 text-gray-200 mb-2" />
             <span className="text-gray-300 text-[10px] font-bold uppercase tracking-widest px-4 text-center">No Image</span>
           </div>
        )}
        
        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow text-left p-5 md:p-6 bg-white">
        <span className="text-[9px] font-medium text-gray-500 uppercase tracking-[0.2em] mb-2">{brand}</span>
        <h3 className="text-sm md:text-[15px] font-normal text-gray-900 leading-relaxed mb-4 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
                {finalDiscountPrice ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs md:text-sm font-bold text-gray-400 line-through leading-none">৳{price}</span>
                    <span className="text-lg font-serif font-bold text-secondary leading-none">৳{finalDiscountPrice}</span>
                  </div>
                ) : (
                  <span className="text-lg font-serif font-bold text-secondary">৳{price}</span>
                )}
          </div>
          
          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm relative z-20 group/btn ${
              isAdded 
                ? 'bg-green-500 text-white border-green-500 scale-110' 
                : 'bg-cream border border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary'
            }`}
          >
            {isAdded ? (
              <Check className="w-5 h-5 animate-in zoom-in duration-300" strokeWidth={2.5} />
            ) : (
              <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;