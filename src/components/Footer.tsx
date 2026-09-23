import React from 'react';
import { CONTACT_INFO } from '../data/mscellData.ts';
import { SiteSettings, DEFAULT_SETTINGS } from '../firebase.ts';

interface FooterProps {
  settings?: SiteSettings;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings = DEFAULT_SETTINGS,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/62${(settings.whatsappNumber || '085156482636').replace(/^0/, '')}?text=${encodeURIComponent(
    'Halo MsCell, saya mau tanya paket pulsa/internet.'
  )}`;

  return (
    <footer id="footer" className="bg-[#007bff] text-white pt-16 pb-8 border-t-4 border-blue-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-blue-400/40 gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                {CONTACT_INFO.name}
              </h2>
              {settings.storeStatus && (
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    settings.storeStatus === 'Buka'
                      ? 'bg-green-500/20 text-green-200 border-green-300/40'
                      : settings.storeStatus === 'Istirahat'
                      ? 'bg-yellow-500/20 text-yellow-200 border-yellow-300/40'
                      : 'bg-red-500/20 text-red-200 border-red-300/40'
                  }`}
                >
                  ● {settings.storeStatus}
                </span>
              )}
            </div>
            <p className="text-blue-100 text-sm max-w-md">
              {CONTACT_INFO.tagline}. Melayani transaksi pulsa, paket kuota, token PLN, transfer uang & top up game secara cepat, aman, dan terpercaya.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-sm hover:shadow transition"
            >
              <i className="bx bxl-whatsapp text-xl"></i>
              Chat WhatsApp
            </a>
            <button
              onClick={scrollToTop}
              className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl text-sm transition cursor-pointer"
              title="Kembali ke atas"
            >
              <i className="bx bx-up-arrow-alt text-xl"></i>
            </button>
          </div>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold tracking-wide mb-4 text-white flex items-center gap-2">
              <i className="bx bxs-contact text-blue-200"></i>
              Contact
            </h3>
            <div className="space-y-3 text-blue-100 text-sm">
              <p className="flex items-center gap-3">
                <i className="bx bxs-phone text-2xl text-blue-200 shrink-0"></i>
                <a
                  href={`tel:${settings.phone || CONTACT_INFO.phone}`}
                  className="hover:text-white hover:underline transition font-mono"
                >
                  {settings.phone || CONTACT_INFO.phone}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <i className="bx bx-mail-send text-2xl text-blue-200 shrink-0"></i>
                <a
                  href={`mailto:${settings.email || CONTACT_INFO.email}`}
                  className="hover:text-white hover:underline transition break-all"
                >
                  {settings.email || CONTACT_INFO.email}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <i className="bx bxl-whatsapp text-2xl text-green-300 shrink-0"></i>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition"
                >
                  WhatsApp: {settings.whatsappNumber || CONTACT_INFO.phoneFormatted}
                </a>
              </p>
            </div>
          </div>

          {/* Alamat */}
          <div>
            <h3 className="text-xl font-bold tracking-wide mb-4 text-white flex items-center gap-2">
              <i className="bx bxs-map-pin text-blue-200"></i>
              Alamat
            </h3>
            <div className="space-y-3 text-blue-100 text-sm">
              <p className="leading-relaxed">
                {settings.address || CONTACT_INFO.address}
              </p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  settings.address || CONTACT_INFO.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-200 hover:text-white underline mt-1 font-medium"
              >
                <i className="bx bx-navigation"></i>
                Buka di Google Maps
              </a>
            </div>
          </div>

          {/* Sosial Media Kami */}
          <div>
            <h3 className="text-xl font-bold tracking-wide mb-4 text-white flex items-center gap-2">
              <i className="bx bxs-share-alt text-blue-200"></i>
              Sosial Media Kami
            </h3>
            <div className="space-y-3 text-blue-100 text-sm">
              <div className="flex items-center gap-3">
                <i className="bx bxs-instagram-alt text-2xl text-pink-300 shrink-0"></i>
                <a
                  href={settings.instagram || CONTACT_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white font-semibold underline tracking-wide uppercase"
                >
                  -INSTAGRAM ({settings.instagramHandle || CONTACT_INFO.instagramHandle})
                </a>
              </div>
              <p className="text-xs text-blue-200/90 leading-relaxed pt-2">
                Follow akun Instagram kami untuk mendapatkan info promo kuota terbaru, voucher diskon, dan update layanan digital harian.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/30 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-100 gap-2">
          <p className="uppercase tracking-wider font-medium leading-relaxed text-center sm:text-left">
            ALL RIGHTS RESERVED BY MSCELL {CONTACT_INFO.year} & DESIGN BY{' '}
            <a
              href={CONTACT_INFO.designerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline font-bold hover:text-blue-200 transition"
            >
              {CONTACT_INFO.designer}
            </a>
          </p>

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-blue-200 hover:text-white underline text-[11px] font-medium flex items-center gap-1 cursor-pointer"
            >
              <i className="bx bxs-lock-alt"></i> Panel Pengelola Privat (Firebase)
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
