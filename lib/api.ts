// =================================================================
// DUMMY DATA - BAGIAN INI AKAN DIHAPUS SAAT API BACKEND SUDAH SIAP
// =================================================================
const mockProducts = [
    { id: "1", sku: "NK-AM270-GRY", barcode: "887229000123", product_name: "Nike Air Max 270", slug: "nike-air-max-270-grey", url_image: "/product-1.png", short_name: "Air Max 270", unit: "pasang", description: "Sepatu olahraga premium.", category_id: 1 },
    { id: "2", sku: "AD-UB22-WHT", barcode: "887229000456", product_name: "Adidas Ultraboost 22", slug: "adidas-ultraboost-22-white", url_image: "/product-2.png", short_name: "Ultraboost 22", unit: "pasang", description: "Sepatu lari dengan teknologi Boost.", category_id: 1 },
];

const mockUsers = [
  { id: "1", name: "Admin Utama", email: "admin@canvasing.com", role: "admin", status: "active", lastLogin: "2024-07-28T10:00:00Z", avatar: "/placeholder-user.jpg" },
  { id: "2", name: "Editor Konten", email: "editor@canvasing.com", role: "editor", status: "active", lastLogin: "2024-07-28T12:30:00Z", avatar: "/placeholder-user.jpg" },
];

const mockStores = [
  { id: "1", name: "Toko Jakarta Pusat", address: "Jl. Sudirman No. 123, Jakarta Pusat", city: "jakarta", phone: "+62 21 1234 5678", manager: "Budi Santoso", status: "active", totalProducts: 245, monthlySales: 45200000, coordinates: { lat: -6.2088, lng: 106.8456 } },
  { id: "2", name: "Toko Bandung Utara", address: "Jl. Dago No. 45, Bandung", city: "bandung", phone: "+62 22 9876 5432", manager: "Sari Dewi", status: "active", totalProducts: 189, monthlySales: 32500000, coordinates: { lat: -6.8951, lng: 107.6084 } },
];

const mockBanners = [
    { id: "1", image_url: "/generic-store-banner.png", text: "Diskon Spesial Akhir Tahun!", status: 1, created_at: "2024-07-28T10:00:00Z" },
    { id: "2", image_url: "/product-2.png", text: "Koleksi Sepatu Lari Terbaru", status: 1, created_at: "2024-07-27T15:00:00Z" },
];

const mockMedia = [
    { id: "1", name: "nike-air-max-270.jpg", type: "image", size: 2048576, folder: "products", url: "/product-1.png", uploadDate: "2024-01-15" },
    { id: "2", name: "adidas-ultraboost.jpg", type: "image", size: 1536000, folder: "products", url: "/product-2.png", uploadDate: "2024-01-14" },
];

// Simulasi API call menggunakan data dummy
const fetchDummyData = (endpoint: string, options?: RequestInit) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let data: any[] = [];
            if (endpoint.startsWith("/products")) data = mockProducts;
            if (endpoint.startsWith("/users")) data = mockUsers;
            if (endpoint.startsWith("/stores")) data = mockStores;
            if (endpoint.startsWith("/banners")) data = mockBanners;
            if (endpoint.startsWith("/media")) data = mockMedia;
            
            resolve({
                ok: true,
                json: () => Promise.resolve({ success: true, data }),
            });
        }, 500); // Simulasi delay jaringan
    });
};
// =================================================================
// AKHIR DARI DUMMY DATA
// =================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    // ---- HAPUS ATAU BERI KOMENTAR BAGIAN INI SAAT API SUDAH SIAP ----
    const response: any = await fetchDummyData(endpoint);
    // ----------------------------------------------------------------

    /* ---- GUNAKAN BAGIAN INI SAAT API SUDAH SIAP ----
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
    }
    */
    
    const result = await response.json();
    if (!result.success) {
        throw new Error(result.error || "API request failed");
    }
    return result.data;
  },
};