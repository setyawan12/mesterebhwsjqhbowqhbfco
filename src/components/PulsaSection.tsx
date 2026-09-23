import React, { useState } from 'react';
import { PULSA_PACKAGES, ProductItem } from '../data/mscellData.ts';
import { Marquee } from './Marquee.tsx';

interface PulsaSectionProps {
  onSelectProduct: (product: ProductItem) => void;
  onBackToHome: () => void;
  searchFilter?: string;
  items?: ProductItem[];
  footerMarquee?: string;
  footerMarqueeSpeed?: number;
}

export const PulsaSection: React.FC<PulsaSectionProps> = ({
  onSelectProduct,
  onBackToHome,
  searchFilter = '',
  items,
  footerMarquee = 'Harga Sewaktu-Waktu Dapat Berubah Tanpa Pemberitahuan - Melayani Juga Pulsa Transfer & Isi Saldo E-Wallet',
  footerMarqueeSpeed = 25,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [detectedOperator, setDetectedOperator] = useState('');

  const activeCatalog = items && items.length > 0 ? items : PULSA_PACKAGES;

  const detectOperator = (num: string) => {
    const clean = num.replace(/\D/g, '');
    if (clean.startsWith('0811') || clean.startsWith('0812') || clean.startsWith('0813') || clean.startsWith('0821') || clean.startsWith('0822') || clean.startsWith('0823') || clean.startsWith('0852') || clean.startsWith('0853')) {
      return 'Telkomsel';
    }
    if (clean.startsWith('0814') || clean.startsWith('0815') || clean.startsWith('0816') || clean.startsWith('0855') || clean.startsWith('0856') || clean.startsWith('0857') || clean.startsWith('0858')) {
      return 'Indosat';
    }
    if (clean.startsWith('0817') || clean.startsWith('0818') || clean.startsWith('0819') || clean.startsWith('0859') || clean.startsWith('0877') || clean.startsWith('0878')) {
      return 'XL';
    }
    if (clean.startsWith('0831') || clean.startsWith('0832') || clean.startsWith('0833') || clean.startsWith('0838')) {
      return 'Axis';
    }
    if (clean.startsWith('0895') || clean.startsWith('0896') || clean.startsWith('0897') || clean.startsWith('0898') || clean.startsWith('0899')) {
      return 'Three (3)';
    }
    if (clean.startsWith('0881') || clean.startsWith('0882') || clean.startsWith('0883') || clean.startsWith('0884') || clean.startsWith('0885') || clean.startsWith('0886') || clean.startsWith('0887') || clean.startsWith('0888') || clean.startsWith('0889')) {
      return 'Smartfren';
    }
    return '';
  };

  const handlePhoneChange = (val: string) => {
    setPhoneNumber(val);
    setDetectedOperator(detectOperator(val));
  };

  const filteredPulsa = activeCatalog.filter((p) => {
    const q = searchFilter.toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      (p.amount && p.amount.toLowerCase().includes(q)) ||
      p.price.toLowerCase().includes(q)
    );
  });

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
            Pulsa Reguler & Transfer
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-blue-100 text-[#007bff] mb-3">
            <i className="bx bxs-devices text-3xl"></i>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Pulsa Seluler
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1 max-w-xl mx-auto">
            Melayani pengisian pulsa elektrik semua operator Indonesia dengan proses otomatis 24 jam di konter MsCell Klaten.
          </p>
        </div>

        {/* Quick Operator Detector Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8 max-w-xl mx-auto">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Cek Operator Nomor HP Anda:
          </label>
          <div className="relative">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="Masukkan nomor (misal: 085156482636)"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#007bff] text-sm pr-28"
            />
            {detectedOperator && (
              <span className="absolute right-2.5 top-2 bg-blue-100 text-[#007bff] text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-200">
                {detectedOperator}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Mendukung Telkomsel (SimPATI/AS), Indosat Ooredoo (IM3), XL, Axis, Tri, dan Smartfren.
          </p>
        </div>

        {/* Pulsa Table */}
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
                  {filteredPulsa.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/60 transition duration-150 odd:bg-white even:bg-gray-50/50"
                    >
                      <td className="py-3 px-4 text-center font-medium text-gray-500">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2">
                        <i className="bx bx-mobile-vibration text-blue-600 text-lg"></i>
                        {item.name}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-700">
                        {item.amount}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-[#007bff]">
                        {item.price}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600">
                        {item.info || '-'}
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Gray Notice */}
        <section id="marquee" className="mt-8 rounded-xl overflow-hidden shadow-xs">
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
