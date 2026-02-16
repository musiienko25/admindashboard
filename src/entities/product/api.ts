import { apiFetch } from '@/shared/api/base';

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images?: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductFilters {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  skip?: number;
}

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export const productsApi = {
  getList: (filters: ProductFilters) => {
    const params: Record<string, string | number | undefined> = {};
    if (filters.q) params.q = filters.q;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.order) params.order = filters.order;
    if (filters.limit !== undefined) params.limit = filters.limit;
    if (filters.skip !== undefined) params.skip = filters.skip;

    const query = buildQueryString(params);

    let endpoint: string;
    if (filters.q) {
      endpoint = `/products/search${query}`;
    } else if (filters.category) {
      endpoint = `/products/category/${filters.category}${query}`;
    } else {
      endpoint = `/products${query}`;
    }
    return apiFetch<ProductsResponse>(endpoint);
  },

  getById: (id: number) => apiFetch<Product>(`/products/${id}`),

  create: (data: Omit<Product, 'id'>) =>
    apiFetch<Product>('/products/add', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<Product>) =>
    apiFetch<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<Product & { isDeleted: boolean; deletedOn: string }>(`/products/${id}`, {
      method: 'DELETE',
    }),

  getCategories: () => apiFetch<string[]>('/products/category-list'),

  getBrands: () =>
    apiFetch<ProductsResponse>('/products?limit=0').then((res) => {
      const brands = new Set(res.products.map((p) => p.brand).filter(Boolean));
      return Array.from(brands).sort();
    }),
};
