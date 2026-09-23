export interface ProductItem {
  id: string;
  category: 'pulsa' | 'internet' | 'pln' | 'bank' | 'game';
  subCategory?: string;
  name: string;
  provider?: string;
  amount?: string;
  price: string;
  priceNumber?: number;
  period?: string;
  info?: string;
  badge?: string;
  isAvailable?: boolean;
}

export const INTERNET_PACKAGES: ProductItem[] = [
  { id: 'int-1', category: 'internet', provider: 'Indosat', name: '1GB UNLIMITED', amount: '1GB', price: 'Rp.26000', priceNumber: 26000, period: '1 Bulan', info: 'Unlimited Apps' },
  { id: 'int-2', category: 'internet', provider: 'Indosat', name: '2GB UNLIMITED', amount: '2GB', price: 'Rp.42000', priceNumber: 42000, period: '1 Bulan', info: 'Unlimited Apps' },
  { id: 'int-3', category: 'internet', provider: 'Indosat', name: '3GB UNLIMITED', amount: '3GB', price: 'Rp.62000', priceNumber: 62000, period: '1 Bulan', info: 'Unlimited Apps' },
  { id: 'int-4', category: 'internet', provider: 'Indosat', name: '7GB UNLIMITED', amount: '7GB', price: 'Rp.80000', priceNumber: 80000, period: '1 Bulan', info: 'Unlimited Apps' },
  { id: 'int-5', category: 'internet', provider: 'Indosat', name: '10GB UNLIMITED', amount: '10GB', price: 'Rp.100000', priceNumber: 100000, period: '1 Bulan', info: 'Unlimited Apps' },
  { id: 'int-6', category: 'internet', provider: 'Indosat', name: 'Perdana IM3 2K', amount: 'Pulsa 2K', price: 'Rp.4000', priceNumber: 4000, period: '-', info: 'Nomor Perdana' },
  
  { id: 'int-7', category: 'internet', provider: 'Axis', name: '1GB', amount: '1GB', price: 'Rp.9000', priceNumber: 9000, period: '5 Hari', info: 'Kuota Reguler' },
  { id: 'int-8', category: 'internet', provider: 'Axis', name: '3GB', amount: '3GB', price: 'Rp.21000', priceNumber: 21000, period: '15 Hari', info: 'Kuota Reguler' },
  { id: 'int-9', category: 'internet', provider: 'Axis', name: '5GB', amount: '5GB', price: 'Rp.9000', priceNumber: 9000, period: '5 Hari', info: 'Promo Mantap' },
  { id: 'int-10', category: 'internet', provider: 'Axis', name: '3GB', amount: '3GB', price: 'Rp.34000', priceNumber: 34000, period: '15 Hari', info: 'Kuota Reguler' },
  { id: 'int-11', category: 'internet', provider: 'Axis', name: '1GB', amount: '1GB', price: 'Rp.15000', priceNumber: 15000, period: '1 Bulan', info: '30 Hari' },
  { id: 'int-12', category: 'internet', provider: 'Axis', name: '2GB', amount: '2GB', price: 'Rp.25000', priceNumber: 25000, period: '1 Bulan', info: '30 Hari' },
  { id: 'int-13', category: 'internet', provider: 'Axis', name: '3GB', amount: '3GB', price: 'Rp.33000', priceNumber: 33000, period: '1 Bulan', info: '30 Hari' },
  { id: 'int-14', category: 'internet', provider: 'Axis', name: 'BRONET 4G OWSEM 1GB+1GB(4G)', amount: '2GB (1GB+1GB)', price: 'Rp.22000', priceNumber: 22000, period: '30 Hari', info: 'Owsem 4G' },
  { id: 'int-15', category: 'internet', provider: 'Axis', name: 'BRONET 4G OWSEM 1GB+3GB(4G)', amount: '4GB (1GB+3GB)', price: 'Rp.49000', priceNumber: 49000, period: '30 Hari', info: 'Owsem 4G' },
  { id: 'int-16', category: 'internet', provider: 'Axis', name: 'BRONET 4G OWSEM 2GB+6GB(4G)', amount: '8GB (2GB+6GB)', price: 'Rp.49000', priceNumber: 49000, period: '30 Hari', info: 'Owsem 4G' },
  { id: 'int-17', category: 'internet', provider: 'Axis', name: 'BRONET 4G OWSEM 3GB+9GB(4G)', amount: '12GB (3GB+9GB)', price: 'Rp.65000', priceNumber: 65000, period: '30 Hari', info: 'Owsem 4G' },
  { id: 'int-18', category: 'internet', provider: 'Axis', name: 'OWSEM 16 GB + UNLIMITED GAMES', amount: '16GB + Games', price: 'Rp.48000', priceNumber: 48000, period: '30 Hari', info: 'Free Games' },
  { id: 'int-19', category: 'internet', provider: 'Axis', name: 'OWSEM 24 GB + UNLIMITED GAMES', amount: '24GB + Games', price: 'Rp.56000', priceNumber: 56000, period: '30 Hari', info: 'Free Games' },
  { id: 'int-20', category: 'internet', provider: 'Axis', name: 'OWSEM 32 GB + UNLIMITED GAMES', amount: '32GB + Games', price: 'Rp.75000', priceNumber: 75000, period: '30 Hari', info: 'Free Games' },

  { id: 'int-21', category: 'internet', provider: 'XL', name: '4,5GB', amount: '4.5GB', price: 'Rp.30000', priceNumber: 30000, period: '30 Hari', info: 'HotRod 30 Hari' },
  { id: 'int-22', category: 'internet', provider: 'XL', name: '8GB', amount: '8GB', price: 'Rp.42000', priceNumber: 42000, period: '30 Hari', info: 'HotRod 30 Hari' },
  { id: 'int-23', category: 'internet', provider: 'XL', name: '15GB', amount: '15GB', price: 'Rp.65000', priceNumber: 65000, period: '30 Hari', info: 'HotRod 30 Hari' },
  { id: 'int-24', category: 'internet', provider: 'XL', name: '1.5Gb+1Gb 4G+1Gb Youtube 30D', amount: '3.5GB Total', price: 'Rp.28000', priceNumber: 28000, period: '30 Hari', info: 'Khusus Xtra Combo Lite' },
  { id: 'int-25', category: 'internet', provider: 'XL', name: '3Gb+2Gb 4G+1Gb Youtube 30D', amount: '6GB Total', price: 'Rp.38000', priceNumber: 38000, period: '30 Hari', info: 'Khusus Xtra Combo Lite' },
  { id: 'int-26', category: 'internet', provider: 'XL', name: '6Gb+4Gb 4G+1Gb Youtube 30D', amount: '11GB Total', price: 'Rp.55000', priceNumber: 55000, period: '30 Hari', info: 'Khusus Xtra Combo Lite' },

  { id: 'int-27', category: 'internet', provider: 'Telkomsel', name: '1,5GB', amount: '1.5GB', price: 'Rp.11000', priceNumber: 11000, period: '30 Hari', info: 'Jaringan Terbaik' },
  { id: 'int-28', category: 'internet', provider: 'Telkomsel', name: '4GB', amount: '4GB', price: 'Rp.36000', priceNumber: 36000, period: '30 Hari', info: 'Jaringan Terbaik' },
  { id: 'int-29', category: 'internet', provider: 'Telkomsel', name: '10GB', amount: '10GB', price: 'Rp.60000', priceNumber: 60000, period: '30 Hari', info: 'Jaringan Terbaik' },
  { id: 'int-30', category: 'internet', provider: 'Telkomsel', name: '14GB', amount: '14GB', price: 'Rp.80000', priceNumber: 80000, period: '30 Hari', info: 'Jaringan Terbaik' },

  { id: 'int-31', category: 'internet', provider: 'Smartfren', name: '1GB', amount: '1GB', price: 'Rp.8500', priceNumber: 8500, period: '5 Hari', info: 'Smartfren 4G' },
  { id: 'int-32', category: 'internet', provider: 'Smartfren', name: '4GB', amount: '4GB', price: 'Rp.12000', priceNumber: 12000, period: '7 Hari', info: 'Smartfren 4G' },
  { id: 'int-33', category: 'internet', provider: 'Smartfren', name: '10GB', amount: '10GB', price: 'Rp.32000', priceNumber: 32000, period: '30 Hari', info: 'Smartfren 4G' },
  { id: 'int-34', category: 'internet', provider: 'Smartfren', name: 'UNLIMITED 500MB/HARI', amount: 'Unlimited FUP 500MB', price: 'Rp.55000', priceNumber: 55000, period: '28 Hari', info: 'Unlimited Internet' },
  { id: 'int-35', category: 'internet', provider: 'Smartfren', name: 'UNLIMITED 1GB/HARI (7 Hari)', amount: 'Unlimited FUP 1GB', price: 'Rp.22000', priceNumber: 22000, period: '7 Hari', info: 'Unlimited Mingguan' },
  { id: 'int-36', category: 'internet', provider: 'Smartfren', name: 'UNLIMITED 1GB/HARI (28 Hari)', amount: 'Unlimited FUP 1GB', price: 'Rp.80000', priceNumber: 80000, period: '28 Hari', info: 'Unlimited Bulanan' },
  { id: 'int-37', category: 'internet', provider: 'Smartfren', name: '500MB + 1,5GB (01-05) + 500MB Chat', amount: '2.5GB Total', price: 'Rp.10000', priceNumber: 10000, period: '3 Hari', info: 'Nonstop Hemat' },
  { id: 'int-38', category: 'internet', provider: 'Smartfren', name: '1,25GB + 1,75GB (01-06) + 1GB Chat', amount: '4GB Total', price: 'Rp.15000', priceNumber: 15000, period: '7 Hari', info: 'Nonstop Hemat' },
  { id: 'int-39', category: 'internet', provider: 'Smartfren', name: '2GB + 3GB (01-05) + 1GB Chat', amount: '6GB Total', price: 'Rp.23000', priceNumber: 23000, period: '14 Hari', info: 'Nonstop Hemat' },
  { id: 'int-40', category: 'internet', provider: 'Smartfren', name: '4GB + 4GB (01-06) + 2GB Chat', amount: '10GB Total', price: 'Rp.35000', priceNumber: 35000, period: '30 Hari', info: 'Nonstop Hemat' },
  { id: 'int-41', category: 'internet', provider: 'Smartfren', name: '10GB + 20GB (01-06)', amount: '30GB Total', price: 'Rp.65000', priceNumber: 65000, period: '30 Hari', info: 'Super Kuota' },
  { id: 'int-42', category: 'internet', provider: 'Smartfren', name: '20GB + 40GB (01-06) + SmartMusic', amount: '60GB Total', price: 'Rp.110000', priceNumber: 110000, period: '30 Hari', info: 'Super Kuota Music' },

  { id: 'int-43', category: 'internet', provider: 'Three', name: 'MINI 1 GB', amount: '1GB', price: 'Rp.10000', priceNumber: 10000, period: '5 Hari', info: 'Mini Kuota' },
  { id: 'int-44', category: 'internet', provider: 'Three', name: 'AON 1,5 / BM 1,5', amount: '1.5GB', price: 'Rp.15000', priceNumber: 15000, period: '30 Hari', info: 'AlwaysOn 30 Hari' },
  { id: 'int-45', category: 'internet', provider: 'Three', name: 'AON 2 / PM 1', amount: '2GB', price: 'Rp.20000', priceNumber: 20000, period: '30 Hari', info: 'AlwaysOn 30 Hari' },
  { id: 'int-46', category: 'internet', provider: 'Three', name: 'AON 3GB', amount: '3GB', price: 'Rp.27000', priceNumber: 27000, period: '30 Hari', info: 'AlwaysOn 30 Hari' },
  { id: 'int-47', category: 'internet', provider: 'Three', name: 'UNLIMITED (01-17) + 6GB', amount: 'Unlimited + 6GB', price: 'Rp.65000', priceNumber: 65000, period: '30 Hari', info: 'Unlimited Kalong' },
  { id: 'int-48', category: 'internet', provider: 'Three', name: '2GB Reguler + 2GB Vidmax', amount: '4GB Total', price: 'Rp.22000', priceNumber: 22000, period: '30 Hari', info: 'Reguler + Vidmax' },
  { id: 'int-49', category: 'internet', provider: 'Three', name: '3GB Reguler + 3GB Vidmax', amount: '6GB Total', price: 'Rp.38000', priceNumber: 38000, period: '30 Hari', info: 'Reguler + Vidmax' },
  { id: 'int-50', category: 'internet', provider: 'Three', name: '2GB (90Hr) + 4GB 4G', amount: '6GB Total', price: 'Rp.37000', priceNumber: 37000, period: '30 Hari', info: 'Masa Aktif Panjang' },
  { id: 'int-51', category: 'internet', provider: 'Three', name: '1GB (90Hr) + 1GB 4G (30Hr)', amount: '2GB Total', price: 'Rp.18000', priceNumber: 18000, period: '30 Hari', info: 'AON Mantap' },
  { id: 'int-52', category: 'internet', provider: 'Three', name: '2GB (90Hr) + 4GB 4G (30Hr)', amount: '6GB Total', price: 'Rp.32000', priceNumber: 32000, period: '30 Hari', info: 'AON Mantap' },
  { id: 'int-53', category: 'internet', provider: 'Three', name: '3GB REG (90Hr) + 6GB 4G (30Hr)', amount: '9GB Total', price: 'Rp.45000', priceNumber: 45000, period: '30 Hari', info: 'AON Mantap' },
];

