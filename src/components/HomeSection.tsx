import React from 'react';
import { ActivePage } from './Navbar.tsx';
import { CONTACT_INFO } from '../data/mscellData.ts';

interface HomeSectionProps {
  onNavigate: (page: ActivePage) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onNavigate }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section id="hero" className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Logo Image */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-center">
                  <img
                    src="/assets/img/logo.png"
                    alt="MsCell Logo"
                    className="w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] object-contain transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* About / Hero Text */}
            <div className="md:col-span-7 text-center md:text-left space-y-4" id="about">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Konter Pulsa & Digital Service Terpercaya
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Ms<span className="text-[#007bff]">Cell</span>
              </h1>

              <p className="text-gray-600 text-lg sm:text-xl leading-relaxed max-w-2xl">
                MsCell adalah sebuah konter yang menyediakan banyak keperluan digital seperti pulsa, voucher internet dan masih banyak lagi..
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => onNavigate('internet')}
                  className="bg-[#007bff] hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-2 text-sm"
                >
                  <i className="bx bx-sort-alt-2 text-xl"></i>
                  Lihat Voucher Internet
                </button>

                <button
                  onClick={() => onNavigate('pulsa')}
                  className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-semibold px-6 py-3 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-2 text-sm"
                >
                  <i className="bx bxs-devices text-xl text-[#007bff]"></i>
                  Isi Pulsa
                </button>

                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm"
                >
                  <i className="bx bxl-whatsapp text-xl"></i>
                  Chat WhatsApp
                </a>
              </div>

              {/* Badges */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg">
                <div className="text-center p-2 rounded-lg bg-blue-50/50">
                  <div className="font-extrabold text-blue-700 text-lg sm:text-xl">100%</div>
                  <div className="text-[11px] sm:text-xs text-gray-500 font-medium">Aman & Legal</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-blue-50/50">
                  <div className="font-extrabold text-blue-700 text-lg sm:text-xl">24 Jam</div>
                  <div className="text-[11px] sm:text-xs text-gray-500 font-medium">Respon Cepat</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-blue-50/50">
                  <div className="font-extrabold text-blue-700 text-lg sm:text-xl">Termurah</div>
                  <div className="text-[11px] sm:text-xs text-gray-500 font-medium">Harga Grosir</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section (Produk dan Layanan Unggulan Kami) */}
      <section id="feature" className="py-16 md:py-24 bg-[#007bff] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Produk dan Layanan Unggulan Kami
            </h2>
            <p className="text-blue-100 text-base max-w-2xl mx-auto">
              Klik salah satu produk di bawah ini untuk melihat daftar harga lengkap dan melakukan pemesanan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Card 1: Pulsa Seluler */}
            <div
              onClick={() => onNavigate('pulsa')}
              className="bg-white rounded-2xl p-6 text-center text-gray-800 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center text-[#007bff] group-hover:bg-[#007bff] group-hover:text-white transition duration-300">
                  <i className="bx bxs-devices text-3xl"></i>
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#007bff] transition">
                  Pulsa Seluler
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  Telkomsel, Indosat, XL, Axis, Tri, Smartfren nominal 5K - 100K.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-[#007bff] flex items-center justify-center gap-1">
                Buka Katalog <i className="bx bx-right-arrow-alt text-base"></i>
              </div>
            </div>

            {/* Card 2: Voucher Data */}
            <div
              onClick={() => onNavigate('internet')}
              className="bg-white rounded-2xl p-6 text-center text-gray-800 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center text-[#007bff] group-hover:bg-[#007bff] group-hover:text-white transition duration-300">
                  <i className="bx bx-sort-alt-2 text-3xl"></i>
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#007bff] transition">
                  Voucher Data
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  Paket kuota internet harian, mingguan, bulanan semua provider.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-[#007bff] flex items-center justify-center gap-1">
                Buka Katalog <i className="bx bx-right-arrow-alt text-base"></i>
              </div>
            </div>

            {/* Card 3: Token PLN */}
            <div
              onClick={() => onNavigate('pln')}
              className="bg-white rounded-2xl p-6 text-center text-gray-800 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center text-[#007bff] group-hover:bg-[#007bff] group-hover:text-white transition duration-300">
                  <i className="bx bx-building-house text-3xl"></i>
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#007bff] transition">
                  Token PLN
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  Token listrik prabayar 20K - 1 Juta & pembayaran tagihan pascabayar.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-[#007bff] flex items-center justify-center gap-1">
                Buka Katalog <i className="bx bx-right-arrow-alt text-base"></i>
              </div>
            </div>

            {/* Card 4: Transfer Bank */}
            <div
              onClick={() => onNavigate('bank')}
              className="bg-white rounded-2xl p-6 text-center text-gray-800 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center text-[#007bff] group-hover:bg-[#007bff] group-hover:text-white transition duration-300">
                  <i className="bx bxs-bank text-3xl"></i>
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#007bff] transition">
                  Transfer Bank
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  Mitra resmi BRILink. Transfer, setor tunai, tarik tunai tanpa antre.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-[#007bff] flex items-center justify-center gap-1">
                Info Layanan <i className="bx bx-right-arrow-alt text-base"></i>
              </div>
            </div>

            {/* Card 5: Game Online */}
            <div
              onClick={() => onNavigate('game')}
              className="bg-white rounded-2xl p-6 text-center text-gray-800 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center text-[#007bff] group-hover:bg-[#007bff] group-hover:text-white transition duration-300">
                  <i className="bx bxs-diamond text-3xl"></i>
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#007bff] transition">
                  Game Online
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  Top up Free Fire, Mobile Legends, PUBG Mobile, CODM terjangkau.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-[#007bff] flex items-center justify-center gap-1">
                Buka Katalog <i className="bx bx-right-arrow-alt text-base"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Excellence Section (Keunggulan MsCell) */}
      <section id="excellence" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* List */}
            <div className="md:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Keunggulan <span className="text-[#007bff]">MsCell</span>
              </h2>

              <p className="text-gray-600 text-base">
                MsCell berkomitmen memberikan kenyamanan dan kecepatan transaksi untuk seluruh pelanggan di Klaten dan sekitarnya:
              </p>

              <div className="space-y-4 pt-2">
                {[
                  { name: 'Aman', desc: 'Transaksi terjamin legal dan aman dengan riwayat transaksi yang jelas.' },
                  { name: 'Amanah', desc: 'Kepercayaan pelanggan adalah prioritas utama konter kami sejak berdiri.' },
                  { name: 'Respon Cepat', desc: 'Pelayanan kilat via WhatsApp dan konter fisik tanpa menunggu lama.' },
                  { name: 'Murah', desc: 'Harga bersaing, ramah di kantong pelajar, masyarakat, dan pebisnis pulsa.' },
                  { name: 'Mudah', desc: 'Format pemesanan simpel tanpa ribet registrasi yang berbelit-belit.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-blue-50/50 transition">
                    <i className="bx bxs-check-circle text-3xl sm:text-4xl text-[#007bff] shrink-0 mt-0.5"></i>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Illustration */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative p-4">
                <div className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center overflow-hidden shadow-inner">
                  <img
                    src="/assets/img/keranjang.png"
                    alt="Keunggulan MsCell Keranjang"
                    className="w-4/5 h-4/5 object-contain hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kenawhy Section (Kenapa Harus Memilih Kami) */}
      <section id="kenawhy" className="py-16 md:py-24 bg-[#eeeeee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Kenapa Harus Memilih Kami
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Alasan mengapa ribuan pelanggan setia mempercayakan kebutuhan pulsa & kuota kepada MsCell
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: PENGALAMAN */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition duration-300 border border-gray-200/80 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#007bff] flex items-center justify-center mb-4 text-2xl">
                  <i className="bx bxs-time text-3xl"></i>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 tracking-wide mb-2 uppercase">
                  PENGALAMAN
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Kami berpengalaman karena telah melakukan banyak transaksi!
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-blue-600 font-semibold">
                ✓ Ribuan Transaksi Sukses
              </div>
            </div>

            {/* Card 2: RESPON CEPAT */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition duration-300 border border-gray-200/80 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#007bff] flex items-center justify-center mb-4 text-2xl">
                  <i className="bx bx-loader text-3xl animate-spin"></i>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 tracking-wide mb-2 uppercase">
                  RESPON CEPAT
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Kami akan melakukan respon cepat bila pelanggan mengalami masalah pada produk kami
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-blue-600 font-semibold">
                ✓ Bantuan Kendala Cepat
              </div>
            </div>

            {/* Card 3: MURAH */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition duration-300 border border-gray-200/80 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#007bff] flex items-center justify-center mb-4 text-2xl">
                  <i className="bx bxs-chat text-3xl"></i>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 tracking-wide mb-2 uppercase">
                  MURAH
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Harga Produk produk kami terjamin murahnya.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-blue-600 font-semibold">
                ✓ Harga Grosir & Ramah Kantong
              </div>
            </div>

            {/* Card 4: ONE PAYMENT */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition duration-300 border border-gray-200/80 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#007bff] flex items-center justify-center mb-4 text-2xl">
                  <i className="bx bx-credit-card text-3xl"></i>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 tracking-wide mb-2 uppercase">
                  ONE PAYMENT
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Kami melayani pembayaran secara tunai,jadi akan lebih transparan kepada pembeli.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-blue-600 font-semibold">
                ✓ Transparan Tanpa Biaya Tersembunyi
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
