// =================================================================
// DUMMY DATA
// =================================================================
const mockUsers = [
    { id: "1", name: "Admin Utama", email: "admin@canvasing.com", role: "admin", status: "active", lastLogin: "2024-07-28T10:00:00Z", avatar: "/placeholder-user.jpg" },
];
const mockStores = [
    { id: "1", store_code: "JKT-001", store_name: "Canvasing Store Grand Indonesia", created_at: "2024-09-23T10:00:00Z", address: "Jl. M.H. Thamrin No.1, Menteng, Jakarta Pusat", latitude: -6.1934, longitude: 106.8219, mid: "MID-12345", tid: "TID-12345" },
];
const mockMedia = [
    { id: "1", name: "nike-air-max-270.jpg", type: "image", size: 2048576, folder: "products", url: "/product-1.png", uploadDate: "2024-01-15" },
];

const fetchDummyData = (endpoint: string) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let data: any[] = [];
            if (endpoint.startsWith("/users")) data = mockUsers;
            if (endpoint.startsWith("/stores")) data = mockStores;
            if (endpoint.startsWith("/media")) data = mockMedia;
            resolve({
                ok: true,
                json: () => Promise.resolve({ success: true, data }),
            });
        }, 500);
    });
};
// =================================================================
// AKHIR DARI DUMMY DATA
// =================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = () => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: `Request failed with status ${response.status}` }));
        throw new Error(errorBody.error || errorBody.message);
    }
    const result = await response.json();
    if (result.status === "error") {
        throw new Error(result.error || "API request returned an error");
    }
    return result.data || result;
};

export const api = {
  get: async <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
    if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");

    // Daftarkan /stores sebagai endpoint yang sudah siap
    const realApiEndpoints = ["/products", "/banners", "/stores"];
    
    let response: any;
    
    if (realApiEndpoints.some(path => endpoint.startsWith(path))) {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        if (params) {
            Object.keys(params).forEach(key => {
                if(params[key] !== null && params[key] !== undefined) {
                    url.searchParams.append(key, params[key]);
                }
            });
        }
        response = await fetch(url.toString(), { headers: getAuthHeaders() });
    } else {
      response = await fetchDummyData(endpoint);
    }
    return handleApiResponse(response);
  },

  post: async <T>(endpoint: string, body: unknown): Promise<T> => {
    if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });

    return handleApiResponse(response);
  },

  // Method baru untuk update
  put: async <T>(endpoint: string, body: unknown): Promise<T> => {
    if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });
    return handleApiResponse(response);
  },

  // Method baru untuk delete
  delete: async <T>(endpoint: string): Promise<T> => {
    if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },
};