export const PULSA_PACKAGES: ProductItem[] = [
  { id: 'pls-1', category: 'pulsa', name: 'Pulsa 5.000', amount: '5.000', price: 'Rp.6500', priceNumber: 6500, info: 'Semua Operator (Tsel, Isat, XL, Axis, Tri, Smart)' },
  { id: 'pls-2', category: 'pulsa', name: 'Pulsa 10.000', amount: '10.000', price: 'Rp.11500', priceNumber: 11500, info: 'Semua Operator' },
  { id: 'pls-3', category: 'pulsa', name: 'Pulsa 15.000', amount: '15.000', price: 'Rp.16500', priceNumber: 16500, info: 'Semua Operator' },
  { id: 'pls-4', category: 'pulsa', name: 'Pulsa 20.000', amount: '20.000', price: 'Rp.21500', priceNumber: 21500, info: 'Semua Operator' },
  { id: 'pls-5', category: 'pulsa', name: 'Pulsa 25.000', amount: '25.000', price: 'Rp.26500', priceNumber: 26500, info: 'Semua Operator' },
  { id: 'pls-6', category: 'pulsa', name: 'Pulsa 30.000', amount: '30.000', price: 'Rp.31500', priceNumber: 31500, info: 'Semua Operator' },
  { id: 'pls-7', category: 'pulsa', name: 'Pulsa 50.000', amount: '50.000', price: 'Rp.51500', priceNumber: 51500, info: 'Semua Operator' },
  { id: 'pls-8', category: 'pulsa', name: 'Pulsa 100.000', amount: '100.000', price: 'Rp.101000', priceNumber: 101000, info: 'Semua Operator' },
  { id: 'pls-9', category: 'pulsa', name: 'Pulsa Transfer Telkomsel 50K', amount: '50.000', price: 'Rp.49000', priceNumber: 49000, info: 'Pulsa Transfer (Harga Lebih Murah)' },
  { id: 'pls-10', category: 'pulsa', name: 'Pulsa Transfer Telkomsel 100K', amount: '100.000', price: 'Rp.97000', priceNumber: 97000, info: 'Pulsa Transfer Hemat' },
];

