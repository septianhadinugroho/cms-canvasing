// types/index.ts
export interface Tier {
  min_quantity: number;
  price: string;
}

export interface User {
  name: string;
  store_code: string;
  role: 'ADMIN' | 'SALESMAN' | 'CASHIER';
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
  vat?: number;
  departmentCode?: string;
}

export type ProductFormData = Omit<Product, 'product_id' | 'name_category' | 'price' | 'tiers'> & {
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
  ip_pos_web: string | null;
  cashier_id: string | null;
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
  password?: string;
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

export interface Cashier {
  id: string;
  name: string;
  username: string;
  store_code: string;
  role: 'kasir';
}

// Order types for Sales History Page
export interface Order {
  orderNumber: string;
  status: string;
  amount: number;
  customerName: string;
  items: { product_name: string; quantity: number; price: number }[];
}

export interface ApiOrder {
  order_number: string;
  status: number;
  total_amount: number;
  customer_name: string;
  items: { product_name: string; quantity: number; price: number }[];
}