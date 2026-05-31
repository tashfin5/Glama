import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define what a single item in our cart looks like
export interface CartItem {
  _id: string;
  name: string;
  brand: string;
  price: number;
  discountPrice?: number;
  image: string;
  quantity: number;
}

export interface CartDiscount {
  offerId: string;
  title: string;
  discountAmount: number;
}

// Define the actions our store can take
interface CartState {
  cart: CartItem[];
  activeOffers: any[];
  setActiveOffers: (offers: any[]) => void;
  addToCart: (item: CartItem, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCalculations: () => { subtotal: number; discounts: CartDiscount[]; total: number };
  getCartCount: () => number;
}

// Create the Zustand store
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      activeOffers: [],

      setActiveOffers: (offers) => set({ activeOffers: offers }),

      // Add item to cart
      addToCart: (item, quantity = 1) => {
        const cart = get().cart;
        const activeOffers = get().activeOffers || [];
        
        let finalQuantity = quantity;

        // Auto-add free items for BOGO offers
        activeOffers.forEach(offer => {
          if (!offer.isActive) return;
          const offerTypes = Array.isArray(offer.offerType) ? offer.offerType : [offer.offerType || 'STANDARD'];
          if (offerTypes.includes('BOGO')) {
            const bogoBuyIds = offer.bogoBuyProducts?.map((p: any) => p._id || p) || [];
            const bogoGetProducts = offer.bogoGetProducts || [];
            const bogoGetIds = bogoGetProducts.map((p: any) => p._id || p);
            
            if (bogoBuyIds.includes(item._id)) {
              const buyQty = offer.buyQuantity || 1;
              const getQty = offer.getQuantity || 1;
              const isSameGroup = bogoBuyIds.some((id: string) => bogoGetIds.includes(id));
              
              if (isSameGroup && finalQuantity === buyQty) {
                // If it's a self-BOGO (buy 1 get 1 of the same item), just increase finalQuantity
                finalQuantity += getQty;
              } else if (!isSameGroup && quantity === buyQty && bogoGetProducts.length > 0) {
                // If it's a different item, we need to push it to the cart separately
                const freeProduct = bogoGetProducts[0];
                if (typeof freeProduct === 'object' && freeProduct._id) {
                  const existingFreeItem = cart.find((i) => i._id === freeProduct._id);
                  if (existingFreeItem) {
                    existingFreeItem.quantity += getQty;
                  } else {
                    cart.push({
                      _id: freeProduct._id,
                      name: freeProduct.name,
                      brand: freeProduct.brand,
                      price: freeProduct.price,
                      discountPrice: freeProduct.discountPrice,
                      image: freeProduct.images?.[0] || '',
                      quantity: getQty
                    });
                  }
                }
              }
            }
          }
        });

        const existingItem = cart.find((i) => i._id === item._id);

        if (existingItem) {
          // If already in cart, just increase quantity
          set({
            cart: cart.map((i) =>
              i._id === item._id ? { ...i, quantity: i.quantity + finalQuantity } : i
            ),
          });
        } else {
          // If new, add it to the array
          set({ cart: [...cart, { ...item, quantity: finalQuantity }] });
        }
      },

      // Remove specific item
      removeFromCart: (id) => {
        set({ cart: get().cart.filter((item) => item._id !== id) });
      },

      // Increase quantity by 1
      increaseQuantity: (id) => {
        set({
          cart: get().cart.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        });
      },