export const PLN_PACKAGES: ProductItem[] = [
  { id: 'pln-1', category: 'pln', name: 'Token PLN 20.000', amount: '20.000', price: 'Rp.22500', priceNumber: 22500, info: 'KWh sesuai tarif PLN resmi, instan 24 jam' },
  { id: 'pln-2', category: 'pln', name: 'Token PLN 50.000', amount: '50.000', price: 'Rp.52500', priceNumber: 52500, info: 'KWh sesuai tarif PLN resmi, instan 24 jam' },
  { id: 'pln-3', category: 'pln', name: 'Token PLN 100.000', amount: '100.000', price: 'Rp.102500', priceNumber: 102500, info: 'KWh sesuai tarif PLN resmi, instan 24 jam' },
  { id: 'pln-4', category: 'pln', name: 'Token PLN 200.000', amount: '200.000', price: 'Rp.202500', priceNumber: 202500, info: 'KWh sesuai tarif PLN resmi, instan 24 jam' },
  { id: 'pln-5', category: 'pln', name: 'Token PLN 500.000', amount: '500.000', price: 'Rp.502500', priceNumber: 502500, info: 'KWh sesuai tarif PLN resmi, instan 24 jam' },
  { id: 'pln-6', category: 'pln', name: 'Token PLN 1.000.000', amount: '1.000.000', price: 'Rp.1002500', priceNumber: 1002500, info: 'KWh sesuai tarif PLN resmi, instan 24 jam' },
  { id: 'pln-7', category: 'pln', name: 'Bayar Listrik Pascabayar', amount: 'Sesuai Tagihan', price: 'Admin Rp.2500', priceNumber: 2500, info: 'Cek & Bayar tagihan bulanan PLN tanpa antre' },
];

