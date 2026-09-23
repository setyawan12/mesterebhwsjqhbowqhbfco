import React, { useState } from 'react';
import { CONTACT_INFO, ProductItem } from '../data/mscellData.ts';
import { Marquee } from './Marquee.tsx';

interface BankSectionProps {
  onBackToHome: () => void;
  onSelectProduct: (product: ProductItem) => void;
}

export const BankSection: React.FC<BankSectionProps> = ({ onBackToHome, onSelectProduct }) => {
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [bankTarget, setBankTarget] = useState<string>('BRI');

  const calculateFee = () => {
    const num = parseInt(transferAmount.replace(/\D/g, ''), 10) || 0;
    if (num <= 0) return 0;
    if (bankTarget === 'BRI') {
      if (num <= 500000) return 3000;
      if (num <= 1000000) return 5000;
      if (num <= 5000000) return 7000;
      return 10000;
    } else {
      if (num <= 500000) return 6500;
      if (num <= 1000000) return 8000;
      return 12000;
    }
  };

  const handleOrderTransfer = () => {
    const fee = calculateFee();
    const item: ProductItem = {
      id: `bank-tf-${Date.now()}`,
      category: 'bank',
      name: `Transfer Bank ${bankTarget}`,
      amount: transferAmount ? `Rp ${parseInt(transferAmount.replace(/\D/g, ''), 10).toLocaleString('id-ID')}` : 'Nominal Fleksibel',
      price: fee > 0 ? `Biaya Admin Rp ${fee.toLocaleString('id-ID')}` : 'Admin Mulai Rp 3.000',
      info: `Layanan BRILink Resmi MsCell Klaten (${bankTarget})`,
    };
    onSelectProduct(item);
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

          <span className="text-xs text-blue-700 bg-blue-50 font-semibold px-3 py-1.5 rounded-lg border border-blue-200 shadow-xs">
            Mitra Agen BRILink Resmi
          </span>
        </div>

        {/* Hero Bank / BRILink section from original site */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-gray-200 mb-10 text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/assets/img/brilink.png"
              alt="Logo Agen BRILink"
              className="h-16 sm:h-20 object-contain"
              onError={(e) => {
                // Fallback to original external URL
                (e.target as HTMLImageElement).src =
                  'https://1.bp.blogspot.com/-DKzrn1P43Y8/XZBsY_iD64I/AAAAAAAAAgM/NlSUoy1Wz0geXeXoVtOHlMF14Ns0HjXRgCLcBGAsYHQ/s1600/Logo%2BAgen%2BBRILink%2BCDR%2Bdan%2BPNG.png';
              }}
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 max-w-2xl mx-auto">
            Layanan Transfer & Keuangan Agen BRILink MsCell
          </h2>

          <div className="max-w-3xl mx-auto bg-blue-50/70 border border-blue-100 rounded-2xl p-6 sm:p-8">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-medium">
              "Kami Tergabung menjadi mitra dari BRI, Fungsi dari BRILink sendiri adalah untuk memudahkan keperluan transfer, tarik tunai dan masih banyak lagi tanpa pergi ke bank dan tanpa mengantri"
            </p>
          </div>
        </div>

        {/* Layanan Kami Diantaranya Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-start">
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-md border border-gray-200">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 pb-3 border-b border-gray-100">
              <i className="bx bxs-bank text-[#007bff]"></i>
              Layanan Kami Diantaranya
            </h3>

            <div className="space-y-4">
              {[
                {
                  title: 'Transfer Tunai Sesama BRI Dan Bank Lain',
                  desc: 'Kirim uang instan ke semua bank di Indonesia (BCA, Mandiri, BNI, BSI, CIMB, Danamon, Bank Jateng, dll).',
                },
                {
                  title: 'Tarik Tunai',
                  desc: 'Tarik uang dari kartu ATM atau saldo e-wallet langsung jadi uang tunai tanpa antre panjang di mesin ATM.',
                },
                {
                  title: 'Setor Tunai',
                  desc: 'Setor uang tunai langsung masuk ke buku tabungan atau rekening bank Anda secara aman dan real-time.',
                },
                {
                  title: 'Cicilan & Angsuran',
                  desc: 'Bayar angsuran kredit kendaraan FIF, Adira, OTO, BAF, Mega Finance, dan angsuran lainnya.',
                },
                {
                  title: 'Dan Masih Banyak Lagi',
                  desc: 'Top up saldo e-wallet (DANA, OVO, ShopeePay, GoPay, LinkAja, Maxim), bayar BPJS Kesehatan & PDAM.',
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-blue-50/50 transition border border-transparent hover:border-blue-100"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#007bff] flex items-center justify-center shrink-0 mt-0.5">
                    <i className="bx bxs-chevrons-right text-2xl font-bold"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{service.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transfer Calculator Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-3xl p-8 shadow-xl">
            <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
              <i className="bx bx-calculator text-2xl text-blue-300"></i>
              Simulasi Biaya Transfer
            </h4>
            <p className="text-blue-200 text-xs mb-6">
              Hitung perkiraan biaya admin transfer melalui Agen BRILink MsCell Klaten.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-blue-200 uppercase mb-1">
                  Bank Tujuan:
                </label>
                <select
                  value={bankTarget}
                  onChange={(e) => setBankTarget(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  <option value="BRI" className="text-gray-900">Sesama Bank BRI (Termurah)</option>
                  <option value="BCA" className="text-gray-900">Bank BCA</option>
                  <option value="Mandiri" className="text-gray-900">Bank Mandiri</option>
                  <option value="BNI" className="text-gray-900">Bank BNI</option>
                  <option value="BSI" className="text-gray-900">Bank Syariah Indonesia (BSI)</option>
                  <option value="Lainnya" className="text-gray-900">Bank Lain / E-Wallet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-200 uppercase mb-1">
                  Nominal Uang (Rp):
                </label>
                <input
                  type="text"
                  value={transferAmount}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '');
                    setTransferAmount(clean ? parseInt(clean, 10).toLocaleString('id-ID') : '');
                  }}
                  placeholder="Contoh: 500.000"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white/40 font-mono"
                />
              </div>

              {transferAmount && (
                <div className="bg-white/15 rounded-2xl p-4 border border-white/20 mt-2 space-y-2">
                  <div className="flex justify-between text-xs text-blue-100">
                    <span>Estimasi Biaya Admin:</span>
                    <span className="font-bold text-white">
                      Rp {calculateFee().toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-white border-t border-white/20 pt-2">
                    <span>Total Disetor:</span>
                    <span className="text-green-300 font-mono text-base">
                      Rp {(
                        (parseInt(transferAmount.replace(/\D/g, ''), 10) || 0) + calculateFee()
                      ).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleOrderTransfer}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md mt-4"
              >
                <i className="bx bxl-whatsapp text-xl"></i>
                Konsultasi / Transaksi via WA
              </button>

              <div className="text-[11px] text-blue-200 text-center leading-relaxed">
                Alamat Konter: {CONTACT_INFO.address}
              </div>
            </div>
          </div>
        </div>

        {/* Gray Notice */}
        <section id="marquee" className="rounded-xl overflow-hidden shadow-xs">
          <Marquee
            text="Layanan Agen BRILink MsCell: Buka Setiap Hari - Solusi Keuangan Mudah & Cepat Tanpa Pergi Ke Bank"
            bgColor="#A9A9A9"
            textColor="#111827"
          />
        </section>
      </div>
    </div>
  );
};
