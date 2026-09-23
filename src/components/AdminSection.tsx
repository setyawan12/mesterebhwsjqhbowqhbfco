import React, { useState, useEffect, useMemo } from 'react';
import { ProductItem } from '../data/mscellData.ts';
import { BlogPost, DEFAULT_BLOG_POSTS } from '../data/blogData.ts';
import { Marquee } from './Marquee.tsx';
import {
  SiteSettings,
  updateSiteSettings,
  saveProductToFirebase,
  deleteProductFromFirebase,
  seedAllProductsToFirebase,
  saveBlogPostToFirebase,
  deleteBlogPostFromFirebase,
  seedDefaultBlogPostsToFirebase,
  firebaseConfig,
} from '../firebase.ts';

interface AdminSectionProps {
  settings: SiteSettings;
  products: ProductItem[];
  articles?: BlogPost[];
  onBackToHome: () => void;
}

export const AdminSection: React.FC<AdminSectionProps> = ({
  settings,
  products,
  articles = DEFAULT_BLOG_POSTS,
  onBackToHome,
}) => {
  // Passcode security: default 'mscell123'
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('mscell_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Active admin tab: 'settings' | 'products' | 'bulk' | 'blog' | 'database'
  const [activeTab, setActiveTab] = useState<'settings' | 'products' | 'bulk' | 'blog' | 'database'>('settings');

  // Form states for settings
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Keep formData synced with settings if not actively saving
  useEffect(() => {
    if (!isSavingSettings) {
      setFormData(settings);
    }
  }, [settings, isSavingSettings]);

  // Product management states
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // New product initial state
  const [newProduct, setNewProduct] = useState<Partial<ProductItem>>({
    category: 'internet',
    provider: 'Indosat',
    name: '',
    amount: '',
    price: 'Rp ',
    period: '30 Hari',
    info: '',
    isAvailable: true,
  });

  // Seed / sync state
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedReport, setSeedReport] = useState('');

  // Delete modal state (in-app modal, avoiding iframe window.confirm block)
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');

  // Confirmation modal states
  const [isSeedModalOpen, setIsSeedModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Bulk price edit state
  const [bulkCategory, setBulkCategory] = useState<string>('internet');
  const [bulkAdjustment, setBulkAdjustment] = useState<number>(1000);
  const [isApplyingBulk, setIsApplyingBulk] = useState(false);

  // Blog articles admin state
  const [blogSearchQuery, setBlogSearchQuery] = useState('');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('all');
  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogPost | null>(null);
  const [previewArticle, setPreviewArticle] = useState<BlogPost | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<BlogPost | null>(null);
  const [isSavingArticle, setIsSavingArticle] = useState(false);
  const [isDeletingArticle, setIsDeletingArticle] = useState(false);

  // New Article Form state
  const initialArticleForm: Partial<BlogPost> = {
    title: '',
    category: 'Tips & Panduan',
    author: 'Admin MsCell',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    readTime: '3 mnt baca',
    summary: '',
    content: '',
    tags: ['MsCell', 'Tips'],
    isPublished: true,
  };
  const [newArticle, setNewArticle] = useState<Partial<BlogPost>>(initialArticleForm);
  const [tagInput, setTagInput] = useState('MsCell, Tips');

  // Filtered articles in admin list
  const filteredAdminArticles = useMemo(() => {
    return articles.filter((post) => {
      const matchesCat =
        blogCategoryFilter === 'all' || post.category === blogCategoryFilter;
      const q = blogSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [articles, blogCategoryFilter, blogSearchQuery]);

  // Handle Save New Article
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content) {
      alert('Judul dan isi konten artikel wajib diisi!');
      return;
    }

    setIsSavingArticle(true);
    try {
      const generatedId = `post-${Date.now()}`;
      const slug = (newArticle.title || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const parsedTags = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const fullPost: BlogPost = {
        id: generatedId,
        title: newArticle.title || '',
        slug: slug || generatedId,
        category: (newArticle.category as any) || 'Tips & Panduan',
        author: newArticle.author || 'Admin MsCell',
        date: newArticle.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        createdAt: Date.now(),
        imageUrl: newArticle.imageUrl || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
        readTime: newArticle.readTime || '3 mnt baca',
        summary: newArticle.summary || '',
        content: newArticle.content || '',
        tags: parsedTags.length > 0 ? parsedTags : ['MsCell'],
        isPublished: newArticle.isPublished !== false,
      };

      await saveBlogPostToFirebase(fullPost);
      setSaveSuccessMsg(`Artikel "${fullPost.title}" berhasil diunggah ke website!`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
      setIsNewArticleModalOpen(false);
      setNewArticle(initialArticleForm);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Gagal menyimpan artikel: ${err?.message || 'Periksa koneksi internet'}`);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSavingArticle(false);
    }
  };

  // Handle Update Existing Article
  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title || !editingArticle.content) return;

    setIsSavingArticle(true);
    try {
      await saveBlogPostToFirebase(editingArticle);
      setSaveSuccessMsg(`Artikel "${editingArticle.title}" berhasil diperbarui di Firebase!`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
      setEditingArticle(null);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Gagal memperbarui artikel: ${err?.message || 'Periksa koneksi'}`);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSavingArticle(false);
    }
  };

  // Handle Toggle Publish/Draft
  const handleTogglePublishArticle = async (post: BlogPost) => {
    try {
      const updated = { ...post, isPublished: !post.isPublished };
      await saveBlogPostToFirebase(updated);
      setSaveSuccessMsg(
        updated.isPublished
          ? `Artikel "${post.title}" sekarang TERBIT di website.`
          : `Artikel "${post.title}" diubah menjadi DRAF.`
      );
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Gagal mengubah status publikasi: ${err?.message || ''}`);
    }
  };

  // Handle Confirm Delete Article
  const confirmDeleteArticle = async () => {
    if (!articleToDelete) return;
    setIsDeletingArticle(true);
    try {
      await deleteBlogPostFromFirebase(articleToDelete.id);
      setSaveSuccessMsg(`Artikel "${articleToDelete.title}" berhasil dihapus dari Firebase.`);
      setTimeout(() => setSaveSuccessMsg(''), 3500);
      setArticleToDelete(null);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Gagal menghapus artikel: ${err?.message || ''}`);
    } finally {
      setIsDeletingArticle(false);
    }
  };

  // Quick preset images for fast authoring
  const imagePresets = [
    { label: '📱 Kuota & Data', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80' },
    { label: '📞 Pulsa & Nomor', url: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80' },
    { label: '⚡ Token PLN Listrik', url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80' },
    { label: '🏦 Agen BRILink', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80' },
    { label: '🎮 Top Up Game', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80' },
    { label: '🏪 Konter MsCell', url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80' },
  ];

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('mscell_pin') || 'mscell123';
    if (passcode === storedPin || passcode === 'mscell123' || passcode === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('mscell_admin_auth', 'true');
      setPasscodeError('');
    } else {
      setPasscodeError('Kata sandi salah! Gunakan sandi admin default: mscell123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('mscell_admin_auth');
  };

  // Handle Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await updateSiteSettings(formData);
      setSaveSuccessMsg('Pengaturan & Marquee berhasil disimpan ke Firebase!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan pengaturan ke Firebase.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Filtered products for admin
  const filteredProducts = products.filter((item) => {
    const matchCat =
      productCategoryFilter === 'all' || item.category === productCategoryFilter;
    const q = productSearch.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      (item.provider && item.provider.toLowerCase().includes(q)) ||
      (item.amount && item.amount.toLowerCase().includes(q)) ||
      item.price.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // Handle Save Product (Edit or New)
  const handleSaveProductItem = async (productToSave: ProductItem) => {
    setIsSavingProduct(true);
    try {
      await saveProductToFirebase(productToSave);
      setEditingProduct(null);
      setIsNewProductModalOpen(false);
      setSaveSuccessMsg(`Produk "${productToSave.name}" berhasil disimpan ke Firebase!`);
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan produk ke Firebase.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Handle Delete Product - Open in-app confirmation modal
  const openDeleteModal = (productId: string, name: string) => {
    setDeleteErrorMsg('');
    setProductToDelete({ id: productId, name });
  };

  // Confirm and execute delete from Firebase
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeletingProduct(true);
    setDeleteErrorMsg('');
    try {
      await deleteProductFromFirebase(productToDelete.id);
      setSaveSuccessMsg(`Produk "${productToDelete.name}" berhasil dihapus dari Firebase!`);
      setTimeout(() => setSaveSuccessMsg(''), 3500);
      setProductToDelete(null);
    } catch (err: any) {
      console.error(err);
      setDeleteErrorMsg(err?.message || 'Gagal menghapus produk dari Firebase. Periksa koneksi internet.');
    } finally {
      setIsDeletingProduct(false);
    }
  };

  // Handle Toggle Availability
  const handleToggleAvailable = async (item: ProductItem) => {
    const updated = { ...item, isAvailable: item.isAvailable === false ? true : false };
    try {
      await saveProductToFirebase(updated);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Gagal memperbarui status: ${err?.message || 'Periksa koneksi'}`);
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  // Handle Seed to Firebase
  const executeSeedAll = async () => {
    setIsSeeding(true);
    setIsSeedModalOpen(false);
    try {
      const count = await seedAllProductsToFirebase();
      setSeedReport(`Berhasil menyinkronkan ${count} produk ke Firebase Firestore!`);
      setSaveSuccessMsg(`Berhasil menyinkronkan ${count} produk ke Firebase!`);
      setTimeout(() => {
        setSeedReport('');
        setSaveSuccessMsg('');
      }, 5000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Gagal menyinkronkan ke Firebase: ${err?.message || 'Periksa koneksi internet'}`);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSeeding(false);
    }
  };

  // Handle Bulk Price Adjustment
  const executeApplyBulk = async () => {
    setIsApplyingBulk(true);
    setIsBulkModalOpen(false);
    try {
      const targetItems = products.filter(p => p.category === bulkCategory);
      for (const item of targetItems) {
        const currentPriceNum = parseInt(item.price.replace(/\D/g, ''), 10) || 0;
        if (currentPriceNum > 0) {
          const newPriceNum = Math.max(0, currentPriceNum + bulkAdjustment);
          const updatedPriceStr = `Rp ${newPriceNum.toLocaleString('id-ID')}`;
          await saveProductToFirebase({ ...item, price: updatedPriceStr });
        }
      }
      setSaveSuccessMsg(`Harga berhasil diperbarui untuk ${targetItems.length} produk!`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Gagal penyesuaian harga: ${err?.message || ''}`);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsApplyingBulk(false);
    }
  };

  // If NOT authenticated, show clean PIN login
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 text-[#007bff] rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
            <i className="bx bxs-lock-alt"></i>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
            Panel Privat MsCell
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Halaman khusus pengelola untuk mengendalikan marquee, produk, harga, dan kontak yang tersimpan di Firebase Firestore.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1.5">
                Kata Sandi Admin:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Masukkan sandi (default: mscell123)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#007bff] text-sm pr-10"
                  autoFocus
                />
                <i className="bx bx-key absolute right-3 top-3.5 text-gray-400 text-lg"></i>
              </div>
              {passcodeError && (
                <p className="text-xs text-red-600 mt-1.5 font-medium">{passcodeError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#007bff] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition cursor-pointer shadow-md text-sm flex items-center justify-center gap-2"
            >
              <i className="bx bx-log-in text-lg"></i>
              Buka Panel Pengelola
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Status Firebase:</span>
            <span className="font-mono text-green-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {firebaseConfig.projectId}
            </span>
          </div>

          <div className="mt-4">
            <button
              onClick={onBackToHome}
              className="text-xs text-blue-600 hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <i className="bx bx-arrow-back"></i> Kembali ke Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-100 min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#007bff] flex items-center justify-center text-2xl font-bold border border-blue-100">
              <i className="bx bxs-dashboard"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Panel Pengendali MsCell (Privat)
                </h1>
                <span className="bg-green-100 text-green-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-green-200">
                  Firebase Live
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Semua perubahan harga, produk, dan teks marquee tersimpan langsung di Firebase & sinkron otomatis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={onBackToHome}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <i className="bx bx-show text-base"></i>
              Lihat Tampilan Web
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <i className="bx bx-log-out text-base"></i>
              Kunci / Keluar
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccessMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-sm font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <i className="bx bx-check-circle text-xl text-green-600"></i>
              <span>{saveSuccessMsg}</span>
            </div>
            <button
              onClick={() => setSaveSuccessMsg('')}
              className="text-green-600 hover:text-green-900 cursor-pointer"
            >
              <i className="bx bx-x text-lg"></i>
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#007bff] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <i className="bx bx-slider-alt text-lg"></i>
            Marquee & Kontak Konter
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#007bff] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <i className="bx bx-list-check text-lg"></i>
            Kelola Produk & Harga ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'bulk'
                ? 'bg-[#007bff] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <i className="bx bx-trending-up text-lg"></i>
            Penyesuaian Harga Cepat
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'blog'
                ? 'bg-[#007bff] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <i className="bx bx-news text-lg"></i>
            Kelola Blog & Artikel ({articles.length})
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'database'
                ? 'bg-[#007bff] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <i className="bx bxs-data text-lg"></i>
            Sinkronisasi Database
          </button>
        </div>

        {/* TAB 1: MARQUEE & KONTER SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200">
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-gray-900">
                Pengaturan Marquee Berjalan & Informasi Konter
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Teks berjalan dan kontak yang diperbarui di sini akan langsung tampil pada seluruh pengunjung website.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Header Marquee Preview, Speed & Input */}
              <div className="bg-cyan-50/70 border border-cyan-200 rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <label className="text-sm font-bold text-gray-800">
                    1. Teks Marquee Header (Warna Cyan Atas):
                  </label>
                  <span className="text-[11px] font-semibold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md border border-cyan-300">
                    Header Banner Website
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Teks promosi yang berjalan di bagian paling atas halaman:
                </p>
                <textarea
                  rows={2}
                  value={formData.headerMarquee}
                  onChange={(e) => setFormData({ ...formData, headerMarquee: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#007bff] text-sm bg-white"
                  placeholder="Masukkan teks marquee atas..."
                  required
                />

                {/* Pengaturan Kecepatan Marquee Header */}
                <div className="mt-4 pt-4 border-t border-cyan-200/80">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <i className="bx bx-tachometer text-base text-cyan-700"></i>
                        Atur Kecepatan Marquee Header:
                      </span>
                      <p className="text-[11px] text-gray-500">
                        Durasi satu putaran penuh (semakin kecil detik = semakin cepat jalannya)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-cyan-700 text-white font-mono shadow-xs">
                        {formData.headerMarqueeSpeed ?? 20} Detik
                      </span>
                      <span className="text-[11px] font-semibold text-gray-700 bg-white px-2 py-1 rounded-lg border border-cyan-200">
                        {(formData.headerMarqueeSpeed ?? 20) <= 12
                          ? '⚡ Sangat Cepat'
                          : (formData.headerMarqueeSpeed ?? 20) <= 18
                          ? '⚡ Cepat'
                          : (formData.headerMarqueeSpeed ?? 20) <= 26
                          ? '👍 Normal / Sedang'
                          : (formData.headerMarqueeSpeed ?? 20) <= 38
                          ? '🚶 Lambat'
                          : '🐢 Sangat Lambat'}
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="6"
                    max="50"
                    step="1"
                    value={formData.headerMarqueeSpeed ?? 20}
                    onChange={(e) =>
                      setFormData({ ...formData, headerMarqueeSpeed: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-600 cursor-pointer h-2 bg-cyan-200 rounded-lg"
                  />

                  {/* Tombol Pilihan Cepat */}
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Pilihan Cepat:</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, headerMarqueeSpeed: 12 })}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer border ${
                        (formData.headerMarqueeSpeed ?? 20) === 12
                          ? 'bg-cyan-600 text-white border-cyan-600 font-bold'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      ⚡ Cepat (12s)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, headerMarqueeSpeed: 20 })}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer border ${
                        (formData.headerMarqueeSpeed ?? 20) === 20
                          ? 'bg-cyan-600 text-white border-cyan-600 font-bold'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      👍 Standar (20s)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, headerMarqueeSpeed: 35 })}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer border ${
                        (formData.headerMarqueeSpeed ?? 20) === 35
                          ? 'bg-cyan-600 text-white border-cyan-600 font-bold'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      🐢 Lambat (35s)
                    </button>
                  </div>

                  {/* Pratinjau Bergerak Langsung */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                        Pratinjau Kecepatan Bergerak (Live):
                      </span>
                      <span className="text-[10px] text-gray-400">Arahkan kursor untuk jeda</span>
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-xs border border-cyan-300">
                      <Marquee
                        text={formData.headerMarquee || 'Teks Marquee Kosong'}
                        speed={formData.headerMarqueeSpeed ?? 20}
                        bgColor="#B0E0E6"
                        textColor="#111827"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer / Catalog Marquee Preview, Speed & Input */}
              <div className="bg-gray-100/70 border border-gray-300 rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <label className="text-sm font-bold text-gray-800">
                    2. Teks Marquee Katalog (Warna Abu-Abu Bawah Tabel):
                  </label>
                  <span className="text-[11px] font-semibold text-gray-700 bg-gray-200 px-2 py-0.5 rounded-md border border-gray-300">
                    Bawah Tabel Paket
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Pemberitahuan perubahan harga di bawah tabel paket:
                </p>
                <input
                  type="text"
                  value={formData.footerMarquee}
                  onChange={(e) => setFormData({ ...formData, footerMarquee: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#007bff] text-sm bg-white"
                  placeholder="Contoh: Harga Sewaktu-Waktu Dapat Berubah Tanpa Pemberitahuan"
                  required
                />

                {/* Pengaturan Kecepatan Marquee Katalog */}
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <i className="bx bx-tachometer text-base text-gray-700"></i>
                        Atur Kecepatan Marquee Katalog:
                      </span>
                      <p className="text-[11px] text-gray-500">
                        Durasi satu putaran penuh teks di bawah tabel paket
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-gray-800 text-white font-mono shadow-xs">
                        {formData.footerMarqueeSpeed ?? 25} Detik
                      </span>
                      <span className="text-[11px] font-semibold text-gray-700 bg-white px-2 py-1 rounded-lg border border-gray-300">
                        {(formData.footerMarqueeSpeed ?? 25) <= 14
                          ? '⚡ Sangat Cepat'
                          : (formData.footerMarqueeSpeed ?? 25) <= 20
                          ? '⚡ Cepat'
                          : (formData.footerMarqueeSpeed ?? 25) <= 30
                          ? '👍 Normal / Sedang'
                          : (formData.footerMarqueeSpeed ?? 25) <= 42
                          ? '🚶 Lambat'
                          : '🐢 Sangat Lambat'}
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="6"
                    max="60"
                    step="1"
                    value={formData.footerMarqueeSpeed ?? 25}
                    onChange={(e) =>
                      setFormData({ ...formData, footerMarqueeSpeed: Number(e.target.value) })
                    }
                    className="w-full accent-gray-700 cursor-pointer h-2 bg-gray-300 rounded-lg"
                  />

                  {/* Tombol Pilihan Cepat */}
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Pilihan Cepat:</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, footerMarqueeSpeed: 15 })}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer border ${
                        (formData.footerMarqueeSpeed ?? 25) === 15
                          ? 'bg-gray-800 text-white border-gray-800 font-bold'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      ⚡ Cepat (15s)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, footerMarqueeSpeed: 25 })}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer border ${
                        (formData.footerMarqueeSpeed ?? 25) === 25
                          ? 'bg-gray-800 text-white border-gray-800 font-bold'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      👍 Standar (25s)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, footerMarqueeSpeed: 40 })}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer border ${
                        (formData.footerMarqueeSpeed ?? 25) === 40
                          ? 'bg-gray-800 text-white border-gray-800 font-bold'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      🐢 Lambat (40s)
                    </button>
                  </div>

                  {/* Pratinjau Bergerak Langsung */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                        Pratinjau Kecepatan Bergerak (Live):
                      </span>
                      <span className="text-[10px] text-gray-400">Arahkan kursor untuk jeda</span>
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-xs border border-gray-400">
                      <Marquee
                        text={formData.footerMarquee || 'Teks Marquee Kosong'}
                        speed={formData.footerMarqueeSpeed ?? 25}
                        bgColor="#A9A9A9"
                        textColor="#111827"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Status & WhatsApp Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Status Operasional Konter:
                  </label>
                  <select
                    value={formData.storeStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        storeStatus: e.target.value as 'Buka' | 'Tutup' | 'Istirahat',
                      })
                    }
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#007bff] text-sm bg-white font-semibold"
                  >
                    <option value="Buka">🟢 Buka (Melayani Transaksi)</option>
                    <option value="Istirahat">🟡 Istirahat Sementara</option>
                    <option value="Tutup">🔴 Tutup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Nomor WhatsApp Penerima Pesanan:
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="085156482636"
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#007bff] text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Nomor Telepon / Call Center:
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="085156482636"
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#007bff] text-sm"
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Email Kontak:
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="mestersartono1975@gmail.com"
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#007bff] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Instagram URL:
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="https://instagram.com/mestere_cell"
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#007bff] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Alamat Lengkap Konter:
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl.Tegal Ngandong no 18..."
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#007bff] text-sm"
                />
              </div>

              {/* Save Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="bg-[#007bff] hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <i className={`bx ${isSavingSettings ? 'bx-loader bx-spin' : 'bxs-save'} text-xl`}></i>
                  {isSavingSettings ? 'Menyimpan ke Firebase...' : 'Simpan Semua Pengaturan ke Firebase'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: KELOLA PRODUK & HARGA */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Katalog Seluruh Produk MsCell ({filteredProducts.length})
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Edit harga secara berskala, tambah paket baru, atau aktifkan/nonaktifkan stok.
                </p>
              </div>

              <button
                onClick={() => {
                  setNewProduct({
                    category: 'internet',
                    provider: 'Indosat',
                    name: '',
                    amount: '',
                    price: 'Rp ',
                    period: '30 Hari',
                    info: '',
                    isAvailable: true,
                  });
                  setIsNewProductModalOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <i className="bx bx-plus text-lg"></i>
                Tambah Produk Baru
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row gap-3 mb-6 items-center justify-between">
              {/* Category chips */}
              <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
                {[
                  { key: 'all', label: 'Semua' },
                  { key: 'internet', label: 'Voucher Internet' },
                  { key: 'pulsa', label: 'Pulsa' },
                  { key: 'pln', label: 'Token PLN' },
                  { key: 'game', label: 'Game Online' },
                  { key: 'bank', label: 'BRILink' },
                ].map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setProductCategoryFilter(c.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      productCategoryFilter === c.key
                        ? 'bg-[#007bff] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full lg:w-72">
                <input
                  type="text"
                  placeholder="Cari produk / provider..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff]"
                />
                <i className="bx bx-search absolute left-2.5 top-2.5 text-gray-400"></i>
              </div>
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                      <th className="py-3 px-3 text-center w-12">No</th>
                      <th className="py-3 px-3">Kategori</th>
                      <th className="py-3 px-3">Provider</th>
                      <th className="py-3 px-3">Nama Produk</th>
                      <th className="py-3 px-3">Jumlah / Kuota</th>
                      <th className="py-3 px-3">Harga</th>
                      <th className="py-3 px-3">Masa Aktif / Info</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-10 text-center text-gray-500">
                          Tidak ada produk ditemukan. Klik "Tambah Produk Baru" atau gunakan fitur Sinkronisasi.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-blue-50/40 transition">
                          <td className="py-2.5 px-3 text-center text-gray-500">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-semibold uppercase text-[11px] text-gray-600">
                            {p.category}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-blue-700">
                            {p.provider || '-'}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-gray-900">
                            {p.name}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-gray-700">
                            {p.amount || '-'}
                          </td>
                          <td className="py-2.5 px-3 font-extrabold text-[#007bff]">
                            {p.price}
                          </td>
                          <td className="py-2.5 px-3 text-gray-500 text-xs">
                            {p.period || p.info || '-'}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => handleToggleAvailable(p)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                                p.isAvailable !== false
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                              title="Klik untuk ubah status ketersediaan"
                            >
                              {p.isAvailable !== false ? 'Tersedia' : 'Kosong'}
                            </button>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                                title="Edit Harga / Detail"
                              >
                                <i className="bx bx-edit text-base"></i>
                              </button>
                              <button
                                onClick={() => openDeleteModal(p.id, p.name)}
                                className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer"
                                title="Hapus Produk"
                              >
                                <i className="bx bx-trash text-base"></i>
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

        {/* TAB 3: BULK PRICE ADJUSTMENT */}
        {activeTab === 'bulk' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <div className="mb-6 pb-4 border-b border-gray-100 text-center">
              <div className="w-14 h-14 bg-blue-50 text-[#007bff] rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
                <i className="bx bx-trending-up"></i>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900">
                Penyesuaian Harga Berskala / Masal
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Gunakan alat ini saat server operator menaikkan atau menurunkan harga modal kuota/pulsa secara serentak.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Pilih Kategori Yang Disesuaikan:
                </label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#007bff] text-sm bg-white"
                >
                  <option value="internet">Voucher Data (Internet)</option>
                  <option value="pulsa">Pulsa Seluler</option>
                  <option value="pln">Token Listrik PLN</option>
                  <option value="game">Game Online</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Nominal Kenaikan / Penurunan (Rp):
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[500, 1000, 2000, -1000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBulkAdjustment(val)}
                      className={`p-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                        bulkAdjustment === val
                          ? 'bg-[#007bff] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {val > 0 ? `+Rp ${val}` : `-Rp ${Math.abs(val)}`}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={bulkAdjustment}
                  onChange={(e) => setBulkAdjustment(parseInt(e.target.value, 10) || 0)}
                  placeholder="Contoh: 1000 atau -500"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#007bff] text-sm font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  *Gunakan angka positif untuk menaikkan harga (misal: 1000) dan angka negatif untuk menurunkan (misal: -1000).
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(true)}
                  disabled={isApplyingBulk}
                  className="w-full bg-[#007bff] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <i className={`bx ${isApplyingBulk ? 'bx-loader bx-spin' : 'bx-check-double'} text-xl`}></i>
                  {isApplyingBulk
                    ? 'Sedang Memperbarui Harga di Firebase...'
                    : `Terapkan Penyesuaian ke Seluruh Produk ${bulkCategory.toUpperCase()}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DATABASE SYNC / SEED */}
        {activeTab === 'database' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-blue-50 text-[#007bff] rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              <i className="bx bxs-data"></i>
            </div>

            <h2 className="text-xl font-extrabold text-gray-900 mb-1">
              Sinkronisasi & Inisialisasi Firebase
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Tekan tombol di bawah untuk menyalin seluruh data awal MsCell (53+ paket kuota, pulsa 5K-100K, PLN, Free Fire, Mobile Legends, PUBG, BRILink) ke database Firebase Firestore Anda.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left text-xs text-gray-700 space-y-2 mb-6 font-mono">
              <div>Project ID: <strong>{firebaseConfig.projectId}</strong></div>
              <div>Auth Domain: <strong>{firebaseConfig.authDomain}</strong></div>
              <div>Total Koleksi Tersedia: <strong>{products.length} Produk</strong></div>
            </div>

            {seedReport && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 font-semibold">
                {seedReport}
              </div>
            )}

            <button
              onClick={() => setIsSeedModalOpen(true)}
              disabled={isSeeding}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <i className={`bx ${isSeeding ? 'bx-loader bx-spin' : 'bx-cloud-upload'} text-xl`}></i>
              {isSeeding ? 'Menyinkronkan ke Firebase...' : '1-Klik Sinkronkan & Simpan Semua Data ke Firebase'}
            </button>
          </div>
        )}

        {/* TAB 5: BLOG & ARTICLES MANAGEMENT */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            {/* Blog Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 text-[#007bff] rounded-2xl flex items-center justify-center text-3xl shrink-0">
                    <i className="bx bx-news"></i>
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900">
                      Kelola Blog & Artikel MsCell
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      Unggah artikel edukasi, tips kuota hemat, kode pulsa, atau kabar promo yang langsung tayang di website MsCell.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewArticle(initialArticleForm);
                      setTagInput('MsCell, Tips');
                      setIsNewArticleModalOpen(true);
                    }}
                    className="bg-[#007bff] hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <i className="bx bx-plus-circle text-lg"></i>
                    <span>Tulis & Unggah Artikel Baru</span>
                  </button>
                </div>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-100">
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase block">Total Artikel</span>
                  <span className="text-xl font-black text-gray-900">{articles.length}</span>
                </div>
                <div className="bg-green-50 p-3.5 rounded-2xl border border-green-200">
                  <span className="text-[11px] font-semibold text-green-700 uppercase block">Tayang / Terbit</span>
                  <span className="text-xl font-black text-green-800">
                    {articles.filter((a) => a.isPublished).length}
                  </span>
                </div>
                <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
                  <span className="text-[11px] font-semibold text-amber-700 uppercase block">Status Draf</span>
                  <span className="text-xl font-black text-amber-800">
                    {articles.filter((a) => !a.isPublished).length}
                  </span>
                </div>
                <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200">
                  <span className="text-[11px] font-semibold text-blue-700 uppercase block">Database Firestore</span>
                  <span className="text-xs font-mono font-bold text-blue-900 mt-1 block truncate">
                    /settings/global
                  </span>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <i className="bx bx-search text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-lg"></i>
                <input
                  type="text"
                  value={blogSearchQuery}
                  onChange={(e) => setBlogSearchQuery(e.target.value)}
                  placeholder="Cari judul artikel..."
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#007bff]"
                />
                {blogSearchQuery && (
                  <button
                    onClick={() => setBlogSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <i className="bx bx-x text-base"></i>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-gray-500 whitespace-nowrap">Filter Kategori:</span>
                <select
                  value={blogCategoryFilter}
                  onChange={(e) => setBlogCategoryFilter(e.target.value)}
                  className="p-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#007bff] bg-white cursor-pointer w-full sm:w-auto font-medium"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Tips & Panduan">Tips & Panduan</option>
                  <option value="Paket Internet">Paket Internet</option>
                  <option value="Promo & Info">Promo & Info</option>
                  <option value="Game & PLN">Game & PLN</option>
                  <option value="Layanan Digital">Layanan Digital</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>
            </div>

            {/* Articles Table */}
            <div className="bg-white rounded-3xl shadow-xs border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/80 text-[11px] uppercase font-bold text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="py-3.5 px-4">Artikel</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4">Penulis & Tanggal</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredAdminArticles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-500">
                          <i className="bx bx-file-blank text-4xl text-gray-300 mb-2 block"></i>
                          Belum ada artikel ditemukan.
                          <div className="mt-2">
                            <button
                              onClick={() => {
                                setNewArticle(initialArticleForm);
                                setIsNewArticleModalOpen(true);
                              }}
                              className="text-xs font-bold text-[#007bff] hover:underline cursor-pointer"
                            >
                              + Tulis Artikel Baru Sekarang
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredAdminArticles.map((post) => (
                        <tr key={post.id} className="hover:bg-blue-50/40 transition">
                          {/* Image & Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3 max-w-md">
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-200 bg-gray-100"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=200&q=80';
                                }}
                              />
                              <div className="min-w-0">
                                <h4 className="font-bold text-gray-900 line-clamp-1 hover:text-[#007bff] transition">
                                  {post.title}
                                </h4>
                                <p className="text-gray-500 line-clamp-1 text-[11px] mt-0.5">
                                  {post.summary}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {post.category}
                            </span>
                          </td>

                          {/* Author & Date */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="text-gray-900 font-semibold">{post.author}</div>
                            <div className="text-gray-400 text-[11px]">{post.date}</div>
                          </td>

                          {/* Status Toggle */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleTogglePublishArticle(post)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer border transition ${
                                post.isPublished
                                  ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                              }`}
                              title="Klik untuk ubah status publikasi"
                            >
                              <i className={`bx ${post.isPublished ? 'bx-check-circle' : 'bx-time'} mr-1`}></i>
                              {post.isPublished ? 'Terbit di Web' : 'Draf (Sembunyi)'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => setPreviewArticle(post)}
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                                title="Pratinjau Artikel"
                              >
                                <i className="bx bx-show text-base"></i>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingArticle({ ...post })}
                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                                title="Edit Artikel"
                              >
                                <i className="bx bx-edit text-base"></i>
                              </button>
                              <button
                                type="button"
                                onClick={() => setArticleToDelete(post)}
                                className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer"
                                title="Hapus Artikel"
                              >
                                <i className="bx bx-trash text-base"></i>
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
      </div>

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-lg text-gray-900">Edit Produk & Harga</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="bx bx-x text-2xl"></i>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProductItem(editingProduct);
              }}
              className="space-y-4 text-left text-sm"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Produk:</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Provider:</label>
                  <input
                    type="text"
                    value={editingProduct.provider || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, provider: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Harga Jual:</label>
                  <input
                    type="text"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-[#007bff]"
                    placeholder="Contoh: Rp 25.000"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Jumlah / Kuota:</label>
                  <input
                    type="text"
                    value={editingProduct.amount || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, amount: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Masa Aktif:</label>
                  <input
                    type="text"
                    value={editingProduct.period || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, period: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Keterangan / Info:</label>
                <input
                  type="text"
                  value={editingProduct.info || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, info: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-5 py-2 text-xs font-bold bg-[#007bff] hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  {isSavingProduct ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW PRODUCT */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-lg text-gray-900">Tambah Produk Baru</h3>
              <button
                onClick={() => setIsNewProductModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="bx bx-x text-2xl"></i>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const item: ProductItem = {
                  id: `prod-${Date.now()}`,
                  category: (newProduct.category as any) || 'internet',
                  provider: newProduct.provider,
                  name: newProduct.name || 'Produk Baru',
                  amount: newProduct.amount,
                  price: newProduct.price || 'Rp 0',
                  period: newProduct.period,
                  info: newProduct.info,
                  isAvailable: true,
                };
                handleSaveProductItem(item);
              }}
              className="space-y-4 text-left text-sm"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori:</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
                >
                  <option value="internet">Voucher Data (Internet)</option>
                  <option value="pulsa">Pulsa Seluler</option>
                  <option value="pln">Token Listrik PLN</option>
                  <option value="game">Game Online</option>
                  <option value="bank">Layanan Bank / BRILink</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Produk:</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Contoh: Freedom Internet 15GB"
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Provider / Brand:</label>
                  <input
                    type="text"
                    value={newProduct.provider}
                    onChange={(e) => setNewProduct({ ...newProduct, provider: e.target.value })}
                    placeholder="Contoh: Indosat / Free Fire"
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Harga Jual:</label>
                  <input
                    type="text"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="Contoh: Rp 35.000"
                    className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-[#007bff]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Jumlah / Kuota:</label>
                  <input
                    type="text"
                    value={newProduct.amount}
                    onChange={(e) => setNewProduct({ ...newProduct, amount: e.target.value })}
                    placeholder="Contoh: 15 GB"
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Masa Aktif:</label>
                  <input
                    type="text"
                    value={newProduct.period}
                    onChange={(e) => setNewProduct({ ...newProduct, period: e.target.value })}
                    placeholder="Contoh: 30 Hari"
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-5 py-2 text-xs font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-xs"
                >
                  {isSavingProduct ? 'Menyimpan...' : 'Tambahkan ke Firebase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION (REPLACES WINDOW.CONFIRM) */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100 text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              <i className="bx bx-trash"></i>
            </div>

            <h3 className="font-extrabold text-lg text-gray-900 mb-2">
              Hapus Produk dari Firebase?
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus{' '}
              <strong className="text-gray-900 font-bold bg-gray-100 px-2 py-0.5 rounded">
                "{productToDelete.name}"
              </strong>{' '}
              secara permanen dari katalog dan database Firebase?
            </p>

            {deleteErrorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {deleteErrorMsg}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeletingProduct}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer border border-gray-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                disabled={isDeletingProduct}
                className="flex-1 px-5 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isDeletingProduct ? (
                  <>
                    <i className="bx bx-loader bx-spin text-base"></i>
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <i className="bx bx-trash text-base"></i>
                    <span>Ya, Hapus Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SEED TO FIREBASE CONFIRMATION */}
      {isSeedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100 text-center">
            <div className="w-14 h-14 bg-blue-100 text-[#007bff] rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              <i className="bx bx-cloud-upload"></i>
            </div>

            <h3 className="font-extrabold text-lg text-gray-900 mb-2">
              Sinkronkan Data Awal ke Firebase?
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Ini akan menyalin seluruh katalog awal (53+ produk internet, pulsa, PLN, game, marquee, dll) ke database Firestore Anda (<strong>{firebaseConfig.projectId}</strong>).
            </p>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setIsSeedModalOpen(false)}
                disabled={isSeeding}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer border border-gray-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeSeedAll}
                disabled={isSeeding}
                className="flex-1 px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSeeding ? (
                  <>
                    <i className="bx bx-loader bx-spin text-base"></i>
                    <span>Menyinkronkan...</span>
                  </>
                ) : (
                  <>
                    <i className="bx bx-check text-base"></i>
                    <span>Ya, Sinkronkan Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BULK PRICE ADJUSTMENT CONFIRMATION */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100 text-center">
            <div className="w-14 h-14 bg-blue-100 text-[#007bff] rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              <i className="bx bx-trending-up"></i>
            </div>

            <h3 className="font-extrabold text-lg text-gray-900 mb-2">
              Terapkan Penyesuaian Harga?
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Perubahan harga sebesar{' '}
              <strong className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                {bulkAdjustment > 0 ? `+Rp ${bulkAdjustment.toLocaleString('id-ID')}` : `-Rp ${Math.abs(bulkAdjustment).toLocaleString('id-ID')}`}
              </strong>{' '}
              akan diterapkan ke seluruh produk dalam kategori{' '}
              <strong className="uppercase">{bulkCategory}</strong>.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                disabled={isApplyingBulk}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer border border-gray-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeApplyBulk}
                disabled={isApplyingBulk}
                className="flex-1 px-5 py-2.5 text-xs font-bold bg-[#007bff] hover:bg-blue-700 text-white rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isApplyingBulk ? (
                  <>
                    <i className="bx bx-loader bx-spin text-base"></i>
                    <span>Memperbarui...</span>
                  </>
                ) : (
                  <>
                    <i className="bx bx-check-double text-base"></i>
                    <span>Ya, Terapkan Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TULIS & UNGGAH ARTIKEL BARU */}
      {isNewArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-[#007bff] rounded-xl flex items-center justify-center text-2xl font-bold">
                  <i className="bx bx-edit"></i>
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900">Tulis & Unggah Artikel Baru</h3>
                  <p className="text-xs text-gray-500">Artikel akan langsung tersimpan di database Firebase</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewArticleModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="bx bx-x text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-4 text-left text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Judul Artikel: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newArticle.title || ''}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="Contoh: 5 Tips Memilih Paket Data Paling Murah 2026"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff] text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kategori:</label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value as any })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff] bg-white cursor-pointer"
                  >
                    <option value="Tips & Panduan">Tips & Panduan</option>
                    <option value="Paket Internet">Paket Internet</option>
                    <option value="Promo & Info">Promo & Info</option>
                    <option value="Game & PLN">Game & PLN</option>
                    <option value="Layanan Digital">Layanan Digital</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Penulis:</label>
                  <input
                    type="text"
                    value={newArticle.author || ''}
                    onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Estimasi Baca:</label>
                  <input
                    type="text"
                    value={newArticle.readTime || ''}
                    onChange={(e) => setNewArticle({ ...newArticle, readTime: e.target.value })}
                    placeholder="Contoh: 3 mnt baca"
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff]"
                  />
                </div>
              </div>

              {/* Cover Image & Presets */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Gambar Sampul (Cover Image):
                </label>
                <input
                  type="url"
                  value={newArticle.imageUrl || ''}
                  onChange={(e) => setNewArticle({ ...newArticle, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff] font-mono text-xs"
                />
                <div className="mt-2">
                  <span className="text-[11px] text-gray-500 font-semibold block mb-1.5">
                    Pilihan Cepat Gambar Sampul:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {imagePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewArticle({ ...newArticle, imageUrl: preset.url })}
                        className="px-2.5 py-1 text-[11px] bg-gray-100 hover:bg-blue-100 hover:text-blue-800 rounded-lg text-gray-700 transition cursor-pointer border border-gray-200"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Excerpt / Summary */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Ringkasan Singkat (Lead / Excerpt): <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newArticle.summary || ''}
                  onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                  rows={2}
                  placeholder="Tulis 1-2 kalimat ringkasan yang menarik untuk pengunjung..."
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff]"
                  required
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Isi Konten Artikel Lengkap: <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newArticle.content || ''}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  rows={8}
                  placeholder="Tuliskan isi artikel secara lengkap. Anda dapat menggunakan baris baru dan poin bullet (•)."
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff] font-sans leading-relaxed text-xs sm:text-sm"
                  required
                />
              </div>

              {/* Tags & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tag (Pisahkan koma):</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Contoh: Kuota, Hemat, Indosat"
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="newIsPublished"
                    checked={newArticle.isPublished !== false}
                    onChange={(e) => setNewArticle({ ...newArticle, isPublished: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="newIsPublished" className="text-xs font-bold text-gray-800 cursor-pointer">
                    Publikasikan Langsung ke Website MsCell
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewArticleModalOpen(false)}
                  disabled={isSavingArticle}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingArticle}
                  className="px-6 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  <i className={`bx ${isSavingArticle ? 'bx-loader bx-spin' : 'bx-cloud-upload'} text-base`}></i>
                  <span>{isSavingArticle ? 'Mengunggah...' : '🚀 Unggah & Simpan ke Firebase'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ARTIKEL */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-[#007bff] rounded-xl flex items-center justify-center text-2xl font-bold">
                  <i className="bx bx-edit-alt"></i>
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900">Edit Artikel</h3>
                  <p className="text-xs text-gray-500">Perubahan akan langsung diperbarui di database Firebase</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="bx bx-x text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleUpdateArticle} className="space-y-4 text-left text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Judul Artikel: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff] text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kategori:</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff] bg-white cursor-pointer"
                  >
                    <option value="Tips & Panduan">Tips & Panduan</option>
                    <option value="Paket Internet">Paket Internet</option>
                    <option value="Promo & Info">Promo & Info</option>
                    <option value="Game & PLN">Game & PLN</option>
                    <option value="Layanan Digital">Layanan Digital</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Penulis:</label>
                  <input
                    type="text"
                    value={editingArticle.author}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Estimasi Baca:</label>
                  <input
                    type="text"
                    value={editingArticle.readTime || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                    placeholder="Contoh: 3 mnt baca"
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Gambar Sampul (Cover Image):
                </label>
                <input
                  type="url"
                  value={editingArticle.imageUrl}
                  onChange={(e) => setEditingArticle({ ...editingArticle, imageUrl: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff] font-mono text-xs"
                />
                <div className="mt-2">
                  <span className="text-[11px] text-gray-500 font-semibold block mb-1.5">
                    Pilihan Cepat Gambar Sampul:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {imagePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditingArticle({ ...editingArticle, imageUrl: preset.url })}
                        className="px-2.5 py-1 text-[11px] bg-gray-100 hover:bg-blue-100 hover:text-blue-800 rounded-lg text-gray-700 transition cursor-pointer border border-gray-200"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Ringkasan Singkat (Lead / Excerpt): <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editingArticle.summary}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Isi Konten Artikel Lengkap: <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#007bff] font-sans leading-relaxed text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="editIsPublished"
                  checked={editingArticle.isPublished !== false}
                  onChange={(e) => setEditingArticle({ ...editingArticle, isPublished: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="editIsPublished" className="text-xs font-bold text-gray-800 cursor-pointer">
                  Publikasikan Artikel di Website MsCell (Status Terbit)
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  disabled={isSavingArticle}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingArticle}
                  className="px-6 py-2.5 text-xs font-bold bg-[#007bff] hover:bg-blue-700 text-white rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  <i className={`bx ${isSavingArticle ? 'bx-loader bx-spin' : 'bx-save'} text-base`}></i>
                  <span>{isSavingArticle ? 'Menyimpan...' : '💾 Simpan Perubahan ke Firebase'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRATINJAU ARTIKEL */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                Pratinjau Tampilan Pengunjung
              </span>
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="bx bx-x text-2xl"></i>
              </button>
            </div>

            <div className="space-y-4 text-left">
              <div className="h-56 rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={previewArticle.imageUrl}
                  alt={previewArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-bold text-blue-700">{previewArticle.category}</span>
                <span>•</span>
                <span>{previewArticle.date}</span>
                <span>•</span>
                <span>{previewArticle.author}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                {previewArticle.title}
              </h2>

              <div className="bg-blue-50/70 p-3.5 rounded-xl border-l-4 border-blue-600 text-xs sm:text-sm text-blue-900 italic">
                "{previewArticle.summary}"
              </div>

              <div className="text-xs sm:text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {previewArticle.content}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-right">
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="px-5 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HAPUS ARTIKEL CONFIRMATION */}
      {articleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100 text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              <i className="bx bx-trash"></i>
            </div>

            <h3 className="font-extrabold text-lg text-gray-900 mb-2">
              Hapus Artikel dari Firebase?
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus artikel{' '}
              <strong className="text-gray-900 font-bold bg-gray-100 px-2 py-0.5 rounded">
                "{articleToDelete.title}"
              </strong>{' '}
              secara permanen?
            </p>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setArticleToDelete(null)}
                disabled={isDeletingArticle}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer border border-gray-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteArticle}
                disabled={isDeletingArticle}
                className="flex-1 px-5 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isDeletingArticle ? (
                  <>
                    <i className="bx bx-loader bx-spin text-base"></i>
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <i className="bx bx-trash text-base"></i>
                    <span>Ya, Hapus Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ERROR TOAST MESSAGE */}
      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-red-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3">
          <i className="bx bx-error-circle text-2xl shrink-0"></i>
          <p className="text-xs font-semibold">{errorMessage}</p>
          <button onClick={() => setErrorMessage('')} className="ml-auto text-white/80 hover:text-white cursor-pointer">
            <i className="bx bx-x text-xl"></i>
          </button>
        </div>
      )}
    </div>
  );
};