export const FREE_FIRE_ITEMS: ProductItem[] = [
  { id: 'ff-1', category: 'game', subCategory: 'freefire', name: 'Free Fire Diamond 5', amount: '5 Diamond', price: 'Rp.2500', priceNumber: 2500, info: 'Proses Kilat 1-5 Menit' },
  { id: 'ff-2', category: 'game', subCategory: 'freefire', name: 'Free Fire Diamond 12', amount: '12 Diamond', price: 'Rp.3500', priceNumber: 3500, info: 'Proses Kilat' },
  { id: 'ff-3', category: 'game', subCategory: 'freefire', name: 'Free Fire Diamond 50', amount: '50 Diamond', price: 'Rp.10000', priceNumber: 10000, info: 'Proses Kilat' },
  { id: 'ff-4', category: 'game', subCategory: 'freefire', name: 'Free Fire Diamond 70', amount: '70 Diamond', price: 'Rp.12000', priceNumber: 12000, info: 'Best Seller' },
  { id: 'ff-5', category: 'game', subCategory: 'freefire', name: 'Free Fire Diamond 140', amount: '140 Diamond', price: 'Rp.22000', priceNumber: 22000, info: 'Best Seller' },
  { id: 'ff-6', category: 'game', subCategory: 'freefire', name: 'Free Fire Diamond 355', amount: '355 Diamond', price: 'Rp.52000', priceNumber: 52000, info: 'Hemat' },
  { id: 'ff-7', category: 'game', subCategory: 'freefire', name: 'Membership Mingguan', amount: 'Member Mingguan', price: 'Rp.33000', priceNumber: 33000, info: 'Member Mingguan 60 diamond' },
  { id: 'ff-8', category: 'game', subCategory: 'freefire', name: 'Membership Bulanan', amount: 'Member Bulanan', price: 'Rp.120000', priceNumber: 120000, info: 'Member Bulanan 60 Diamond' },
];

