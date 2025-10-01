// types/index.ts

export interface Tier {
  min_quantity: number;
  price: string;
}

export interface Product {
  product_id: string;
  sku: string;
  barcode: string;
  product_name: string;
  slug: string;
  url_image: string; // Ini akan menjadi string JSON
  short_name: string;
  unit: string;
  description: string;
  category_id: string; // Pastikan ini string
  name_category: string;
  stock: number;
  store_id: string;
  tiers: Tier[];
  price: number; // Ini akan diturunkan dari tiers
}

export type ProductFormData = Omit<Product, 'product_id' | 'name_category' | 'stock' | 'price' | 'tiers'> & {
  price: number;
  price_promo?: number;
};


export type BannerImages = string[];

// Tipe baru untuk Store sesuai skema DB
export interface Store {
  id: string;
  store_code: string;
  store_name: string;
  address: string;
  latitude: number;
  longitude: number;
  mid: string;
  tid: string;
  created_at?: string;
  updated_at?: string;
}

// Tipe Banner disesuaikan
export interface Banner {
  id: number;
  image_url: string;
  status: number; // 0 untuk nonaktif, 1 untuk aktif
  created_at?: string;
  updated_at?: string;
}

// Tipe data untuk form
export type BannerFormData = Omit<Banner, 'id' | 'created_at' | 'updated_at'>;