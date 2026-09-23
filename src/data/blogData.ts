export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'Tips & Panduan' | 'Promo & Info' | 'Paket Internet' | 'Game & PLN' | 'Layanan Digital' | 'Umum';
  author: string;
  date: string;
  createdAt: number;
  imageUrl: string;
  summary: string;
  content: string;
  tags?: string[];
  isPublished: boolean;
  readTime?: string;
}

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Tips Memilih Paket Kuota Internet Paling Hemat Sesuai Kebutuhan',
    slug: 'tips-memilih-paket-kuota-internet-hemat',
    category: 'Paket Internet',
    author: 'Admin MsCell',
    date: '20 September 2026',
    createdAt: 1790000000000,
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    readTime: '3 mnt baca',
    isPublished: true,
    tags: ['Internet', 'Kuota', 'Tips Hemat', 'Indosat', 'Telkomsel'],
    summary: 'Bagi pengguna aktif media sosial, streaming, dan YouTube, memilih paket data reguler dengan kuota utama 24 jam jauh lebih hemat dan stabil.',
    content: `Memilih kuota internet di era digital saat ini memerlukan kecermatan agar pengeluaran pulsa bulanan tetap efisien. Banyak pengguna sering tergiur kuota besar, namun tidak menyadari adanya pembagian jam malam atau aplikasi tertentu.

Berikut panduan memilih paket data terbaik di konter MsCell:

1. Perhatikan Kuota Utama vs Kuota Aplikasi
Pastikan paket yang Anda beli memiliki kuota utama 24 jam yang berlaku di semua jaringan (4G/5G). Kuota utama dapat digunakan untuk browsing, browsing maps, hingga streaming tanpa batas jam.

2. Cek Kebijakan Kuota Lokal Zona Klaten
Beberapa operator seperti Indosat Freedom dan Axis Bronet menyediakan paket kuota lokal yang sangat terjangkau khusus aktivasi di wilayah Klaten dan sekitarnya. Ini memberikan jumlah GB yang jauh lebih banyak dengan harga bersahabat.

3. Selalu Periksa Masa Aktif Kartu
Jika penggunaan internet Anda tidak terlalu intens, pilih paket AlwaysOn (Three AON) atau paket 30 hari hingga 90 hari agar kuota tidak hangus sia-sia.

4. Konsultasikan di Konter MsCell
Bingung paket mana yang paling tepat untuk nomor Anda? Kunjungi langsung konter MsCell di Jl. Tegal Ngandong no 18 Klaten, tim kami siap merekomendasikan promo terbaik operator Anda!`
  },
  {
    id: 'post-2',
    title: 'Daftar Kode Dial Resmi Cek Nomor & Sisa Pulsa Semua Operator',
    slug: 'daftar-kode-dial-cek-nomor-pulsa-semua-operator',
    category: 'Tips & Panduan',
    author: 'Admin MsCell',
    date: '16 September 2026',
    createdAt: 1789650000000,
    imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80',
    readTime: '2 mnt baca',
    isPublished: true,
    tags: ['Pulsa', 'Kode Dial', 'Operator', 'Telkomsel', 'XL', 'Tri'],
    summary: 'Lupa nomor ponsel sendiri atau ingin tahu sisa pulsa aktif? Berikut panduan kode USSD resmi terbaru untuk Telkomsel, Indosat, XL, Axis, Tri, dan Smartfren.',
    content: `Seringkali kita lupa dengan nomor handphone sendiri ketika hendak mengisi pulsa atau paket data di konter. Anda tidak perlu panik, cukup hubungi kode dial berikut langsung dari menu panggilan telepon Anda:

• Telkomsel (SimPATI / By.U):
  - Cek Nomor: Hubungi *808# (layanan instan via SMS)
  - Cek Pulsa & Masa Aktif: Hubungi *888#

• Indosat Ooredoo Hutchison (IM3):
  - Cek Nomor: Hubungi *123*30# atau *185#
  - Cek Pulsa: Hubungi *123#

• XL Axiata:
  - Cek Nomor: Hubungi *808# lalu pilih info nomor
  - Cek Pulsa: Hubungi *808# atau aplikasi myXL

• AXIS:
  - Cek Nomor: Hubungi *808# pilih menu MyInfo
  - Cek Pulsa: Hubungi *808#

• Tri (3):
  - Cek Nomor: Hubungi *111*1#
  - Cek Pulsa: Hubungi *111#

• Smartfren:
  - Cek Nomor: Hubungi *999# atau kirim SMS "CEK" ke 999
  - Cek Pulsa: Hubungi *999#

Jika pulsa atau paket data Anda hampir habis, isi ulang cepat di MsCell! Cukup sebutkan nomor telepon Anda, transaksi berhasil dalam hitungan detik.`
  },
  {
    id: 'post-3',
    title: 'Keuntungan dan Kemudahan Bertransaksi di Agen BRILink MsCell',
    slug: 'keuntungan-transaksi-agen-brilink-mscell',
    category: 'Layanan Digital',
    author: 'Admin MsCell',
    date: '10 September 2026',
    createdAt: 1789100000000,
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    readTime: '3 mnt baca',
    isPublished: true,
    tags: ['BRILink', 'Transfer Uang', 'Tarik Tunai', 'Klaten'],
    summary: 'Tak perlu repot mengantre di kantor bank atau mesin ATM yang jauh. Agen BRILink MsCell melayani transfer uang, setor, dan tarik tunai secara instan & aman.',
    content: `Bagi warga Klaten dan sekitarnya, Agen BRILink MsCell hadir sebagai mitra solusi keuangan perbankan terdekat. Dengan dukungan mesin EDC resmi dari Bank BRI, setiap transaksi diproses secara real-time dan aman.

Layanan yang tersedia di Agen BRILink MsCell:
1. Transfer Antar Bank: Kirim uang ke sesama BRI maupun bank lain (BCA, Mandiri, BNI, BSI, CIMB, dll) langsung sampai detik itu juga.
2. Tarik Tunai & Setor Tunai: Ambil atau simpan saldo tabungan Anda tanpa perlu bepergian jauh ke pusat kota.
3. Pembayaran Cicilan & Tagihan: Bayar tagihan leasing, BPJS, PDAM, hingga multi finance dengan bukti struk fisik yang sah.
4. Top Up Saldo Dompet Digital: Isi saldo DANA, GoPay, ShopeePay, OVO, dan LinkAja dengan biaya admin hemat.

Kami siap melayani kebutuhan transaksi Anda setiap hari dengan pelayanan ramah dan cepat!`
  },
  {
    id: 'post-4',
    title: 'Cara Beli Token PLN Listrik Agar Mendapatkan Nilai KWh Maksimal',
    slug: 'cara-beli-token-pln-listrik-kwh-maksimal',
    category: 'Game & PLN',
    author: 'Admin MsCell',
    date: '05 September 2026',
    createdAt: 1788700000000,
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
    readTime: '2 mnt baca',
    isPublished: true,
    tags: ['PLN', 'Token Listrik', 'Prabayar', 'KWh'],
    summary: 'Memahami cara perhitungan KWh meteran listrik prabayar, pajak penerangan jalan (PPJ), dan tips mengisi stroom tanpa gagal.',
    content: `Banyak pelanggan bertanya mengapa membeli token listrik Rp 50.000 tidak menghasilkan 50 kWh di meteran. Hal ini wajar karena pembelian token listrik dikonversikan berdasarkan tarif resmi per kWh dari PLN dan dipotong Pajak Penerangan Jalan (PPJ) daerah setempat.

Tips Saat Mengisi Token Listrik:
1. Masukkan 20 digit nomor stroom dengan teliti pada keypad meteran (bargainser).
2. Jika muncul tulisan "Gagal" atau "Periksa", tunggu 1 menit lalu ulangi kembali.
3. Simpan struk token sebagai arsip jika sewaktu-waktu dibutuhkan konfirmasi ke call center PLN 123.

Di konter MsCell, nomor token listrik 20 digit diproses secara otomatis via sistem server resmi sehingga langsung keluar seketika setelah pembayaran dilakukan!`
  }
];
