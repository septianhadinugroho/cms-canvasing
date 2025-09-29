// types/index.ts

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  product_name: string;
  slug: string;
  url_image: string;
  short_name: string;
  unit: string;
  description: string;
  category_id: number;
  name_category: string;
  stock: number;
  price: number;
}

export type ProductFormData = Omit<Product, 'id' | 'name_category' | 'stock' | 'price'>;

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