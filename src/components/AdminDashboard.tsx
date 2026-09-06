import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  Store,
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  LogOut,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Sliders,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  Filter,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Product, StoreSettings, AdminRequest } from '../types';
import { addProduct, updateProduct, deleteProduct } from '../services/productService';
import { updateStoreSettings } from '../services/storeService';
import {
  subscribeToAdminRequests,
  approveAdminRequest,
  rejectAdminRequest,
  MASTER_ADMIN_EMAIL,
  updateMasterAdminPassword,
} from '../services/adminService';

interface AdminDashboardProps {
  currentAdminEmail: string;
  products: Product[];
  storeSettings: StoreSettings;
  onViewLiveStore: () => void;
  onSignOut: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info' | 'cart' | 'error') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentAdminEmail,
  products,
  storeSettings,
  onViewLiveStore,
  onSignOut,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'store' | 'requests'>('products');

  // -------------------------------------------------------------
  // PRODUCTS STATE & MANAGEMENT
  // -------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Product Form Fields
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Living Room');
  const [prodRoom, setProdRoom] = useState('Living Room');
  const [prodPrice, setProdPrice] = useState<number | ''>('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number | ''>('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodDimensions, setProdDimensions] = useState('');
  const [prodInStock, setProdInStock] = useState(true);
  const [prodIsNew, setProdIsNew] = useState(false);
  const [prodIsBestSeller, setProdIsBestSeller] = useState(false);
  const [prodMaterials, setProdMaterials] = useState('');
  const [prodColors, setProdColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Natural Oak', hex: '#D2B48C' },
  ]);
  const [prodImageBase64, setProdImageBase64] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productFormError, setProductFormError] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // -------------------------------------------------------------
  // STORE SETTINGS STATE
  // -------------------------------------------------------------
  const [storeName, setStoreName] = useState(storeSettings.storeName || 'Furni Studio');
  const [storeStreet, setStoreStreet] = useState(storeSettings.street || '');
  const [storeCity, setStoreCity] = useState(storeSettings.city || '');
  const [storePostalCode, setStorePostalCode] = useState(storeSettings.postalCode || '');
  const [primaryEmail, setPrimaryEmail] = useState(storeSettings.primaryEmail || '');
  const [secondaryEmail, setSecondaryEmail] = useState(storeSettings.secondaryEmail || '');
  const [primaryPhone, setPrimaryPhone] = useState(storeSettings.primaryPhone || '');
  const [hotline, setHotline] = useState(storeSettings.hotline || '');
  const [whatsappNumber, setWhatsappNumber] = useState(storeSettings.whatsappNumber || '919134280545');
  const [workingHours, setWorkingHours] = useState(storeSettings.workingHours || '');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Sync settings if props update
  useEffect(() => {
    setStoreName(storeSettings.storeName || 'Furni Studio');
    setStoreStreet(storeSettings.street || '');
    setStoreCity(storeSettings.city || '');
    setStorePostalCode(storeSettings.postalCode || '');
    setPrimaryEmail(storeSettings.primaryEmail || '');
    setSecondaryEmail(storeSettings.secondaryEmail || '');
    setPrimaryPhone(storeSettings.primaryPhone || '');
    setHotline(storeSettings.hotline || '');
    setWhatsappNumber(storeSettings.whatsappNumber || '919134280545');
    setWorkingHours(storeSettings.workingHours || '');
  }, [storeSettings]);

  // -------------------------------------------------------------
  // MASTER ADMIN PASSWORD STATE
  // -------------------------------------------------------------
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [showAdminNewPassword, setShowAdminNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    if (!newAdminPassword || newAdminPassword.trim().length < 4) {
      setPasswordChangeError('Password must be at least 4 characters long.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updateMasterAdminPassword(newAdminPassword.trim());
      setPasswordChangeSuccess('Password updated successfully in database.');
      setNewAdminPassword('');
      onShowToast('Password Updated', 'Master admin password has been saved.', 'success');
    } catch (err: any) {
      setPasswordChangeError(err?.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // -------------------------------------------------------------
  // ADMIN REQUESTS STATE
  // -------------------------------------------------------------
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([]);
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAdminRequests(
      (requests) => {
        setAdminRequests(requests);
      },
      (error) => {
        console.warn('Admin requests subscription notice:', error);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const pendingRequestsCount = adminRequests.filter((r) => r.status === 'pending').length;

  // -------------------------------------------------------------
  // IMAGE UPLOAD HANDLER (Direct Gallery Upload)
  // -------------------------------------------------------------
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProductFormError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    // Convert file to Base64
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setProdImageBase64(result);
      setImageFileName(file.name);
      setProductFormError('');
    };
    reader.onerror = () => {
      setProductFormError('Failed to read selected image file.');
    };
    reader.readAsDataURL(file);
  };

  // Open modal for new product
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory('Sofa');
    setProdRoom('Living Room');
    setProdPrice('');
    setProdOriginalPrice('');
    setProdDescription('');
    setProdDimensions('');
    setProdInStock(true);
    setProdIsNew(true);
    setProdIsBestSeller(false);
    setProdMaterials('Kiln-dried Hardwood, Linen Weave');
    setProdColors([
      { name: 'Natural Oak', hex: '#D2B48C' },
      { name: 'Charcoal', hex: '#36454F' },
    ]);
    setProdImageBase64('');
    setImageFileName('');
    setProductFormError('');
    setIsProductModalOpen(true);
  };

  // Open modal for editing product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdRoom(prod.room);
    setProdPrice(prod.price);
    setProdOriginalPrice(prod.originalPrice || '');
    setProdDescription(prod.description);
    setProdDimensions(prod.dimensions || '');
    setProdInStock(prod.inStock !== false);
    setProdIsNew(prod.isNew || false);
    setProdIsBestSeller(prod.isBestSeller || false);
    setProdMaterials(prod.materials ? prod.materials.join(', ') : '');
    setProdColors(prod.colors && prod.colors.length > 0 ? prod.colors : [{ name: 'Default', hex: '#D2B48C' }]);
    setProdImageBase64(prod.image);
    setImageFileName('Current Photo');
    setProductFormError('');
    setIsProductModalOpen(true);
  };

  // Save product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      setProductFormError('Please enter a product name.');
      return;
    }
    if (prodPrice === '' || Number(prodPrice) <= 0) {
      setProductFormError('Please enter a valid selling price.');
      return;
    }
    if (!prodImageBase64) {
      setProductFormError('Please upload an image from your gallery.');
      return;
    }

    setIsSavingProduct(true);
    setProductFormError('');

    const materialsArray = prodMaterials
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    const productPayload: Product = {
      id: editingProductId || `prod_${Date.now()}`,
      name: prodName.trim(),
      category: prodCategory.trim(),
      room: prodRoom.trim(),
      price: Number(prodPrice),
      originalPrice: prodOriginalPrice !== '' ? Number(prodOriginalPrice) : undefined,
      description: prodDescription.trim(),
      dimensions: prodDimensions.trim() || undefined,
      inStock: prodInStock,
      isNew: prodIsNew,
      isBestSeller: prodIsBestSeller,
      rating: 5.0,
      reviewsCount: 1,
      image: prodImageBase64,
      materials: materialsArray.length > 0 ? materialsArray : undefined,
      colors: prodColors.filter((c) => c.name.trim() && c.hex.trim()),
    };

    try {
      if (editingProductId) {
        await updateProduct(productPayload);
        onShowToast('Product Updated', `"${prodName}" was updated successfully.`, 'success');
      } else {
        await addProduct(productPayload);
        onShowToast('Product Added', `"${prodName}" was added to the catalog.`, 'success');
      }
      setIsProductModalOpen(false);
    } catch (err: any) {
      console.error('Save product error:', err);
      setProductFormError(err.message || 'Failed to save product.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (prod: Product) => {
    if (window.confirm(`Are you sure you want to delete "${prod.name}" from the store catalog?`)) {
      try {
        await deleteProduct(prod.id);
        onShowToast('Product Removed', `"${prod.name}" was removed.`, 'info');
      } catch (err: any) {
        console.error('Delete product error:', err);
        onShowToast('Error', 'Failed to remove product.', 'error');
      }
    }
  };

  // Save Store Settings
  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);

    try {
      await updateStoreSettings({
        storeName: storeName.trim(),
        street: storeStreet.trim(),
        city: storeCity.trim(),
        postalCode: storePostalCode.trim(),
        primaryEmail: primaryEmail.trim(),
        secondaryEmail: secondaryEmail.trim() || undefined,
        primaryPhone: primaryPhone.trim(),
        hotline: hotline.trim() || undefined,
        whatsappNumber: whatsappNumber.trim(),
        workingHours: workingHours.trim(),
      });
      onShowToast('Settings Saved', 'Store information has been updated successfully.', 'success');
    } catch (err: any) {
      console.error('Save settings error:', err);
      onShowToast('Error', 'Failed to update store settings.', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Approve Admin Request
  const handleApproveRequest = async (request: AdminRequest) => {
    setActionLoadingId(request.id);
    try {
      await approveAdminRequest(request.id, currentAdminEmail);
      onShowToast('Request Approved', `${request.fullName} (${request.email}) can now sign in as administrator.`, 'success');
    } catch (err: any) {
      console.error('Approve error:', err);
      onShowToast('Error', 'Failed to approve request.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Reject Admin Request
  const handleRejectRequest = async (request: AdminRequest) => {
    setActionLoadingId(request.id);
    try {
      await rejectAdminRequest(request.id, currentAdminEmail);
      onShowToast('Request Rejected', `${request.fullName} has been declined administrator access.`, 'info');
    } catch (err: any) {
      console.error('Reject error:', err);
      onShowToast('Error', 'Failed to reject request.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter || p.room === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Requests
  const filteredRequests = adminRequests.filter((r) => {
    if (requestFilter === 'all') return true;
    return r.status === requestFilter;
  });

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#C08251]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-stone-900">Admin Dashboard</span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-stone-500 truncate max-w-[200px] sm:max-w-xs">
                {currentAdminEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="admin-view-store-btn"
              onClick={onViewLiveStore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              id="admin-sign-out-btn"
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center overflow-x-auto w-full sm:w-auto bg-white p-1 rounded-xl border border-stone-200 shadow-xs text-xs font-semibold">
            <button
              id="nav-tab-products"
              onClick={() => setActiveTab('products')}
              className={`px-3.5 sm:px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span>Products ({products.length})</span>
            </button>

            <button
              id="nav-tab-store"
              onClick={() => setActiveTab('store')}
              className={`px-3.5 sm:px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'store'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Store className="w-4 h-4 shrink-0" />
              <span>Store Details</span>
            </button>

            <button
              id="nav-tab-requests"
              onClick={() => setActiveTab('requests')}
              className={`px-3.5 sm:px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer relative ${
                activeTab === 'requests'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Admin Requests</span>
              {pendingRequestsCount > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              id="add-new-product-btn"
              onClick={handleOpenAddProduct}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          )}
        </div>

        {/* --------------------------------------------------------- */}
        {/* TAB 1: PRODUCT CATALOG MANAGEMENT */}
        {/* --------------------------------------------------------- */}
        {activeTab === 'products' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name, category, or room..."
                  className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 focus:border-stone-800 focus:bg-white rounded-xl outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 outline-none cursor-pointer w-full sm:w-auto"
                >
                  <option value="All">All Categories & Rooms</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Dining Room">Dining Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Home Office">Home Office</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Sofa">Sofas & Sectionals</option>
                  <option value="Chair">Lounge Chairs</option>
                  <option value="Table">Dining & Accent Tables</option>
                  <option value="Storage">Credenzas & Storage</option>
                  <option value="Lighting">Lighting</option>
                </select>
              </div>
            </div>

            {/* MOBILE BOX / CARD VIEW (Shown on mobile screens < md) */}
            <div className="block md:hidden">
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-400 text-xs shadow-xs">
                  No products found matching your search.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between gap-3 hover:border-stone-300 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="font-bold text-stone-900 text-xs leading-snug line-clamp-2">
                              {p.name}
                            </h3>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            <span className="text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md font-medium">
                              {p.category}
                            </span>
                            <span className="text-stone-500">
                              • {p.room}
                            </span>
                          </div>

                          <div className="pt-0.5">
                            {p.inStock !== false ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <span className="text-sm font-bold text-stone-900">${p.price}</span>
                          {p.originalPrice && (
                            <span className="text-[11px] text-stone-400 line-through ml-1.5">
                              ${p.originalPrice}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="py-1.5 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DESKTOP TABLE VIEW (Preserved exactly as is for desktop >= md) */}
            <div className="hidden md:block bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 font-semibold uppercase tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="py-3.5 px-4">Item</th>
                      <th className="py-3.5 px-4">Category & Room</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-stone-400">
                          No products found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="font-semibold text-stone-900 block truncate max-w-xs">
                                  {p.name}
                                </span>
                                <span className="text-[11px] text-stone-400">ID: {p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-stone-800 block">{p.category}</span>
                            <span className="text-[11px] text-stone-500">{p.room}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-stone-900">${p.price}</span>
                            {p.originalPrice && (
                              <span className="text-[11px] text-stone-400 line-through block">
                                ${p.originalPrice}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {p.inStock !== false ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                                Out of Stock
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p)}
                                className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* TAB 2: STORE INFORMATION MANAGEMENT */}
        {/* --------------------------------------------------------- */}
        {activeTab === 'store' && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-200 pb-4 mb-6">
              <h2 className="text-lg font-bold text-stone-900">Store Profile & Contacts</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Update store location, emails, phone numbers, and WhatsApp ordering credentials
              </p>
            </div>

            <form onSubmit={handleSaveStoreSettings} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">
                    WhatsApp Order Phone Number (International format, e.g. 919134280545)
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="919134280545"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Physical Address Section */}
              <div className="pt-2 border-t border-stone-100">
                <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  <span>Physical Address</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={storeStreet}
                      onChange={(e) => setStoreStreet(e.target.value)}
                      placeholder="e.g. 88 Woodcraft Boulevard"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        City & State
                      </label>
                      <input
                        type="text"
                        required
                        value={storeCity}
                        onChange={(e) => setStoreCity(e.target.value)}
                        placeholder="Kolkata, West Bengal"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Postal / PIN Code
                      </label>
                      <input
                        type="text"
                        required
                        value={storePostalCode}
                        onChange={(e) => setStorePostalCode(e.target.value)}
                        placeholder="700001"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Numbers & Emails */}
              <div className="pt-3 border-t border-stone-100">
                <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  <span>Telephones & Gmail / Emails</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Primary Gmail / Email
                    </label>
                    <input
                      type="email"
                      required
                      value={primaryEmail}
                      onChange={(e) => setPrimaryEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Secondary / Support Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={secondaryEmail}
                      onChange={(e) => setSecondaryEmail(e.target.value)}
                      placeholder="support@furnistudio.com"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Primary Telephone
                    </label>
                    <input
                      type="tel"
                      required
                      value={primaryPhone}
                      onChange={(e) => setPrimaryPhone(e.target.value)}
                      placeholder="+91 91342 80545"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Hotline / Toll Free (Optional)
                    </label>
                    <input
                      type="tel"
                      value={hotline}
                      onChange={(e) => setHotline(e.target.value)}
                      placeholder="+91 91342 80545"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="pt-3 border-t border-stone-100">
                <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Operating Schedule</span>
                </label>
                <input
                  type="text"
                  required
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="Monday - Saturday: 9:00 AM - 8:00 PM"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                />
              </div>

              <div className="pt-4 border-t border-stone-200">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSettings ? 'Saving Changes...' : 'Save Store Details'}</span>
                </button>
              </div>
            </form>

            {/* MASTER ADMIN SECURITY & PASSWORD MANAGEMENT CARD */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="border-b border-stone-200 pb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#C08251]" />
                  <h3 className="text-base font-bold text-stone-900">Master Admin Security & Credentials</h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Update administrator login password for <strong className="text-stone-800">{MASTER_ADMIN_EMAIL}</strong>
                </p>
              </div>

              {passwordChangeError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{passwordChangeError}</span>
                </div>
              )}

              {passwordChangeSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{passwordChangeSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-3.5 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminNewPassword ? 'text' : 'password'}
                      required
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none text-xs transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminNewPassword(!showAdminNewPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showAdminNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Key className="w-3.5 h-3.5 text-[#C08251]" />
                    <span>{isUpdatingPassword ? 'Saving Password...' : 'Save New Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* TAB 3: ADMIN ACCESS REQUESTS & APPROVALS */}
        {/* --------------------------------------------------------- */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Filter Pill Header */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <h2 className="text-sm font-bold text-stone-900">Administrator Access Applications</h2>
                <p className="text-[11px] text-stone-500">
                  Review and approve pending team requests or revoke existing authorizations
                </p>
              </div>

              <div className="flex items-center overflow-x-auto w-full sm:w-auto gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((statusVal) => (
                  <button
                    key={statusVal}
                    onClick={() => setRequestFilter(statusVal)}
                    className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-colors cursor-pointer flex-1 sm:flex-initial text-center ${
                      requestFilter === statusVal
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {statusVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Request List */}
            <div className="space-y-3">
              {filteredRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400 text-xs">
                  No administrator applications found for this filter.
                </div>
              ) : (
                filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-wrap items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-[280px]">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-stone-900 text-sm">{req.fullName}</span>

                        {req.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </span>
                        )}
                        {req.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Approved Administrator
                          </span>
                        )}
                        {req.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          {req.email}
                        </span>
                        {req.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-stone-400" />
                            {req.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] text-stone-400">
                          <Calendar className="w-3.5 h-3.5" />
                          Requested: {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>

                      {req.reason && (
                        <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-150 leading-relaxed mt-2">
                          <strong className="text-stone-800">Application Statement:</strong> {req.reason}
                        </p>
                      )}

                      {req.reviewedBy && (
                        <p className="text-[11px] text-stone-400 mt-1">
                          Reviewed by {req.reviewedBy} on{' '}
                          {req.reviewedAt ? new Date(req.reviewedAt).toLocaleDateString() : ''}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons for Admins */}
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-1">
                      {req.status !== 'approved' && (
                        <button
                          onClick={() => handleApproveRequest(req)}
                          disabled={actionLoadingId === req.id}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Access</span>
                        </button>
                      )}

                      {req.status !== 'rejected' && (
                        <button
                          onClick={() => handleRejectRequest(req)}
                          disabled={actionLoadingId === req.id}
                          className="bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* --------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT PRODUCT (Direct Gallery Upload) */}
      {/* --------------------------------------------------------- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            id="product-editor-modal"
            className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-left border border-stone-200 shadow-xl overflow-hidden max-h-[92vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-stone-200 pb-4 mb-5">
              <h3 className="text-lg font-bold text-stone-900">
                {editingProductId ? 'Edit Product Item' : 'Add New Furniture Piece'}
              </h3>
              <p className="text-xs text-stone-500">
                Configure full specifications and upload imagery directly from your device gallery
              </p>
            </div>

            {productFormError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{productFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* DIRECT GALLERY PHOTO UPLOAD */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1.5">
                  Product Photograph (Direct Device Gallery Upload) <span className="text-rose-600">*</span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    prodImageBase64
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-stone-300 hover:border-stone-500 bg-stone-50'
                  }`}
                >
                  {prodImageBase64 ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={prodImageBase64}
                        alt="Preview"
                        className="w-32 h-32 rounded-xl object-cover border border-stone-200 shadow-xs mb-2"
                      />
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Photo loaded from gallery ({imageFileName || 'Selected'})
                      </span>
                      <span className="text-[11px] text-stone-400 mt-0.5">Click to choose a different photo</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-stone-800">
                        Choose photo from gallery or drag file here
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        High resolution JPG, PNG, WEBP supported
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Title & Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Product Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Minimalist Oak Credenza"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Room Category <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={prodRoom}
                    onChange={(e) => setProdRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                  >
                    <option value="Living Room">Living Room</option>
                    <option value="Dining Room">Dining Room</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Home Office">Home Office</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>
                </div>
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Style Category <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    placeholder="e.g. Sofa, Tables, Storage"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Selling Price ($) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="1200"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Original Price ($) (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="1500"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Artisan crafted with sustainably harvested materials..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none resize-none"
                />
              </div>

              {/* Dimensions & Materials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Dimensions (e.g. 72" W x 36" D x 30" H)
                  </label>
                  <input
                    type="text"
                    value={prodDimensions}
                    onChange={(e) => setProdDimensions(e.target.value)}
                    placeholder='72" W x 36" D x 30" H'
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Craft Materials (comma separated)
                  </label>
                  <input
                    type="text"
                    value={prodMaterials}
                    onChange={(e) => setProdMaterials(e.target.value)}
                    placeholder="Kiln-dried Teak, Solid Brass, Top Grain Leather"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:border-stone-800 focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Badges and Stock Toggles */}
              <div className="flex flex-wrap items-center gap-6 p-3 rounded-xl bg-stone-50 border border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodInStock}
                    onChange={(e) => setProdInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-stone-900"
                  />
                  <span className="font-semibold text-stone-800">In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsNew}
                    onChange={(e) => setProdIsNew(e.target.checked)}
                    className="w-4 h-4 rounded text-stone-900"
                  />
                  <span className="font-semibold text-stone-800">New Arrival Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsBestSeller}
                    onChange={(e) => setProdIsBestSeller(e.target.checked)}
                    className="w-4 h-4 rounded text-stone-900"
                  />
                  <span className="font-semibold text-stone-800">Bestseller Badge</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProduct ? 'Saving Piece...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
