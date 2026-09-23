import React, { useState, useMemo } from 'react';
import { BlogPost } from '../data/blogData.ts';

interface BlogSectionProps {
  onBackToHome: () => void;
  articles: BlogPost[];
  whatsappNumber?: string;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  onBackToHome,
  articles,
  whatsappNumber = '085156482636',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Available categories
  const categories = [
    { id: 'all', label: 'Semua Artikel' },
    { id: 'Tips & Panduan', label: '💡 Tips & Panduan' },
    { id: 'Paket Internet', label: '🌐 Paket Internet' },
    { id: 'Promo & Info', label: '🔥 Promo & Info' },
    { id: 'Game & PLN', label: '⚡ Game & PLN' },
    { id: 'Layanan Digital', label: '🏦 Layanan Digital' },
  ];

  // Filtered published articles
  const filteredArticles = useMemo(() => {
    return articles.filter((post) => {
      // Only show published articles in public view
      if (!post.isPublished) return false;

      const matchesCat =
        selectedCategory === 'all' || post.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(q)));

      return matchesCat && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Handle article selection (scroll to top smoothly)
  const handleSelectArticle = (post: BlogPost) => {
    setActiveArticle(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Copy Link
  const handleCopyShareLink = (post: BlogPost) => {
    const textToCopy = `${window.location.origin}?article=${post.slug || post.id} - Baca "${post.title}" di MsCell`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Paket Internet':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Tips & Panduan':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Promo & Info':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Game & PLN':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Layanan Digital':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // --- DETAIL / READER VIEW ---
  if (activeArticle) {
    const relatedPosts = articles
      .filter((p) => p.id !== activeArticle.id && p.isPublished)
      .slice(0, 3);

    const waShareUrl = `https://wa.me/?text=${encodeURIComponent(
      `Baca artikel menarik dari MsCell: "${activeArticle.title}"\n${activeArticle.summary}\n\nKunjungi konter MsCell Klaten untuk info pulsa & kuota!`
    )}`;

    const waOrderUrl = `https://wa.me/62${whatsappNumber.replace(/^0/, '')}?text=${encodeURIComponent(
      `Halo MsCell, saya baru membaca artikel "${activeArticle.title}" dan ingin tanya info pembelian.`
    )}`;

    return (
      <div className="py-10 bg-gray-50 min-h-[85vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <button
              onClick={() => setActiveArticle(null)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#007bff] hover:text-blue-800 bg-white px-4 py-2 rounded-xl shadow-xs border border-gray-200 transition cursor-pointer"
            >
              <i className="bx bx-arrow-back text-lg"></i>
              Kembali ke Semua Artikel
            </button>

            <button
              onClick={onBackToHome}
              className="text-xs text-gray-500 hover:text-gray-800 transition flex items-center gap-1 cursor-pointer"
            >
              <i className="bx bx-home text-base"></i>
              Ke Beranda
            </button>
          </div>

          {/* Main Article Container */}
          <article className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200 mb-10 overflow-hidden">
            {/* Meta header */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4 text-xs">
              <span
                className={`px-3 py-1 rounded-full font-bold border ${getCategoryColor(
                  activeArticle.category
                )}`}
              >
                {activeArticle.category}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 font-medium flex items-center gap-1">
                <i className="bx bx-calendar text-base text-gray-400"></i>
                {activeArticle.date}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 font-medium flex items-center gap-1">
                <i className="bx bx-user-circle text-base text-blue-500"></i>
                {activeArticle.author}
              </span>
              {activeArticle.readTime && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    <i className="bx bx-time-five text-base text-gray-400"></i>
                    {activeArticle.readTime}
                  </span>
                </>
              )}
            </div>

            {/* Article Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
              {activeArticle.title}
            </h1>

            {/* Cover Image */}
            {activeArticle.imageUrl && (
              <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-8 shadow-xs border border-gray-100 bg-gray-100">
                <img
                  src={activeArticle.imageUrl}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              </div>
            )}

            {/* Summary Highlight Box */}
            {activeArticle.summary && (
              <div className="bg-blue-50/80 border-l-4 border-[#007bff] p-4 sm:p-5 rounded-r-2xl mb-8">
                <p className="text-sm sm:text-base font-semibold text-blue-950 leading-relaxed italic">
                  "{activeArticle.summary}"
                </p>
              </div>
            )}

            {/* Article Content */}
            <div className="text-gray-700 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line font-normal">
              {activeArticle.content}
            </div>

            {/* Tags */}
            {activeArticle.tags && activeArticle.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase mr-1">
                  Tag Terkait:
                </span>
                {activeArticle.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-lg transition"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                <i className="bx bx-share-alt text-base text-[#007bff]"></i>
                Bagikan Artikel Ini:
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={waShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl shadow-xs transition"
                >
                  <i className="bx bxl-whatsapp text-lg"></i>
                  Bagikan ke WhatsApp
                </a>

                <button
                  onClick={() => handleCopyShareLink(activeArticle)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition cursor-pointer"
                >
                  <i className={`bx ${copiedLink ? 'bx-check text-green-600' : 'bx-copy'} text-base`}></i>
                  {copiedLink ? 'Tautan Disalin!' : 'Salin Tautan'}
                </button>
              </div>
            </div>

            {/* CTA Box Contact MsCell */}
            <div className="mt-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full inline-block mb-2">
                  Layanan Resmi Konter MsCell
                </span>
                <h3 className="text-xl font-extrabold mb-1">
                  Butuh Pulsa, Kuota Internet, atau Layanan BRILink?
                </h3>
                <p className="text-xs sm:text-sm text-blue-100">
                  Transaksi cepat, harga bersahabat, dan diproses langsung seketika. Hubungi kami sekarang!
                </p>
              </div>

              <a
                href={waOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 bg-white hover:bg-gray-100 text-[#007bff] font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <i className="bx bxl-whatsapp text-2xl text-[#25D366]"></i>
                Chat WhatsApp MsCell
              </a>
            </div>
          </article>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="bx bx-news text-[#007bff]"></i>
                Artikel Menarik Lainnya
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedPosts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectArticle(item)}
                    className="bg-white rounded-2xl p-4 shadow-xs border border-gray-200 hover:shadow-md transition cursor-pointer flex flex-col"
                  >
                    <div className="h-32 rounded-xl overflow-hidden mb-3 bg-gray-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border w-fit mb-2 ${getCategoryColor(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 hover:text-[#007bff] transition">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-auto">
                      {item.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- LIST / GRID VIEW ---
  return (
    <div className="py-10 bg-gray-50 min-h-[85vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#007bff]">
                Warta & Tips Digital
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Blog & Informasi MsCell
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Panduan kuota hemat, kode dial pulsa, tips perbankan BRILink, dan promo konter terbaru.
            </p>
          </div>

          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#007bff] hover:text-blue-800 bg-white px-4 py-2.5 rounded-xl shadow-xs border border-gray-200 transition cursor-pointer self-start sm:self-auto"
          >
            <i className="bx bx-arrow-back text-lg"></i>
            Kembali Ke Beranda
          </button>
        </div>

        {/* Search Bar & Categories */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-gray-200 mb-8 space-y-4">
          <div className="relative">
            <i className="bx bx-search text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 text-xl"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel (contoh: paket internet, kode dial, BRILink, token PLN)..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#007bff] text-sm bg-gray-50/50 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="bx bx-x text-xl"></i>
              </button>
            )}
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-[#007bff] text-white border-[#007bff] shadow-xs'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-xs">
            <div className="w-16 h-16 bg-blue-50 text-[#007bff] rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              <i className="bx bx-search-alt"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Tidak Ada Artikel Ditemukan
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
              Tidak ada artikel yang cocok dengan pencarian "{searchQuery}" pada kategori ini.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-bold bg-[#007bff] hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => handleSelectArticle(article)}
                className="bg-white rounded-3xl overflow-hidden shadow-xs border border-gray-200 hover:shadow-md hover:border-blue-300 transition duration-300 cursor-pointer flex flex-col group"
              >
                {/* Article Card Image */}
                <div className="h-48 w-full overflow-hidden bg-gray-100 relative">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-xs ${getCategoryColor(
                        article.category
                      )}`}
                    >
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Meta */}
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2">
                    <span className="font-semibold text-blue-700">{article.author}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                    {article.readTime && (
                      <>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-base text-gray-900 group-hover:text-[#007bff] transition leading-snug mb-2 line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {article.summary}
                  </p>

                  {/* Footer link */}
                  <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#007bff] group-hover:translate-x-1 transition inline-flex items-center gap-1">
                      Baca Selengkapnya
                      <i className="bx bx-right-arrow-alt text-base"></i>
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">MsCell Klaten</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
