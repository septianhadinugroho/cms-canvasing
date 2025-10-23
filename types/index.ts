// types/index.ts

export interface Tier {
  min_quantity: number;
  price: string;
  price_promo?: string;
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

// NEW: Interface for customer addresses
export interface CustomerAddress {
  id_address: number;
  id_customer: number;
  label: string;
  address: string;
  detail_address: string | null;
  latitude: string;
  longitude: string;
  is_primary: number;
}


// UPDATED: Customer interface
export interface Customer {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  store_id: number;
  enabled: "1" | "0" | null;
  addresses: CustomerAddress[];
  store_name?: string;
  // The following properties are deprecated from the main object
  address?: string;
  latitude?: string;
  longitude?: string;
  nik?: string;
  dob?: string;
  pob?: string;
  gender?: 'Male' | 'Female';
  nationality?: string;
  npwp?: string;
  nama_npwp?: string;
  created_at: string;
  updated_at: string;
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

interface ApiOrderItem {
  sku: string;
  barcode: string;
  product_name: string;
  quantity: number;
  price: string;
  percentage: number;
}

export interface ApiResponse<T> {
  status: string;
  data: {
    items: T[];
    pagination?: {
      totalData: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
    };
  };
  error: null | any;
}

export interface ApiOrder {
  order_date: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  // address: string;
  customer_address: string; 
  store_id: number;
  delivery_type: string;
  payment_source: string;
  status: string;
  voucher: any[];
  items: ApiOrderItem[];
  total_amount: number;
  grand_total: number;
}