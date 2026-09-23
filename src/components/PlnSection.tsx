import React, { useState } from 'react';
import { PLN_PACKAGES, ProductItem } from '../data/mscellData.ts';
import { Marquee } from './Marquee.tsx';

interface PlnSectionProps {
  onSelectProduct: (product: ProductItem) => void;
  onBackToHome: () => void;
  items?: ProductItem[];
  footerMarquee?: string;
  footerMarqueeSpeed?: number;
}

export const PlnSection: React.FC<PlnSectionProps> = ({
  onSelectProduct,
  onBackToHome,
  items,
  footerMarquee = 'Layanan Token Listrik MsCell Siap 24 Jam - Tanpa Antre di Kantor PLN',
  footerMarqueeSpeed = 25,
}) => {
  const [meterNumber, setMeterNumber] = useState('');
  const [meterChecked, setMeterChecked] = useState(false);

  const activeCatalog = items && items.length > 0 ? items : PLN_PACKAGES;

  const handleCheckMeter = (e: React.FormEvent) => {
    e.preventDefault();
    if (meterNumber.trim().length >= 10) {
      setMeterChecked(true);
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
            PLN Prabayar & Pascabayar
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-amber-100 text-amber-600 mb-3">
            <i className="bx bx-building-house text-3xl"></i>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Token PLN & Listrik
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1 max-w-xl mx-auto">
            Isi token listrik PLN prabayar kilat dan bayar tagihan listrik pascabayar langsung di konter MsCell Klaten.
          </p>
        </div>

        {/* Meter Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8 max-w-xl mx-auto">
          <form onSubmit={handleCheckMeter} className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">
              Masukkan Nomor Meter / ID Pelanggan PLN:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={meterNumber}
                  onChange={(e) => {
                    setMeterNumber(e.target.value);
                    setMeterChecked(false);
                  }}
                  placeholder="Contoh: 14234567890"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#007bff] text-sm"
                  maxLength={12}
                />
              </div>
              <button
                type="submit"
                className="bg-[#007bff] hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition cursor-pointer"
              >
                Cek ID
              </button>
            </div>
            {meterChecked && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 flex items-center gap-2">
                <i className="bx bx-check-circle text-lg text-green-600"></i>
                <span>
                  ID Pelanggan <strong>{meterNumber}</strong> valid! Silakan pilih nominal token di bawah.
                </span>
              </div>
            )}
          </form>
        </div>

        {/* PLN Packages Table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#007bff] text-white text-xs sm:text-sm uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-16">No</th>
                  <th className="py-3.5 px-4">Produk PLN</th>
                  <th className="py-3.5 px-4">Nominal</th>
                  <th className="py-3.5 px-4">Harga / Biaya</th>
                  <th className="py-3.5 px-4">Informasi</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {activeCatalog.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/60 transition duration-150 odd:bg-white even:bg-gray-50/50"
                  >
                    <td className="py-3 px-4 text-center font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2">
                      <i className="bx bxs-zap text-amber-500 text-lg"></i>
                      {item.name}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-700">
                      {item.amount}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-[#007bff]">
                      {item.price}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      {item.info}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onSelectProduct(item)}
                        className="bg-[#007bff] hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs hover:shadow transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <i className="bx bxs-cart-add text-sm"></i>
                        Beli Token
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to use */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 text-base mb-3 flex items-center gap-2">
            <i className="bx bx-info-circle text-[#007bff] text-xl"></i>
            Cara Pengisian Token PLN di MsCell:
          </h3>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2 leading-relaxed">
            <li>Pilih nominal token yang diinginkan atau hubungi admin di <strong>085156482636</strong>.</li>
            <li>Kirimkan 11-12 digit Nomor Meteran atau ID Pelanggan PLN Anda.</li>
            <li>Lakukan pembayaran tunai di konter MsCell atau via transfer bank/e-wallet.</li>
            <li>20 digit kode stroom token listrik akan langsung dikirimkan ke Anda dan siap diinput ke meteran listrik.</li>
          </ol>
        </div>

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
