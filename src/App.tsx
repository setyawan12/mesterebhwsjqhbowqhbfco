import { useState, useMemo, useEffect } from 'react';
import { Navbar, ActivePage } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomeSection } from './components/HomeSection.tsx';
import { InternetSection } from './components/InternetSection.tsx';
import { PulsaSection } from './components/PulsaSection.tsx';
import { PlnSection } from './components/PlnSection.tsx';
import { BankSection } from './components/BankSection.tsx';
import { GameSection } from './components/GameSection.tsx';
import { BlogSection } from './components/BlogSection.tsx';
import { AdminSection } from './components/AdminSection.tsx';
import { OrderModal } from './components/OrderModal.tsx';
import { ALL_PRODUCTS, ProductItem, CONTACT_INFO } from './data/mscellData.ts';
import { BlogPost, DEFAULT_BLOG_POSTS } from './data/blogData.ts';
import {
  subscribeSiteSettings,
  subscribeProducts,
  subscribeBlogPosts,
  testFirebaseConnection,
  SiteSettings,
  DEFAULT_SETTINGS,
} from './firebase.ts';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Live Firebase states
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [productsList, setProductsList] = useState<ProductItem[]>(ALL_PRODUCTS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(DEFAULT_BLOG_POSTS);

  // Initialize and subscribe to Firebase Firestore in real-time
  useEffect(() => {
    testFirebaseConnection();

    // Subscribe to global settings (marquee, contacts, store status)
    const unsubscribeSettings = subscribeSiteSettings((newSettings) => {
      setSiteSettings(newSettings);
    });

    // Subscribe to all products
    const unsubscribeProducts = subscribeProducts((newProducts) => {
      if (newProducts && newProducts.length > 0) {
        setProductsList(newProducts);
      }
    });

    // Subscribe to blog articles
    const unsubscribeBlog = subscribeBlogPosts((newPosts) => {
      if (newPosts && newPosts.length > 0) {
        setBlogPosts(newPosts);
      }
    });

    return () => {
      unsubscribeSettings();
      unsubscribeProducts();
      unsubscribeBlog();
    };
  }, []);

  // Filter products by category for sub-pages
  const internetProducts = useMemo(
    () => productsList.filter((p) => p.category === 'internet'),
    [productsList]
  );
  const pulsaProducts = useMemo(
    () => productsList.filter((p) => p.category === 'pulsa'),
    [productsList]
  );
  const plnProducts = useMemo(
    () => productsList.filter((p) => p.category === 'pln'),
    [productsList]
  );
  const gameProducts = useMemo(
    () => productsList.filter((p) => p.category === 'game'),
    [productsList]
  );

  // Global search results across all product categories
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return productsList.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        (item.provider && item.provider.toLowerCase().includes(q)) ||
        (item.amount && item.amount.toLowerCase().includes(q)) ||
        item.price.toLowerCase().includes(q) ||
        (item.info && item.info.toLowerCase().includes(q)) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, productsList]);

  const handleSelectProduct = (product: ProductItem) => {
    setSelectedProduct(product);
  };

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappChatUrl = `https://wa.me/62${(siteSettings.whatsappNumber || '085156482636').replace(/^0/, '')}?text=${encodeURIComponent(
    'Halo MsCell, saya ingin info pemesanan pulsa / kuota / game.'
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans selection:bg-[#007bff] selection:text-white">
      {/* Top Navigation Bar with authentic Cyan Marquee */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        headerMarquee={siteSettings.headerMarquee}
        headerMarqueeSpeed={siteSettings.headerMarqueeSpeed}
      />

      {/* Main Body */}
      <main className="flex-1 w-full">
        {/* If search query has active matches and we are on home/any page */}
        {searchQuery.trim().length > 0 ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[60vh]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Hasil Pencarian: "{searchQuery}"
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Ditemukan <strong>{searchResults.length}</strong> produk di MsCell
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                Hapus Pencarian
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
                <i className="bx bx-search-alt text-5xl text-gray-400 mb-3 block"></i>
                <h3 className="text-lg font-bold text-gray-700">Tidak ada produk yang cocok</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                  Coba kata kunci lain seperti nama operator (Indosat, Telkomsel, Axis, Three), token PLN, atau game (Free Fire, ML).
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#007bff] text-white text-xs sm:text-sm uppercase tracking-wider">
                        <th className="py-3 px-4 text-center w-14">No</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Nama Produk</th>
                        <th className="py-3 px-4">Jumlah / Kuota</th>
                        <th className="py-3 px-4">Harga</th>
                        <th className="py-3 px-4">Masa / Info</th>
                        <th className="py-3 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {searchResults.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50/60 transition">
                          <td className="py-3 px-4 text-center text-gray-500">{idx + 1}</td>
                          <td className="py-3 px-4">
                            <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-900">
                            {item.name}
                            {item.provider && (
                              <span className="ml-2 text-xs font-normal text-gray-500">
                                ({item.provider})
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-700">
                            {item.amount || '-'}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-[#007bff]">
                            {item.price}
                          </td>
                          <td className="py-3 px-4 text-xs text-gray-600">
                            {item.period || item.info || '-'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleSelectProduct(item)}
                              className="bg-[#007bff] hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition cursor-pointer"
                            >
                              Pesan
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {activePage === 'home' && <HomeSection onNavigate={handleNavigate} />}
            {activePage === 'internet' && (
              <InternetSection
                onSelectProduct={handleSelectProduct}
                onBackToHome={() => handleNavigate('home')}
                searchFilter={searchQuery}
                items={internetProducts}
                footerMarquee={siteSettings.footerMarquee}
                footerMarqueeSpeed={siteSettings.footerMarqueeSpeed}
                lastUpdated={siteSettings.lastUpdated}
              />
            )}
            {activePage === 'pulsa' && (
              <PulsaSection
                onSelectProduct={handleSelectProduct}
                onBackToHome={() => handleNavigate('home')}
                searchFilter={searchQuery}
                items={pulsaProducts}
                footerMarquee={siteSettings.footerMarquee}
                footerMarqueeSpeed={siteSettings.footerMarqueeSpeed}
              />
            )}
            {activePage === 'pln' && (
              <PlnSection
                onSelectProduct={handleSelectProduct}
                onBackToHome={() => handleNavigate('home')}
                items={plnProducts}
                footerMarquee={siteSettings.footerMarquee}
                footerMarqueeSpeed={siteSettings.footerMarqueeSpeed}
              />
            )}
            {activePage === 'bank' && (
              <BankSection
                onBackToHome={() => handleNavigate('home')}
                onSelectProduct={handleSelectProduct}
              />
            )}
            {activePage === 'game' && (
              <GameSection
                onSelectProduct={handleSelectProduct}
                onBackToHome={() => handleNavigate('home')}
                searchFilter={searchQuery}
                items={gameProducts}
                footerMarquee={siteSettings.footerMarquee}
                footerMarqueeSpeed={siteSettings.footerMarqueeSpeed}
              />
            )}
            {activePage === 'blog' && (
              <BlogSection
                onBackToHome={() => handleNavigate('home')}
                articles={blogPosts}
                whatsappNumber={siteSettings.whatsappNumber}
              />
            )}
            {activePage === 'admin' && (
              <AdminSection
                settings={siteSettings}
                products={productsList}
                articles={blogPosts}
                onBackToHome={() => handleNavigate('home')}
              />
            )}
          </>
        )}
      </main>

      {/* Floating WhatsApp Action Button */}
      <a
        href={whatsappChatUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp MsCell"
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110 group cursor-pointer border-2 border-white"
        title={`Chat WhatsApp MsCell (${siteSettings.whatsappNumber || CONTACT_INFO.phone})`}
      >
        <i className="bx bxl-whatsapp text-3xl"></i>
        <span className="absolute right-16 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
          Chat MsCell ({siteSettings.whatsappNumber || CONTACT_INFO.phone})
        </span>
      </a>

      {/* Order / Checkout Modal */}
      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Authentic Footer with live Firebase Settings & discreet Admin link */}
      <Footer
        settings={siteSettings}
        onOpenAdmin={() => handleNavigate('admin')}
      />
    </div>
  );
}
