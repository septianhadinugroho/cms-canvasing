import { Customer } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("accessToken");
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorBody = await response
      .json()
      .catch(() => ({ message: `Request failed with status ${response.status}` }));
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
    if (!API_BASE_URL)
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          url.searchParams.append(key, params[key]);
        }
      });
    }
    
    const response = await fetch(url.toString(), { 
      headers: getAuthHeaders(),
      cache: "no-store" 
    });

    return handleApiResponse(response);
  },

  post: async <T>(endpoint: string, body: unknown): Promise<T> => {
    if (!API_BASE_URL)
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    return handleApiResponse(response);
  },

  put: async <T>(endpoint: string, body?: unknown): Promise<T> => {
    if (!API_BASE_URL)
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : null,
    });
    return handleApiResponse(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    if (!API_BASE_URL)
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  },
};

export const getCustomers = (): Promise<Customer[]> => {
  return api.get<Customer[]>("/customers/all");
};

// PERUBAHAN: Fungsi ini sekarang menerima id dan status baru (0 atau 1)
export const updateCustomerStatus = (id: number, newStatus: 0 | 1) => {
  // Mengirim payload { enabled: newStatus }
  return api.put(`/customers/${id}`, { enabled: newStatus });
};