import React, { useState, useMemo } from 'react';
import { INTERNET_PACKAGES, ProductItem } from '../data/mscellData.ts';
import { Marquee } from './Marquee.tsx';

interface InternetSectionProps {
  onSelectProduct: (product: ProductItem) => void;
  onBackToHome: () => void;
  searchFilter?: string;
  items?: ProductItem[];
  footerMarquee?: string;
  footerMarqueeSpeed?: number;
  lastUpdated?: string;
}

export const InternetSection: React.FC<InternetSectionProps> = ({
  onSelectProduct,
  onBackToHome,
  searchFilter = '',
  items,
  footerMarquee = 'Harga Sewaktu-Waktu Dapat Berubah Tanpa Pemberitahuan',
  footerMarqueeSpeed = 25,
  lastUpdated = '11:59 | 13 Desember 2020',
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('Semua');
  const [localSearch, setLocalSearch] = useState<string>('');

  const activeCatalog = items && items.length > 0 ? items : INTERNET_PACKAGES;

  const providers = ['Semua', 'Indosat', 'Axis', 'XL', 'Telkomsel', 'Smartfren', 'Three'];

  const filteredItems = useMemo(() => {
    return activeCatalog.filter((item) => {
      // If item is marked as out of stock, it can still be displayed or filtered
      const matchProvider =
        selectedProvider === 'Semua' ||
        (item.provider && item.provider.toLowerCase() === selectedProvider.toLowerCase());

      const query = (searchFilter || localSearch).trim().toLowerCase();
      if (!query) return matchProvider;

      const matchText =
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.provider && item.provider.toLowerCase().includes(query)) ||
        (item.amount && item.amount.toLowerCase().includes(query)) ||
        (item.price && item.price.toLowerCase().includes(query)) ||
        (item.period && item.period.toLowerCase().includes(query));

      return matchProvider && matchText;
    });
  }, [activeCatalog, selectedProvider, searchFilter, localSearch]);

  const getProviderBadge = (provider?: string) => {
    switch (provider?.toLowerCase()) {
      case 'indosat':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'axis':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'xl':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'telkomsel':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'smartfren':
        return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'three':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="py-10 bg-gray-50 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#007bff] hover:text-blue-800 bg-white px-4 py-2 rounded-xl shadow-xs border border-gray-200 transition cursor-pointer"
          >
            <i className="bx bx-arrow-back text-lg"></i>
            Kembali Ke Beranda
          </button>

          <span className="text-xs text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-xs">
            Katalog Lengkap: <strong>{INTERNET_PACKAGES.length} Paket</strong>
          </span>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-blue-100 text-[#007bff] mb-3">
            <i className="bx bx-sort-alt-2 text-3xl"></i>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Voucher Internet
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1 max-w-xl mx-auto">
            Daftar harga kuota & voucher data resmi MsCell Klaten. Murah, masa aktif jelas, dan proses kilat langsung masuk!
          </p>
        </div>

        {/* Provider Filter Tabs */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start w-full md:w-auto">
            {providers.map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvider(prov)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  selectedProvider === prov
                    ? 'bg-[#007bff] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>

          {/* Local quick search if top bar isn't used */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Cari kuota (misal: 10GB)..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full text-xs sm:text-sm pl-8 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#007bff]"
            />
            <i className="bx bx-search absolute left-2.5 top-2.5 text-gray-400"></i>
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
              >
                <i className="bx bx-x"></i>
              </button>
            )}
          </div>
        </div>

        {/* Catalog Table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#007bff] text-white text-xs sm:text-sm uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-16">No</th>
                  <th className="py-3.5 px-4">Provider</th>
                  <th className="py-3.5 px-4">Produk</th>
                  <th className="py-3.5 px-4">Harga</th>
                  <th className="py-3.5 px-4">Masa Aktif</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      <i className="bx bx-search-alt text-4xl text-gray-400 block mb-2"></i>
                      Tidak ada paket internet yang cocok dengan pencarian Anda.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/60 transition duration-150 odd:bg-white even:bg-gray-50/50"
                    >
                      <td className="py-3 px-4 text-center font-medium text-gray-500">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md border ${getProviderBadge(
                            item.provider
                          )}`}
                        >
                          {item.provider}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        <div>{item.name}</div>
                        {item.info && (
                          <span className="text-[11px] text-gray-500 font-normal">
                            {item.info}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-[#007bff]">
                        {item.price}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-700">
                        <span className="inline-flex items-center gap-1">
                          <i className="bx bx-time-five text-gray-400"></i>
                          {item.period || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onSelectProduct(item)}
                          className="bg-[#007bff] hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs hover:shadow transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <i className="bx bxs-cart-add text-sm"></i>
                          Pesan
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Update note from the original site */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Status: Server Transaksi Online & Siap Kirim
          </div>
          <p className="font-mono text-gray-600 font-medium">
            Update {lastUpdated} &lt;&lt;&lt;
          </p>
        </div>

        {/* Grey Marquee Notice from original site */}
        <section id="marquee" className="mt-6 rounded-xl overflow-hidden shadow-xs">
          <Marquee
            text={footerMarquee}
            speed={footerMarqueeSpeed}
            bgColor="#A9A9A9"
            textColor="#111827"
          />
        </section>
      </div>
    </div>
  );
};
