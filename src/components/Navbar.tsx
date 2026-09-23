import React, { useState } from 'react';
import { Marquee } from './Marquee.tsx';

export type ActivePage = 'home' | 'pulsa' | 'internet' | 'pln' | 'bank' | 'game' | 'blog' | 'admin';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  headerMarquee?: string;
  headerMarqueeSpeed?: number;
  onSelectCategory?: (category: ActivePage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  searchQuery,
  setSearchQuery,
  headerMarquee = 'Ayo Bergabung dengan kami, kamu bisa jualan pulsa dan kouta hanya dengan hpmu, harga mantap pasti untung! Hubungi WhatsApp: 085156482636',
  headerMarqueeSpeed = 20,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: ActivePage, anchorId?: string) => {
    setActivePage(page);
    setMobileMenuOpen(false);

    if (page === 'home' && anchorId) {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md bg-[#007bff]">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-white focus:outline-none group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/20 p-1 flex items-center justify-center border border-white/30 group-hover:scale-105 transition">
                <img
                  src="/assets/img/logo.png"
                  alt="MsCell Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="text-left">
                <span className="font-extrabold text-2xl tracking-tight text-white block leading-none">
                  MsCell
                </span>
                <span className="text-[10px] text-blue-100 tracking-wider uppercase font-medium">
                  Konter Digital Klaten
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
                activePage === 'home'
                  ? 'bg-blue-800 text-white font-semibold'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('home', 'about')}
              className="px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:bg-white/15 hover:text-white transition cursor-pointer"
            >
              About
            </button>

            {/* Product Dropdown / Quick Links */}
            <div className="relative group">
              <button
                onClick={() => handleNavClick('home', 'feature')}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition cursor-pointer ${
                  ['pulsa', 'internet', 'pln', 'bank', 'game'].includes(activePage)
                    ? 'bg-blue-800 text-white font-semibold'
                    : 'text-white/90 hover:bg-white/15 hover:text-white'
                }`}
              >
                Product
                <i className="bx bx-chevron-down text-base transition group-hover:rotate-180"></i>
              </button>

              <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl py-2 hidden group-hover:block border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1 text-[11px] font-bold uppercase text-gray-400">Pilih Layanan:</div>
                <button
                  onClick={() => handleNavClick('pulsa')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#007bff] flex items-center gap-2 transition"
                >
                  <i className="bx bxs-devices text-blue-600"></i> Pulsa Seluler
                </button>
                <button
                  onClick={() => handleNavClick('internet')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#007bff] flex items-center gap-2 transition"
                >
                  <i className="bx bx-sort-alt-2 text-blue-600"></i> Voucher Data (Internet)
                </button>
                <button
                  onClick={() => handleNavClick('pln')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#007bff] flex items-center gap-2 transition"
                >
                  <i className="bx bx-building-house text-blue-600"></i> Token Listrik PLN
                </button>
                <button
                  onClick={() => handleNavClick('bank')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#007bff] flex items-center gap-2 transition"
                >
                  <i className="bx bxs-bank text-blue-600"></i> Transfer Bank / BRILink
                </button>
                <button
                  onClick={() => handleNavClick('game')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#007bff] flex items-center gap-2 transition"
                >
                  <i className="bx bxs-diamond text-blue-600"></i> Game Online
                </button>
              </div>
            </div>

            <button
              onClick={() => handleNavClick('home', 'excellence')}
              className="px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:bg-white/15 hover:text-white transition cursor-pointer"
            >
              Feature
            </button>

            <button
              onClick={() => handleNavClick('home', 'kenawhy')}
              className="px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:bg-white/15 hover:text-white transition cursor-pointer"
            >
              Info
            </button>

            <button
              onClick={() => handleNavClick('home', 'footer')}
              className="px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:bg-white/15 hover:text-white transition cursor-pointer"
            >
              Contact
            </button>

            <button
              onClick={() => handleNavClick('blog')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
                activePage === 'blog'
                  ? 'bg-blue-800 text-white font-semibold'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              Blog
            </button>

            {/* Private Admin Link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                activePage === 'admin'
                  ? 'bg-white text-[#007bff] border-white shadow-sm'
                  : 'bg-blue-900/60 text-blue-100 hover:bg-white hover:text-[#007bff] border-blue-400/40'
              }`}
              title="Panel Pengelola Privat MsCell (Firebase)"
            >
              <i className="bx bxs-lock-alt text-sm"></i>
              <span>Admin (Privat)</span>
            </button>
          </nav>

          {/* Search Bar on Navbar */}
          <div className="hidden md:flex items-center relative max-w-xs w-full ml-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari kuota, pulsa, game..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-gray-800 placeholder-gray-400 text-sm rounded-lg pl-9 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-xs"
              />
              <i className="bx bx-search absolute left-3 top-2 text-gray-400 text-base"></i>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="bx bx-x text-base"></i>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-blue-100 p-2 rounded-lg focus:outline-none cursor-pointer"
              aria-label="Menu"
            >
              <i className={`bx ${mobileMenuOpen ? 'bx-x' : 'bx-menu'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search & Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-blue-700/95 border-t border-blue-600 px-4 pt-3 pb-4 space-y-2 shadow-inner">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Cari produk MsCell..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-gray-800 placeholder-gray-400 text-sm rounded-lg pl-9 pr-8 py-2 focus:outline-none"
            />
            <i className="bx bx-search absolute left-3 top-2.5 text-gray-400 text-base"></i>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-gray-400"
              >
                <i className="bx bx-x"></i>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left px-3 py-2 rounded-md text-white hover:bg-blue-600 cursor-pointer"
            >
              🏠 Home
            </button>
            <button
              onClick={() => handleNavClick('home', 'about')}
              className="text-left px-3 py-2 rounded-md text-white hover:bg-blue-600 cursor-pointer"
            >
              ℹ️ About
            </button>
            <button
              onClick={() => handleNavClick('pulsa')}
              className="text-left px-3 py-2 rounded-md text-white hover:bg-blue-600 cursor-pointer"
            >
              📱 Pulsa Seluler
            </button>
            <button
              onClick={() => handleNavClick('internet')}
              className="text-left px-3 py-2 rounded-md text-white hover:bg-blue-600 cursor-pointer"
            >
              🌐 Voucher Data
            </button>
            <button
              onClick={() => handleNavClick('pln')}
              className="text-left px-3 py-2 rounded-md text-white hover:bg-blue-600 cursor-pointer"
            >
              ⚡ Token PLN
            </button>
            <button
              onClick={() => handleNavClick('bank')}
              className="text-left px-3 py-2 rounded-md text-white hover:bg-blue-600 cursor-pointer"
            >
              🏦 Transfer BRILink
            </button>
            <button
              onClick={() => handleNavClick('game')}
              className="text-left px-3 py-2 rounded-md text-white hover:bg-blue-600 cursor-pointer"
            >
              🎮 Game Online
            </button>
            <button
              onClick={() => handleNavClick('blog')}
              className="text-left px-3 py-2 rounded-md text-white hover:bg-blue-600 cursor-pointer"
            >
              📝 Blog
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="col-span-2 text-left px-3 py-2 rounded-md bg-blue-900 text-white hover:bg-blue-800 font-bold flex items-center gap-1.5 cursor-pointer mt-1"
            >
              <i className="bx bxs-lock-alt text-amber-300"></i>
              Panel Pengelola Privat (Firebase)
            </button>
          </div>
        </div>
      )}

      {/* Authentic Cyan Marquee Banner from mesterecellid.netlify.app */}
      <section id="marquee" className="w-full overflow-hidden border-b border-blue-200">
        <Marquee
          text={headerMarquee}
          speed={headerMarqueeSpeed}
          bgColor="#B0E0E6"
          textColor="#111827"
        />
      </section>
    </header>
  );
};
