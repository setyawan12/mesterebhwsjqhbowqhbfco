import React, { useState } from 'react';
import {
  FREE_FIRE_ITEMS,
  MOBILE_LEGENDS_ITEMS,
  PUBG_ITEMS,
  CODM_ITEMS,
  ProductItem,
} from '../data/mscellData.ts';
import { Marquee } from './Marquee.tsx';

type SelectedGame = 'ff' | 'ml' | 'pubg' | 'codm';

interface GameSectionProps {
  onSelectProduct: (product: ProductItem) => void;
  onBackToHome: () => void;
  searchFilter?: string;
  items?: ProductItem[];
  footerMarquee?: string;
  footerMarqueeSpeed?: number;
}

export const GameSection: React.FC<GameSectionProps> = ({
  onSelectProduct,
  onBackToHome,
  searchFilter = '',
  items,
  footerMarquee = 'Harga Sewaktu-Waktu Dapat Berubah Tanpa Pemberitahuan - Melayani Top Up Game 24 Jam',
  footerMarqueeSpeed = 25,
}) => {
  const [activeGame, setActiveGame] = useState<SelectedGame>('ff');
  const [loadingSim, setLoadingSim] = useState<boolean>(false);
  const [loadingGameName, setLoadingGameName] = useState<string>('');

  const handleGameSelect = (gameKey: SelectedGame, gameTitle: string) => {
    if (activeGame === gameKey) return;
    setLoadingGameName(gameTitle);
    setLoadingSim(true);
    setTimeout(() => {
      setActiveGame(gameKey);
      setLoadingSim(false);
    }, 600);
  };

  const getActiveGameItems = () => {
    if (items && items.length > 0) {
      const filtered = items.filter((it) => {
        if (it.category !== 'game') return false;
        if (it.subCategory) return it.subCategory === activeGame;
        if (activeGame === 'ff' && (it.provider?.toLowerCase().includes('free fire') || it.name.toLowerCase().includes('free fire'))) return true;
        if (activeGame === 'ml' && (it.provider?.toLowerCase().includes('mobile legends') || it.name.toLowerCase().includes('mobile legends') || it.name.toLowerCase().includes('starlight'))) return true;
        if (activeGame === 'pubg' && (it.provider?.toLowerCase().includes('pubg') || it.name.toLowerCase().includes('pubg') || it.name.toLowerCase().includes('uc'))) return true;
        if (activeGame === 'codm' && (it.provider?.toLowerCase().includes('codm') || it.name.toLowerCase().includes('cod') || it.name.toLowerCase().includes('cp'))) return true;
        return false;
      });
      if (filtered.length > 0) return filtered;
    }

    switch (activeGame) {
      case 'ff':
        return FREE_FIRE_ITEMS;
      case 'ml':
        return MOBILE_LEGENDS_ITEMS;
      case 'pubg':
        return PUBG_ITEMS;
      case 'codm':
        return CODM_ITEMS;
    }
  };

  const currentItems = getActiveGameItems().filter((item) => {
    const q = searchFilter.toLowerCase();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      (item.amount && item.amount.toLowerCase().includes(q)) ||
      item.price.toLowerCase().includes(q) ||
      (item.info && item.info.toLowerCase().includes(q))
    );
  });

  const getGameTitle = () => {
    switch (activeGame) {
      case 'ff':
        return 'Free Fire';
      case 'ml':
        return 'Mobile Legends: Bang Bang';
      case 'pubg':
        return 'PUBG Mobile';
      case 'codm':
        return 'Call of Duty: Mobile';
    }
  };

  return (
    <div className="py-10 bg-gray-50 min-h-[85vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#007bff] hover:text-blue-800 bg-white px-4 py-2 rounded-xl shadow-xs border border-gray-200 transition cursor-pointer"
          >
            <i className="bx bx-arrow-back text-lg"></i>
            Kembali Ke Beranda
          </button>

          <span className="text-xs text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-xs">
            Top Up Game Online Legal & Cepat
          </span>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-sky-100 text-[#007bff] mb-3">
            <i className="bx bxs-diamond text-3xl"></i>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Game Online
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1 max-w-xl mx-auto">
            Top up Diamond Free Fire, Mobile Legends, PUBG Mobile UC, dan CODM CP terpercaya hanya di MsCell Klaten.
          </p>
        </div>

        {/* Game Selector Cards (Sky blue style from original site) */}
        <div className="bg-sky-100/90 rounded-3xl p-6 sm:p-8 shadow-md border border-sky-200 mb-10">
          <h3 className="text-center font-bold text-sky-900 mb-6 text-lg tracking-wide uppercase">
            Pilih Game Favorit Anda:
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Free Fire */}
            <button
              onClick={() => handleGameSelect('ff', 'Free Fire')}
              className={`p-4 rounded-2xl transition duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer ${
                activeGame === 'ff'
                  ? 'bg-white shadow-xl ring-4 ring-orange-400 scale-102'
                  : 'bg-white/80 hover:bg-white hover:shadow-md'
              }`}
            >
              <div className="w-24 h-16 flex items-center justify-center p-1">
                <img
                  src="/assets/img/freefire.svg"
                  alt="Free Fire"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://cdn.worldvectorlogo.com/logos/freefire-1.svg';
                  }}
                />
              </div>
              <span className="font-bold text-sm text-gray-800">Free Fire</span>
            </button>

            {/* Mobile Legends */}
            <button
              onClick={() => handleGameSelect('ml', 'Mobile Legends')}
              className={`p-4 rounded-2xl transition duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer ${
                activeGame === 'ml'
                  ? 'bg-white shadow-xl ring-4 ring-blue-500 scale-102'
                  : 'bg-white/80 hover:bg-white hover:shadow-md'
              }`}
            >
              <div className="w-24 h-16 flex items-center justify-center p-1">
                <img
                  src="/assets/img/mobilelegends.png"
                  alt="Mobile Legends"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://www.freepnglogos.com/uploads/logo-mobile-legend-png/logo-mobile-legend-tcash-apapun-operatornya-semua-bisa-paketcash-18.png';
                  }}
                />
              </div>
              <span className="font-bold text-sm text-gray-800">Mobile Legends</span>
            </button>

            {/* PUBG Mobile */}
            <button
              onClick={() => handleGameSelect('pubg', 'PUBG Mobile')}
              className={`p-4 rounded-2xl transition duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer ${
                activeGame === 'pubg'
                  ? 'bg-white shadow-xl ring-4 ring-amber-500 scale-102'
                  : 'bg-white/80 hover:bg-white hover:shadow-md'
              }`}
            >
              <div className="w-24 h-16 flex items-center justify-center p-1">
                <img
                  src="/assets/img/pubg.svg"
                  alt="PUBG Mobile"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="font-bold text-sm text-gray-800">PUBG Mobile</span>
            </button>

            {/* CODM */}
            <button
              onClick={() => handleGameSelect('codm', 'Call of Duty: Mobile')}
              className={`p-4 rounded-2xl transition duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer ${
                activeGame === 'codm'
                  ? 'bg-white shadow-xl ring-4 ring-emerald-500 scale-102'
                  : 'bg-white/80 hover:bg-white hover:shadow-md'
              }`}
            >
              <div className="w-24 h-16 flex items-center justify-center p-1">
                <img
                  src="/assets/img/codm.svg"
                  alt="Call of Duty Mobile"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://cdn.worldvectorlogo.com/logos/call-of-duty.svg';
                  }}
                />
              </div>
              <span className="font-bold text-sm text-gray-800">COD Mobile</span>
            </button>
          </div>
        </div>

        {/* Loading simulation authentic to mesterecellid.netlify.app */}
        {loadingSim ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-gray-200 shadow-sm">
            <div className="mscell-loader mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-900">Memuat Data.....</h2>
            <p className="text-sm text-gray-500 italic mt-1">"{loadingGameName}"</p>
          </div>
        ) : (
          <div>
            {/* Title for Active Game */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <i className="bx bxs-game text-[#007bff]"></i>
                Daftar Harga: {getGameTitle()}
              </h2>
              <span className="text-xs bg-blue-50 text-[#007bff] font-semibold px-3 py-1 rounded-full border border-blue-200">
                100% Legal & Cepat
              </span>
            </div>

            {/* Table */}
            <section id="katalog" className="sec katalog-width">
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#007bff] text-white text-xs sm:text-sm uppercase tracking-wider">
                        <th className="py-3.5 px-4 text-center w-16">No</th>
                        <th className="py-3.5 px-4">Produk</th>
                        <th className="py-3.5 px-4">Jumlah</th>
                        <th className="py-3.5 px-4">Harga</th>
                        <th className="py-3.5 px-4">Informasi</th>
                        <th className="py-3.5 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {currentItems.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-blue-50/60 transition duration-150 odd:bg-white even:bg-gray-50/50"
                        >
                          <td className="py-3 px-4 text-center font-medium text-gray-500">
                            {index + 1}
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-900">
                            {item.name}
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-700">
                            {item.amount || '-'}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-[#007bff]">
                            {item.price}
                          </td>
                          <td className="py-3 px-4 text-xs text-gray-600">
                            {item.info || item.period || '-'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => onSelectProduct(item)}
                              className="bg-[#007bff] hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs hover:shadow transition inline-flex items-center gap-1 cursor-pointer"
                            >
                              <i className="bx bxs-cart-add text-sm"></i>
                              Top Up
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Gray Notice from original site */}
            <section id="marquee" className="mt-8 rounded-xl overflow-hidden shadow-xs">
              <Marquee
                text={footerMarquee}
                speed={footerMarqueeSpeed}
                bgColor="#A9A9A9"
                textColor="#111827"
              />
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