export const MOBILE_LEGENDS_ITEMS: ProductItem[] = [
  { id: 'ml-1', category: 'game', subCategory: 'mobilelegends', name: 'ML Diamond 3', amount: '3 Diamond', price: 'Rp.3000', priceNumber: 3000, info: 'Cepat & Legal 100%' },
  { id: 'ml-2', category: 'game', subCategory: 'mobilelegends', name: 'ML Diamond 12', amount: '12 Diamond', price: 'Rp.5000', priceNumber: 5000, info: 'Legal 100%' },
  { id: 'ml-3', category: 'game', subCategory: 'mobilelegends', name: 'ML Diamond 15', amount: '15 Diamond', price: 'Rp.6000', priceNumber: 6000, info: 'Legal 100%' },
  { id: 'ml-4', category: 'game', subCategory: 'mobilelegends', name: 'ML Diamond 30', amount: '30 Diamond', price: 'Rp.10000', priceNumber: 10000, info: 'Legal 100%' },
  { id: 'ml-5', category: 'game', subCategory: 'mobilelegends', name: 'ML Diamond 36', amount: '36 Diamond', price: 'Rp.12000', priceNumber: 12000, info: 'Legal 100%' },
  { id: 'ml-6', category: 'game', subCategory: 'mobilelegends', name: 'ML Diamond 45', amount: '45 Diamond', price: 'Rp.15000', priceNumber: 15000, info: 'Legal 100%' },
  { id: 'ml-7', category: 'game', subCategory: 'mobilelegends', name: 'ML Diamond 59', amount: '59 Diamond', price: 'Rp.18000', priceNumber: 18000, info: 'Legal 100%' },
  { id: 'ml-8', category: 'game', subCategory: 'mobilelegends', name: 'ML Diamond 74', amount: '74 Diamond', price: 'Rp.22000', priceNumber: 22000, info: 'Legal 100%' },
  { id: 'ml-9', category: 'game', subCategory: 'mobilelegends', name: 'ML Diamond 85', amount: '85 Diamond', price: 'Rp.25000', priceNumber: 25000, info: 'Legal 100%' },
  { id: 'ml-10', category: 'game', subCategory: 'mobilelegends', name: 'ML Diamond 170', amount: '170 Diamond', price: 'Rp.47000', priceNumber: 47000, info: 'Legal 100%' },
  { id: 'ml-11', category: 'game', subCategory: 'mobilelegends', name: 'ML Diamond 185', amount: '185 Diamond', price: 'Rp.50000', priceNumber: 50000, info: 'Legal 100%' },
  { id: 'ml-12', category: 'game', subCategory: 'mobilelegends', name: 'ML Diamond 222', amount: '222 Diamond', price: 'Rp.60000', priceNumber: 60000, info: 'Legal 100%' },
  { id: 'ml-13', category: 'game', subCategory: 'mobilelegends', name: 'ML Diamond 296', amount: '296 Diamond', price: 'Rp.89000', priceNumber: 89000, info: 'Legal 100%' },
  { id: 'ml-14', category: 'game', subCategory: 'mobilelegends', name: 'Starlight Member', amount: 'Starlight Card', price: 'Rp.146000', priceNumber: 146000, period: '30 Hari', info: 'Starlight Pass 30 Hari' },
  { id: 'ml-15', category: 'game', subCategory: 'mobilelegends', name: 'Starlight + Diamond', amount: 'Starlight + 127', price: 'Rp.195000', priceNumber: 195000, period: '30 Hari', info: 'Paket Komplit Starlight' },
];