      // Decrease quantity by 1 (and remove if it hits 0)
      decreaseQuantity: (id) => {
        const cart = get().cart;
        const item = cart.find((i) => i._id === id);
        
        if (item?.quantity === 1) {
          set({ cart: cart.filter((i) => i._id !== id) });
        } else {
          set({
            cart: cart.map((i) =>
              i._id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          });
        }
      },

      // Empty the whole cart
      clearCart: () => set({ cart: [] }),

      // Basic subtotal fallback
      getCartTotal: () => {
        return get().getCartCalculations().total;
      },

      // Advanced Calculation Engine
      getCartCalculations: () => {
        const cart = get().cart;
        const offers = get().activeOffers || [];
        
        let subtotal = 0;
        cart.forEach(item => {
          subtotal += (item.discountPrice || item.price) * item.quantity;
        });

        let discounts: CartDiscount[] = [];
        let totalDiscountAmount = 0;

        // Make a copy of cart quantities so we don't double discount the exact same physical items in some complex scenarios, 
        // though for simplicity we will just calculate independently.
        
        offers.forEach(offer => {
          if (!offer.isActive) return;
          
          // Check if offer has any products attached at all (either legacy or new fields)
          // Normalize IDs in case they are populated objects
          const productIds = offer.products?.map((p: any) => p._id || p) || [];
          const bogoBuyIds = offer.bogoBuyProducts?.map((p: any) => p._id || p) || [];
          const bogoGetIds = offer.bogoGetProducts?.map((p: any) => p._id || p) || [];

          const hasProducts = productIds.length > 0 || bogoBuyIds.length > 0 || (offer.bundles && offer.bundles.length > 0);
          if (!hasProducts) return;
          
          let discountForThisOffer = 0;
          const matchedItems = cart.filter(item => productIds.includes(item._id));
          const offerTypes = Array.isArray(offer.offerType) ? offer.offerType : [offer.offerType || 'STANDARD'];

          if ((offerTypes.includes('PERCENTAGE') || offerTypes.includes('FIXED')) && matchedItems.length === 0) {
            // we don't return early here, because BOGO or BUNDLE might still apply if they don't rely on matchedItems (legacy products array)
          }

          if (offerTypes.includes('PERCENTAGE')) {
            matchedItems.forEach(item => {
              const price = item.discountPrice || item.price;
              discountForThisOffer += (price * item.quantity) * (offer.discountValue / 100);
            });
          } 
          if (offerTypes.includes('FIXED')) {
            matchedItems.forEach(item => {
              const price = item.discountPrice || item.price;
              discountForThisOffer += Math.min(price, offer.discountValue) * item.quantity;
            });
          }
          if (offerTypes.includes('BOGO')) {
            const buyQty = offer.buyQuantity || 1;
            const getQty = offer.getQuantity || 1;
            
            if (bogoBuyIds.length > 0 && bogoGetIds.length > 0) {
              const buyItemsInCart = cart.filter(item => bogoBuyIds.includes(item._id));
              const getItemsInCart = cart.filter(item => bogoGetIds.includes(item._id));
              
              const isSameGroup = bogoBuyIds.some((id: string) => bogoGetIds.includes(id));

              if (isSameGroup) {
                // If the buy and get items overlap (e.g. Buy 1 Get 1 Free on the exact same item), 
                // we treat them as a single group.
                const requiredGroupSize = buyQty + getQty;
                const totalQty = buyItemsInCart.reduce((sum, item) => sum + item.quantity, 0);
                const freeItemGroups = Math.floor(totalQty / requiredGroupSize);
                let freeItemsToGive = freeItemGroups * getQty;
                
                if (freeItemsToGive > 0) {
                  const sortedItems = [...buyItemsInCart].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
                  for (const item of sortedItems) {
                    if (freeItemsToGive <= 0) break;
                    const qtyToDiscount = Math.min(item.quantity, freeItemsToGive);
                    discountForThisOffer += (item.discountPrice || item.price) * qtyToDiscount;
                    freeItemsToGive -= qtyToDiscount;
                  }
                }
              } else {
                // Distinct buy and get products
                const totalBuyQty = buyItemsInCart.reduce((sum, item) => sum + item.quantity, 0);
                const eligibleGetGroups = Math.floor(totalBuyQty / buyQty);
                let freeItemsToGive = eligibleGetGroups * getQty;

                if (freeItemsToGive > 0 && getItemsInCart.length > 0) {
                  const sortedGetItems = [...getItemsInCart].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
                  for (const item of sortedGetItems) {
                    if (freeItemsToGive <= 0) break;
                    const qtyToDiscount = Math.min(item.quantity, freeItemsToGive);
                    discountForThisOffer += (item.discountPrice || item.price) * qtyToDiscount;
                    freeItemsToGive -= qtyToDiscount;
                  }
                }
              }
            } else if (matchedItems.length > 0) {
              // Legacy BOGO
              const requiredGroupSize = buyQty + getQty;
              const totalQty = matchedItems.reduce((sum, item) => sum + item.quantity, 0);
              const freeItemGroups = Math.floor(totalQty / requiredGroupSize);
              let freeItemsToGive = freeItemGroups * getQty;
              
              if (freeItemsToGive > 0) {
                const sortedItems = [...matchedItems].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
                for (const item of sortedItems) {
                  if (freeItemsToGive <= 0) break;
                  const qtyToDiscount = Math.min(item.quantity, freeItemsToGive);
                  discountForThisOffer += (item.discountPrice || item.price) * qtyToDiscount;
                  freeItemsToGive -= qtyToDiscount;
                }
              }
            }
          }
          if (offerTypes.includes('BUNDLE')) {
            if (offer.bundles && offer.bundles.length > 0) {
              offer.bundles.forEach((bundle: any) => {
                if (!bundle.products || bundle.products.length === 0) return;
                const bundleProductIds = bundle.products.map((p: any) => p._id || p);
                const hasAll = bundleProductIds.every((pid: string) => cart.some(i => i._id === pid));
                if (hasAll) {
                  const bundleCount = Math.min(...bundleProductIds.map((pid: string) => {
                    const item = cart.find(i => i._id === pid);
                    return item ? item.quantity : 0;
                  }));
                  
                  if (bundleCount > 0) {
                    const normalBundlePrice = bundleProductIds.reduce((sum: number, pid: string) => {
                      const item = cart.find(i => i._id === pid);
                      return sum + (item ? (item.discountPrice || item.price) : 0);
                    }, 0);
                    
                    if (normalBundlePrice > bundle.bundlePrice) {
                      discountForThisOffer += (normalBundlePrice - bundle.bundlePrice) * bundleCount;
                    }
                  }
                }
              });
            } else if (productIds.length > 0) {
              // Legacy BUNDLE
              const hasAll = productIds.every((pid: string) => cart.some(i => i._id === pid));
              if (hasAll) {
                const bundleCount = Math.min(...productIds.map((pid: string) => {
                  const item = cart.find(i => i._id === pid);
                  return item ? item.quantity : 0;
                }));
                
                if (bundleCount > 0) {
                  const normalBundlePrice = productIds.reduce((sum: number, pid: string) => {
                    const item = cart.find(i => i._id === pid);
                    return sum + (item ? (item.discountPrice || item.price) : 0);
                  }, 0);
                  
                  if (normalBundlePrice > offer.bundlePrice) {
                    discountForThisOffer += (normalBundlePrice - offer.bundlePrice) * bundleCount;
                  }
                }
              }
            }
          }

          if (discountForThisOffer > 0) {
            discounts.push({
              offerId: offer._id,
              title: offer.title,
              discountAmount: discountForThisOffer
            });
            totalDiscountAmount += discountForThisOffer;
          }
        });

        // Ensure total doesn't go below 0
        const total = Math.max(0, subtotal - totalDiscountAmount);

        return { subtotal, discounts, total };
      },

      // Get total number of items
      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'glama-cart-storage', // This saves the cart in localStorage so it survives page refreshes!
    }
  )
);