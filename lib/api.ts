const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('adminToken');

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: response.statusText }));
      throw new ApiError(response.status, error.error || 'An error occurred');
    }

    return response.json();
  } catch (error: any) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError(
        0,
        'Unable to connect to server. Please check if the API is running.'
      );
    }
    throw error;
  }
}

/* =======================
   VEHICLES API
======================= */

export interface VehiclesQueryParams {
  status?: string;
  featured?: boolean;
  brand?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  seats?: number;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface VehiclesResponse {
  data: any[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export const vehiclesAPI = {
  getAll: (params?: VehiclesQueryParams) => {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    return fetchAPI<VehiclesResponse>(
      `/vehicles?${queryParams.toString()}`
    );
  },

  getById: (id: string) =>
    fetchAPI<any>(`/vehicles/${id}`),

  create: (data: any) =>
    fetchAPI<any>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI<any>(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI<{ message: string }>(`/vehicles/${id}`, {
      method: 'DELETE',
    }),
};

/* =======================
   ENQUIRIES API
======================= */

export const enquiriesAPI = {
  create: (data: any) =>
    fetchAPI<any>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (params?: { status?: string; search?: string }) => {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    return fetchAPI<any[]>(`/enquiries?${queryParams.toString()}`);
  },

  getById: (id: string) =>
    fetchAPI<any>(`/enquiries/${id}`),

  update: (id: string, data: any) =>
    fetchAPI<any>(`/enquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  addNote: (id: string, note: string) =>
    fetchAPI<any>(`/enquiries/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),

  delete: (id: string) =>
    fetchAPI<{ message: string }>(`/enquiries/${id}`, {
      method: 'DELETE',
    }),
};

/* =======================
   TESTIMONIALS API
======================= */

export const testimonialsAPI = {
  getAll: () =>
    fetchAPI<any[]>('/testimonials'),

  create: (data: any) =>
    fetchAPI<any>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI<any>(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI<{ message: string }>(`/testimonials/${id}`, {
      method: 'DELETE',
    }),
};

/* =======================
   SETTINGS API
======================= */

export const settingsAPI = {
  get: () =>
    fetchAPI<any>('/settings'),

  update: (data: any) =>
    fetchAPI<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

/* =======================
   ADMIN API
======================= */

export const adminAPI = {
  login: (email: string, password: string) =>
    fetchAPI<{ token: string; admin: any }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () =>
    fetchAPI<any>('/admin/me'),

  getStats: () =>
    fetchAPI<any>('/admin/stats'),
};

export { ApiError };
