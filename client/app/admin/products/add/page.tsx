"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, UploadCloud, Save, X, Loader2 } from 'lucide-react';
import { useAdminAuthStore } from '../../../../store/useAdminAuthStore';

export default function AddProductPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [isKBeauty, setIsKBeauty] = useState(true);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState<{_id: string, name: string}[]>([]);
  const [brands, setBrands] = useState<{_id: string, name: string}[]>([]);
  
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { userInfo } = useAdminAuthStore();
  const router = useRouter();

  // Fetch categories & brands on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/brands')
        ]);
        setCategories(catRes.data);
        if (catRes.data.length > 0) setCategory(catRes.data[0]._id);
        
        setBrands(brandRes.data);
        if (brandRes.data.length > 0) setBrand(brandRes.data[0].name);
      } catch (error) {
        console.error('Failed to fetch initial data', error);
      }
    };
    fetchData();
  }, []);

  // Handle Cloudinary Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
      setImages([...images, data.url]);
    } catch (error) {
      console.error('Image upload failed', error);
      toast.error('Image upload failed. Ensure backend has Cloudinary credentials.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      // 1. Create dummy product
      const { data: createdProduct } = await axios.post('http://localhost:5000/api/products', {}, config);

      // 2. Update dummy product with actual form data
      await axios.put(`http://localhost:5000/api/products/${createdProduct._id}`, {
        name,
        price,
        discountPrice,
        stock,
        brand,
        description,
        isKBeauty,
        images,
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      }, config);

      toast.success('Product added successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Failed to save product', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-medium tracking-wide text-gray-900 uppercase">Add New Product</h1>
          </div>
        </div>
      </div>

      <form className="flex flex-col lg:flex-row gap-6" onSubmit={submitHandler}>
        
        {/* Left Column: Main Details */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-primary outline-none" placeholder="e.g. Advanced Snail 96 Mucin Power Essence" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-primary outline-none h-32" placeholder="Write a detailed description..."></textarea>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Pricing & Inventory</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Regular Price (৳) <span className="text-red-500">*</span></label>
                <input type="number" required value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Discount Price (৳)</label>
                <input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(Number(e.target.value))} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Stock Quantity <span className="text-red-500">*</span></label>
                <input type="number" required value={stock} onChange={(e) => setStock(Number(e.target.value))} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-primary outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Organization & Media */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Organization</h2>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Brand</label>
              <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-primary outline-none bg-white">
                <option value="">No Brand / Select Brand</option>
                {brands.map((b) => (
                  <option key={b._id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Custom Tags</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-primary outline-none" placeholder="e.g. Vegan, Best Seller, Cruelty-Free (comma separated)" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
              <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-primary outline-none bg-white">
                <option value="" disabled>Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-3 p-3 bg-pink-50 border border-pink-100 rounded-md cursor-pointer">
              <input type="checkbox" checked={isKBeauty} onChange={(e) => setIsKBeauty(e.target.checked)} className="w-4 h-4 text-primary focus:ring-primary accent-primary" />
              <span className="text-sm font-bold text-primary">Mark as K-Beauty Flagship</span>
            </label>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Product Images</h2>
            
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-primary transition-colors group">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-pink-100 transition-colors">
                {uploading ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : <UploadCloud className="w-6 h-6 text-gray-500 group-hover:text-primary" />}
              </div>
              <p className="text-sm font-bold text-gray-700">{uploading ? 'Uploading...' : 'Click to upload image'}</p>
            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {images.map((url, index) => (
                  <div key={index} className="relative aspect-square border border-gray-200 rounded-md overflow-hidden group">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button type="button" onClick={() => router.push('/admin/products')} className="px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading} className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-black transition-colors shadow-sm flex items-center gap-2 text-sm disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}