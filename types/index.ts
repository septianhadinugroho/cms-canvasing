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
  url_image: string;
  short_name: string;
  unit: string;
  description: string;
  category_id: string;
  name_category: string;
  stock: number;
  store_id: string;
  tiers: Tier[];
  price: number;
}

export type ProductFormData = Omit<Product, 'product_id' | 'name_category' | 'stock' | 'price' | 'tiers'> & {
  price: number;
  price_promo?: number;
};


export type BannerImages = string[];

export interface Store {
  id: string;
  store_code: string;
  store_name: string;
  address: string;
  latitude: number;
  longitude: number;
  mid: string;
  tid: string;
  hotline: string | null;
  mac_address: string | null;
  phone_number: string | null;
  status: string | number | null;
  npwp: string | null;
  ip_address: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Banner {
  id: number;
  image_url: string;
  status: number;
  created_at?: string;
  updated_at?: string;
}

export type BannerFormData = Omit<Banner, 'id' | 'created_at' | 'updated_at'>;

export interface Salesman {
  id: string;
  name: string;
  username: string;
  store_code: string;
  store_name: string;
  address: string;
  mid: string | null;
  tid: string | null;
  hotline: string | null;
  mac_address: string | null;
  npwp: string | null;
  isActive?: "Y" | "N";
  enabled?: "Y" | "N";
}

// Tipe baru untuk Customer
export interface Customer {
  id: number;
  customer_name: string;
  address: string;
  email: string;
  phone: string;
  store_id: number;
  created_at: string;
  updated_at: string;
  latitude: string;
  longitude: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}