export const PUBG_ITEMS: ProductItem[] = [
  { id: 'pubg-1', category: 'game', subCategory: 'pubg', name: 'PUBG Mobile UC 52', amount: '52 UC', price: 'Rp.10000', priceNumber: 10000, info: 'UC Legal Cepat' },
  { id: 'pubg-2', category: 'game', subCategory: 'pubg', name: 'PUBG Mobile UC 131', amount: '131 UC', price: 'Rp.25000', priceNumber: 25000, info: 'UC Legal Cepat' },
  { id: 'pubg-3', category: 'game', subCategory: 'pubg', name: 'PUBG Mobile UC 263', amount: '263 UC', price: 'Rp.50000', priceNumber: 50000, info: 'Best Value' },
  { id: 'pubg-4', category: 'game', subCategory: 'pubg', name: 'PUBG Mobile UC 530', amount: '530 UC', price: 'Rp.100000', priceNumber: 100000, info: 'Best Value' },
  { id: 'pubg-5', category: 'game', subCategory: 'pubg', name: 'PUBG Mobile UC 1050', amount: '1050 UC', price: 'Rp.200000', priceNumber: 200000, info: 'Royale Pass Ready' },
];

export const CODM_ITEMS: ProductItem[] = [
  { id: 'codm-1', category: 'game', subCategory: 'codm', name: 'CODM CP 31', amount: '31 CP', price: 'Rp.6000', priceNumber: 6000, info: 'Instan ke akun Garena' },
  { id: 'codm-2', category: 'game', subCategory: 'codm', name: 'CODM CP 63', amount: '63 CP', price: 'Rp.12000', priceNumber: 12000, info: 'Instan ke akun Garena' },
  { id: 'codm-3', category: 'game', subCategory: 'codm', name: 'CODM CP 128', amount: '128 CP', price: 'Rp.25000', priceNumber: 25000, info: 'Instan ke akun Garena' },
  { id: 'codm-4', category: 'game', subCategory: 'codm', name: 'CODM CP 321', amount: '321 CP', price: 'Rp.60000', priceNumber: 60000, info: 'Battle Pass Ready' },
  { id: 'codm-5', category: 'game', subCategory: 'codm', name: 'CODM CP 645', amount: '645 CP', price: 'Rp.120000', priceNumber: 120000, info: 'Hemat' },
];

export const ALL_PRODUCTS: ProductItem[] = [
  ...INTERNET_PACKAGES,
  ...PULSA_PACKAGES,
  ...PLN_PACKAGES,
  ...FREE_FIRE_ITEMS,
  ...MOBILE_LEGENDS_ITEMS,
  ...PUBG_ITEMS,
  ...CODM_ITEMS,
];

export const CONTACT_INFO = {
  name: 'MsCell',
  tagline: 'Solusi Kebutuhan Pulsa, Paket Data & Layanan Digital Anda',
  phone: '085156482636',
  phoneFormatted: '0851-5648-2636',
  whatsappUrl: 'https://wa.me/6285156482636',
  email: 'mestersartono1975@gmail.com',
  address: 'Jl.Tegal Ngandong no 18, Tegal Ngandong, Ngandong, Gantiwarno, Klaten, Jawa Tengah, 57455',
  instagram: 'https://instagram.com/mestere_cell',
  instagramHandle: '@mestere_cell',
  designer: 'SIDIQ ALFIANSYAH',
  designerUrl: 'https://facebook.com/inoiz7',
  year: '2020',
};
