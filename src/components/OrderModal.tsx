import React, { useState } from 'react';
import { ProductItem, CONTACT_INFO } from '../data/mscellData.ts';

interface OrderModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ product, onClose }) => {
  const [targetId, setTargetId] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tunai di Konter (One Payment)');
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const isGame = product.category === 'game';
  const isPln = product.category === 'pln';
  const isBank = product.category === 'bank';

  let inputLabel = 'Nomor HP Tujuan:';
  let inputPlaceholder = 'Contoh: 08515648xxxx';

  if (isGame) {
    inputLabel = 'ID Game / Server:';
    inputPlaceholder = 'Contoh: 12345678 (2041)';
  } else if (isPln) {
    inputLabel = 'Nomor Meter / ID Pelanggan PLN:';
    inputPlaceholder = 'Contoh: 14234567890';
  } else if (isBank) {
    inputLabel = 'Nomor Rekening & Nama Bank:';
    inputPlaceholder = 'Contoh: BRI 0123-01-xxxxxx a.n Budi';
  }

  const generatedWaText = `Halo MsCell, saya ingin memesan:
- Produk: ${product.name} ${product.provider ? `(${product.provider})` : ''}
- Jumlah/Voucher: ${product.amount || '-'}
- Harga: ${product.price}
- ${inputLabel.replace(':', '')}: ${targetId || '[Belum diisi]'}
- Metode Pembayaran: ${paymentMethod}
${notes ? `- Catatan: ${notes}` : ''}

Mohon diproses ya kak. Terima kasih!`;

  const waHref = `https://wa.me/6285156482636?text=${encodeURIComponent(generatedWaText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedWaText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#007bff] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="bx bxs-cart-add text-2xl"></i>
            <h3 className="font-bold text-lg tracking-wide">Pesan di MsCell</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition cursor-pointer"
            aria-label="Tutup"
          >
            <i className="bx bx-x text-2xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Summary Box */}
          <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-4">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              Detail Produk Yang Dipilih
            </div>
            <div className="text-lg font-bold text-gray-900">{product.name}</div>
            <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600 mt-1">
              {product.provider && (
                <span className="bg-white px-2.5 py-0.5 rounded-full border border-blue-200 font-medium text-blue-700">
                  {product.provider}
                </span>
              )}
              {product.amount && (
                <span className="bg-white px-2.5 py-0.5 rounded-full border border-gray-200 text-gray-700">
                  Jumlah: {product.amount}
                </span>
              )}
              {product.period && (
                <span className="bg-white px-2.5 py-0.5 rounded-full border border-gray-200 text-gray-700">
                  Masa Aktif: {product.period}
                </span>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-blue-100/80 flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">Harga:</span>
              <span className="text-xl font-extrabold text-[#007bff]">{product.price}</span>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {inputLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder={inputPlaceholder}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#007bff] focus:ring-2 focus:ring-blue-200 outline-none text-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Metode Pembayaran:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#007bff] focus:ring-2 focus:ring-blue-200 outline-none text-sm bg-white"
              >
                <option value="Tunai di Konter (One Payment)">Tunai di Konter (One Payment Cash)</option>
                <option value="Transfer Bank (BRI / BRILink)">Transfer Bank BRI / BRILink</option>
                <option value="Transfer Bank Lain (BCA / BNI / Mandiri)">Transfer Bank Lain</option>
                <option value="E-Wallet (DANA / ShopeePay / OVO)">E-Wallet (DANA / ShopeePay / OVO)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1 italic">
                *MsCell mengutamakan transparansi dan kemudahan pembayaran tunai maupun transfer.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Catatan Tambahan (Opsional):
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Tolong proses segera ya mas"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#007bff] focus:ring-2 focus:ring-blue-200 outline-none text-sm"
              />
            </div>
          </div>

          {/* Quick WA Info */}
          <div className="bg-green-50 rounded-xl p-3.5 border border-green-200 flex items-start gap-3">
            <i className="bx bxl-whatsapp text-2xl text-green-600 mt-0.5"></i>
            <div className="text-xs text-green-800 leading-relaxed">
              Pesanan akan otomatis diteruskan ke WhatsApp resmi MsCell (<strong>{CONTACT_INFO.phoneFormatted}</strong>). Admin akan langsung memproses transaksi Anda!
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer text-center text-sm"
            >
              <i className="bx bxl-whatsapp text-xl"></i>
              Kirim Pesanan ke WhatsApp
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <i className={`bx ${copied ? 'bx-check text-green-600' : 'bx-copy'}`}></i>
              {copied ? 'Tersalin!' : 'Salin Format'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
