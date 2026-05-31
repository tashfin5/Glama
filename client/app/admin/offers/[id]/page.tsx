"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAdminAuthStore } from '../../../../store/useAdminAuthStore';
import { useAdminUIStore } from '@/store/useAdminUIStore';

export default function EditOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [mobileImage, setMobileImage] = useState('');
  const [titleColor, setTitleColor] = useState('#ffffff');
  const [descriptionColor, setDescriptionColor] = useState('#e5e7eb');
  const [isActive, setIsActive] = useState(true);
  const [products, setProducts] = useState<string[]>([]);
  
  const [offerType, setOfferType] = useState<string[]>(['STANDARD']);
  const [discountValue, setDiscountValue] = useState(0);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [getQuantity, setGetQuantity] = useState(1);
  const [bundlePrice, setBundlePrice] = useState(0);

  const [bogoBuyProducts, setBogoBuyProducts] = useState<string[]>([]);
  const [bogoGetProducts, setBogoGetProducts] = useState<string[]>([]);
  const [bundles, setBundles] = useState<{ bundleName: string, products: string[], bundlePrice: number }[]>([]);
  
  const [allProducts, setAllProducts] = useState<any[]>([]);
  
  const [uploading, setUploading] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const { userInfo } = useAdminAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offerRes, productsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/offers/${id}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`)
        ]);
        
        const data = offerRes.data;
        setTitle(data.title);
        useAdminUIStore.getState().setPageTitle(`Edit Offer: ${data.title}`);
        
        setDescription(data.description || '');
        setImage(data.image);
        setMobileImage(data.mobileImage || '');
        setTitleColor(data.titleColor || data.textColor || '#ffffff');
        setDescriptionColor(data.descriptionColor || data.textColor || '#e5e7eb');
        setIsActive(data.isActive);
        // Backward compatibility: ensure offerType is an array
        setOfferType(Array.isArray(data.offerType) ? data.offerType : [data.offerType || 'STANDARD']);
        setDiscountValue(data.discountValue || 0);
        setBuyQuantity(data.buyQuantity || 1);
        setGetQuantity(data.getQuantity || 1);
        setBundlePrice(data.bundlePrice || 0);
        // data.products might be array of objects or strings, we need strings for checkboxes
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products.map((p: any) => p._id || p));
        }
        if (data.bogoBuyProducts && Array.isArray(data.bogoBuyProducts)) {
          setBogoBuyProducts(data.bogoBuyProducts.map((p: any) => p._id || p));
        }
        if (data.bogoGetProducts && Array.isArray(data.bogoGetProducts)) {
          setBogoGetProducts(data.bogoGetProducts.map((p: any) => p._id || p));
        }
        if (data.bundles && Array.isArray(data.bundles)) {
          setBundles(data.bundles.map((b: any) => ({
            ...b,
            products: b.products ? b.products.map((p: any) => p._id || p) : []
          })));
        }

        setAllProducts(productsRes.data);
      } catch (error) {
        toast.error('Failed to load offer details');
        router.push('/admin/offers');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();

    // Cleanup title on unmount
    return () => {
      useAdminUIStore.getState().setPageTitle(null);
    };
  }, [id, router]);

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, formData, config);
      setImage(data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const uploadMobileFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploadingMobile(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, formData, config);
      setMobileImage(data.url);
      toast.success('Mobile Image uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Mobile Image upload failed');
    } finally {
      setUploadingMobile(false);
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/offers/${id}`,
        { 
          title, 
          description, 
          image, 
          mobileImage,
          titleColor,
          descriptionColor,
          isActive, 
          products, 
          offerType, 
          discountValue, 
          buyQuantity, 
          getQuantity, 
          bundlePrice,
          bogoBuyProducts,
          bogoGetProducts,
          bundles 
        },
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      toast.success('Offer updated successfully');
      router.push('/admin/offers');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update offer');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/offers" className="p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-medium tracking-wide text-gray-900 uppercase">Edit Offer</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Offer Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Desktop Banner Image URL *</label>
                <span className="text-[10px] text-blue-500 font-medium">Recommended: 1920x500 (Desktop)</span>
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-md focus:border-primary outline-none transition-colors bg-gray-50"
                  readOnly
                />
                <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-md font-bold uppercase tracking-widest text-xs cursor-pointer flex items-center gap-2 border border-gray-200 transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload
                  <input type="file" className="hidden" onChange={uploadFileHandler} />
                </label>
              </div>
              {image && (
                <div className="mt-4 w-full h-48 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Mobile Banner Image URL (Optional)</label>
                <span className="text-[10px] text-blue-500 font-medium">Recommended: 1080x1350 (Portrait)</span>
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={mobileImage}
                  onChange={(e) => setMobileImage(e.target.value)}
                  placeholder="Image URL or upload"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-md focus:border-primary outline-none transition-colors bg-gray-50"
                  readOnly
                />
                <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-md font-bold uppercase tracking-widest text-xs cursor-pointer flex items-center gap-2 border border-gray-200 transition-colors">
                  {uploadingMobile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload
                  <input type="file" className="hidden" onChange={uploadMobileFileHandler} />
                </label>
              </div>
              {mobileImage && (
                <div className="mt-4 w-48 h-48 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                  <img src={mobileImage} alt="Mobile Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-6">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title Text Color</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-md p-1 bg-gray-50 w-fit">
                  <input
                    type="color"
                    value={titleColor}
                    onChange={(e) => setTitleColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-sm font-mono text-gray-600 px-2">{titleColor.toUpperCase()}</span>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description Text Color</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-md p-1 bg-gray-50 w-fit">
                  <input
                    type="color"
                    value={descriptionColor}
                    onChange={(e) => setDescriptionColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-sm font-mono text-gray-600 px-2">{descriptionColor.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary accent-primary"
              />
              <label htmlFor="isActive" className="text-sm font-bold text-gray-700">Active Status</label>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Promotion Settings</label>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Offer Types</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['STANDARD', 'PERCENTAGE', 'FIXED', 'BOGO', 'BUNDLE'].map((type) => (
                      <label key={type} className="flex items-center gap-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={offerType.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setOfferType([...offerType.filter(t => t !== 'STANDARD' || type === 'STANDARD'), type]);
                            } else {
                              setOfferType(offerType.filter(t => t !== type));
                            }
                          }}
                          className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary accent-primary"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {type === 'STANDARD' ? 'Standard' : type === 'PERCENTAGE' ? 'Percentage' : type === 'FIXED' ? 'Fixed Amount' : type === 'BOGO' ? 'Buy X Get Y' : 'Bundle'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {(offerType.includes('PERCENTAGE') || offerType.includes('FIXED')) && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Discount Value
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-md outline-none bg-white"
                      placeholder="Enter % or amount"
                    />
                  </div>
                )}

                {offerType.includes('BOGO') && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Buy Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={buyQuantity}
                        onChange={(e) => setBuyQuantity(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-md outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Get Quantity (Free)</label>
                      <input
                        type="number"
                        min="1"
                        value={getQuantity}
                        onChange={(e) => setGetQuantity(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-md outline-none bg-white"
                      />
                    </div>
                  </>
                )}

                {offerType.includes('BUNDLE') && (
                  <div className="bg-blue-50 p-4 border border-blue-100 rounded-md">
                     <p className="text-sm text-blue-800 font-medium">For bundles, use the section below to create specific bundle combinations.</p>
                  </div>
                )}
              </div>
            </div>

            {offerType.includes('BOGO') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                {/* Buy Products */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Products Customer Must Buy</label>
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto p-4 border border-gray-200 rounded-md bg-gray-50">
                    {allProducts.map(product => (
                      <label key={product._id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                        <input
                          type="checkbox"
                          checked={bogoBuyProducts.includes(product._id)}
                          onChange={(e) => {
                            if (e.target.checked) setBogoBuyProducts([...bogoBuyProducts, product._id]);
                            else setBogoBuyProducts(bogoBuyProducts.filter(id => id !== product._id));
                          }}
                          className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary accent-primary"
                        />
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-gray-500">{product.brand}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Get Products */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Products Customer Gets Free</label>
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto p-4 border border-gray-200 rounded-md bg-gray-50">
                    {allProducts.map(product => (
                      <label key={product._id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                        <input
                          type="checkbox"
                          checked={bogoGetProducts.includes(product._id)}
                          onChange={(e) => {
                            if (e.target.checked) setBogoGetProducts([...bogoGetProducts, product._id]);
                            else setBogoGetProducts(bogoGetProducts.filter(id => id !== product._id));
                          }}
                          className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary accent-primary"
                        />
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-gray-500">{product.brand}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {offerType.includes('BUNDLE') && (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Bundle Combinations</label>
                  <button 
                    type="button" 
                    onClick={() => setBundles([...bundles, { bundleName: '', bundlePrice: 0, products: [] }])}
                    className="text-xs bg-primary text-white px-3 py-1.5 rounded font-bold uppercase"
                  >
                    + Add Bundle
                  </button>
                </div>
                <div className="space-y-6">
                  {bundles.map((bundle, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4 bg-gray-50 relative">
                      <button 
                        type="button" 
                        onClick={() => setBundles(bundles.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold uppercase"
                      >
                        Remove
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Bundle Name (e.g. Skincare Trio)</label>
                          <input 
                            type="text" 
                            value={bundle.bundleName} 
                            onChange={(e) => {
                              const newBundles = [...bundles];
                              newBundles[index].bundleName = e.target.value;
                              setBundles(newBundles);
                            }}
                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Bundle Price (৳)</label>
                          <input 
                            type="number" 
                            value={bundle.bundlePrice} 
                            onChange={(e) => {
                              const newBundles = [...bundles];
                              newBundles[index].bundlePrice = Number(e.target.value);
                              setBundles(newBundles);
                            }}
                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none"
                          />
                        </div>
                      </div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">Select Products for this Bundle</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md bg-white">
                        {allProducts.map(product => (
                          <label key={product._id} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer border border-transparent">
                            <input
                              type="checkbox"
                              checked={bundle.products.includes(product._id)}
                              onChange={(e) => {
                                const newBundles = [...bundles];
                                if (e.target.checked) newBundles[index].products.push(product._id);
                                else newBundles[index].products = newBundles[index].products.filter(id => id !== product._id);
                                setBundles(newBundles);
                              }}
                              className="w-3 h-3 text-primary"
                            />
                            <p className="text-[10px] text-gray-800 line-clamp-1">{product.name}</p>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  {bundles.length === 0 && <p className="text-sm text-gray-500 text-center">No bundles added yet.</p>}
                </div>
              </div>
            )}

            {(!offerType.includes('BOGO') && !offerType.includes('BUNDLE') || offerType.includes('STANDARD') || offerType.includes('PERCENTAGE') || offerType.includes('FIXED')) && (
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Attach Products to Offer</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-4 border border-gray-200 rounded-md bg-gray-50">
                  {allProducts.map(product => (
                    <label key={product._id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                      <input
                        type="checkbox"
                        checked={products.includes(product._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProducts([...products, product._id]);
                          } else {
                            setProducts(products.filter(id => id !== product._id));
                          }
                        }}
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary accent-primary"
                      />
                      <div className="flex items-center gap-3">
                        {product.images && product.images[0] && (
                          <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded border border-gray-200" />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                  {allProducts.length === 0 && (
                    <p className="text-sm text-gray-500 col-span-2 text-center py-4">No products found. Add products first.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/offers')}
              className="px-8 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-md font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="bg-primary text-white px-8 py-3 rounded-md font-bold uppercase tracking-widest hover:bg-black transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Update Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
